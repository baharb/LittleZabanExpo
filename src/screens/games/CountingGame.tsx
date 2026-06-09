import React, { useContext, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import TopBar from '../../components/TopBar';
import { neliWorldAssets } from '../../assets/neliWorldAssets';
import { characterAssets } from '../../assets/characterAssets';
import { AppContext } from '../../store/AppContext';
import { C } from '../../theme/colors';
import { dir, ff } from '../../theme/fonts';

const OBJECT_SETS = [
  { name: 'apples', fa: 'سیب', en: 'apple', image: neliWorldAssets.foods.apple },
  { name: 'carrots', fa: 'هویج', en: 'carrot', image: neliWorldAssets.foods.carrot },
  { name: 'stars', fa: 'ستاره', en: 'star', image: neliWorldAssets.ui.star },
  { name: 'fish', fa: 'ماهی', en: 'fish', image: neliWorldAssets.foods.fish },
];

const objectTransforms: Array<any[]> = [
  [{ translateY: -20 }, { rotate: '-8deg' }],
  [{ translateY: 12 }, { rotate: '7deg' }],
  [{ translateY: -6 }, { rotate: '4deg' }],
  [{ translateY: 18 }, { rotate: '-5deg' }],
  [{ translateY: -14 }, { rotate: '9deg' }],
  [{ translateY: 8 }, { rotate: '-9deg' }],
  [{ translateY: -2 }, { rotate: '6deg' }],
  [{ translateY: 22 }, { rotate: '-3deg' }],
  [{ translateY: -18 }, { rotate: '3deg' }],
];

const FA_NUMBERS = ['یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه', 'ده'];
const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function toFaDigits(value: number | string) {
  return String(value).replace(/\d/g, digit => FA_DIGITS[Number(digit)]);
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeRound() {
  const count = Math.floor(Math.random() * 9) + 1;
  const set = OBJECT_SETS[Math.floor(Math.random() * OBJECT_SETS.length)];
  const options = new Set([count]);
  while (options.size < 4) options.add(Math.floor(Math.random() * 10) + 1);
  return { count, set, options: shuffle([...options]) };
}

export default function CountingGame() {
  const { lang, addStars } = useContext(AppContext);
  const [round, setRound] = useState(makeRound);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [countedItems, setCountedItems] = useState<number[]>([]);
  const isFa = lang === 'fa' || lang === 'ar';

  const speakCount = (index: number) => {
    if (countedItems.includes(index)) return;
    const number = index + 1;
    setCountedItems(prev => [...prev, index]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Speech.stop();
    Speech.speak(isFa ? `${FA_NUMBERS[index]} ${round.set.fa}` : `${number} ${round.set.en}`, {
      language: isFa ? 'fa-IR' : 'en-US',
      rate: isFa ? 0.68 : 0.82,
      pitch: 1.18,
    });
  };

  const handleAnswer = (n: number) => {
    if (feedback !== null) return;
    const correct = n === round.count;
    setFeedback(correct);
    if (correct) {
      addStars(2);
      setScore(prev => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setTimeout(() => {
      setFeedback(null);
      setCountedItems([]);
      setRound(makeRound());
    }, 950);
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={neliWorldAssets.rooms.garden} style={styles.scene} imageStyle={styles.sceneImage}>
        <View style={styles.sceneWash} />
        <View style={styles.skyGlow} />
        <TopBar title="Counting" titleFa="شمارش" showClose dark={false} rightContent={<Text style={styles.score}>{toFaDigits(score)}</Text>} />

        <View style={styles.content}>
          <View style={styles.questionPill}>
            <Text style={[styles.kicker, { fontFamily: ff(lang, 'black') }, dir(lang)]}>
              {isFa ? 'چند تا می‌بینی؟' : 'How many do you see?'}
            </Text>
          </View>

          <Image source={characterAssets.aidin.poses.thinking} style={styles.owl} resizeMode="contain" />

          <View style={styles.objectGarden}>
            {Array.from({ length: round.count }).map((_, i) => {
              const counted = countedItems.includes(i);
              return (
                <TouchableOpacity
                  key={`${round.set.name}-${i}`}
                  style={styles.countItem}
                  onPress={() => speakCount(i)}
                  activeOpacity={counted ? 1 : 0.82}
                >
                  <Image
                    source={round.set.image}
                    style={[
                      styles.countImage,
                      {
                        transform: [
                          ...objectTransforms[i % objectTransforms.length],
                          ...(counted ? [{ scale: 1.15 }] : []),
                        ],
                      },
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomTray}>
          <View style={styles.options}>
            {round.options.map(n => {
              const selectedWrong = feedback === false && n !== round.count;
              const selectedRight = feedback !== null && n === round.count;
              return (
                <TouchableOpacity
                  key={n}
                  style={[styles.numBtn, selectedRight && styles.numBtnRight, selectedWrong && styles.numBtnDim]}
                  onPress={() => handleAnswer(n)}
                  activeOpacity={0.86}
                >
                  <Text style={styles.numText}>{toFaDigits(n)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {feedback !== null ? (
          <View style={[styles.feedback, feedback ? styles.feedbackGood : styles.feedbackBad]}>
            <Text style={[styles.feedbackText, { fontFamily: ff(lang, 'black') }]}>
              {feedback ? (isFa ? 'درست بود!' : 'That is right!') : (isFa ? `${round.count} تا بود` : `It was ${round.count}`)}
            </Text>
          </View>
        ) : null}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7FFF4' },
  scene: { flex: 1 },
  sceneImage: { width: '100%', height: '100%', opacity: 0.42 },
  sceneWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.42)' },
  skyGlow: {
    position: 'absolute',
    right: -80,
    top: -86,
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: 'rgba(186,230,253,0.58)',
  },
  score: {
    minWidth: 52,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    color: C.textDark,
    fontFamily: ff('fa', 'black'),
    fontSize: 17,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 9,
    borderWidth: 2,
    borderColor: '#B9F6CA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionPill: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#14532D',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  kicker: { color: C.textDark, fontSize: 25, lineHeight: 34, textAlign: 'center' },
  owl: {
    position: 'absolute',
    left: -10,
    bottom: 66,
    width: 340,
    height: 420,
  },
  objectGarden: {
    width: '60%',
    minWidth: 390,
    maxWidth: 620,
    minHeight: 220,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.36)',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingHorizontal: 28,
    paddingVertical: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  countItem: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countImage: { width: 70, height: 70 },
  bottomTray: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 34,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderTopWidth: 2,
    borderColor: 'rgba(255,255,255,0.92)',
  },
  options: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  numBtn: {
    width: 112,
    height: 78,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#14532D',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },
  numBtnRight: { backgroundColor: '#ECFDF3', borderColor: '#22C55E' },
  numBtnDim: { opacity: 0.5 },
  numText: { fontFamily: ff('fa', 'black'), color: C.purpleDeep, fontSize: 38 },
  feedback: { position: 'absolute', left: 230, right: 230, bottom: 110, borderRadius: 24, paddingVertical: 13, alignItems: 'center' },
  feedbackGood: { backgroundColor: '#22C55E' },
  feedbackBad: { backgroundColor: '#FF6B6B' },
  feedbackText: { color: '#FFFFFF', fontSize: 20 },
});
