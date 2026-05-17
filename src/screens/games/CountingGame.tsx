import React, { useContext, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import TopBar from '../../components/TopBar';
import { neliWorldAssets } from '../../assets/neliWorldAssets';
import { AppContext } from '../../store/AppContext';
import { C } from '../../theme/colors';
import { dir, ff } from '../../theme/fonts';

const OBJECT_SETS = [
  { name: 'apples', image: neliWorldAssets.foods.apple },
  { name: 'carrots', image: neliWorldAssets.foods.carrot },
  { name: 'stars', image: neliWorldAssets.ui.star },
  { name: 'fish', image: neliWorldAssets.foods.fish },
];

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
  const isFa = lang === 'fa' || lang === 'ar';

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
      setRound(makeRound());
    }, 950);
  };

  return (
    <View style={styles.root}>
      <TopBar title="Counting" titleFa="شمارش" showBack dark rightContent={<Text style={styles.score}>{score}</Text>} />

      <View style={styles.content}>
        <ImageBackground source={neliWorldAssets.rooms.garden} style={styles.stage} imageStyle={styles.stageImage}>
          <View style={styles.stageShade} />
          <Text style={[styles.kicker, { fontFamily: ff(lang, 'black') }, dir(lang)]}>
            {isFa ? 'چند تا می بینی؟' : 'How many do you see?'}
          </Text>
          <View style={styles.objectGarden}>
            {Array.from({ length: round.count }).map((_, i) => (
              <Image key={`${round.set.name}-${i}`} source={round.set.image} style={[styles.countImage, { transform: [{ rotate: `${i % 2 ? 8 : -8}deg` }] }]} resizeMode="contain" />
            ))}
          </View>
        </ImageBackground>

        <View style={styles.options}>
          {round.options.map(n => {
            const selectedWrong = feedback === false && n !== round.count;
            const selectedRight = feedback !== null && n === round.count;
            return (
              <TouchableOpacity key={n} style={[styles.numBtn, selectedRight && styles.numBtnRight, selectedWrong && styles.numBtnDim]} onPress={() => handleAnswer(n)} activeOpacity={0.86}>
                <Text style={styles.numText}>{n}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {feedback !== null ? (
          <View style={[styles.feedback, feedback ? styles.feedbackGood : styles.feedbackBad]}>
            <Text style={[styles.feedbackText, { fontFamily: ff(lang, 'black') }]}>
              {feedback ? (isFa ? 'درست بود!' : 'That is right!') : (isFa ? `${round.count} تا بود` : `It was ${round.count}`)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#35B95B' },
  score: { minWidth: 48, height: 42, borderRadius: 21, backgroundColor: C.yellow, color: C.textDark, fontFamily: ff('fa', 'black'), fontSize: 17, textAlign: 'center', textAlignVertical: 'center', paddingTop: 9 },
  content: { flex: 1, padding: 16, paddingTop: 8 },
  stage: { flex: 1, minHeight: 332, borderRadius: 32, padding: 18, overflow: 'hidden', borderWidth: 6, borderColor: '#FFFFFF' },
  stageImage: { width: '100%', height: '100%' },
  stageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(24,91,32,0.08)' },
  kicker: { color: '#FFFFFF', fontSize: 26, lineHeight: 34, textAlign: 'center', marginBottom: 16 },
  objectGarden: { flex: 1, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.18)', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 12, padding: 16 },
  countImage: { width: 64, height: 64 },
  options: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, paddingTop: 18 },
  numBtn: { width: '46%', height: 86, borderRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#FFFFFF' },
  numBtnRight: { backgroundColor: '#ECFDF3', borderColor: '#22C55E' },
  numBtnDim: { opacity: 0.5 },
  numText: { fontFamily: ff('fa', 'black'), color: C.purpleDeep, fontSize: 38 },
  feedback: { position: 'absolute', left: 32, right: 32, bottom: 22, borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  feedbackGood: { backgroundColor: '#22C55E' },
  feedbackBad: { backgroundColor: '#FF6B6B' },
  feedbackText: { color: '#FFFFFF', fontSize: 20 },
});
