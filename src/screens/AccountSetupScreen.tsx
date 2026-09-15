import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { characterAssets } from '../assets/characterAssets';
import { AppContext, isRTL, Lang, LANGUAGES } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';
import { DetectedContact, detectContact, isIranianPhone, sendVerificationCode, verifyCode, SendCodeError, VerifyCodeError } from '../services/accountActivation';

type Step = 'contact' | 'code' | 'password';

const RESEND_COOLDOWN_SECONDS = 60;

// Every user-facing string on this screen, in the 4 languages a parent can
// pick from. Games and other kid-facing content stay Persian regardless —
// this only covers the parent-facing sign-in/passcode flow.
const TX: Record<string, Partial<Record<Lang, string>>> = {
  welcomeTitle: {
    fa: 'به زال خوش آمدید', en: 'Welcome to ZAAL',
    fr: 'Bienvenue sur ZAAL', es: 'Bienvenido a ZAAL',
  },
  welcomeCopy: {
    fa: 'این رمز، تنظیمات والدین را از دسترس کودک دور نگه می‌دارد.',
    en: 'This passcode keeps parent settings safely out of your child’s reach.',
    fr: 'Ce code garde les paramètres parentaux hors de portée de votre enfant.',
    es: 'Este código mantiene los ajustes de los padres fuera del alcance de tu hijo.',
  },
  contactTitle: {
    fa: 'ورود والدین', en: 'Parent Sign-In',
    fr: 'Connexion parent', es: 'Acceso de padres',
  },
  contactSubtitle: {
    fa: 'برای محافظت از تنظیمات، ایمیل یا شماره همراه‌تان را وارد کنید تا کد تایید برایتان بفرستیم.',
    en: 'To protect your settings, enter your email or phone number and we’ll send you a verification code.',
    fr: 'Pour protéger vos paramètres, saisissez votre e-mail ou numéro de téléphone afin de recevoir un code de vérification.',
    es: 'Para proteger tus ajustes, ingresa tu correo o número de teléfono y te enviaremos un código de verificación.',
  },
  codeTitle: {
    fa: 'کد تایید را وارد کنید', en: 'Enter Verification Code',
    fr: 'Saisissez le code de vérification', es: 'Ingresa el código de verificación',
  },
  passwordTitle: {
    fa: 'رمز والدین را تنظیم کنید', en: 'Set Your Parent Passcode',
    fr: 'Définissez votre code parental', es: 'Configura tu contraseña de padres',
  },
  passwordSubtitle: {
    fa: 'برای اطمینان، سال تولدتان را یک‌بار دیگر وارد کنید. این عدد از این پس رمز ورود به تنظیمات والدین خواهد بود.',
    en: 'For security, please enter your birth year one more time. From now on, this will be your passcode for parent settings.',
    fr: 'Par sécurité, saisissez à nouveau votre année de naissance. Ce sera désormais votre code d’accès aux paramètres parentaux.',
    es: 'Por seguridad, ingresa tu año de nacimiento una vez más. A partir de ahora, este será tu código de acceso a los ajustes de padres.',
  },
  contactPlaceholder: {
    fa: 'ایمیل یا شماره تلفن (با کد کشور، مثلاً +1...)',
    en: 'Email or phone number (with country code, e.g. +1...)',
    fr: 'E-mail ou numéro de téléphone (avec indicatif, ex. +1...)',
    es: 'Correo o número de teléfono (con código de país, ej. +1...)',
  },
  birthYearPlaceholder: {
    fa: 'سال تولد والد (مثلاً 1990)', en: 'Parent birth year (e.g. 1990)',
    fr: 'Année de naissance du parent (ex. 1990)', es: 'Año de nacimiento del padre/madre (ej. 1990)',
  },
  sendCode: { fa: 'ارسال کد', en: 'Send Code', fr: 'Envoyer le code', es: 'Enviar código' },
  confirmCode: { fa: 'تایید کد', en: 'Confirm Code', fr: 'Confirmer le code', es: 'Confirmar código' },
  resendCode: { fa: 'ارسال دوباره کد', en: 'Resend Code', fr: 'Renvoyer le code', es: 'Reenviar código' },
  changeContact: {
    fa: 'تغییر ایمیل یا شماره تلفن', en: 'Change Email or Phone Number',
    fr: 'Changer d’e-mail ou de numéro', es: 'Cambiar correo o número de teléfono',
  },
  birthYearLabel: {
    fa: 'سال تولد شما', en: 'Your Birth Year',
    fr: 'Votre année de naissance', es: 'Tu año de nacimiento',
  },
  saveAndStart: {
    fa: 'ذخیره رمز و شروع', en: 'Save & Get Started',
    fr: 'Enregistrer et commencer', es: 'Guardar y comenzar',
  },
  note: {
    fa: 'اطلاعات ورود شما فقط روی همین دستگاه ذخیره می‌شود.',
    en: 'Your sign-in details are stored only on this device.',
    fr: 'Vos informations de connexion sont stockées uniquement sur cet appareil.',
    es: 'Tus datos de acceso se guardan solo en este dispositivo.',
  },
  languageLabel: { fa: 'زبان', en: 'Language', fr: 'Langue', es: 'Idioma' },
  errInvalidContact: {
    fa: 'ایمیل یا شماره تلفن معتبر وارد کنید (شماره باید با + و کد کشور باشد).',
    en: 'Please enter a valid email or phone number (numbers need a + and country code).',
    fr: 'Saisissez un e-mail ou un numéro valide (le numéro doit inclure + et l’indicatif du pays).',
    es: 'Ingresa un correo o número válido (el número debe incluir + y el código de país).',
  },
  errIranSms: {
    fa: 'ارسال پیامک به شماره‌های ایران به دلیل محدودیت‌های تحریمی امکان‌پذیر نیست. لطفاً ایمیل وارد کنید.',
    en: 'SMS delivery to Iranian phone numbers isn’t available due to sanctions restrictions. Please use an email instead.',
    fr: 'L’envoi de SMS vers les numéros iraniens est impossible en raison des restrictions liées aux sanctions. Veuillez utiliser un e-mail.',
    es: 'No es posible enviar SMS a números de Irán debido a restricciones de sanciones. Usa un correo electrónico.',
  },
  errInvalidBirthYear: {
    fa: 'سال تولد والد را درست وارد کنید.', en: 'Please enter a valid parent birth year.',
    fr: 'Saisissez une année de naissance valide.', es: 'Ingresa un año de nacimiento válido.',
  },
  errSendNotConfigured: {
    fa: 'سرویس ارسال کد هنوز راه‌اندازی نشده است.', en: 'The code delivery service isn’t set up yet.',
    fr: 'Le service d’envoi de code n’est pas encore configuré.', es: 'El servicio de envío de códigos aún no está configurado.',
  },
  errSendGeneric: {
    fa: 'ارسال کد انجام نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.',
    en: 'We couldn’t send the code. Check your connection and try again.',
    fr: 'Impossible d’envoyer le code. Vérifiez votre connexion et réessayez.',
    es: 'No pudimos enviar el código. Revisa tu conexión e inténtalo de nuevo.',
  },
  errCodeIncomplete: {
    fa: 'کد ۶ رقمی را کامل وارد کنید.', en: 'Please enter the full 6-digit code.',
    fr: 'Saisissez le code à 6 chiffres complet.', es: 'Ingresa el código completo de 6 dígitos.',
  },
  errVerifyGeneric: {
    fa: 'کد نادرست یا منقضی‌شده است. دوباره تلاش کنید.', en: 'That code is incorrect or expired. Please try again.',
    fr: 'Ce code est incorrect ou expiré. Réessayez.', es: 'Ese código es incorrecto o expiró. Inténtalo de nuevo.',
  },
  errPasswordIncomplete: {
    fa: 'سال تولدتان را کامل، در ۴ رقم، وارد کنید.', en: 'Please enter your full 4-digit birth year.',
    fr: 'Saisissez votre année de naissance complète (4 chiffres).', es: 'Ingresa tu año de nacimiento completo (4 dígitos).',
  },
  errPasswordMismatch: {
    fa: 'این عدد باید همان سال تولدی باشد که در مرحله اول وارد کردید.',
    en: 'This must match the birth year you entered in the first step.',
    fr: 'Ce nombre doit correspondre à l’année de naissance saisie à la première étape.',
    es: 'Este número debe coincidir con el año de nacimiento del primer paso.',
  },
  errSaveFailed: {
    fa: 'ذخیره رمز عبور انجام نشد. دوباره تلاش کنید.', en: 'We couldn’t save your passcode. Please try again.',
    fr: 'Impossible d’enregistrer votre code. Réessayez.', es: 'No pudimos guardar tu contraseña. Inténtalo de nuevo.',
  },
};

function t(lang: Lang, key: keyof typeof TX): string {
  return TX[key]?.[lang] ?? TX[key]?.en ?? '';
}

function codeSubtitle(lang: Lang, contactValue: string): string {
  switch (lang) {
    case 'fr': return `Saisissez le code à 6 chiffres envoyé à « ${contactValue} ».`;
    case 'es': return `Ingresa el código de 6 dígitos que enviamos a "${contactValue}".`;
    case 'en': return `Enter the 6-digit code we sent to "${contactValue}".`;
    default: return `کد ۶ رقمی‌ای که به «${contactValue}» فرستادیم را وارد کنید.`;
  }
}

function resendLabel(lang: Lang, cooldown: number): string {
  if (cooldown <= 0) return t(lang, 'resendCode');
  return `${t(lang, 'resendCode')} (${cooldown})`;
}

function sendCodeErrorMessage(lang: Lang, err: unknown): string {
  if (err instanceof SendCodeError && err.message === 'SUPABASE_NOT_CONFIGURED') {
    return t(lang, 'errSendNotConfigured');
  }
  return t(lang, 'errSendGeneric');
}

function verifyCodeErrorMessage(lang: Lang, err: unknown): string {
  if (err instanceof VerifyCodeError && err.message === 'SUPABASE_NOT_CONFIGURED') {
    return t(lang, 'errSendNotConfigured');
  }
  return t(lang, 'errVerifyGeneric');
}

/** A row of N circles that mirrors a numeric value, with an invisible input
 *  on top so tapping anywhere in the row opens the keyboard. Digits show
 *  plainly for the OTP code; for the parent PIN they show as a filled dot. */
function CodeCircles({
  length,
  value,
  onChangeText,
  secure,
  autoFocus,
  onSubmitEditing,
  oneTimeCode,
  lang,
}: {
  length: number;
  value: string;
  onChangeText: (value: string) => void;
  secure?: boolean;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
  oneTimeCode?: boolean;
  lang: Lang;
}) {
  const inputRef = useRef<TextInput>(null);
  const focused = useRef(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={styles.circleRow}
    >
      {Array.from({ length }).map((_, i) => {
        const digit = value[i];
        const filled = digit !== undefined;
        const isCursor = isFocused && i === value.length && value.length < length;
        return (
          <View
            key={i}
            style={[
              styles.circle,
              filled && styles.circleFilled,
              isCursor && styles.circleCursor,
            ]}
          >
            {filled && !secure && (
              <Text style={[styles.circleDigit, { fontFamily: ff(lang, 'black') }]}>{digit}</Text>
            )}
            {filled && secure && <View style={styles.circleDot} />}
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={text => onChangeText(text.replace(/\D/g, '').slice(0, length))}
        onFocus={() => { focused.current = true; setIsFocused(true); }}
        onBlur={() => { focused.current = false; setIsFocused(false); }}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        onSubmitEditing={onSubmitEditing}
        textContentType={oneTimeCode ? 'oneTimeCode' : (secure ? 'newPassword' : 'oneTimeCode')}
        autoComplete={oneTimeCode ? 'sms-otp' : 'off'}
        style={styles.hiddenInput}
        caretHidden
      />
    </TouchableOpacity>
  );
}

/** Compact language dropdown: a pill showing the current language, opening a
 *  small list of the 4 supported parent-facing languages, each shown in its
 *  own script. Selecting one persists immediately via settingsLang. */
function LanguageDropdown({ lang, onSelect, rtl }: { lang: Lang; onSelect: (l: Lang) => void; rtl: boolean }) {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  return (
    <View style={[styles.langWrap, rtl ? { alignSelf: 'flex-start' } : { alignSelf: 'flex-end' }]}>
      <TouchableOpacity
        style={styles.langButton}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.8}
      >
        <Text style={styles.langFlag}>{current.flag}</Text>
        <Text style={[styles.langButtonText, { fontFamily: ff(lang, 'bold') }]}>{current.nativeLabel}</Text>
        <Text style={styles.langChevron}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={[styles.langMenu, rtl ? { left: 0 } : { right: 0 }]}>
          {LANGUAGES.map(language => (
            <TouchableOpacity
              key={language.code}
              style={[styles.langMenuItem, language.code === lang && styles.langMenuItemActive]}
              onPress={() => { onSelect(language.code); setOpen(false); }}
              activeOpacity={0.8}
            >
              <Text style={styles.langFlag}>{language.flag}</Text>
              <Text style={[styles.langMenuText, { fontFamily: ff(language.code, 'bold') }]}>{language.nativeLabel}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function AccountSetupScreen() {
  const { activateAccount, settingsLang, setSettingsLang } = useContext(AppContext);
  const { reset } = useNav();
  const { width, height } = useWindowDimensions();
  const compact = height < 600;
  const lang = settingsLang;
  const rtl = isRTL(lang);
  const textDir = dir(lang);

  const [step, setStep] = useState<Step>('contact');
  const [contact, setContact] = useState('');
  const [detected, setDetected] = useState<DetectedContact | null>(null);
  const [birthYear, setBirthYear] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    return () => { if (cooldownTimer.current) clearInterval(cooldownTimer.current); };
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownTimer.current) clearInterval(cooldownTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateBirthYear = () => {
    const birthYearNum = Number(birthYear);
    const currentYear = new Date().getFullYear();
    return /^\d{4}$/.test(birthYear) && birthYearNum >= currentYear - 100 && birthYearNum <= currentYear - 13;
  };

  const sendCode = async () => {
    const found = detectContact(contact);
    if (!found) {
      setError(t(lang, 'errInvalidContact'));
      return;
    }
    if (found.channel === 'sms' && isIranianPhone(found.value)) {
      setError(t(lang, 'errIranSms'));
      return;
    }
    if (!validateBirthYear()) {
      setError(t(lang, 'errInvalidBirthYear'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      await sendVerificationCode(found);
      setDetected(found);
      setCode('');
      setStep('code');
      startCooldown();
    } catch (err) {
      setError(sendCodeErrorMessage(lang, err));
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    if (!detected || cooldown > 0) return;
    setBusy(true);
    setError('');
    try {
      await sendVerificationCode(detected);
      startCooldown();
    } catch (err) {
      setError(sendCodeErrorMessage(lang, err));
    } finally {
      setBusy(false);
    }
  };

  const confirmCode = async () => {
    if (!detected) return;
    if (!/^\d{6}$/.test(code)) {
      setError(t(lang, 'errCodeIncomplete'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      await verifyCode(detected, code);
      setPassword('');
      setStep('password');
    } catch (err) {
      setError(verifyCodeErrorMessage(lang, err));
    } finally {
      setBusy(false);
    }
  };

  const finish = async () => {
    if (!/^\d{4}$/.test(password)) {
      setError(t(lang, 'errPasswordIncomplete'));
      return;
    }
    if (password !== birthYear) {
      setError(t(lang, 'errPasswordMismatch'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      const birthYearNum = Number(birthYear);
      await activateAccount(contact.trim(), password, birthYearNum);
      reset({ name: 'Home' });
    } catch {
      setError(t(lang, 'errSaveFailed'));
    } finally {
      setBusy(false);
    }
  };

  const backToContact = () => {
    setStep('contact');
    setDetected(null);
    setCode('');
    setError('');
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    setCooldown(0);
  };

  const stepCopy: Record<Step, { title: string; subtitle: string }> = {
    contact: {
      title: t(lang, 'contactTitle'),
      subtitle: t(lang, 'contactSubtitle'),
    },
    code: {
      title: t(lang, 'codeTitle'),
      subtitle: codeSubtitle(lang, contact.trim()),
    },
    password: {
      title: t(lang, 'passwordTitle'),
      subtitle: t(lang, 'passwordSubtitle'),
    },
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.sun} />
      <View style={styles.cloud} />
      <View style={[styles.shell, { width: Math.min(width - 36, 980), minHeight: Math.min(height - 32, 570), flexDirection: rtl ? 'row-reverse' : 'row' }]}>
        <View style={styles.artPane}>
          <Image source={characterAssets.neli.poses.waving} style={[styles.character, compact && styles.characterCompact]} resizeMode="contain" />
          <Text style={[styles.artTitle, { fontFamily: ff(lang, 'black') }, textDir]}>{t(lang, 'welcomeTitle')}</Text>
          <Text style={[styles.artCopy, { fontFamily: ff(lang, 'regular') }, textDir]}>{t(lang, 'welcomeCopy')}</Text>
        </View>

        <View style={styles.formPane}>
          <View style={[styles.topRow, { flexDirection: rtl ? 'row' : 'row-reverse' }]}>
            <View style={styles.lockBadge}>
              <Text style={styles.lockGlyph}>●</Text>
            </View>
            <LanguageDropdown lang={lang} onSelect={setSettingsLang} rtl={rtl} />
          </View>
          <Text style={[styles.title, { fontFamily: ff(lang, 'black') }, textDir]}>{stepCopy[step].title}</Text>
          <Text style={[styles.subtitle, { fontFamily: ff(lang, 'regular') }, textDir]}>{stepCopy[step].subtitle}</Text>

          {step === 'contact' && (
            <>
              <TextInput
                value={contact}
                onChangeText={value => { setContact(value); setError(''); }}
                placeholder={t(lang, 'contactPlaceholder')}
                placeholderTextColor="#8B80A8"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                style={[styles.input, { fontFamily: ff(lang, 'regular') }, textDir]}
              />
              <TextInput
                value={birthYear}
                onChangeText={value => { setBirthYear(value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
                placeholder={t(lang, 'birthYearPlaceholder')}
                placeholderTextColor="#8B80A8"
                keyboardType="numeric"
                maxLength={4}
                style={[styles.input, { fontFamily: ff(lang, 'regular') }, textDir]}
                onSubmitEditing={sendCode}
              />
              {error ? <Text style={[styles.error, { fontFamily: ff(lang, 'bold') }, textDir]}>{error}</Text> : null}
              <TouchableOpacity style={styles.primaryButton} onPress={sendCode} disabled={busy} activeOpacity={0.86}>
                {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={[styles.primaryText, { fontFamily: ff(lang, 'black') }]}>{t(lang, 'sendCode')}</Text>}
              </TouchableOpacity>
            </>
          )}

          {step === 'code' && (
            <>
              <CodeCircles
                length={6}
                value={code}
                onChangeText={value => { setCode(value); setError(''); }}
                autoFocus
                oneTimeCode
                onSubmitEditing={confirmCode}
                lang={lang}
              />
              {error ? <Text style={[styles.error, { fontFamily: ff(lang, 'bold') }, textDir]}>{error}</Text> : null}
              <TouchableOpacity style={styles.primaryButton} onPress={confirmCode} disabled={busy} activeOpacity={0.86}>
                {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={[styles.primaryText, { fontFamily: ff(lang, 'black') }]}>{t(lang, 'confirmCode')}</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={resendCode} disabled={busy || cooldown > 0} activeOpacity={0.7} style={styles.linkRow}>
                <Text style={[styles.link, cooldown > 0 && styles.linkDisabled, { fontFamily: ff(lang, 'bold') }]}>
                  {resendLabel(lang, cooldown)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={backToContact} disabled={busy} activeOpacity={0.7}>
                <Text style={[styles.link, { fontFamily: ff(lang, 'regular') }]}>{t(lang, 'changeContact')}</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'password' && (
            <>
              <Text style={[styles.fieldLabel, { fontFamily: ff(lang, 'bold') }, textDir]}>{t(lang, 'birthYearLabel')}</Text>
              <CodeCircles
                length={4}
                value={password}
                onChangeText={value => { setPassword(value); setError(''); }}
                secure
                autoFocus
                onSubmitEditing={finish}
                lang={lang}
              />
              {error ? <Text style={[styles.error, { fontFamily: ff(lang, 'bold') }, textDir]}>{error}</Text> : null}
              <TouchableOpacity style={styles.primaryButton} onPress={finish} disabled={busy} activeOpacity={0.86}>
                {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={[styles.primaryText, { fontFamily: ff(lang, 'black') }]}>{t(lang, 'saveAndStart')}</Text>}
              </TouchableOpacity>
            </>
          )}

          <Text style={[styles.note, { fontFamily: ff(lang, 'regular') }]}>{t(lang, 'note')}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#64D8A4', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sun: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: '#FFE16A', top: -100, right: -55 },
  cloud: { position: 'absolute', width: 360, height: 180, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.34)', bottom: -80, left: -70 },
  shell: { borderRadius: 34, backgroundColor: '#FFFFFF', overflow: 'visible', borderWidth: 7, borderColor: 'rgba(255,255,255,0.75)', elevation: 12, shadowColor: '#174B3A', shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 12 } },
  artPane: { width: '43%', backgroundColor: '#FFF3B0', alignItems: 'center', justifyContent: 'center', padding: 24, borderRadius: 27, overflow: 'hidden' },
  character: { width: '82%', height: 270 },
  characterCompact: { height: 200 },
  artTitle: { color: '#321E63', fontSize: 27, textAlign: 'center' },
  artCopy: { color: '#66577F', fontSize: 14, lineHeight: 23, textAlign: 'center', marginTop: 8 },
  formPane: { flex: 1, paddingHorizontal: 42, paddingVertical: 30, justifyContent: 'center' },
  topRow: { alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  lockBadge: { width: 66, height: 66, borderRadius: 23, backgroundColor: '#FFF0C8', alignItems: 'center', justifyContent: 'center' },
  lockGlyph: { color: '#FF7A1A', fontSize: 34, lineHeight: 40 },
  langWrap: { position: 'relative', zIndex: 20 },
  langButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F1FA', borderWidth: 2, borderColor: '#E1D9EE', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 9, gap: 6 },
  langFlag: { fontSize: 16 },
  langButtonText: { color: '#2C175D', fontSize: 13 },
  langChevron: { color: '#8B80A8', fontSize: 10, marginLeft: 2 },
  langMenu: { position: 'absolute', top: 46, minWidth: 150, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 2, borderColor: '#E1D9EE', paddingVertical: 6, elevation: 16, shadowColor: '#174B3A', shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, zIndex: 30 },
  langMenuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  langMenuItemActive: { backgroundColor: '#FFF0C8' },
  langMenuText: { color: '#2C175D', fontSize: 14 },
  title: { color: '#2C175D', fontSize: 29 },
  subtitle: { color: '#776B91', fontSize: 14, lineHeight: 23, marginTop: 6, marginBottom: 20 },
  input: { height: 58, borderRadius: 18, backgroundColor: '#F4F1FA', borderWidth: 2, borderColor: '#E1D9EE', paddingHorizontal: 17, color: '#2C175D', fontSize: 15, marginBottom: 13 },
  fieldLabel: { color: '#2C175D', fontSize: 14, marginBottom: 10 },
  circleRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16, position: 'relative' },
  circle: {
    width: 46, height: 46, borderRadius: 23, marginHorizontal: 6,
    backgroundColor: '#F4F1FA', borderWidth: 2, borderColor: '#E1D9EE',
    alignItems: 'center', justifyContent: 'center',
  },
  circleFilled: { backgroundColor: '#FF7A1A', borderColor: '#FF7A1A' },
  circleCursor: { borderColor: '#FF7A1A' },
  circleDigit: { color: '#FFFFFF', fontSize: 20 },
  circleDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' },
  hiddenInput: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 },
  error: { color: '#D73737', marginBottom: 8, fontSize: 12 },
  primaryButton: { height: 59, borderRadius: 19, backgroundColor: '#FF7A1A', alignItems: 'center', justifyContent: 'center', marginTop: 3 },
  primaryText: { color: '#FFFFFF', fontSize: 16 },
  linkRow: { marginTop: 14 },
  link: { color: '#6B21A8', textAlign: 'center', fontSize: 13, marginTop: 6 },
  linkDisabled: { color: '#B7AECB' },
  note: { color: '#9488AD', textAlign: 'center', fontSize: 11, marginTop: 11 },
});
