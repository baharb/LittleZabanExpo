import React, { useState } from 'react';
import { Image, ImageSourcePropType, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { ff } from '../theme/fonts';

interface Props {
  iconSource?: ImageSourcePropType;
  iconEmoji?: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  errorText: string;
  onVerify: (password: string) => boolean;
  onSuccess: () => void;
  onClose: () => void;
}

// Shared visual shell for any "confirm the parent password before X" flow —
// currently used by Settings and by Premium. Keeping the card, blobs and PIN
// input in one place means every password gate in the app looks and behaves
// the same, and a future one is just a few lines of copy plugged in here.
export default function PasswordGate({
  iconSource, iconEmoji, title, subtitle, buttonLabel, errorText, onVerify, onSuccess, onClose,
}: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!onVerify(password)) {
      setError(errorText);
      return;
    }
    setPassword('');
    setError('');
    onSuccess();
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.blobOne} />
      <View style={styles.blobTwo} />
      <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Image source={neliWorldAssets.ui.close} style={styles.closeIcon} resizeMode="contain" />
      </TouchableOpacity>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          {iconSource ? (
            <Image source={iconSource} style={styles.settingsIcon} resizeMode="contain" />
          ) : (
            <Text style={styles.emojiIcon}>{iconEmoji}</Text>
          )}
        </View>
        <Text style={[styles.title, { fontFamily: ff('fa', 'black') }]}>{title}</Text>
        <Text style={[styles.subtitle, { fontFamily: ff('fa', 'regular') }]}>{subtitle}</Text>
        <TextInput
          value={password}
          onChangeText={value => { setPassword(value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
          secureTextEntry
          autoFocus
          keyboardType="numeric"
          maxLength={4}
          textContentType="password"
          placeholder="رمز عبور، ۴ رقم"
          placeholderTextColor="#9488AD"
          style={[styles.input, { fontFamily: ff('fa', 'regular') }]}
          onSubmitEditing={submit}
        />
        {error ? <Text style={[styles.error, { fontFamily: ff('fa', 'bold') }]}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={submit} activeOpacity={0.86}>
          <Text style={[styles.buttonText, { fontFamily: ff('fa', 'black') }]}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2D1B69', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  blobOne: { position: 'absolute', width: 420, height: 420, borderRadius: 210, backgroundColor: '#6549C7', top: -190, right: -80 },
  blobTwo: { position: 'absolute', width: 360, height: 360, borderRadius: 180, backgroundColor: '#FF9D45', bottom: -230, left: -80 },
  closeButton: { position: 'absolute', top: 12, left: 12, width: 62, height: 62, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  closeIcon: { width: 58, height: 58 },
  card: { width: '48%', minWidth: 410, maxWidth: 570, backgroundColor: '#FFFFFF', borderRadius: 32, paddingHorizontal: 40, paddingVertical: 28, alignItems: 'center', borderWidth: 6, borderColor: 'rgba(255,255,255,0.68)', elevation: 12, shadowColor: '#0C0623', shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 12 } },
  iconCircle: { width: 88, height: 88, borderRadius: 30, backgroundColor: '#FFF0C8', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  settingsIcon: { width: 68, height: 68 },
  emojiIcon: { fontSize: 44 },
  title: { color: '#2D1B69', fontSize: 28, textAlign: 'center' },
  subtitle: { color: '#74668F', fontSize: 14, lineHeight: 23, textAlign: 'center', marginTop: 5 },
  input: { width: '100%', height: 58, borderRadius: 18, backgroundColor: '#F3F0F8', borderWidth: 2, borderColor: '#DDD5E9', color: '#2D1B69', textAlign: 'right', paddingHorizontal: 17, marginTop: 18, fontSize: 16 },
  error: { color: '#D73737', alignSelf: 'stretch', textAlign: 'right', marginTop: 7, fontSize: 12 },
  button: { width: '100%', height: 58, borderRadius: 19, backgroundColor: '#FF7A1A', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  buttonText: { color: '#FFFFFF', fontSize: 16 },
});
