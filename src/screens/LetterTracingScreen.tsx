import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppContext, Lang } from '../store/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import TopBar from '../components/TopBar';
import CharacterAvatar from '../components/CharacterAvatar';
import { C } from '../theme/colors';
import { ff } from '../theme/fonts';
import { neliWorldAssets } from '../assets/neliWorldAssets';

type Letter = { char: string; name: string; word: string; en: string; color: string; soft: string; icon: ImageSourcePropType };
type Point = { x: number; y: number };

const LETTERS: Letter[] = [
  { char: 'ا', name: 'الف', word: 'آب', en: 'Water', color: '#1FB6FF', soft: '#DFF5FF', icon: neliWorldAssets.foods.water },
  { char: 'ب', name: 'ب', word: 'بابا', en: 'Dad', color: '#6C4EFF', soft: '#EEE9FF', icon: neliWorldAssets.ui.home },
  { char: 'پ', name: 'پ', word: 'پلو', en: 'Rice', color: '#22C55E', soft: '#DCFCE7', icon: neliWorldAssets.foods.rice },
  { char: 'ت', name: 'ت', word: 'توپ', en: 'Ball', color: '#FACC15', soft: '#FFF7C2', icon: neliWorldAssets.ui.star },
  { char: 'ث', name: 'ث', word: 'ثمر', en: 'Fruit', color: '#FB923C', soft: '#FFEDD5', icon: neliWorldAssets.foods.apple },
  { char: 'ج', name: 'جیم', word: 'جوراب', en: 'Socks', color: '#EC4899', soft: '#FCE7F3', icon: neliWorldAssets.ui.heart },
  { char: 'چ', name: 'چ', word: 'چتر', en: 'Umbrella', color: '#A855F7', soft: '#F3E8FF', icon: neliWorldAssets.ui.trophy },
  { char: 'ح', name: 'ح', word: 'حلوا', en: 'Halva', color: '#14B8A6', soft: '#CCFBF1', icon: neliWorldAssets.persianFoods.kukuSabzi },
  { char: 'خ', name: 'خ', word: 'خرس', en: 'Bear', color: '#F97316', soft: '#FFEDD5', icon: neliWorldAssets.animals.bear },
  { char: 'د', name: 'دال', word: 'درخت', en: 'Tree', color: '#38BDF8', soft: '#E0F2FE', icon: neliWorldAssets.ui.star },
  { char: 'ذ', name: 'ذال', word: 'ذرت', en: 'Corn', color: '#EAB308', soft: '#FEF9C3', icon: neliWorldAssets.foods.corn },
  { char: 'ر', name: 'ر', word: 'رنگ', en: 'Color', color: '#22C55E', soft: '#DCFCE7', icon: neliWorldAssets.ui.paintbrush },
  { char: 'ز', name: 'ز', word: 'زنبور', en: 'Bee', color: '#FACC15', soft: '#FFF7C2', icon: neliWorldAssets.ui.star },
  { char: 'ژ', name: 'ژ', word: 'ژاله', en: 'Dew', color: '#FB923C', soft: '#FFEDD5', icon: neliWorldAssets.foods.water },
  { char: 'س', name: 'سین', word: 'سیب', en: 'Apple', color: '#EF4444', soft: '#FFE4E6', icon: neliWorldAssets.foods.apple },
  { char: 'ش', name: 'شین', word: 'شیر', en: 'Milk', color: '#7C3AED', soft: '#F1E8FF', icon: neliWorldAssets.foods.yogurt },
  { char: 'ص', name: 'صاد', word: 'صابون', en: 'Soap', color: '#06B6D4', soft: '#CFFAFE', icon: neliWorldAssets.ui.toothbrush },
  { char: 'ض', name: 'ضاد', word: 'ضربان', en: 'Beat', color: '#EC4899', soft: '#FCE7F3', icon: neliWorldAssets.ui.heart },
  { char: 'ط', name: 'طا', word: 'طبل', en: 'Drum', color: '#84CC16', soft: '#ECFCCB', icon: neliWorldAssets.ui.voice },
  { char: 'ظ', name: 'ظا', word: 'ظرف', en: 'Dish', color: '#8B5CF6', soft: '#EDE9FE', icon: neliWorldAssets.foods.pasta },
  { char: 'ع', name: 'عین', word: 'عروسک', en: 'Doll', color: '#F97316', soft: '#FFEDD5', icon: neliWorldAssets.characters.neli },
  { char: 'غ', name: 'غین', word: 'غذا', en: 'Food', color: '#06B6D4', soft: '#CFFAFE', icon: neliWorldAssets.foods.pasta },
  { char: 'ف', name: 'فا', word: 'فیل', en: 'Elephant', color: '#22C55E', soft: '#DCFCE7', icon: neliWorldAssets.animals.elephant },
  { char: 'ق', name: 'قاف', word: 'قورباغه', en: 'Frog', color: '#A855F7', soft: '#F3E8FF', icon: neliWorldAssets.animals.panda },
  { char: 'ک', name: 'کاف', word: 'کفش', en: 'Shoe', color: '#FACC15', soft: '#FFF7C2', icon: neliWorldAssets.ui.trophy },
  { char: 'گ', name: 'گاف', word: 'گل', en: 'Flower', color: '#EC4899', soft: '#FCE7F3', icon: neliWorldAssets.ui.heart },
  { char: 'ل', name: 'لام', word: 'لیمو', en: 'Lemon', color: '#14B8A6', soft: '#CCFBF1', icon: neliWorldAssets.foods.lemonSlice },
  { char: 'م', name: 'میم', word: 'ماه', en: 'Moon', color: '#3B82F6', soft: '#DBEAFE', icon: neliWorldAssets.ui.star },
  { char: 'ن', name: 'نون', word: 'نان', en: 'Bread', color: '#F59E0B', soft: '#FEF3C7', icon: neliWorldAssets.foods.bread },
  { char: 'و', name: 'واو', word: 'وان', en: 'Tub', color: '#EF4444', soft: '#FFE4E6', icon: neliWorldAssets.ui.toothbrush },
  { char: 'ه', name: 'ها', word: 'هوا', en: 'Air', color: '#8B5CF6', soft: '#EDE9FE', icon: neliWorldAssets.ui.sparkle },
  { char: 'ی', name: 'یا', word: 'یخ', en: 'Ice', color: '#0EA5E9', soft: '#E0F2FE', icon: neliWorldAssets.foods.water },
];

function ProgressDots({ total, current, color }: { total: number; current: number; color: string }) {
  return (
    <View style={styles.progressDots}>
      {Array.from({ length: total }).map((_, index) => (
        <View key={index} style={[styles.progressDot, index <= current && { backgroundColor: color, width: 22 }]} />
      ))}
    </View>
  );
}

function TracePad({ letter, lang, onComplete }: { letter: Letter; lang: Lang; onComplete: () => void }) {
  const { width, height } = useWindowDimensions();
  const size = Math.max(285, Math.min(430, Math.min(width * 0.38, height * 0.7)));
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [complete, setComplete] = useState(false);
  const current = useRef<Point[]>([]);
  const padRef = useRef<View | null>(null);
  const origin = useRef({ x: 0, y: 0 });
  const touchedZones = useRef([false, false, false]);
  const tracedDistance = useRef(0);

  const syncOrigin = () => {
    requestAnimationFrame(() => {
      padRef.current?.measureInWindow((x, y) => {
        origin.current = { x, y };
      });
    });
  };

  const reset = () => {
    setStrokes([]);
    setComplete(false);
    current.current = [];
    touchedZones.current = [false, false, false];
    tracedDistance.current = 0;
    syncOrigin();
  };

  useEffect(() => {
    reset();
  }, [letter.char]);

  const markZone = (pt: Point) => {
    const index = pt.y < size * 0.34 ? 0 : pt.y < size * 0.67 ? 1 : 2;
    touchedZones.current[index] = true;
  };

  const maybeComplete = () => {
    if (complete) return;
    const enoughZones = touchedZones.current.every(Boolean);
    const enoughDrawing = tracedDistance.current > size * 0.95;
    if (enoughZones && enoughDrawing) {
      setComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    }
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !complete,
      onMoveShouldSetPanResponder: () => !complete,
      onPanResponderGrant: event => {
        const pt = { x: event.nativeEvent.pageX - origin.current.x, y: event.nativeEvent.pageY - origin.current.y };
        current.current = [pt];
        markZone(pt);
        setStrokes(prev => [...prev, [pt]]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: event => {
        const pt = { x: event.nativeEvent.pageX - origin.current.x, y: event.nativeEvent.pageY - origin.current.y };
        const prevPoint = current.current[current.current.length - 1];
        if (prevPoint) {
          const dx = pt.x - prevPoint.x;
          const dy = pt.y - prevPoint.y;
          tracedDistance.current += Math.sqrt(dx * dx + dy * dy);
        }
        current.current.push(pt);
        markZone(pt);
        setStrokes(prev => {
          const next = [...prev];
          next[next.length - 1] = [...current.current];
          return next;
        });
        maybeComplete();
      },
      onPanResponderRelease: () => {
        current.current = [];
        maybeComplete();
      },
      onPanResponderTerminate: () => {
        current.current = [];
      },
    }),
  ).current;

  const renderStroke = (stroke: Point[], strokeIndex: number) =>
    stroke.slice(1).map((point, index) => {
      const previous = stroke[index];
      const dx = point.x - previous.x;
      const dy = point.y - previous.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      if (length < 0.5) return null;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      return (
        <View
          key={`${strokeIndex}-${index}`}
          style={[
            styles.stroke,
            {
              width: length + 18,
              left: (point.x + previous.x) / 2 - (length + 18) / 2,
              top: (point.y + previous.y) / 2 - 10,
              backgroundColor: complete ? '#20C878' : letter.color,
              transform: [{ rotate: `${angle}deg` }],
            },
          ]}
        />
      );
    });

  return (
    <View style={styles.padShell}>
      <View
        ref={padRef}
        style={[styles.pad, { width: size, height: size, backgroundColor: letter.soft }]}
        onLayout={syncOrigin}
        {...pan.panHandlers}
      >
        <View style={styles.letterAura} />
        <Text
          style={[
            styles.traceLetter,
            {
              color: letter.color,
              fontFamily: ff(lang, 'black'),
              fontSize: size * 0.82,
              lineHeight: size * 0.9,
            },
          ]}
        >
          {letter.char}
        </Text>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {strokes.map((stroke, index) => renderStroke(stroke, index))}
        </View>
        <View pointerEvents="none" style={styles.traceHint}>
          <Text style={[styles.traceHintText, { fontFamily: ff(lang, 'bold') }]}>
            {lang === 'fa' || lang === 'ar' ? 'با انگشتت روی حرف بکش' : 'Trace with your finger'}
          </Text>
        </View>
        {complete ? (
          <View style={styles.doneBadge}>
            <Text style={styles.doneMark}>✓</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.padActions}>
        <TouchableOpacity style={styles.clearButton} onPress={reset} activeOpacity={0.86}>
          <Text style={[styles.clearText, { fontFamily: ff(lang, 'black') }]}>
            {lang === 'fa' || lang === 'ar' ? 'پاک کن' : 'Clear'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function WordCard({ letter, index, lang }: { letter: Letter; index: number; lang: Lang }) {
  const bg = index === 0 ? letter.color : index === 1 ? '#FF7A45' : '#7C3AED';
  const label = index === 0 ? letter.word : index === 1 ? letter.name : letter.en;
  const caption = index === 0 ? 'کلمه' : index === 1 ? 'نام حرف' : 'English';

  return (
    <View style={[styles.wordCard, { backgroundColor: bg }]}>
      <View style={styles.wordImageBubble}>
        <Image source={letter.icon} style={styles.wordIcon} resizeMode="contain" />
      </View>
      <View style={styles.wordCopy}>
        <Text style={[styles.wordLabel, { fontFamily: ff(lang, 'black') }]} numberOfLines={1}>{label}</Text>
        <Text style={[styles.wordCaption, { fontFamily: ff(lang, 'bold') }]}>{caption}</Text>
      </View>
    </View>
  );
}

export default function LetterTracingScreen() {
  const { lang } = useContext(AppContext);
  const { speakFarsiOnly, speakInLang, stop } = useSpeech();
  const [idx, setIdx] = useState(0);
  const { width, height } = useWindowDimensions();
  const letter = LETTERS[idx];
  const isFa = lang === 'fa' || lang === 'ar';
  const mascotSize = Math.max(165, Math.min(250, height * 0.34));
  const railHeight = Math.max(72, Math.min(88, height * 0.13));

  const wordCards = useMemo(() => [0, 1, 2], [letter.char]);

  const speak = () => {
    stop();
    speakFarsiOnly(`${letter.name}. ${letter.word}`, () => {
      if (!isFa) setTimeout(() => speakInLang(`${letter.name}. ${letter.en}`, lang), 220);
    });
  };

  const nextLetter = () => {
    setIdx(prev => Math.min(prev + 1, LETTERS.length - 1));
  };

  return (
    <View style={styles.root}>
      <View style={styles.skyGlow} />
      <View style={styles.lemonGlow} />
      <View style={styles.pinkGlow} />
      <TopBar title="Letter Tracing" titleFa="تمرین حروف" showBack dark={false} compactTitle />

      <View style={[styles.stage, { paddingHorizontal: Math.max(16, width * 0.025), paddingBottom: railHeight + 8 }]}>
        <View style={styles.leftPanel}>
          <View style={styles.mascotCard}>
            <CharacterAvatar characterId="dara" size={mascotSize} floating={false} />
            <View style={[styles.speechBubble, { borderColor: letter.color }]}>
              <Text style={[styles.speechText, { fontFamily: ff(lang, 'black') }]}>
                {isFa ? 'آفرین! بکش و یاد بگیر' : 'Trace and learn!'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.centerPanel}>
          <View style={styles.headerCard}>
            <View style={[styles.bigLetterChip, { backgroundColor: letter.color }]}>
              <Text style={[styles.bigLetterText, { fontFamily: ff(lang, 'black') }]}>{letter.char}</Text>
            </View>
            <View style={styles.headerCopy}>
              <Text style={[styles.title, { fontFamily: ff(lang, 'black') }]}>
                {isFa ? 'حرف را دنبال کن' : 'Trace the Persian letter'}
              </Text>
              <Text style={[styles.subtitle, { fontFamily: ff(lang, 'bold') }]}>
                {letter.name} • {letter.word}
              </Text>
              <ProgressDots total={LETTERS.length} current={idx} color={letter.color} />
            </View>
            <TouchableOpacity style={[styles.soundButton, { borderColor: letter.color }]} onPress={speak} activeOpacity={0.88}>
              <Image source={neliWorldAssets.ui.voice} style={styles.soundIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <TracePad letter={letter} lang={lang} onComplete={nextLetter} />
        </View>

        <View style={styles.rightPanel}>
          {wordCards.map(index => (
            <WordCard key={`${letter.char}-${index}`} letter={letter} index={index} lang={lang} />
          ))}
          <TouchableOpacity style={[styles.nextButton, { backgroundColor: letter.color }]} onPress={nextLetter} activeOpacity={0.88}>
            <Text style={[styles.nextText, { fontFamily: ff(lang, 'black') }]}>
              {isFa ? 'حرف بعدی' : 'Next letter'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.letterRailWrap, { height: railHeight }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.letterRail}>
          {LETTERS.map((item, index) => (
            <TouchableOpacity
              key={`${item.char}-${index}`}
              style={[styles.letterTile, index === idx && { backgroundColor: item.color, transform: [{ translateY: -7 }] }]}
              onPress={() => setIdx(index)}
              activeOpacity={0.86}
            >
              <Text style={[styles.letterTileText, { color: index === idx ? '#FFFFFF' : '#24305E', fontFamily: ff(lang, 'black') }]}>
                {item.char}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#BFF3FF', overflow: 'hidden' },
  skyGlow: {
    position: 'absolute',
    left: -120,
    top: 72,
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: 'rgba(42, 201, 255, 0.34)',
  },
  lemonGlow: {
    position: 'absolute',
    right: 60,
    top: 88,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255, 242, 141, 0.75)',
  },
  pinkGlow: {
    position: 'absolute',
    right: -95,
    bottom: 70,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 143, 190, 0.5)',
  },
  stage: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 10 },
  leftPanel: { width: '21%', minWidth: 170, alignItems: 'center', justifyContent: 'center' },
  centerPanel: { flex: 1, alignItems: 'stretch', justifyContent: 'center' },
  rightPanel: { width: '26%', minWidth: 260, gap: 12, justifyContent: 'center' },
  mascotCard: {
    width: '100%',
    minHeight: 300,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: '#24648A',
    shadowOpacity: 0.11,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  speechBubble: {
    marginTop: -14,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  speechText: { color: '#24305E', fontSize: 13, textAlign: 'center' },
  headerCard: {
    minHeight: 94,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 14,
    shadowColor: '#24648A',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  bigLetterChip: {
    width: 74,
    height: 74,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bigLetterText: { color: '#FFFFFF', fontSize: 45, lineHeight: 58 },
  headerCopy: { flex: 1 },
  title: { color: '#1F2450', fontSize: 25, lineHeight: 32 },
  subtitle: { color: '#626A8F', fontSize: 15, lineHeight: 22, marginTop: 1 },
  progressDots: { flexDirection: 'row', gap: 4, marginTop: 8, alignItems: 'center' },
  progressDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D8E4F2' },
  soundButton: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundIcon: { width: 34, height: 34 },
  padShell: { alignItems: 'center' },
  pad: {
    borderRadius: 42,
    borderWidth: 6,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#1D2B68',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  letterAura: {
    position: 'absolute',
    width: '78%',
    height: '78%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  traceLetter: {
    opacity: 0.22,
    includeFontPadding: false,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.95)',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 14,
  },
  stroke: { position: 'absolute', height: 20, borderRadius: 10, opacity: 0.93 },
  traceHint: {
    position: 'absolute',
    bottom: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.82)',
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  traceHintText: { color: '#5D668A', fontSize: 12 },
  doneBadge: {
    position: 'absolute',
    right: 18,
    top: 18,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  doneMark: { color: '#FFFFFF', fontFamily: ff('fa', 'black'), fontSize: 28 },
  padActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  clearButton: {
    minWidth: 132,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EEF4FF',
  },
  clearText: { color: C.purple, fontSize: 14 },
  wordCard: {
    minHeight: 102,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#1D2B68',
    shadowOpacity: 0.13,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  wordImageBubble: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordIcon: { width: '78%', height: '78%' },
  wordCopy: { flex: 1, marginLeft: 12 },
  wordLabel: { color: '#FFFFFF', fontSize: 22, lineHeight: 30 },
  wordCaption: { color: 'rgba(255,255,255,0.86)', fontSize: 12 },
  nextButton: {
    height: 58,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  nextText: { color: '#FFFFFF', fontSize: 16 },
  letterRailWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.86)',
    justifyContent: 'center',
  },
  letterRail: { alignItems: 'center', gap: 9, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 8 },
  letterTile: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#234A77',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  letterTileText: { fontSize: 27, lineHeight: 36 },
});
