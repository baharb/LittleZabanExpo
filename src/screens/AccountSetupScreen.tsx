import React, { useContext, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { characterAssets } from '../assets/characterAssets';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { ff } from '../theme/fonts';

function isValidContact(value: string) {
  const normalized = value.trim();
  const phone = normalized.replace(/[\s()-]/g, '');
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || /^\+?[0-9]{8,15}$/.test(phone);
}

export default function AccountSetupScreen() {
  const { activateAccount } = useContext(AppContext);
  const { reset } = useNav();
  const { width, height } = useWindowDimensions();
  const compact = height < 600;
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const finish = async () => {
    if (!isValidContact(contact)) {
      setError('شماره تلفن یا ایمیل معتبر وارد کنید.');
      return;
    }
    if (!/^\d{4}$/.test(password)) {
      setError('رمز عبور باید ۴ رقم باشد.');
      return;
    }
    if (password !== confirmation) {
      setError('تکرار رمز عبور با رمز اصلی یکسان نیست.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await activateAccount(contact.trim(), password);
      reset({ name: 'Main', tab: 'Games' });
    } catch {
      setError('ذخیره رمز عبور انجام نشد. دوباره تلاش کنید.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.sun} />
      <View style={styles.cloud} />
      <View style={[styles.shell, { width: Math.min(width - 36, 980), minHeight: Math.min(height - 32, 570) }]}>
        <View style={styles.artPane}>
          <Image source={characterAssets.neli.poses.waving} style={[styles.character, compact && styles.characterCompact]} resizeMode="contain" />
          <Text style={[styles.artTitle, { fontFamily: ff('fa', 'black') }]}>به لیتل زبان خوش آمدید</Text>
          <Text style={[styles.artCopy, { fontFamily: ff('fa', 'regular') }]}>این رمز، تنظیمات والدین را از دسترس کودک دور نگه می‌دارد.</Text>
        </View>

        <View style={styles.formPane}>
          <View style={styles.lockBadge}>
            <Text style={styles.lockGlyph}>●</Text>
          </View>
          <Text style={[styles.title, { fontFamily: ff('fa', 'black') }]}>تنظیم رمز والدین</Text>
          <Text style={[styles.subtitle, { fontFamily: ff('fa', 'regular') }]}>ایمیل یا شماره تلفن را وارد کنید و یک رمز والدین بسازید. فعلاً کد فعال‌سازی ارسال نمی‌شود.</Text>

          <TextInput
            value={contact}
            onChangeText={value => { setContact(value); setError(''); }}
            placeholder="ایمیل یا شماره تلفن"
            placeholderTextColor="#8B80A8"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            style={[styles.input, { fontFamily: ff('fa', 'regular') }]}
          />
          <TextInput
            value={password}
            onChangeText={value => { setPassword(value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
            placeholder="رمز عبور، ۴ رقم"
            placeholderTextColor="#8B80A8"
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            textContentType="newPassword"
            style={[styles.input, { fontFamily: ff('fa', 'regular') }]}
          />
          <TextInput
            value={confirmation}
            onChangeText={value => { setConfirmation(value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
            placeholder="تکرار رمز عبور"
            placeholderTextColor="#8B80A8"
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            textContentType="newPassword"
            style={[styles.input, { fontFamily: ff('fa', 'regular') }]}
            onSubmitEditing={finish}
          />

          {error ? <Text style={[styles.error, { fontFamily: ff('fa', 'bold') }]}>{error}</Text> : null}
          <TouchableOpacity style={styles.primaryButton} onPress={finish} disabled={busy} activeOpacity={0.86}>
            {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={[styles.primaryText, { fontFamily: ff('fa', 'black') }]}>ذخیره رمز و شروع</Text>}
          </TouchableOpacity>
          <Text style={[styles.note, { fontFamily: ff('fa', 'regular') }]}>اطلاعات در این دستگاه ذخیره می‌شود و فعلاً پیام تأیید ارسال نمی‌شود.</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#64D8A4', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sun: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: '#FFE16A', top: -100, right: -55 },
  cloud: { position: 'absolute', width: 360, height: 180, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.34)', bottom: -80, left: -70 },
  shell: { flexDirection: 'row-reverse', borderRadius: 34, backgroundColor: '#FFFFFF', overflow: 'hidden', borderWidth: 7, borderColor: 'rgba(255,255,255,0.75)', elevation: 12, shadowColor: '#174B3A', shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 12 } },
  artPane: { width: '43%', backgroundColor: '#FFF3B0', alignItems: 'center', justifyContent: 'center', padding: 24 },
  character: { width: '82%', height: 270 },
  characterCompact: { height: 200 },
  artTitle: { color: '#321E63', fontSize: 27, textAlign: 'center' },
  artCopy: { color: '#66577F', fontSize: 14, lineHeight: 23, textAlign: 'center', marginTop: 8 },
  formPane: { flex: 1, paddingHorizontal: 42, paddingVertical: 30, justifyContent: 'center' },
  lockBadge: { width: 66, height: 66, borderRadius: 23, backgroundColor: '#FFF0C8', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginBottom: 12 },
  lockGlyph: { color: '#FF7A1A', fontSize: 34, lineHeight: 40 },
  title: { color: '#2C175D', fontSize: 29, textAlign: 'right' },
  subtitle: { color: '#776B91', fontSize: 14, lineHeight: 23, textAlign: 'right', marginTop: 6, marginBottom: 20 },
  input: { height: 58, borderRadius: 18, backgroundColor: '#F4F1FA', borderWidth: 2, borderColor: '#E1D9EE', paddingHorizontal: 17, color: '#2C175D', fontSize: 15, textAlign: 'right', marginBottom: 13 },
  error: { color: '#D73737', textAlign: 'right', marginBottom: 8, fontSize: 12 },
  primaryButton: { height: 59, borderRadius: 19, backgroundColor: '#FF7A1A', alignItems: 'center', justifyContent: 'center', marginTop: 3 },
  primaryText: { color: '#FFFFFF', fontSize: 16 },
  note: { color: '#9488AD', textAlign: 'center', fontSize: 11, marginTop: 11 },
});
