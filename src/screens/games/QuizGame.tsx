import React, { useContext, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppContext } from '../../store/AppContext';
import { useSpeech } from '../../hooks/useSpeech';
import TopBar from '../../components/TopBar';
import CharacterAvatar from '../../components/CharacterAvatar';
import { C } from '../../theme/colors';
import { dir, ff } from '../../theme/fonts';
import { neliWorldAssets } from '../../assets/neliWorldAssets';

type Item = { id: string; fa: string; en: string; kind: 'cat' | 'apple' | 'water' | 'sun' | 'house' | 'flower'; color: string; accent: string };

const ITEMS: Item[] = [
  { id: 'cat', fa: 'گربه', en: 'Cat', kind: 'cat', color: '#A855F7', accent: '#FDE68A' },
  { id: 'apple', fa: 'سیب', en: 'Apple', kind: 'apple', color: '#EF4444', accent: '#22C55E' },
  { id: 'water', fa: 'آب', en: 'Water', kind: 'water', color: '#38BDF8', accent: '#93C5FD' },
  { id: 'sun', fa: 'خورشید', en: 'Sun', kind: 'sun', color: '#FACC15', accent: '#FB923C' },
  { id: 'house', fa: 'خانه', en: 'House', kind: 'house', color: '#FB923C', accent: '#A855F7' },
  { id: 'flower', fa: 'گل', en: 'Flower', kind: 'flower', color: '#EC4899', accent: '#22C55E' },
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeQuestion() {
  const correct = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const options = shuffle([correct, ...shuffle(ITEMS.filter(item => item.id !== correct.id)).slice(0, 3)]);
  return { correct, options };
}

function ItemArt({ item, characterId }: { item: Item; characterId: string }) {
  const source = {
    apple: neliWorldAssets.foods.apple,
    water: neliWorldAssets.foods.water,
    sun: neliWorldAssets.ui.star,
    house: neliWorldAssets.rooms.livingRoom,
    flower: neliWorldAssets.ui.paintbrush,
    cat: neliWorldAssets.animals.cat,
  }[item.kind];

  if (item.kind === 'house') {
    return (
      <ImageBackground source={source} style={styles.art} imageStyle={styles.artImage}>
        <CharacterAvatar characterId={characterId} size={124} />
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.art, { backgroundColor: item.accent + '55' }]}>
      <Image source={source} style={item.kind === 'cat' ? styles.artCharacter : styles.artAsset} resizeMode="contain" />
    </View>
  );
}

export default function QuizGame() {
  const { lang, addStars, selectedCharacterId } = useContext(AppContext);
  const { speakFarsiOnly, speakInLang, stop } = useSpeech();
  const [q, setQ] = useState(makeQuestion);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const isFa = lang === 'fa' || lang === 'ar';

  const speakItem = () => {
    stop();
    speakFarsiOnly(q.correct.fa, () => {
      if (!isFa) setTimeout(() => speakInLang(q.correct.en, lang), 220);
    });
  };

  const answer = (item: Item) => {
    if (selected) return;
    setSelected(item.id);
    const ok = item.id === q.correct.id;
    if (ok) {
      addStars(2);
      setScore(prev => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setTotal(prev => prev + 1);
    setTimeout(() => {
      setQ(makeQuestion());
      setSelected(null);
    }, 1000);
  };

  return (
    <View style={styles.root}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#E9F7FF' }]} />
      <TopBar title="Word Quiz" titleFa="مسابقه کلمه" showBack dark={false} rightContent={<Text style={styles.score}>{score}/{total}</Text>} />
      <View style={styles.content}>
        <TouchableOpacity style={styles.questionCard} onPress={speakItem} activeOpacity={0.9}>
          <ItemArt item={q.correct} characterId={selectedCharacterId} />
          <Text style={[styles.question, { fontFamily: ff(lang, 'black') }, dir(lang)]}>{isFa ? 'این چیه؟' : 'What is this?'}</Text>
          <Text style={styles.listen}>{isFa ? 'برای شنیدن لمس کن' : 'Tap to hear'}</Text>
        </TouchableOpacity>
        <View style={styles.options}>
          {q.options.map(opt => {
            const correct = selected && opt.id === q.correct.id;
            const wrong = selected === opt.id && opt.id !== q.correct.id;
            return (
              <TouchableOpacity key={opt.id} style={[styles.option, !!correct && styles.correct, wrong && styles.wrong]} onPress={() => answer(opt)}>
                <Text style={[styles.optFa, { fontFamily: ff('fa', 'black') }]}>{opt.fa}</Text>
                <Text style={styles.optEn}>{opt.en}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  score: { minWidth: 58, height: 42, borderRadius: 21, backgroundColor: C.yellow, color: C.textDark, fontFamily: ff('fa', 'black'), fontSize: 15, textAlign: 'center', textAlignVertical: 'center', paddingTop: 10 },
  content: { flex: 1, padding: 16, paddingTop: 8 },
  questionCard: { minHeight: 330, borderRadius: 32, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 18 },
  question: { color: C.textDark, fontSize: 28, lineHeight: 36, marginTop: 10, textAlign: 'center' },
  listen: { fontFamily: ff('fa', 'bold'), color: C.textMid, fontSize: 12, marginTop: 5 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  option: { width: '48%', minHeight: 86, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 4.5, borderColor: 'transparent' },
  correct: { borderColor: '#22C55E', backgroundColor: '#F0FFF4' },
  wrong: { borderColor: '#FF6B6B', backgroundColor: '#FFF1F2' },
  optFa: { color: C.textDark, fontSize: 19 },
  optEn: { fontFamily: ff('fa', 'bold'), color: C.textMid, fontSize: 12 },
  art: { width: '100%', height: 210, borderRadius: 28, backgroundColor: '#F7F4FF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  artImage: { width: '100%', height: '100%' },
  artAsset: { width: 150, height: 150 },
  artCharacter: { width: 174, height: 174 },
  sceneNeli: { position: 'absolute', right: 20, bottom: -8, width: 112, height: 146 },
  apple: { width: 92, height: 92, borderRadius: 46 },
  leaf: { position: 'absolute', top: 56, right: 126, width: 28, height: 16, borderRadius: 12, transform: [{ rotate: '-25deg' }] },
  drop: { width: 84, height: 112, borderRadius: 46, transform: [{ rotate: '45deg' }] },
  sunHalo: { position: 'absolute', width: 138, height: 138, borderRadius: 69, opacity: 0.35 },
  sun: { width: 90, height: 90, borderRadius: 45 },
  roof: { width: 0, height: 0, borderLeftWidth: 70, borderRightWidth: 70, borderBottomWidth: 62, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  house: { width: 118, height: 78, borderRadius: 16, backgroundColor: '#FFFFFF' },
  door: { position: 'absolute', bottom: 45, width: 30, height: 44, borderRadius: 11 },
  petal: { position: 'absolute', top: 48, width: 44, height: 52, borderRadius: 24 },
  petalLeft: { position: 'absolute', left: 115, top: 78, width: 44, height: 52, borderRadius: 24 },
  petalRight: { position: 'absolute', right: 115, top: 78, width: 44, height: 52, borderRadius: 24 },
  center: { width: 36, height: 36, borderRadius: 18 },
  stem: { position: 'absolute', bottom: 44, width: 9, height: 58, borderRadius: 5 },
  catHead: { width: 112, height: 104, borderRadius: 52 },
  catEarLeft: { position: 'absolute', left: 108, top: 52, width: 36, height: 42, borderRadius: 19 },
  catEarRight: { position: 'absolute', right: 108, top: 52, width: 36, height: 42, borderRadius: 19 },
  eyeLeft: { position: 'absolute', left: 35, top: 40, width: 12, height: 12, borderRadius: 6, backgroundColor: '#1B1238' },
  eyeRight: { position: 'absolute', right: 35, top: 40, width: 12, height: 12, borderRadius: 6, backgroundColor: '#1B1238' },
  smile: { position: 'absolute', bottom: 27, alignSelf: 'center', width: 42, height: 20, borderBottomWidth: 5, borderBottomColor: '#1B1238', borderRadius: 20 },
});
