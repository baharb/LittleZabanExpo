import React, { useContext } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import TopBar from '../components/TopBar';
import CharacterAvatar from '../components/CharacterAvatar';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { AppContext, LANGUAGES } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';

export default function ProfileScreen() {
  const { settingsLang, setSettingsLang, stars, streak, badges, completedSections, age, setAge, selectedCharacterId } = useContext(AppContext);
  const { navigate } = useNav();
  const { width, height } = useWindowDimensions();
  const ui = Math.min(width / 390, height / 844);
  const lang = settingsLang;
  const isFa = lang === 'fa';

  return (
    <View style={styles.root}>
      <TopBar title="Settings" titleFa="تنظیمات" displayLang={lang} showClose onBack={() => navigate({ name: 'Main', tab: 'Games' })} dark />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: Math.max(12, Math.round(14 * ui)), paddingBottom: Math.max(28, Math.round(34 * ui)), gap: Math.max(12, Math.round(14 * ui)) }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.panel, { borderRadius: Math.max(22, Math.round(26 * ui)), padding: Math.max(14, Math.round(16 * ui)) }]}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)) }, dir(lang)]}>
            {isFa ? 'زبان تنظیمات و راهنما' : 'Settings and help language'}
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
            {isFa ? 'این انتخاب فقط زبان صفحه‌های تنظیمات و راهنما را تغییر می‌دهد. بازی‌ها همیشه فارسی هستند.' : 'This only changes Settings and Help pages. Games always stay in Persian.'}
          </Text>
        </View>

        <ImageBackground source={neliWorldAssets.rooms.bedroom} style={[styles.hero, { height: Math.max(200, Math.round(220 * ui)), borderRadius: Math.max(26, Math.round(30 * ui)), padding: Math.max(12, Math.round(16 * ui)) }]} imageStyle={styles.heroImage}>
          <View style={styles.heroShade} />
          <CharacterAvatar characterId={selectedCharacterId} size={Math.max(138, Math.round(156 * ui))} />
          <View style={styles.heroText}>
            <Text style={[styles.kicker, { fontFamily: ff(lang, 'bold'), fontSize: Math.max(11, Math.round(12 * ui)) }, dir(lang)]}>
              {isFa ? 'پروفایل کودک' : 'Child profile'}
            </Text>
            <Text style={[styles.title, { fontFamily: ff(lang, 'black'), fontSize: Math.max(24, Math.round(27 * ui)) }, dir(lang)]}>
              {isFa ? `${age || 4} ساله` : `Age ${age || 4}`}
            </Text>
            <Text style={[styles.sub, { fontFamily: ff(lang, 'regular'), fontSize: Math.max(12, Math.round(13 * ui)), lineHeight: Math.max(18, Math.round(19 * ui)) }, dir(lang)]}>
              {isFa ? 'فارسی، بازی، داستان و جایزه' : 'Persian play, stories, and rewards'}
            </Text>
          </View>
        </ImageBackground>

        <View style={[styles.statsRow, { gap: Math.max(8, Math.round(10 * ui)) }]}>
          <View style={[styles.statCard, { backgroundColor: '#FFE57A' }]}>
            <Image source={neliWorldAssets.ui.star} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNum, { fontFamily: ff(lang, 'black') }]}>{stars}</Text>
            <Text style={[styles.statLbl, { fontFamily: ff(lang, 'bold') }]}>{isFa ? 'ستاره' : 'Stars'}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFB2CE' }]}>
            <Image source={neliWorldAssets.ui.heart} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNum, { fontFamily: ff(lang, 'black') }]}>{streak}</Text>
            <Text style={[styles.statLbl, { fontFamily: ff(lang, 'bold') }]}>{isFa ? 'روز' : 'Days'}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#8EF2DD' }]}>
            <Image source={neliWorldAssets.ui.ok} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNum, { fontFamily: ff(lang, 'black') }]}>{completedSections?.length ?? 0}</Text>
            <Text style={[styles.statLbl, { fontFamily: ff(lang, 'bold') }]}>{isFa ? 'درس' : 'Done'}</Text>
          </View>
        </View>

        <View style={[styles.panel, { borderRadius: Math.max(22, Math.round(26 * ui)), padding: Math.max(14, Math.round(16 * ui)) }]}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)), marginBottom: Math.max(10, Math.round(12 * ui)) }, dir(lang)]}>
            {isFa ? 'تنظیمات' : 'Settings'}
          </Text>
          <View style={styles.settingsGrid}>
            <View style={[styles.settingsButton, styles.ageSettings, { backgroundColor: '#E8F7FF' }]}>
              <View style={styles.settingsCopy}>
                <Text style={[styles.settingsTitle, { fontFamily: ff(lang, 'black') }]}>{isFa ? 'سن کودک' : 'Child age'}</Text>
                <Text style={[styles.settingsSub, { fontFamily: ff(lang, 'regular') }]}>{isFa ? 'سن را انتخاب کن تا فعالیت‌ها مناسب‌تر شوند' : 'Choose an age to personalize activities'}</Text>
              </View>
              <View style={styles.ageRow}>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(value => (
                  <TouchableOpacity
                    key={value}
                    style={[styles.ageButton, age === value && styles.ageButtonActive]}
                    onPress={() => setAge(value)}
                    activeOpacity={0.82}
                  >
                    <Text style={[styles.ageButtonText, age === value && styles.ageButtonTextActive, { fontFamily: ff('fa', 'black') }]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={[styles.settingsButton, { backgroundColor: '#F1E8FF' }]} onPress={() => navigate({ name: 'Parent' })} activeOpacity={0.82}>
              <Image source={neliWorldAssets.ui.settings} style={styles.settingsIcon} resizeMode="contain" />
              <View style={styles.settingsCopy}>
                <Text style={[styles.settingsTitle, { fontFamily: ff(lang, 'black') }]}>{isFa ? 'تنظیمات والدین' : 'Parent settings'}</Text>
                <Text style={[styles.settingsSub, { fontFamily: ff(lang, 'regular') }]}>{isFa ? 'سن کودک، گزارش پیشرفت و کد ورود' : 'Child age, progress report, and PIN'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingsButton, { backgroundColor: '#FFF2C7' }]} onPress={() => navigate({ name: 'Characters' })} activeOpacity={0.82}>
              <Image source={neliWorldAssets.ui.heart} style={styles.settingsIcon} resizeMode="contain" />
              <View style={styles.settingsCopy}>
                <Text style={[styles.settingsTitle, { fontFamily: ff(lang, 'black') }]}>{isFa ? 'انتخاب شخصیت' : 'Choose character'}</Text>
                <Text style={[styles.settingsSub, { fontFamily: ff(lang, 'regular') }]}>{isFa ? 'شخصیت همراه کودک را تغییر بده' : "Change the child's companion"}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.panel, { borderRadius: Math.max(22, Math.round(26 * ui)), padding: Math.max(14, Math.round(16 * ui)) }]}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)), marginBottom: Math.max(10, Math.round(12 * ui)) }, dir(lang)]}>
            {isFa ? 'جایزه ها' : 'Rewards'}
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
  hero: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, overflow: 'hidden', borderWidth: 6, borderColor: '#FFFFFF' },
  heroImage: { width: '100%', height: '100%' },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30,19,94,0.18)' },
  avatar: { width: 138, height: 180, marginBottom: -8 },
  heroText: { flex: 1, marginBottom: 8 },
  kicker: { color: '#FFFFFF', fontWeight: '900', marginBottom: 3 },
  title: { color: '#FFFFFF', fontWeight: '900' },
  sub: { color: 'rgba(255,255,255,0.92)', marginTop: 3 },
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
  settingsGrid: { gap: 10 },
  settingsButton: { minHeight: 76, borderRadius: 20, padding: 12, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  ageSettings: { flexDirection: 'column', alignItems: 'stretch' },
  ageRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7, justifyContent: 'flex-start' },
  ageButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  ageButtonActive: { backgroundColor: '#078BFF' },
  ageButtonText: { color: '#221044', fontSize: 14 },
  ageButtonTextActive: { color: '#FFFFFF' },
  settingsIcon: { width: 52, height: 52 },
  settingsCopy: { flex: 1, alignItems: 'flex-end' },
  settingsTitle: { color: '#221044', fontSize: 15, textAlign: 'right' },
  settingsSub: { color: '#6B5A89', fontSize: 11, lineHeight: 17, marginTop: 2, textAlign: 'right' },
  rewardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reward: { width: 62, height: 62, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF2C7', borderWidth: 4.5, borderColor: '#FFFFFF' },
  rewardIcon: { width: 52, height: 52 },
});
