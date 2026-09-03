import React, { useContext, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import TopBar from '../components/TopBar';
import CharacterAvatar from '../components/CharacterAvatar';
import DailyLimitCard from '../components/DailyLimitCard';
import PremiumCard from '../components/PremiumCard';
import { usePremiumGate } from '../hooks/usePremiumGate';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { AppContext, Lang, LANGUAGES } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';

const TX: Record<string, Record<Lang, string>> = {
  settingsHelp:     { fa: 'زبان تنظیمات و راهنما', en: 'Settings & help language', fr: 'Langue des paramètres', es: 'Idioma de ajustes', ar: 'لغة الإعدادات', zh: 'Settings & help language', ko: 'Settings & help language' },
  settingsNote:     { fa: 'این انتخاب فقط زبان صفحه‌های تنظیمات و راهنما را تغییر می‌دهد. بازی‌ها همیشه فارسی هستند.', en: 'This only changes Settings & Help pages. Games always stay in Persian.', fr: 'Cela ne change que les pages Paramètres. Les jeux restent en persan.', es: 'Esto solo cambia Ajustes. Los juegos siempre están en persa.', ar: 'هذا يغير صفحات الإعدادات فقط. الألعاب تبقى بالفارسية.', zh: 'This only changes Settings pages. Games stay in Persian.', ko: 'This only changes Settings pages. Games stay in Persian.' },
  parentAccount:    { fa: 'حساب والدین', en: 'Parent account', fr: 'Compte parent', es: 'Cuenta de padres', ar: 'حساب الوالدين', zh: 'Parent account', ko: 'Parent account' },
  currentPwd:       { fa: 'رمز فعلی', en: 'Current password', fr: 'Mot de passe actuel', es: 'Contraseña actual', ar: 'كلمة المرور الحالية', zh: 'Current password', ko: 'Current password' },
  newPwd:           { fa: 'رمز جدید', en: 'New password', fr: 'Nouveau mot de passe', es: 'Nueva contraseña', ar: 'كلمة مرور جديدة', zh: 'New password', ko: 'New password' },
  confirmPwd:       { fa: 'تکرار رمز جدید', en: 'Confirm new password', fr: 'Confirmer le mot de passe', es: 'Confirmar contraseña', ar: 'تأكيد كلمة المرور', zh: 'Confirm new password', ko: 'Confirm new password' },
  changePwd:        { fa: 'تغییر رمز عبور', en: 'Change password', fr: 'Changer le mot de passe', es: 'Cambiar contraseña', ar: 'تغيير كلمة المرور', zh: 'Change password', ko: 'Change password' },
  pwdTooShort:      { fa: 'رمز جدید باید ۴ رقم باشد.', en: 'New password must be 4 digits.', fr: 'Le mot de passe doit contenir 4 chiffres.', es: 'La contraseña debe tener 4 dígitos.', ar: 'يجب أن تتكون كلمة المرور من 4 أرقام.', zh: 'New password must be 4 digits.', ko: 'New password must be 4 digits.' },
  pwdMismatch:      { fa: 'تکرار رمز جدید یکسان نیست.', en: 'New password confirmation does not match.', fr: 'Les mots de passe ne correspondent pas.', es: 'Las contraseñas no coinciden.', ar: 'كلمات المرور غير متطابقة.', zh: 'New password confirmation does not match.', ko: 'New password confirmation does not match.' },
  pwdWrong:         { fa: 'رمز فعلی درست نیست.', en: 'Current password is incorrect.', fr: 'Mot de passe actuel incorrect.', es: 'La contraseña actual es incorrecta.', ar: 'كلمة المرور الحالية غير صحيحة.', zh: 'Current password is incorrect.', ko: 'Current password is incorrect.' },
  pwdChanged:       { fa: 'رمز عبور تغییر کرد.', en: 'Password changed.', fr: 'Mot de passe changé.', es: 'Contraseña cambiada.', ar: 'تم تغيير كلمة المرور.', zh: 'Password changed.', ko: 'Password changed.' },
  childProfile:     { fa: 'پروفایل کودک', en: 'Child profile', fr: 'Profil enfant', es: 'Perfil del niño', ar: 'ملف الطفل', zh: 'Child profile', ko: 'Child profile' },
  persianPlay:      { fa: 'فارسی، بازی، داستان و جایزه', en: 'Persian play, stories & rewards', fr: 'Jeux, histoires et récompenses en persan', es: 'Juegos, cuentos y premios en persa', ar: 'ألعاب وقصص ومكافآت بالفارسية', zh: 'Persian play, stories & rewards', ko: 'Persian play, stories & rewards' },
  stars:            { fa: 'ستاره', en: 'Stars', fr: 'Étoiles', es: 'Estrellas', ar: 'نجوم', zh: 'Stars', ko: 'Stars' },
  days:             { fa: 'روز', en: 'Days', fr: 'Jours', es: 'Días', ar: 'أيام', zh: 'Days', ko: 'Days' },
  done:             { fa: 'درس', en: 'Done', fr: 'Fait', es: 'Hecho', ar: 'تم', zh: 'Done', ko: 'Done' },
  childAge:         { fa: 'سن کودک', en: 'Child age', fr: 'Âge de l\'enfant', es: 'Edad del niño', ar: 'عمر الطفل', zh: 'Child age', ko: 'Child age' },
  childAgeSub:      { fa: 'سن را انتخاب کن تا فعالیت‌ها مناسب‌تر شوند', en: 'Choose an age to personalize activities', fr: 'Choisissez un âge pour personnaliser les activités', es: 'Elige una edad para personalizar las actividades', ar: 'اختر العمر لتخصيص الأنشطة', zh: 'Choose an age to personalize activities', ko: 'Choose an age to personalize activities' },
  rewards:          { fa: 'جایزه ها', en: 'Rewards', fr: 'Récompenses', es: 'Recompensas', ar: 'المكافآت', zh: 'Rewards', ko: 'Rewards' },
  age:              { fa: 'ساله', en: 'Age', fr: 'ans', es: 'años', ar: 'سنوات', zh: 'Age', ko: 'Age' },
};

function t(lang: Lang, key: keyof typeof TX): string {
  return TX[key]?.[lang] ?? TX[key]?.en ?? '';
}

export default function ProfileScreen() {
  const {
    settingsLang, setSettingsLang, stars, streak, badges, completedSections, age, setAge, selectedCharacterId, accountContact, changePassword,
    dailyLimitEnabled, setDailyLimitEnabled, dailyLimitMinutes, setDailyLimitMinutes, usedTodayMs, remainingMs, bonusMinutesToday, addBonusMinutes,
    isPremium,
  } = useContext(AppContext);
  const { navigate } = useNav();
  const { openPremium } = usePremiumGate();
  const { width, height } = useWindowDimensions();
  const ui = Math.min(width / 390, height / 844);
  const lang = settingsLang;
  const isFa = lang === 'fa';
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handlePasswordChange = async () => {
    if (!/^\d{4}$/.test(newPassword)) {
      setPasswordStatus({ type: 'error', text: t(lang, 'pwdTooShort') });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: t(lang, 'pwdMismatch') });
      return;
    }
    const changed = await changePassword(currentPassword, newPassword);
    if (!changed) {
      setPasswordStatus({ type: 'error', text: t(lang, 'pwdWrong') });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordStatus({ type: 'success', text: t(lang, 'pwdChanged') });
  };

  const ageLabel = (() => {
    const a = age || 4;
    const r = a <= 3 ? '2-3' : a <= 5 ? '4-5' : '6-8';
    return isFa ? `${r} ${t(lang, 'age')}` : `${t(lang, 'age')} ${r}`;
  })();

  return (
    <View style={styles.root}>
      <TopBar title="Settings" titleFa="تنظیمات" displayLang={lang} showClose onBack={() => navigate({ name: 'Main', tab: 'Games' })} dark />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: Math.max(12, Math.round(14 * ui)), paddingBottom: Math.max(28, Math.round(34 * ui)), gap: Math.max(12, Math.round(14 * ui)) }]} showsVerticalScrollIndicator={false}>

        {/* Box 0 — Premium (always first, so it reads like the app's main upsell) */}
        <PremiumCard lang={lang} isPremium={isPremium} onPress={openPremium} />

        {/* Box 1 — Language picker */}
        <View style={[styles.panel, { borderRadius: Math.max(22, Math.round(26 * ui)), padding: Math.max(14, Math.round(16 * ui)) }]}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)) }, dir(lang)]}>
            {t(lang, 'settingsHelp')}
          </Text>
          <View style={[styles.languageRow, isFa && styles.languageRowRtl]}>
            {LANGUAGES.map(language => (
              <TouchableOpacity
                key={language.code}
                style={[styles.languageButton, settingsLang === language.code && styles.languageButtonActive]}
                onPress={() => setSettingsLang(language.code)}
                activeOpacity={0.82}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.languageText,
                    settingsLang === language.code && styles.languageTextActive,
                    { fontFamily: ff(language.code, 'bold') },
                  ]}
                >
                  {language.nativeLabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.languageNote, { fontFamily: ff(lang, 'regular') }, dir(lang)]}>
            {t(lang, 'settingsNote')}
          </Text>
        </View>

        {/* Box 2 — Parent account */}
        <View style={[styles.panel, { borderRadius: Math.max(22, Math.round(26 * ui)), padding: Math.max(14, Math.round(16 * ui)) }]}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)) }, dir(lang)]}>
            {t(lang, 'parentAccount')}
          </Text>
          <Text style={styles.accountContact}>{accountContact}</Text>
          <View style={styles.passwordForm}>
            <TextInput
              value={currentPassword}
              onChangeText={value => { setCurrentPassword(value.replace(/\D/g, '').slice(0, 4)); setPasswordStatus(null); }}
              placeholder={t(lang, 'currentPwd')}
              placeholderTextColor="#8B80A8"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              textContentType="password"
              style={[styles.passwordInput, { fontFamily: ff(lang, 'regular') }]}
            />
            <View style={styles.passwordRow}>
              <TextInput
                value={newPassword}
                onChangeText={value => { setNewPassword(value.replace(/\D/g, '').slice(0, 4)); setPasswordStatus(null); }}
                placeholder={t(lang, 'newPwd')}
                placeholderTextColor="#8B80A8"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                textContentType="newPassword"
                style={[styles.passwordInput, styles.passwordHalf, { fontFamily: ff(lang, 'regular') }]}
              />
              <TextInput
                value={confirmPassword}
                onChangeText={value => { setConfirmPassword(value.replace(/\D/g, '').slice(0, 4)); setPasswordStatus(null); }}
                placeholder={t(lang, 'confirmPwd')}
                placeholderTextColor="#8B80A8"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                textContentType="newPassword"
                style={[styles.passwordInput, styles.passwordHalf, { fontFamily: ff(lang, 'regular') }]}
                onSubmitEditing={handlePasswordChange}
              />
            </View>
            {passwordStatus ? (
              <Text style={[styles.passwordStatus, passwordStatus.type === 'success' ? styles.passwordSuccess : styles.passwordError, { fontFamily: ff(lang, 'bold') }]}>
                {passwordStatus.text}
              </Text>
            ) : null}
            <TouchableOpacity style={styles.changePasswordButton} onPress={handlePasswordChange} activeOpacity={0.84}>
              <Text style={[styles.changePasswordText, { fontFamily: ff(lang, 'black') }]}>{t(lang, 'changePwd')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Box 3 — Child profile (simple panel, static character) */}
        <View style={[styles.panel, styles.hero, { borderRadius: Math.max(26, Math.round(30 * ui)), padding: Math.max(12, Math.round(16 * ui)) }]}>
          <CharacterAvatar characterId={selectedCharacterId} size={Math.max(138, Math.round(156 * ui))} floating={false} />
          <View style={styles.heroText}>
            <Text style={[styles.kicker, { fontFamily: ff(lang, 'bold'), fontSize: Math.max(11, Math.round(12 * ui)) }, dir(lang)]}>
              {t(lang, 'childProfile')}
            </Text>
            <Text style={[styles.title, { fontFamily: ff(lang, 'black'), fontSize: Math.max(24, Math.round(27 * ui)) }, dir(lang)]}>
              {ageLabel}
            </Text>
            <Text style={[styles.sub, { fontFamily: ff(lang, 'regular'), fontSize: Math.max(12, Math.round(13 * ui)), lineHeight: Math.max(18, Math.round(19 * ui)) }, dir(lang)]}>
              {t(lang, 'persianPlay')}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={[styles.statsRow, { gap: Math.max(8, Math.round(10 * ui)) }]}>
          <View style={[styles.statCard, { backgroundColor: '#FFE57A' }]}>
            <Image source={neliWorldAssets.ui.star} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNum, { fontFamily: ff(lang, 'black') }]}>{stars}</Text>
            <Text style={[styles.statLbl, { fontFamily: ff(lang, 'bold') }]}>{t(lang, 'stars')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFB2CE' }]}>
            <Image source={neliWorldAssets.ui.heart} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNum, { fontFamily: ff(lang, 'black') }]}>{streak}</Text>
            <Text style={[styles.statLbl, { fontFamily: ff(lang, 'bold') }]}>{t(lang, 'days')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#8EF2DD' }]}>
            <Image source={neliWorldAssets.ui.ok} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNum, { fontFamily: ff(lang, 'black') }]}>{completedSections?.length ?? 0}</Text>
            <Text style={[styles.statLbl, { fontFamily: ff(lang, 'bold') }]}>{t(lang, 'done')}</Text>
          </View>
        </View>

        {/* Box 4 — Child age */}
        <View style={[styles.panel, styles.ageSettings, { borderRadius: Math.max(22, Math.round(26 * ui)), padding: Math.max(14, Math.round(16 * ui)) }]}>
          <View style={styles.settingsCopy}>
            <Text style={[styles.settingsTitle, { fontFamily: ff(lang, 'black') }, dir(lang)]}>{t(lang, 'childAge')}</Text>
            <Text style={[styles.settingsSub, { fontFamily: ff(lang, 'regular') }, dir(lang)]}>{t(lang, 'childAgeSub')}</Text>
          </View>
          <View style={styles.ageRow}>
            {([{ label: '2-3', value: 2 }, { label: '4-5', value: 4 }, { label: '6-8', value: 6 }] as const).map(({ label, value }) => (
              <TouchableOpacity
                key={label}
                style={[styles.ageButton, age === value && styles.ageButtonActive]}
                onPress={() => setAge(value)}
                activeOpacity={0.82}
              >
                <Text style={[styles.ageButtonText, age === value && styles.ageButtonTextActive, { fontFamily: ff('fa', 'black') }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Box 5 — Daily time limit */}
        <DailyLimitCard
          lang={lang}
          enabled={dailyLimitEnabled}
          onToggleEnabled={setDailyLimitEnabled}
          minutes={dailyLimitMinutes}
          onChangeMinutes={setDailyLimitMinutes}
          usedTodayMs={usedTodayMs}
          remainingMs={remainingMs}
          bonusMinutesToday={bonusMinutesToday}
          onAddBonus={addBonusMinutes}
        />

        {/* Box 6 — Rewards */}
        <View style={[styles.panel, { borderRadius: Math.max(22, Math.round(26 * ui)), padding: Math.max(14, Math.round(16 * ui)) }]}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)), marginBottom: Math.max(10, Math.round(12 * ui)) }, dir(lang)]}>
            {t(lang, 'rewards')}
          </Text>
          <View style={styles.rewardRow}>
            {(badges?.length ? badges : ['star', 'ok', 'heart', 'trophy']).map((badge, index) => {
              const source = badge === 'ok' ? neliWorldAssets.ui.ok : badge === 'heart' ? neliWorldAssets.ui.heart : badge === 'trophy' ? neliWorldAssets.ui.trophy : neliWorldAssets.ui.star;
              return (
                <View key={`${badge}-${index}`} style={styles.reward}>
                  <Image source={source} style={styles.rewardIcon} resizeMode="contain" />
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1E135E' },
  scroll: { gap: 14 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroText: { flex: 1 },
  kicker: { color: '#4A2D8A', fontWeight: '900', marginBottom: 3 },
  title: { color: '#221044', fontWeight: '900' },
  sub: { color: '#5C4B78', marginTop: 3 },
  statsRow: { flexDirection: 'row' },
  statCard: { flex: 1, borderRadius: 24, padding: 12, alignItems: 'center', borderWidth: 4.5, borderColor: '#FFFFFF' },
  statIcon: { width: 48, height: 48 },
  statNum: { color: '#25105C', fontSize: 24, fontWeight: '900', marginTop: 2 },
  statLbl: { color: '#493C63', fontSize: 11, fontWeight: '900' },
  panel: { backgroundColor: 'rgba(255,255,255,0.95)' },
  sectionTitle: { color: '#221044', fontWeight: '900', marginBottom: 12 },
  languageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  languageRowRtl: { flexDirection: 'row-reverse' },
  languageButton: { minWidth: 92, flexGrow: 1, flexBasis: '29%', minHeight: 58, borderRadius: 18, paddingHorizontal: 9, paddingVertical: 8, backgroundColor: '#F0EBFF', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'transparent' },
  languageButtonActive: { backgroundColor: '#FFF2C7', borderColor: '#F5B800' },
  languageFlag: { fontSize: 21 },
  languageText: { color: '#5C4B78', fontSize: 11, marginTop: 2, textAlign: 'center' },
  languageTextActive: { color: '#221044' },
  languageNote: { color: '#6B5A89', fontSize: 11.5, lineHeight: 18, marginTop: 10 },
  accountContact: { color: '#7C3AED', fontFamily: 'Nunito_700Bold', fontSize: 13, textAlign: 'right', marginBottom: 11 },
  passwordForm: { gap: 9 },
  passwordRow: { flexDirection: 'row-reverse', gap: 9 },
  passwordInput: { height: 52, borderRadius: 16, backgroundColor: '#F3F0F8', borderWidth: 2, borderColor: '#DED7EA', paddingHorizontal: 14, color: '#2D1B69', textAlign: 'right', fontSize: 13 },
  passwordHalf: { flex: 1 },
  passwordStatus: { fontSize: 12, textAlign: 'right' },
  passwordError: { color: '#D73737' },
  passwordSuccess: { color: '#0B9362' },
  changePasswordButton: { height: 50, borderRadius: 17, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center' },
  changePasswordText: { color: '#FFFFFF', fontSize: 14 },
  ageSettings: { flexDirection: 'column', alignItems: 'stretch', gap: 10 },
  ageRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7, justifyContent: 'flex-start' },
  ageButton: { minWidth: 72, height: 40, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  ageButtonActive: { backgroundColor: '#078BFF' },
  ageButtonText: { color: '#221044', fontSize: 14 },
  ageButtonTextActive: { color: '#FFFFFF' },
  settingsCopy: { alignItems: 'flex-end' },
  settingsTitle: { color: '#221044', fontSize: 15, textAlign: 'right' },
  settingsSub: { color: '#6B5A89', fontSize: 11, lineHeight: 17, marginTop: 2, textAlign: 'right' },
  rewardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reward: { width: 62, height: 62, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF2C7', borderWidth: 4.5, borderColor: '#FFFFFF' },
  rewardIcon: { width: 52, height: 52 },
});
