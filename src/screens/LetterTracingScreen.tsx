import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Line as SvgLine, Text as SvgText } from 'react-native-svg';
import { AppContext, Lang } from '../store/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import TopBar from '../components/TopBar';
import CharacterAvatar from '../components/CharacterAvatar';
import { C } from '../theme/colors';
import { ff } from '../theme/fonts';
import { neliWorldAssets } from '../assets/neliWorldAssets';

type Letter = { char: string; name: string; word: string; en: string; color: string };
type Point = { x: number; y: number };
type ExampleItem = { label: string; icon: any; color: string };

const LETTERS: Letter[] = [
  { char: 'ا', name: 'الف', word: 'آب', en: 'Water', color: '#38BDF8' },
  { char: 'ب', name: 'بِه', word: 'بابا', en: 'Dad', color: '#6C4EFF' },
  { char: 'پ', name: 'پِه', word: 'پلو', en: 'Rice', color: '#22C55E' },
  { char: 'ت', name: 'تِه', word: 'توپ', en: 'Ball', color: '#FACC15' },
  { char: 'ث', name: 'ثَنا', word: 'ثمر', en: 'Fruit', color: '#FB923C' },
  { char: 'ج', name: 'جیم', word: 'جوراب', en: 'Socks', color: '#EC4899' },
  { char: 'چ', name: 'چِه', word: 'چتر', en: 'Umbrella', color: '#A855F7' },
  { char: 'ح', name: 'حِه', word: 'حلوا', en: 'Halva', color: '#14B8A6' },
  { char: 'خ', name: 'خِه', word: 'خرس', en: 'Bear', color: '#F97316' },
  { char: 'د', name: 'دال', word: 'درخت', en: 'Tree', color: '#38BDF8' },
  { char: 'ذ', name: 'ذال', word: 'ذرت', en: 'Corn', color: '#6C4EFF' },
  { char: 'ر', name: 'راء', word: 'رنگ', en: 'Color', color: '#22C55E' },
  { char: 'ز', name: 'زاء', word: 'زنبور', en: 'Bee', color: '#FACC15' },
  { char: 'ژ', name: 'ژه', word: 'ژاله', en: 'Dew', color: '#FB923C' },
  { char: 'س', name: 'سین', word: 'سیب', en: 'Apple', color: '#EF4444' },
  { char: 'ش', name: 'شین', word: 'شیر', en: 'Milk', color: '#7C3AED' },
  { char: 'ص', name: 'صاد', word: 'صابون', en: 'Soap', color: '#06B6D4' },
  { char: 'ض', name: 'ضاد', word: 'ضربان', en: 'Beat', color: '#EC4899' },
  { char: 'ط', name: 'طاء', word: 'طبل', en: 'Drum', color: '#84CC16' },
  { char: 'ظ', name: 'ظاء', word: 'ظرف', en: 'Dish', color: '#8B5CF6' },
  { char: 'ع', name: 'عین', word: 'عروسک', en: 'Doll', color: '#F97316' },
  { char: 'غ', name: 'غین', word: 'غذا', en: 'Food', color: '#06B6D4' },
  { char: 'ف', name: 'فاء', word: 'فیل', en: 'Elephant', color: '#22C55E' },
  { char: 'ق', name: 'قاف', word: 'قورباغه', en: 'Frog', color: '#A855F7' },
  { char: 'ک', name: 'کاف', word: 'کفش', en: 'Shoe', color: '#FACC15' },
  { char: 'گ', name: 'گاف', word: 'گل', en: 'Flower', color: '#EC4899' },
  { char: 'ل', name: 'لام', word: 'لیمو', en: 'Lemon', color: '#14B8A6' },
  { char: 'م', name: 'میم', word: 'ماه', en: 'Moon', color: '#3B82F6' },
  { char: 'ن', name: 'نون', word: 'نان', en: 'Bread', color: '#F59E0B' },
  { char: 'و', name: 'واو', word: 'وان', en: 'Tub', color: '#EF4444' },
  { char: 'ه', name: 'ها', word: 'هوا', en: 'Air', color: '#8B5CF6' },
  { char: 'ی', name: 'یا', word: 'یخ', en: 'Ice', color: '#0EA5E9' },
];

const TRACE_EXAMPLE_LABELS: Record<string, string[]> = {
  'ا': ['آب', 'آهو', 'آبنبات'],
  'ب': ['بابا', 'بادکنک', 'بستنی'],
  'پ': ['پلو', 'پروانه', 'پرتقال'],
  'ت': ['توپ', 'تخم‌مرغ', 'تلفن'],
  'ث': ['ثمر', 'ثانیه', 'ثروت'],
  'ج': ['جوراب', 'جوجه', 'جنگل'],
  'چ': ['چتر', 'چای', 'چشم'],
  'ح': ['حلوا', 'حیاط', 'حوض'],
  'خ': ['خرس', 'خیار', 'خرگوش'],
  'د': ['درخت', 'دامن', 'دوچرخه'],
  'ذ': ['ذرت', 'ذهن', 'ذره'],
  'ر': ['رنگ', 'روباه', 'رودخانه'],
  'ز': ['زنبور', 'زرافه', 'زیتون'],
  'ژ': ['ژاله', 'ژاکت', 'ژیله'],
  'س': ['سیب', 'سبد', 'ستاره'],
  'ش': ['شیر', 'شتر', 'شب'],
  'ص': ['صابون', 'صدف', 'صندلی'],
  'ض': ['ضربان', 'ضیافت', 'ضامن'],
  'ط': ['طبل', 'طاووس', 'طوفان'],
  'ظ': ['ظرف', 'ظریف', 'ظاهر'],
  'ع': ['عروسک', 'عینک', 'عقاب'],
  'غ': ['غذا', 'غنچه', 'غاز'],
  'ف': ['فیل', 'فنجان', 'فرشته'],
  'ق': ['قورباغه', 'قفل', 'قلم'],
  'ک': ['کتاب', 'کفش', 'کدو'],
  'گ': ['گل', 'گربه', 'گاو'],
  'ل': ['لیمو', 'لیوان', 'لانه'],
  'م': ['ماه', 'ماهی', 'موش'],
  'ن': ['نان', 'نمک', 'نارنگی'],
  'و': ['وان', 'وال', 'ویترین'],
  'ه': ['هوا', 'هلو', 'هدیه'],
  'ی': ['یخ', 'یوز', 'یادگار'],
};

const TRACE_EXAMPLE_ICONS = [
  neliWorldAssets.foods.apple,
  neliWorldAssets.animals.bear,
  neliWorldAssets.animals.cat,
];

function getTraceExamples(letter: string): ExampleItem[] {
  const labels = TRACE_EXAMPLE_LABELS[letter] ?? ['آب', 'آهو', 'آبنبات'];
  const colors = ['#FF5AAE', '#18C9D4', '#8A5CFF'];
  return labels.slice(0, 3).map((label, index) => ({
    label,
    icon: TRACE_EXAMPLE_ICONS[index % TRACE_EXAMPLE_ICONS.length],
    color: colors[index % colors.length],
  }));
}

function TracePad({ letter, lang, onDone }: { letter: Letter; lang: Lang; onDone: () => void }) {
  const { width, height } = useWindowDimensions();
  const size = Math.max(260, Math.min(360, Math.min(width * 0.36, height * 0.68)));
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [done, setDone] = useState(false);
  const bandsRef = useRef([false, false, false]);
  const current = useRef<Point[]>([]);
  const tracedDistance = useRef(0);
  const origin = useRef({ x: 0, y: 0 });
  const padRef = useRef<View | null>(null);

  const syncOrigin = () => {
    requestAnimationFrame(() => {
      padRef.current?.measureInWindow((x, y) => {
        origin.current = { x, y };
      });
    });
  };

  const clearTrace = () => {
    setStrokes([]);
    setDone(false);
    bandsRef.current = [false, false, false];
    current.current = [];
    tracedDistance.current = 0;
  };

  useEffect(() => {
    clearTrace();
    syncOrigin();
  }, [letter.char]);

  const markBands = (pt: Point) => {
    const next = [...bandsRef.current];
    const bandIndex = pt.y < size * 0.33 ? 0 : pt.y < size * 0.66 ? 1 : 2;
    next[bandIndex] = true;
    bandsRef.current = next;
  };

  const canFinish = () => bandsRef.current.every(Boolean) && tracedDistance.current > size * 1.05;

  const finish = () => {
    if (done) return;
    setDone(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onDone();
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !done,
      onMoveShouldSetPanResponder: () => !done,
      onPanResponderGrant: event => {
        const pt = {
          x: event.nativeEvent.pageX - origin.current.x,
          y: event.nativeEvent.pageY - origin.current.y,
        };
        current.current = [pt];
        setStrokes(prev => [...prev, [pt]]);
        markBands(pt);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: event => {
        const pt = {
          x: event.nativeEvent.pageX - origin.current.x,
          y: event.nativeEvent.pageY - origin.current.y,
        };
        const prev = current.current[current.current.length - 1];
        if (prev) {
          const dx = pt.x - prev.x;
          const dy = pt.y - prev.y;
          tracedDistance.current += Math.sqrt(dx * dx + dy * dy);
        }
        current.current.push(pt);
        markBands(pt);
        setStrokes(prev => {
          const next = [...prev];
          next[next.length - 1] = [...current.current];
          return next;
        });
        if (canFinish()) finish();
      },
      onPanResponderRelease: () => {
        current.current = [];
      },
      onPanResponderTerminate: () => {
        current.current = [];
      },
    }),
  ).current;

  const renderLine = (pts: Point[], si: number) =>
    pts.slice(1).map((pt, i) => {
      const prev = pts[i];
      const dx = pt.x - prev.x;
      const dy = pt.y - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 0.4) return null;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      return (
        <View
          key={`${si}-${i}`}
          style={{
            position: 'absolute',
            width: len + 14,
            height: 18,
            borderRadius: 9,
            backgroundColor: done ? '#22C55E' : letter.color,
            left: (pt.x + prev.x) / 2 - (len + 14) / 2,
            top: (pt.y + prev.y) / 2 - 9,
            transform: [{ rotate: `${angle}deg` }],
            opacity: 0.92,
          }}
        />
      );
    });

  return (
    <View style={styles.padWrap}>
      <View
        ref={padRef}
        style={[styles.pad, { width: size, height: size }]}
        onLayout={syncOrigin}
        {...pan.panHandlers}
      >
        <View style={styles.ghostWrap} pointerEvents="none">
          <Svg width={size} height={size}>
            <SvgLine
              x1={size / 2}
              y1={size * 0.16}
              x2={size / 2}
              y2={size * 0.84}
              stroke="rgba(149, 128, 214, 0.62)"
              strokeWidth={Math.max(6, size * 0.022)}
              strokeDasharray={`${Math.max(16, size * 0.038)} ${Math.max(10, size * 0.024)}`}
              strokeLinecap="round"
            />
            <SvgText
              x={size / 2}
              y={size / 2}
              dy="0.35em"
              textAnchor="middle"
              fill="none"
              stroke="rgba(149, 128, 214, 0.68)"
              strokeWidth={Math.max(8, size * 0.04)}
              strokeDasharray={`${Math.max(18, size * 0.042)} ${Math.max(10, size * 0.026)}`}
              strokeLinecap="round"
              strokeLinejoin="round"
              fontSize={size * 1.06}
              fontFamily={ff(lang, 'black')}
            >
              {letter.char}
            </SvgText>
          </Svg>
        </View>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {strokes.map((stroke, i) => renderLine(stroke, i))}
        </View>
        {done ? <View style={styles.doneBadge}><Text style={styles.doneMark}>✓</Text></View> : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.clearBtn} onPress={clearTrace}>
          <Text style={styles.clearText}>{lang === 'fa' || lang === 'ar' ? 'پاک کن' : 'Clear'}</Text>
        </TouchableOpacity>
        {done ? (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: letter.color }]}
            onPress={() => {
              clearTrace();
              onDone();
            }}
          >
            <Text style={styles.nextText}>{lang === 'fa' || lang === 'ar' ? 'بعدی' : 'Next'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

function ExampleCard({
  label,
  color,
  icon,
  cardWidth,
  cardHeight,
  lang,
}: {
  label: string;
  color: string;
  icon: any;
  cardWidth: number;
  cardHeight: number;
  lang: Lang;
}) {
  return (
    <View style={[styles.exampleCard, { borderColor: color, width: cardWidth, height: cardHeight }]}>
      <View style={styles.exampleTop}>
        <Image source={icon} style={styles.exampleImage} resizeMode="contain" />
      </View>
      <View style={styles.exampleLabelWrap}>
        <Text style={[styles.exampleLabel, { fontFamily: ff(lang, 'black') }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

export default function LetterTracingScreen() {
  const { lang } = useContext(AppContext);
  const { speakFarsiOnly, speakInLang, stop } = useSpeech();
  const [idx, setIdx] = useState(0);
  const letter = LETTERS[idx % LETTERS.length];
  const isFa = lang === 'fa' || lang === 'ar';
  const { width, height } = useWindowDimensions();
  const giraffeSize = Math.max(200, Math.min(320, height * 0.44));
  const leftColWidth = Math.max(180, Math.min(260, width * 0.22));
  const rightColWidth = Math.max(250, Math.min(400, width * 0.34));
  const exampleItems = useMemo(() => getTraceExamples(letter.char), [letter.char]);
  const exampleGap = 8;
  const exampleCardWidth = Math.max(74, (rightColWidth - exampleGap * 2) / 3);
  const exampleCardHeight = Math.max(108, Math.min(150, height * 0.2));

  const speak = () => {
    stop();
    speakFarsiOnly(`${letter.name}. ${letter.word}`, () => {
      if (!isFa) setTimeout(() => speakInLang(`${letter.name}. ${letter.en}`, lang), 220);
    });
  };

  return (
    <View style={styles.root}>
      <TopBar title="Trace the letters" titleFa="یادگیری حروف" showBack dark compactTitle />

      <View style={styles.page}>
        <View style={[styles.mainRow, { gap: Math.max(8, width * 0.01), paddingHorizontal: Math.max(10, width * 0.012) }]}>
          <View style={[styles.giraffeCol, { width: leftColWidth }]}>
            <CharacterAvatar characterId="dara" size={giraffeSize} floating={false} />
          </View>

          <View style={styles.centerCol}>
            <View style={styles.centerHeader}>
              <View style={styles.letterPill}>
                <Text style={styles.letterPillText}>{letter.char}</Text>
              </View>
              <TouchableOpacity style={styles.soundBtn} onPress={speak} activeOpacity={0.9}>
                <Image source={neliWorldAssets.ui.voice} style={styles.soundIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>

            <View style={styles.centerTraceCard}>
              <TracePad
                key={letter.char}
                letter={letter}
                lang={lang}
                onDone={() => setIdx(prev => Math.min(prev + 1, LETTERS.length - 1))}
              />
            </View>
          </View>

          <View style={[styles.examplesCol, { width: rightColWidth }]}>
            <View style={[styles.examplesRow, { gap: exampleGap }]}>
              {exampleItems.map(example => (
                <ExampleCard
                  key={example.label}
                  label={example.label}
                  color={example.color}
                  icon={example.icon}
                  cardWidth={exampleCardWidth}
                  cardHeight={exampleCardHeight}
                  lang={lang}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.letterRowWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.letterRow}>
            {LETTERS.map((l, i) => (
              <TouchableOpacity
                key={`${l.char}-${i}`}
                style={[styles.tile, i === idx && { backgroundColor: l.color }]}
                onPress={() => setIdx(i)}
                activeOpacity={0.86}
              >
                <Text style={[styles.tileText, { color: i === idx ? '#FFFFFF' : C.textDark, fontFamily: ff(lang, 'black') }]}>
                  {l.char}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#16C8D4' },
  page: { flex: 1, paddingTop: 4, paddingBottom: 0 },
  mainRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  giraffeCol: { alignItems: 'center', justifyContent: 'flex-end' },
  centerCol: { flex: 1, alignItems: 'stretch', justifyContent: 'center' },
  centerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  letterPill: {
    minWidth: 108,
    height: 68,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    shadowColor: '#1D1850',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  letterPillText: {
    color: '#19A9C0',
    fontSize: 42,
    lineHeight: 46,
    fontFamily: ff('fa', 'black'),
  },
  centerTraceCard: { alignItems: 'center' },
  examplesCol: { alignItems: 'flex-end', justifyContent: 'center' },
  examplesRow: { flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-end' },
  padWrap: { alignItems: 'center' },
  pad: {
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(190, 221, 242, 0.95)',
    shadowColor: '#21104C',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  ghostWrap: { ...StyleSheet.absoluteFillObject },
  doneBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneMark: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 26 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 14 },
  clearBtn: {
    height: 50,
    minWidth: 120,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: { fontFamily: ff('fa', 'black'), color: C.purple, fontSize: 14 },
  nextBtn: { height: 50, minWidth: 120, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  nextText: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 14 },
  letterRowWrap: { marginTop: 2, paddingBottom: 0 },
  letterRow: { gap: 8, paddingVertical: 8, paddingHorizontal: 2 },
  tile: { width: 54, height: 54, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  tileText: { fontSize: 24, lineHeight: 34 },
  soundBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D1850',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  soundIcon: { width: 30, height: 30 },
  exampleCard: {
    borderRadius: 22,
    borderWidth: 4,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#1D1850',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  exampleTop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    backgroundColor: '#FFFFFF',
  },
  exampleImage: {
    width: '68%',
    height: '68%',
    marginTop: 2,
  },
  exampleLabelWrap: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(25, 169, 192, 0.12)',
  },
  exampleLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#2F335B',
  },
});
