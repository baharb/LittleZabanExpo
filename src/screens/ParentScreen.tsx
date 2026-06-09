import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import KidIcon from '../components/KidIcon';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';

export default function ParentScreen() {
  const { goBack } = useNav();
  const { settingsLang: lang, stars, streak, completedSections, badges, parentPin, setParentPin, setAge, age } = useContext(AppContext);
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [newPin, setNewPin] = useState('');
  const { width, height } = useWindowDimensions();
  const ui = Math.min(width / 390, height / 844);
  const isFa = lang === 'fa';

  if (!unlocked) {
    return (
      <View style={styles.root}>
        <TouchableOpacity onPress={goBack} style={[styles.back, { paddingTop: Math.max(44, Math.round(56 * ui)), paddingHorizontal: Math.max(12, Math.round(16 * ui)), paddingBottom: Math.max(6, Math.round(8 * ui)) }]}>
          <Text style={styles.backTxt}>‹ {isFa ? 'بازگشت' : 'Back'}</Text>
        </TouchableOpacity>
        <View style={[styles.lockWrap, { padding: Math.max(20, Math.round(24 * ui)) }]}>
          <View style={[styles.lockIcon, { width: Math.max(100, Math.round(112 * ui)), height: Math.max(100, Math.round(112 * ui)), borderRadius: Math.max(34, Math.round(40 * ui)), marginBottom: Math.max(14, Math.round(18 * ui)) }]}>
            <KidIcon name="profile" size={68} color="#7C3AED" softColor="#fff" />
          </View>
          <Text style={[styles.lockTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(24, Math.round(29 * ui)) }, dir(lang)]}>
            {isFa ? 'پنل والدین' : 'Parent Dashboard'}
          </Text>
          <Text style={[styles.lockSub, { fontFamily: ff(lang, 'regular'), fontSize: Math.max(13, Math.round(15 * ui)), marginTop: Math.max(6, Math.round(7 * ui)), marginBottom: Math.max(20, Math.round(24 * ui)) }, dir(lang)]}>
            {isFa ? 'کد ۴ رقمی را وارد کنید.' : 'Enter your 4-digit PIN.'}
          </Text>
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            placeholder="••••"
            placeholderTextColor="rgba(34,16,68,0.28)"
          />
          <TouchableOpacity style={[styles.enterBtn, { borderRadius: Math.max(18, Math.round(22 * ui)), paddingHorizontal: Math.max(34, Math.round(44 * ui)), paddingVertical: Math.max(12, Math.round(14 * ui)), marginTop: Math.max(14, Math.round(18 * ui)) }]} onPress={() => {
            if (pin === parentPin) setUnlocked(true);
            else { Alert.alert('Wrong PIN'); setPin(''); }
          }}>
            <Text style={[styles.enterTxt, { fontFamily: ff(lang, 'bold') }]}>{isFa ? 'ورود' : 'Enter'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={goBack} style={[styles.back, { paddingTop: Math.max(44, Math.round(56 * ui)), paddingHorizontal: Math.max(12, Math.round(16 * ui)), paddingBottom: Math.max(6, Math.round(8 * ui)) }]}>
        <Text style={styles.backTxt}>‹ {isFa ? 'بازگشت' : 'Back'}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: Math.max(12, Math.round(14 * ui)), paddingBottom: Math.max(28, Math.round(34 * ui)) }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(24, Math.round(28 * ui)), marginBottom: Math.max(12, Math.round(14 * ui)) }, dir(lang)]}>
          {isFa ? 'گزارش کودک' : "Child's Progress"}
        </Text>
        <View style={styles.statsRow}>
          {[
            ['★', stars, isFa ? 'ستاره' : 'Stars'],
            ['🔥', streak, isFa ? 'رکورد' : 'Streak'],
            ['✓', completedSections.length, isFa ? 'درس' : 'Lessons'],
            ['🏆', badges.length, isFa ? 'نشان' : 'Badges'],
          ].map(([e, v, l]) => (
            <View key={String(l)} style={styles.statCard}>
              <Text style={styles.statEmoji}>{e}</Text>
              <Text style={[styles.statVal, { fontFamily: ff(lang, 'black') }]}>{v}</Text>
              <Text style={[styles.statLbl, { fontFamily: ff(lang, 'regular') }]}>{l}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black') }, dir(lang)]}>{isFa ? 'سن کودک' : 'Child Age'}</Text>
          <View style={styles.ageRow}>
            {[2,3,4,5,6,7,8,9,10,11,12].map(a => (
              <TouchableOpacity key={a} style={[styles.ageBtn, age === a && styles.ageBtnActive]} onPress={() => setAge(a)}>
                <Text style={[styles.ageTxt, age === a && styles.ageTxtActive]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black') }, dir(lang)]}>{isFa ? 'تغییر کد' : 'Change PIN'}</Text>
          <View style={styles.pinRow}>
            <TextInput
              style={styles.newPin}
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              placeholder={isFa ? 'کد جدید' : 'New PIN'}
              placeholderTextColor="rgba(34,16,68,0.32)"
            />
          <TouchableOpacity style={[styles.saveBtn, { borderRadius: Math.max(16, Math.round(18 * ui)), paddingHorizontal: Math.max(16, Math.round(18 * ui)) }]} onPress={() => {
              if (newPin.length === 4) { setParentPin(newPin); setNewPin(''); Alert.alert('PIN changed'); }
              else Alert.alert('Must be 4 digits');
            }}>
              <Text style={styles.saveTxt}>{isFa ? 'ذخیره' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black') }, dir(lang)]}>{isFa ? 'صدای فارسی' : 'Persian Voice'}</Text>
          <Text style={[styles.infoTxt, { fontFamily: ff(lang, 'regular') }, dir(lang)]}>
            {isFa
              ? 'برای تجربه بهتر، در آینده باید صدای واقعی فارسی جایگزین TTS شود.'
              : 'For a premium experience, real Persian voice recordings should replace TTS over time.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1B124F' },
  back: { },
  backTxt: { fontFamily: ff('fa', 'bold'), color: '#fff', fontSize: 18, fontWeight: '900' },
  lockWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lockIcon: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  lockTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  lockSub: { color: 'rgba(255,255,255,0.74)', textAlign: 'center' },
  pinInput: { backgroundColor: '#fff', borderRadius: 22, padding: 15, fontSize: 28, color: '#221044', textAlign: 'center', width: 170, letterSpacing: 11, fontFamily: ff('fa', 'bold') },
  enterBtn: { backgroundColor: '#FFD764', borderRadius: 22, paddingHorizontal: 44, paddingVertical: 14, marginTop: 18 },
  enterTxt: { color: '#221044', fontSize: 18, fontWeight: '900' },
  scroll: { paddingBottom: 34 },
  pageTitle: { color: '#fff', fontWeight: '900' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  statCard: { flexGrow: 1, flexBasis: '45%', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: 14, alignItems: 'center' },
  statEmoji: { fontSize: 24 },
  statVal: { color: '#221044', fontSize: 24, fontWeight: '900' },
  statLbl: { color: '#6B5A89', fontSize: 12 },
  panel: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 26, padding: 16, marginBottom: 14 },
  sectionTitle: { color: '#221044', fontSize: 18, fontWeight: '900', marginBottom: 12 },
  ageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ageBtn: { width: 46, height: 46, borderRadius: 17, backgroundColor: '#F0EBFF', alignItems: 'center', justifyContent: 'center' },
  ageBtnActive: { backgroundColor: '#7C3AED' },
  ageTxt: { fontFamily: ff('fa', 'bold'), color: '#221044', fontSize: 16, fontWeight: '900' },
  ageTxtActive: { color: '#fff' },
  pinRow: { flexDirection: 'row', gap: 10 },
  newPin: { flex: 1, backgroundColor: '#F0EBFF', borderRadius: 18, padding: 12, color: '#221044', fontSize: 18, textAlign: 'center', fontFamily: ff('fa', 'bold') },
  saveBtn: { backgroundColor: '#16A36A', borderRadius: 18, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  saveTxt: { fontFamily: ff('fa', 'bold'), color: '#fff', fontSize: 14, fontWeight: '900' },
  infoTxt: { color: '#6B5A89', fontSize: 13.5, lineHeight: 21 },
});
