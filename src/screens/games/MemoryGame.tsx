import React, { useContext, useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  color: string;
  accent: string;
  kind: 'cat' | 'flower' | 'fish' | 'rocket' | 'house' | 'sun';
};

type Card = {
  id: string;
  pairId: string;
  item: MemoryItem;
  flipped: boolean;
  matched: boolean;
};

const POOL: MemoryItem[] = [
  { id: 'cat', fa: 'گربه', en: 'Cat', color: '#A855F7', accent: '#FDE68A', kind: 'cat' },
  { id: 'flower', fa: 'گل', en: 'Flower', color: '#EC4899', accent: '#86EFAC', kind: 'flower' },
  { id: 'fish', fa: 'ماهی', en: 'Fish', color: '#38BDF8', accent: '#FACC15', kind: 'fish' },
  { id: 'rocket', fa: 'موشک', en: 'Rocket', color: '#EF4444', accent: '#93C5FD', kind: 'rocket' },
  { id: 'house', fa: 'خانه', en: 'House', color: '#FB923C', accent: '#A78BFA', kind: 'house' },
  { id: 'sun', fa: 'خورشید', en: 'Sun', color: '#FACC15', accent: '#FDBA74', kind: 'sun' },
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

function CardArt({ item }: { item: MemoryItem }) {
  const source = {
    cat: neliWorldAssets.animals.cat,
    flower: neliWorldAssets.ui.paintbrush,
    fish: neliWorldAssets.foods.fish,
    rocket: neliWorldAssets.ui.play,
    house: neliWorldAssets.rooms.livingRoom,
    sun: neliWorldAssets.ui.star,
  }[item.kind];
  if (item.kind === 'house') {
    return (
      <ImageBackground source={source} style={styles.art} imageStyle={styles.artBg}>
        <Image source={neliWorldAssets.ui.home} style={styles.memoryAsset} resizeMode="contain" />
      </ImageBackground>
    );
  }
  return (
    <View style={[styles.art, { backgroundColor: item.accent + '55' }]}>
      <Image source={source} style={styles.memoryAsset} resizeMode="contain" />
    </View>
  );
}

export default function MemoryGame() {
  const { lang, addStars } = useContext(AppContext);
  const [cards, setCards] = useState<Card[]>(makeDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (selected.length !== 2) return;
    const [a, b] = selected;
    const first = cards[a];
    const second = cards[b];

    if (first.pairId === second.pairId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCards(prev => prev.map((card, i) => (i === a || i === b ? { ...card, matched: true } : card)));
      const matchedCount = cards.filter(card => card.matched).length + 2;
      if (matchedCount === cards.length) {
        setWon(true);
        addStars(10);
      }
      setSelected([]);
    } else {
      setTimeout(() => {
        setCards(prev => prev.map((card, i) => (i === a || i === b ? { ...card, flipped: false } : card)));
        setSelected([]);
      }, 750);
    }
    setMoves(prev => prev + 1);
  }, [selected]);

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
  };

  return (
    <View style={styles.root}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F4EEFF' }]} />
      <TopBar
        title="Memory"
        titleFa="بازی حافظه"
        showBack
        dark={false}
        rightContent={<Text style={styles.moves}>{moves}</Text>}
      />

      <View style={styles.content}>
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
          <>
            <Text style={[styles.prompt, { fontFamily: ff(lang, 'black') }]}>
              {lang === 'fa' ? 'جفت‌های شبیه را پیدا کن' : 'Find the matching pairs'}
            </Text>
            <View style={styles.grid}>
              {cards.map((card, i) => {
                const visible = card.flipped || card.matched;
                return (
                  <TouchableOpacity
                    key={card.id}
                    style={[styles.card, visible && styles.cardFront, card.matched && styles.cardMatched]}
                    onPress={() => flip(i)}
                    activeOpacity={0.86}
                  >
                    {visible ? (
                      <>
                        <CardArt item={card.item} />
                        <Text style={styles.cardLabel}>{lang === 'fa' ? card.item.fa : card.item.en}</Text>
                      </>
                    ) : (
                      <View style={styles.cardBack}>
                        <View style={styles.backDotLarge} />
                        <View style={styles.backDotSmall} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  moves: {
    minWidth: 48,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.yellow,
    color: C.textDark,
    fontFamily: ff('fa', 'black'),
    fontSize: 17,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 9,
  },
  content: { flex: 1, padding: 16, paddingTop: 8 },
  prompt: { color: C.textDark, fontSize: 24, lineHeight: 31, textAlign: 'center', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  card: {
    width: '30.5%',
    aspectRatio: 0.86,
    borderRadius: 24,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#20124D',
    shadowOpacity: 0.12,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardFront: { backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#ECE6FF' },
  cardMatched: { borderColor: '#22C55E', backgroundColor: '#F0FFF4' },
  cardBack: { width: '78%', height: '78%', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  backDotLarge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', opacity: 0.9 },
  backDotSmall: { position: 'absolute', right: 16, top: 16, width: 16, height: 16, borderRadius: 8, backgroundColor: C.yellow },
  cardLabel: { fontFamily: ff('fa', 'black'), color: C.textDark, fontSize: 12, marginTop: 3, textAlign: 'center' },
  art: { width: 68, height: 68, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  artBg: { width: '100%', height: '100%' },
  memoryAsset: { width: 56, height: 56 },
  petal: { position: 'absolute', width: 24, height: 28, borderRadius: 14 },
  centerDot: { width: 24, height: 24, borderRadius: 12 },
  stem: { position: 'absolute', bottom: 2, width: 7, height: 24, borderRadius: 4 },
  fishBody: { width: 46, height: 32, borderRadius: 20 },
  fishTail: {
    position: 'absolute',
    right: 2,
    width: 0,
    height: 0,
    borderTopWidth: 15,
    borderBottomWidth: 15,
    borderLeftWidth: 22,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  fishEye: { position: 'absolute', left: 18, top: 21, width: 5, height: 5, borderRadius: 3, backgroundColor: '#1B1238' },
  rocketBody: { width: 30, height: 48, borderRadius: 15 },
  rocketTip: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  rocketWindow: { position: 'absolute', top: 25, width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' },
  flame: { position: 'absolute', bottom: 0, width: 18, height: 20, borderRadius: 12 },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  houseBody: { width: 48, height: 34, borderRadius: 8 },
  door: { position: 'absolute', bottom: 8, width: 12, height: 18, borderRadius: 4, backgroundColor: '#FFFFFF' },
  sunHalo: { position: 'absolute', width: 58, height: 58, borderRadius: 29, opacity: 0.55 },
  sunCore: { width: 38, height: 38, borderRadius: 19 },
  catHead: { width: 48, height: 44, borderRadius: 22 },
  catEarLeft: { position: 'absolute', left: 9, top: 7, width: 18, height: 22, borderRadius: 10 },
  catEarRight: { position: 'absolute', right: 9, top: 7, width: 18, height: 22, borderRadius: 10 },
  catEyeLeft: { position: 'absolute', left: 15, top: 18, width: 6, height: 6, borderRadius: 3, backgroundColor: '#1B1238' },
  catEyeRight: { position: 'absolute', right: 15, top: 18, width: 6, height: 6, borderRadius: 3, backgroundColor: '#1B1238' },
  winBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  winBadge: { width: 118, height: 118, borderRadius: 59, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center' },
  winMark: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 62 },
  winTitle: { color: C.textDark, fontSize: 25, marginTop: 18, textAlign: 'center' },
  playAgain: { backgroundColor: C.yellow, borderRadius: 26, paddingHorizontal: 32, paddingVertical: 15, marginTop: 22 },
  playAgainText: { color: C.textDark, fontSize: 17 },
});
