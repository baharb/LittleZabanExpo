import React, { useContext, useEffect, useRef, useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppContext } from '../../store/AppContext';
import { ff } from '../../theme/fonts';
import { C } from '../../theme/colors';
import TopBar from '../../components/TopBar';
import { neliWorldAssets } from '../../assets/neliWorldAssets';

type MemoryItem = {
  id: string;
  fa: string;
  en: string;
  source: ImageSourcePropType;
  color: string;
  soft: string;
};

type Card = {
  id: string;
  pairId: string;
  item: MemoryItem;
  flipped: boolean;
  matched: boolean;
};

const POOL: MemoryItem[] = [
  { id: 'apple', fa: 'سیب', en: 'Apple', source: neliWorldAssets.foods.apple, color: '#EF4444', soft: '#FFE4E6' },
  { id: 'banana', fa: 'موز', en: 'Banana', source: neliWorldAssets.foods.banana, color: '#FBBF24', soft: '#FEF3C7' },
  { id: 'carrot', fa: 'هویج', en: 'Carrot', source: neliWorldAssets.foods.carrot, color: '#F97316', soft: '#FFEDD5' },
  { id: 'strawberry', fa: 'توت فرنگی', en: 'Strawberry', source: neliWorldAssets.foods.strawberry, color: '#F43F5E', soft: '#FFE4E6' },
  { id: 'broccoli', fa: 'کلم بروکلی', en: 'Broccoli', source: neliWorldAssets.foods.broccoli, color: '#22C55E', soft: '#DCFCE7' },
  { id: 'corn', fa: 'ذرت', en: 'Corn', source: neliWorldAssets.foods.corn, color: '#EAB308', soft: '#FEF9C3' },
];

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeDeck(): Card[] {
  return shuffle(
    POOL.flatMap(item => [0, 1].map(copy => ({
      id: `${item.id}-${copy}-${Math.random()}`,
      pairId: item.id,
      item,
      flipped: false,
      matched: false,
    }))),
  );
}

function CardBack() {
  return (
    <View style={styles.cardBack}>
      <View style={styles.backIcon}>
        <Text style={styles.backIconText}>?</Text>
      </View>
      <View style={styles.backSmile} />
    </View>
  );
}

function CardFace({ item }: { item: MemoryItem }) {
  return (
    <View style={[styles.cardFaceInner, { backgroundColor: item.soft }]}>
      <View style={[styles.faceHalo, { backgroundColor: item.color }]} />
      <Image source={item.source} style={styles.memoryAsset} resizeMode="contain" />
      <Text style={[styles.cardLabel, { color: item.color }]} numberOfLines={1}>
        {item.fa}
      </Text>
    </View>
  );
}

export default function MemoryGame() {
  const { lang, addStars } = useContext(AppContext);
  const { width, height } = useWindowDimensions();
  const [cards, setCards] = useState<Card[]>(makeDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const cardsRef = useRef(cards);
  const awardedRef = useRef(false);

  const compactHeight = Math.max(0, height - 118);
  const cardSize = Math.min(88, Math.max(66, Math.floor(Math.min((width - 360) / 4, (compactHeight - 74) / 3))));
  const matchedCount = cards.filter(card => card.matched).length / 2;

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    if (selected.length !== 2) return;
    const [a, b] = selected;
    const first = cardsRef.current[a];
    const second = cardsRef.current[b];

    if (!first || !second) {
      setSelected([]);
      return;
    }

    setMoves(prev => prev + 1);

    if (first.pairId === second.pairId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const next = cardsRef.current.map((card, i) => (i === a || i === b ? { ...card, matched: true } : card));
      const gameWon = next.every(card => card.matched);
      cardsRef.current = next;
      setCards(next);
      if (gameWon && !awardedRef.current) {
        awardedRef.current = true;
        setWon(true);
        addStars(10);
      }
      setSelected([]);
      return;
    }

    const timeout = setTimeout(() => {
      setCards(prev => prev.map((card, i) => (i === a || i === b ? { ...card, flipped: false } : card)));
      setSelected([]);
    }, 720);

    return () => clearTimeout(timeout);
  }, [addStars, selected]);

  const flip = (idx: number) => {
    if (selected.length === 2 || cards[idx].flipped || cards[idx].matched) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCards(prev => prev.map((card, i) => (i === idx ? { ...card, flipped: true } : card)));
    setSelected(prev => [...prev, idx]);
  };

  const reset = () => {
    setCards(makeDeck());
    setSelected([]);
    setMoves(0);
    setWon(false);
    awardedRef.current = false;
  };

  return (
    <View style={styles.root}>
      <View style={styles.bgMint} />
      <View style={styles.bgSun} />
      <View style={styles.bgBerry} />
      <View style={styles.bgDotA} />
      <View style={styles.bgDotB} />
      <TopBar
        title="Memory Match"
        titleFa="بازی حافظه"
        showBack
        dark={false}
        rightContent={<Text style={styles.moves}>{moves}</Text>}
      />

      <View style={styles.content}>
        <View style={styles.sidePanel}>
          <View style={styles.progressBadge}>
            <Text style={[styles.progressNumber, { fontFamily: ff(lang, 'black') }]}>{matchedCount}/6</Text>
            <Text style={[styles.progressLabel, { fontFamily: ff(lang, 'bold') }]}>
              {lang === 'fa' ? 'جفت پیدا شد' : 'pairs found'}
            </Text>
          </View>
          <Text style={[styles.prompt, { fontFamily: ff(lang, 'black') }]}>
            {lang === 'fa' ? 'میوه‌ها و سبزی‌های شبیه را پیدا کن' : 'Find the fruit and veggie pairs'}
          </Text>
          <View style={styles.sampleStrip}>
            <Image source={neliWorldAssets.foods.strawberry} style={styles.sampleFood} resizeMode="contain" />
            <Image source={neliWorldAssets.foods.broccoli} style={styles.sampleFood} resizeMode="contain" />
            <Image source={neliWorldAssets.foods.corn} style={styles.sampleFood} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.boardWrap}>
          {won ? (
            <View style={styles.winBox}>
              <View style={styles.winBadge}>
                <Text style={styles.winMark}>✓</Text>
              </View>
              <Text style={[styles.winTitle, { fontFamily: ff(lang, 'black') }]}>
                {lang === 'fa' ? 'همه را پیدا کردی!' : 'You found them all!'}
              </Text>
              <TouchableOpacity style={styles.playAgain} onPress={reset} activeOpacity={0.86}>
                <Text style={[styles.playAgainText, { fontFamily: ff(lang, 'black') }]}>
                  {lang === 'fa' ? 'دوباره بازی کن' : 'Play again'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.grid, { width: cardSize * 4 + 30 }]}>
              {cards.map((card, i) => {
                const visible = card.flipped || card.matched;
                return (
                  <TouchableOpacity
                    key={card.id}
                    style={[
                      styles.card,
                      { width: cardSize, height: cardSize },
                      visible && styles.cardFront,
                      card.matched && styles.cardMatched,
                    ]}
                    onPress={() => flip(i)}
                    activeOpacity={0.9}
                  >
                    {visible ? <CardFace item={card.item} /> : <CardBack />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFDF4', overflow: 'hidden' },
  bgMint: {
    position: 'absolute',
    left: -90,
    top: 86,
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: '#D9FBEA',
  },
  bgSun: {
    position: 'absolute',
    right: 42,
    top: 76,
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: '#FFF0A8',
  },
  bgBerry: {
    position: 'absolute',
    right: -80,
    bottom: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FFE0EA',
  },
  bgDotA: {
    position: 'absolute',
    left: '31%',
    top: 106,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7DD3FC',
  },
  bgDotB: {
    position: 'absolute',
    left: '82%',
    bottom: 64,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#86EFAC',
  },
  moves: {
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
    borderColor: '#FFE08A',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 18,
    gap: 18,
  },
  sidePanel: {
    width: 230,
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 14,
  },
  progressBadge: {
    alignSelf: 'flex-start',
    minWidth: 122,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8F7DB',
    shadowColor: '#2D5B34',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  progressNumber: { color: '#169B5B', fontSize: 24, lineHeight: 29, textAlign: 'center' },
  progressLabel: { color: C.textMid, fontSize: 12, lineHeight: 16, textAlign: 'center' },
  prompt: { color: C.textDark, fontSize: 25, lineHeight: 34 },
  sampleStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 9,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#F7ECD3',
  },
  sampleFood: { width: 40, height: 40 },
  boardWrap: {
    minWidth: 420,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C4A03',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardMatched: {
    borderColor: '#8DE8A9',
    shadowColor: '#15803D',
    shadowOpacity: 0.15,
  },
  cardBack: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#FFE59D',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  backIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A16207',
    shadowOpacity: 0.11,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  backIconText: {
    color: '#F59E0B',
    fontFamily: ff('fa', 'black'),
    fontSize: 25,
    lineHeight: 31,
    marginTop: -1,
  },
  backSmile: {
    position: 'absolute',
    bottom: 15,
    width: 22,
    height: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(161,98,7,0.42)',
    borderRadius: 12,
  },
  cardFaceInner: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  faceHalo: {
    position: 'absolute',
    width: '78%',
    height: '78%',
    borderRadius: 500,
    opacity: 0.12,
  },
  memoryAsset: { width: '66%', height: '58%' },
  cardLabel: {
    fontFamily: ff('fa', 'black'),
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 1,
    paddingHorizontal: 4,
  },
  winBox: {
    width: 330,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    borderWidth: 2,
    borderColor: '#DBFBE7',
    shadowColor: '#065F46',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  winBadge: { width: 92, height: 92, borderRadius: 46, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center' },
  winMark: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 50 },
  winTitle: { color: C.textDark, fontSize: 25, marginTop: 16, textAlign: 'center' },
  playAgain: { backgroundColor: C.yellow, borderRadius: 24, paddingHorizontal: 28, paddingVertical: 13, marginTop: 20 },
  playAgainText: { color: C.textDark, fontSize: 16 },
});
