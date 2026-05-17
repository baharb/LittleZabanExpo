import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppContext } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { useSpeech } from '../../hooks/useSpeech';
import TopBar from '../../components/TopBar';
import { C } from '../../theme/colors';
import { dir, ff } from '../../theme/fonts';

type RoutineKind = 'wake' | 'brush' | 'wash' | 'dress' | 'eat' | 'sleep';
type Step = { kind: RoutineKind; fa: string; en: string; color: string; accent: string };

const STEPS: Step[] = [
  { kind: 'wake', fa: 'بیدار شو', en: 'Wake up', color: '#FACC15', accent: '#38BDF8' },
  { kind: 'brush', fa: 'مسواک بزن', en: 'Brush teeth', color: '#38BDF8', accent: '#6C4EFF' },
  { kind: 'wash', fa: 'دست‌ها را بشور', en: 'Wash hands', color: '#22C55E', accent: '#93C5FD' },
  { kind: 'dress', fa: 'لباس بپوش', en: 'Get dressed', color: '#EC4899', accent: '#FDE68A' },
  { kind: 'eat', fa: 'صبحانه بخور', en: 'Eat breakfast', color: '#FB923C', accent: '#FACC15' },
  { kind: 'sleep', fa: 'بخواب', en: 'Go to sleep', color: '#A855F7', accent: '#FDE68A' },
];

function RoutineArt({ step, completed }: { step: Step; completed: boolean }) {
  return (
    <View style={styles.artStage}>
      <View style={[styles.sun, { backgroundColor: step.accent, opacity: step.kind === 'sleep' ? 0.3 : 1 }]} />
      {step.kind === 'sleep' ? <View style={[styles.moon, { backgroundColor: step.accent }]} /> : null}
      <View style={[styles.face, { backgroundColor: step.color }]}>
        <View style={styles.eyeLeft} />
        <View style={styles.eyeRight} />
        <View style={completed ? styles.bigSmile : styles.smile} />
      </View>
      {step.kind === 'brush' ? <View style={[styles.toolBrush, { backgroundColor: step.accent }]} /> : null}
      {step.kind === 'wash' ? <View style={[styles.bubble, { backgroundColor: step.accent }]} /> : null}
      {step.kind === 'dress' ? <View style={[styles.shirt, { backgroundColor: step.accent }]} /> : null}
      {step.kind === 'eat' ? <View style={styles.plate} /> : null}
      {step.kind === 'wake' ? <View style={[styles.ray, { backgroundColor: step.accent }]} /> : null}
    </View>
  );
}

export default function DailyRoutineGame() {
  const { lang, addStars } = useContext(AppContext);
  const { reset } = useNav();
  const { speakFarsiOnly, speakInLang, stop } = useSpeech();
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<boolean[]>(Array(STEPS.length).fill(false));
  const isFa = lang === 'fa' || lang === 'ar';
  const step = STEPS[idx];
  const allDone = done.every(Boolean);

  const speakStep = (s = step) => {
    stop();
    speakFarsiOnly(s.fa, () => {
      if (!isFa) setTimeout(() => speakInLang(s.en, lang), 220);
    });
  };

  const completeStep = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDone(prev => prev.map((v, i) => (i === idx ? true : v)));
    addStars(1);
    speakStep();
  };

  const next = () => {
    if (idx < STEPS.length - 1) setIdx(prev => prev + 1);
    else reset({ name: 'Main', tab: 'Games' });
  };

  return (
    <View style={styles.root}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFF6D8' }]} />
      <TopBar title="Daily Routine" titleFa="کارهای روزانه" showBack dark={false} topInset={10} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={[styles.title, { fontFamily: ff(lang, 'black') }, dir(lang)]}>{isFa ? step.fa : step.en}</Text>
          <Text style={[styles.subtitle, { fontFamily: ff(lang, 'regular') }, dir(lang)]}>
            {done[idx] ? (isFa ? 'آفرین! انجام شد.' : 'Great! Done.') : (isFa ? 'برای انجام، دکمه را لمس کن.' : 'Tap the button to do it.')}
          </Text>
          <RoutineArt step={step} completed={done[idx]} />
        </View>

        <View style={styles.progress}>
          {STEPS.map((s, i) => (
            <TouchableOpacity key={s.kind} style={[styles.stepPill, i === idx && { borderColor: s.color }, done[i] && { backgroundColor: s.color }]} onPress={() => setIdx(i)}>
              <Text style={[styles.stepPillText, done[i] && { color: '#FFFFFF' }]}>{i + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.listenBtn} onPress={() => speakStep()}>
            <Text style={styles.listenText}>{isFa ? 'بشنو' : 'Listen'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.doBtn, { backgroundColor: step.color }]} onPress={done[idx] ? next : completeStep}>
            <Text style={styles.doText}>{done[idx] ? (idx < STEPS.length - 1 ? (isFa ? 'بعدی' : 'Next') : (isFa ? 'بازی‌ها' : 'Games')) : (isFa ? 'انجام دادم' : 'I did it')}</Text>
          </TouchableOpacity>
        </View>

        {allDone ? (
          <View style={styles.doneCard}>
            <Text style={[styles.doneTitle, { fontFamily: ff(lang, 'black') }, dir(lang)]}>{isFa ? 'همه کارها کامل شد!' : 'Routine complete!'}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF6D8' },
  scroll: { padding: 16, paddingBottom: 34 },
  hero: { borderRadius: 32, backgroundColor: '#FFFFFF', padding: 18, alignItems: 'center' },
  title: { color: C.textDark, fontSize: 30, lineHeight: 38, textAlign: 'center' },
  subtitle: { color: C.textMid, fontSize: 15, marginTop: 4, textAlign: 'center' },
  artStage: { width: '100%', height: 300, borderRadius: 30, backgroundColor: '#E9F7FF', alignItems: 'center', justifyContent: 'center', marginTop: 16, overflow: 'hidden' },
  sun: { position: 'absolute', top: 30, right: 42, width: 54, height: 54, borderRadius: 27 },
  moon: { position: 'absolute', top: 38, left: 48, width: 52, height: 52, borderRadius: 26 },
  face: { width: 150, height: 140, borderRadius: 70, borderWidth: 8, borderColor: '#FFFFFF' },
  eyeLeft: { position: 'absolute', left: 45, top: 54, width: 14, height: 14, borderRadius: 7, backgroundColor: '#1B1238' },
  eyeRight: { position: 'absolute', right: 45, top: 54, width: 14, height: 14, borderRadius: 7, backgroundColor: '#1B1238' },
  smile: { position: 'absolute', bottom: 35, alignSelf: 'center', width: 44, height: 20, borderBottomWidth: 5, borderBottomColor: '#1B1238', borderRadius: 20 },
  bigSmile: { position: 'absolute', bottom: 28, alignSelf: 'center', width: 58, height: 30, borderBottomWidth: 7, borderBottomColor: '#1B1238', borderRadius: 28 },
  toolBrush: { position: 'absolute', right: 72, bottom: 82, width: 98, height: 16, borderRadius: 8, transform: [{ rotate: '-20deg' }] },
  bubble: { position: 'absolute', right: 82, bottom: 76, width: 48, height: 48, borderRadius: 24, opacity: 0.75 },
  shirt: { position: 'absolute', bottom: 64, width: 72, height: 70, borderRadius: 18 },
  plate: { position: 'absolute', bottom: 66, width: 104, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF' },
  ray: { position: 'absolute', top: 104, width: 140, height: 12, borderRadius: 6 },
  progress: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 16 },
  stepPill: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  stepPillText: { fontFamily: ff('fa', 'black'), color: C.textDark, fontSize: 14 },
  actions: { flexDirection: 'row', gap: 12 },
  listenBtn: { flex: 1, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  listenText: { fontFamily: ff('fa', 'black'), color: C.purple, fontSize: 14 },
  doBtn: { flex: 1.4, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },
  doText: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 14 },
  doneCard: { borderRadius: 26, backgroundColor: '#FFFFFF', marginTop: 16, padding: 18, alignItems: 'center' },
  doneTitle: { color: C.textDark, fontSize: 20, textAlign: 'center' },
});
