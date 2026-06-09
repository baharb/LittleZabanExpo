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
  const size = Math.max(330, Math.min(510, Math.min(width * 0.44, height * 0.76)));
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [complete, setComplete] = useState(false);
  const current = useRef<Point[]>([]);
  const padRef = useRef<View | null>(null);
  const origin = useRef({ x: 0, y: 0 });
  const visitedCells = useRef(new Set<string>());
  const visitedRows = useRef(new Set<number>());
  const visitedCols = useRef(new Set<number>());
  const tracedDistance = useRef(0);
  const isCheckingComplete = useRef(false);
  const traceMargin = size * 0.12;
  const innerSize = size - traceMargin * 2;
  const gridCols = 5;
  const gridRows = 5;

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
    visitedCells.current = new Set();
    visitedRows.current = new Set();
    visitedCols.current = new Set();
    tracedDistance.current = 0;
    isCheckingComplete.current = false;
    syncOrigin();
  };

  useEffect(() => {
    reset();
  }, [letter.char]);

  const markCoverage = (pt: Point) => {
    if (pt.x < traceMargin || pt.x > size - traceMargin || pt.y < traceMargin || pt.y > size - traceMargin) return;
    const localX = (pt.x - traceMargin) / innerSize;
    const localY = (pt.y - traceMargin) / innerSize;
    const col = Math.min(gridCols - 1, Math.max(0, Math.floor(localX * gridCols)));
    const row = Math.min(gridRows - 1, Math.max(0, Math.floor(localY * gridRows)));
    visitedCells.current.add(`${row}:${col}`);
    visitedRows.current.add(row);
    visitedCols.current.add(col);
  };

  const maybeComplete = () => {
    if (complete || isCheckingComplete.current) return;
    const enoughDrawing = tracedDistance.current > size * 1.45;
    const enoughCoverage =
      visitedCells.current.size >= 9 &&
      visitedRows.current.size >= 3 &&
      visitedCols.current.size >= 3;
    if (enoughDrawing && enoughCoverage) {
      isCheckingComplete.current = true;
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
        markCoverage(pt);
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
        markCoverage(pt);
        setStrokes(prev => {
          const next = [...prev];
          next[next.length - 1] = [...current.current];
          return next;
        });
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
              fontSize: size * 0.94,
              lineHeight: size * 0.98,
              transform: [{ translateY: -size * 0.015 }],
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
            {lang === 'fa' || lang === 'ar' ? 'با انگشتت خودِ حرف را دنبال کن' : 'Trace the big letter with your finger'}
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
  const mascotSize = Math.max(210, Math.min(320, height * 0.43));
  const railHeight = Math.max(78, Math.min(96, height * 0.14));

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

      <View style={[styles.stage, { paddingHorizontal: Math.max(16, width * 0.025), paddingTop: 14, paddingBottom: railHeight + 8 }]}>
        <View style={styles.leftPanel}>
          <View style={styles.mascotCard}>
            <CharacterAvatar characterId="dara" size={mascotSize} floating={false} />
          </View>
        </View>

        <View style={styles.centerPanel}>
          <View style={styles.headerRow}>
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
          </View>

          <TracePad letter={letter} lang={lang} onComplete={nextLetter} />
        </View>

        <View style={styles.rightPanel}>
          <TouchableOpacity style={[styles.soundButton, styles.soundDock, { borderColor: letter.color }]} onPress={speak} activeOpacity={0.88}>
            <Image source={neliWorldAssets.ui.voice} style={styles.soundIcon} resizeMode="contain" />
          </TouchableOpacity>
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
  root: { flex: 1, backgroundColor: '#A7ECFF', overflow: 'hidden' },
  skyGlow: {
    position: 'absolute',
    left: -130,
    top: 54,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(42, 201, 255, 0.42)',
  },
  lemonGlow: {
    position: 'absolute',
    right: 38,
    top: 70,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(255, 244, 157, 0.84)',
  },
  pinkGlow: {
    position: 'absolute',
    right: -110,
    bottom: 54,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 143, 190, 0.56)',
  },
  stage: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 18, paddingTop: 18 },
  leftPanel: { width: '22%', minWidth: 190, alignItems: 'center', justifyContent: 'center' },
  centerPanel: { flex: 1, alignItems: 'stretch', justifyContent: 'center' },
  rightPanel: { width: '27%', minWidth: 280, gap: 14, justifyContent: 'center' },
  mascotCard: {
    width: '100%',
    minHeight: 334,
    borderRadius: 38,
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  bigLetterChip: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  bigLetterText: { color: '#24305E', fontSize: 54, lineHeight: 64, textAlign: 'center', textAlignVertical: 'center' },
  headerCopy: { flex: 1 },
  title: { color: '#1F2450', fontSize: 27, lineHeight: 34 },
  subtitle: { color: '#626A8F', fontSize: 16, lineHeight: 22, marginTop: 2 },
  progressDots: { flexDirection: 'row', gap: 6, marginTop: 10, alignItems: 'center' },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D8E4F2' },
  soundButton: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundDock: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  soundIcon: { width: 36, height: 36 },
  padShell: { alignItems: 'center' },
  pad: {
    borderRadius: 48,
    borderWidth: 7,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#1D2B68',
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  letterAura: {
    position: 'absolute',
    width: '82%',
    height: '82%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  traceLetter: {
    opacity: 0.18,
    includeFontPadding: false,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.95)',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 14,
  },
  stroke: { position: 'absolute', height: 22, borderRadius: 11, opacity: 0.93 },
  traceHint: {
    position: 'absolute',
    bottom: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  traceHintText: { color: '#5D668A', fontSize: 13 },
  doneBadge: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  doneMark: { color: '#FFFFFF', fontFamily: ff('fa', 'black'), fontSize: 30 },
  padActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  clearButton: {
    minWidth: 146,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EEF4FF',
  },
  clearText: { color: C.purple, fontSize: 15 },
  wordCard: {
    minHeight: 112,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#1D2B68',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  wordImageBubble: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordIcon: { width: '76%', height: '76%' },
  wordCopy: { flex: 1, marginLeft: 14 },
  wordLabel: { color: '#FFFFFF', fontSize: 23, lineHeight: 31 },
  wordCaption: { color: 'rgba(255,255,255,0.86)', fontSize: 13 },
  nextButton: {
    height: 62,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  nextText: { color: '#FFFFFF', fontSize: 17 },
  letterRailWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
  },
  letterRail: { alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingTop: 11, paddingBottom: 10 },
  letterTile: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#234A77',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  letterTileText: { fontSize: 28, lineHeight: 38 },
});
