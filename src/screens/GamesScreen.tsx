import React, { useContext } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import TopBar from '../components/TopBar';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { C } from '../theme/colors';
import { dir, ff } from '../theme/fonts';
import { useResponsive } from '../theme/responsive';
import CharacterAvatar from '../components/CharacterAvatar';
import { characterAssets } from '../assets/characterAssets';
import { neliWorldAssets, roomBackgroundPickers } from '../assets/neliWorldAssets';
import { BOX_CHARACTER_WIDTH } from '../theme/characterSizes';

type Kind = 'talk' | 'dress' | 'tooth' | 'animal' | 'cook' | 'paint' | 'routine' | 'room' | 'memory' | 'quiz' | 'color' | 'count' | 'culture' | 'tracing';
type Tile = {
  id: string;
  route: any;
  en: string;
  fa: string;
  descEn: string;
  descFa: string;
  kind: Kind;
  color: string;
  accent: string;
  group: 'play' | 'learn' | 'culture';
};

const GAMES: Tile[] = [
  { id: 'talk', route: { name: 'ConversationGame' }, en: 'Talk with Neli', fa: 'گفت‌وگو با نلی', descEn: 'Listen and answer', descFa: 'بشنو و جواب بده', kind: 'talk', color: '#6C4EFF', accent: '#FACC15', group: 'play' },
  { id: 'dress', route: { name: 'DressUp' }, en: 'Dress Up', fa: 'لباس بپوش', descEn: 'Drag clothes onto Neli', descFa: 'لباس را روی نلی بکش', kind: 'dress', color: '#EC4899', accent: '#FDE68A', group: 'play' },
  { id: 'teeth', route: { name: 'ToothBrush' }, en: 'Brush Teeth', fa: 'مسواک زدن', descEn: 'Move the brush', descFa: 'مسواک را حرکت بده', kind: 'tooth', color: '#38BDF8', accent: '#6C4EFF', group: 'play' },
  { id: 'animals', route: { name: 'FeedAnimals' }, en: 'Feed Animals', fa: 'غذا بده', descEn: 'Drag food to animals', descFa: 'غذا را به حیوان بده', kind: 'animal', color: '#22C55E', accent: '#FACC15', group: 'play' },
  { id: 'cook', route: { name: 'Cooking' }, en: 'Cooking', fa: 'آشپزی', descEn: 'Make fun recipes', descFa: 'غذا درست کن', kind: 'cook', color: '#FB923C', accent: '#FACC15', group: 'play' },
  { id: 'coloring', route: { name: 'Coloring' }, en: 'Coloring Book', fa: 'نقاشی', descEn: 'Paint picture pages', descFa: 'صفحه‌ها را رنگ کن', kind: 'paint', color: '#A855F7', accent: '#FF80C0', group: 'play' },
  { id: 'routine', route: { name: 'DailyRoutine' }, en: 'Daily Routine', fa: 'کارهای روزانه', descEn: 'Wash, dress, sleep', descFa: 'بشور، بپوش، بخواب', kind: 'routine', color: '#14B8A6', accent: '#FDE68A', group: 'play' },
  { id: 'room', route: { name: 'BuildScene' }, en: 'Build a Room', fa: 'اتاق بساز', descEn: 'Place objects', descFa: 'وسایل را بگذار', kind: 'room', color: '#38BDF8', accent: '#FB923C', group: 'play' },
  { id: 'tracing', route: { name: 'LetterTracing' }, en: 'Letter Tracing', fa: 'تمرین حروف', descEn: 'Trace the Persian alphabet', descFa: 'حروف فارسی را دنبال کن', kind: 'tracing', color: '#7EF0C1', accent: '#22C55E', group: 'learn' },
  { id: 'memory', route: { name: 'Game', gameId: 'memory' }, en: 'Memory Match', fa: 'بازی حافظه', descEn: 'Find pairs', descFa: 'جفت‌ها را پیدا کن', kind: 'memory', color: '#6C4EFF', accent: '#FACC15', group: 'learn' },
  { id: 'quiz', route: { name: 'Game', gameId: 'quiz' }, en: 'Word Quiz', fa: 'مسابقه کلمه', descEn: 'See and choose', descFa: 'ببین و انتخاب کن', kind: 'quiz', color: '#38BDF8', accent: '#A855F7', group: 'learn' },
  { id: 'colors', route: { name: 'Game', gameId: 'colormatch' }, en: 'Color Play', fa: 'بازی رنگ', descEn: 'Match playful colors', descFa: 'رنگ درست را پیدا کن', kind: 'color', color: '#EC4899', accent: '#FACC15', group: 'learn' },
  { id: 'counting', route: { name: 'Game', gameId: 'counting' }, en: 'Counting', fa: 'شمارش', descEn: 'Count with pictures', descFa: 'با تصویر بشمار', kind: 'count', color: '#FACC15', accent: '#6C4EFF', group: 'learn' },
  { id: 'culture', route: { name: 'Game', gameId: 'culturequiz' }, en: 'Culture Quiz', fa: 'فرهنگ ایران', descEn: 'See and answer', descFa: 'ببین و جواب بده', kind: 'culture', color: '#FB923C', accent: '#22C55E', group: 'culture' },
];

const GROUPS = [
  { id: 'play', en: 'Touch Games', fa: 'بازی‌های لمسی' },
  { id: 'learn', en: 'Learning Games', fa: 'بازی‌های یادگیری' },
  { id: 'culture', en: 'Culture', fa: 'فرهنگ' },
] as const;

function TileArt({ kind, color, accent, characterId, width, height }: { kind: Kind; color: string; accent: string; characterId: string; width: number; height: number }) {
  if (kind === 'talk') {
    return (
      <ImageBackground source={roomBackgroundPickers.talkPlay(width, height)} style={styles.sceneArt} imageStyle={styles.sceneArtImage}>
        <View style={styles.sceneWash} />
        <CharacterAvatar characterId={characterId} size={BOX_CHARACTER_WIDTH} talking={false} floating={false} style={styles.tileTalkCharacter} />
      </ImageBackground>
    );
  }
  if (kind === 'dress') {
    return (
      <ImageBackground source={roomBackgroundPickers.bedroom(width, height)} style={styles.sceneArt} imageStyle={styles.sceneArtImage}>
        <CharacterAvatar characterId={characterId} size={BOX_CHARACTER_WIDTH} floating={false} style={styles.tileDressCharacter} />
      </ImageBackground>
    );
  }
  if (kind === 'tooth') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.brushTeethBathroom} style={styles.sceneArt} imageStyle={styles.sceneArtImage}>
        <Image source={characterAssets.lila.poses.bigSmile} style={styles.tileGiraffe} resizeMode="contain" />
      </ImageBackground>
    );
  }
  if (kind === 'cook') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.cookingTable} style={styles.sceneArt} imageStyle={styles.sceneArtImage}>
        <Image source={neliWorldAssets.kitchen.pan} style={styles.tilePan} resizeMode="contain" />
        <Image source={neliWorldAssets.foods.pasta} style={styles.tileFoodA} resizeMode="contain" />
        <Image source={neliWorldAssets.foods.tomato} style={styles.tileFoodB} resizeMode="contain" />
      </ImageBackground>
    );
  }
  if (kind === 'animal') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.feedAnimalsJungle} style={styles.sceneArt} imageStyle={styles.sceneArtImage}>
        <Image source={neliWorldAssets.animals.rabbit} style={styles.tileAnimal} resizeMode="contain" />
        <Image source={neliWorldAssets.foods.carrot} style={styles.tileCarrot} resizeMode="contain" />
      </ImageBackground>
    );
  }
  if (kind === 'paint' || kind === 'color') return <View style={styles.art}>{[color, accent, '#22C55E', '#38BDF8'].map((c, i) => <View key={c} style={[styles.paintDot, { backgroundColor: c, left: 42 + (i % 2) * 38, top: 24 + Math.floor(i / 2) * 38 }]} />)}</View>;
  if (kind === 'room') return <View style={styles.art}><View style={[styles.roof, { borderBottomColor: color }]} /><View style={styles.house} /><View style={[styles.door, { backgroundColor: accent }]} /></View>;
  if (kind === 'tracing') return <View style={styles.art}><Image source={neliWorldAssets.ui.brush} style={styles.tileBrush} resizeMode="contain" /><Image source={neliWorldAssets.ui.book} style={styles.tileWater} resizeMode="contain" /></View>;
  if (kind === 'count') return <View style={styles.art}>{[0, 1, 2].map(i => <View key={i} style={[styles.countBall, { backgroundColor: i === 1 ? accent : color, left: 40 + i * 32 }]} />)}</View>;
  if (kind === 'culture') return <View style={styles.art}><View style={[styles.book, { backgroundColor: color }]} /><View style={[styles.sun, { backgroundColor: accent }]} /></View>;
  return <View style={styles.art}><View style={[styles.face, { backgroundColor: color }]}><View style={styles.eyeLeft} /><View style={styles.eyeRight} /><View style={styles.smile} /></View><View style={[styles.chat, { backgroundColor: accent }]} /></View>;
}

export default function GamesScreen() {
  const { navigate } = useNav();
  const { lang, selectedCharacterId } = useContext(AppContext);
  const { width, height } = useWindowDimensions();
  const responsive = useResponsive();
  const ui = Math.min(width / 390, height / 844);
  const isFa = lang === 'fa' || lang === 'ar';
  const minCardWidth = 176;
  const gap = Math.max(10, Math.round(12 * ui));
  const columns = Math.max(2, Math.min(4, Math.floor((responsive.contentWidth - responsive.horizontalPadding * 2 + gap) / (minCardWidth + gap))));
  const cardW = (responsive.contentWidth - responsive.horizontalPadding * 2 - gap * (columns - 1)) / columns;

  return (
    <View style={styles.root}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#35217E' }]} />
      <TopBar title="Games" titleFa="بازی‌ها" dark />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: responsive.horizontalPadding }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { borderRadius: Math.max(26, Math.round(30 * ui)), padding: Math.max(14, Math.round(18 * ui)), marginBottom: Math.max(12, Math.round(16 * ui)) }]}>
          <Text style={[styles.kicker, { fontFamily: ff(lang, 'bold'), fontSize: Math.max(12, Math.round(13 * ui)), marginBottom: Math.max(4, Math.round(5 * ui)) }, dir(lang)]}>{isFa ? 'همه بازی‌ها در یک جا' : 'One clean game library'}</Text>
          <Text style={[styles.pageTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(24, Math.round(28 * ui)), lineHeight: Math.max(30, Math.round(36 * ui)) }, dir(lang)]}>{isFa ? 'انتخاب کن و بازی کن' : 'Choose a game'}</Text>
          <Text style={[styles.pageSub, { fontFamily: ff(lang, 'regular'), fontSize: Math.max(12, Math.round(14 * ui)), lineHeight: Math.max(18, Math.round(21 * ui)) }, dir(lang)]}>{isFa ? 'لمس، کشیدن، شنیدن و جواب دادن.' : 'Tap, drag, listen, and answer.'}</Text>
        </View>
        {GROUPS.map(group => (
          <View key={group.id} style={styles.group}>
            <Text style={[styles.groupTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(17, Math.round(19 * ui)), marginBottom: Math.max(8, Math.round(10 * ui)) }, dir(lang)]}>{isFa ? group.fa : group.en}</Text>
            <View style={styles.grid}>
              {GAMES.filter(game => game.group === group.id).map(game => (
                <TouchableOpacity key={game.id} style={[styles.card, { width: cardW, height: Math.max(214, Math.round(226 * ui)), borderRadius: Math.max(24, Math.round(26 * ui)) }]} onPress={() => navigate(game.route)} activeOpacity={0.88}>
                  <View style={[styles.thumb, { backgroundColor: game.color + '22', borderRadius: Math.max(20, Math.round(22 * ui)) }]}>
                    <TileArt kind={game.kind} color={game.color} accent={game.accent} characterId={selectedCharacterId} width={width} height={height} />
                    <View style={styles.cardShade} />
                    <View style={styles.cardTextBand}>
                      <Text style={[styles.cardTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(15, Math.round(16 * ui)) }, dir(lang)]} numberOfLines={1}>{isFa ? game.fa : game.en}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#35217E' },
  scroll: { paddingHorizontal: 14, paddingBottom: 36 },
  hero: { borderRadius: 30, padding: 18, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.94)' },
  kicker: { color: C.purple, fontSize: 13, marginBottom: 5 },
  pageTitle: { color: C.textDark, fontSize: 28, lineHeight: 36 },
  pageSub: { color: C.textMid, fontSize: 14, lineHeight: 21 },
  group: { marginBottom: 18 },
  groupTitle: { color: '#FFFFFF', fontSize: 19, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 26, overflow: 'hidden', borderWidth: 6, borderColor: '#FFFFFF', shadowColor: '#170736', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 14, elevation: 8 },
  thumb: { flex: 1, overflow: 'hidden' },
  cardShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 48, backgroundColor: 'rgba(37,16,92,0.62)' },
  cardTextBand: { position: 'absolute', left: 10, right: 10, bottom: 9, minHeight: 28, justifyContent: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 16, textAlign: 'left' },
  art: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sceneArt: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' },
  sceneArtImage: { width: '100%', height: '100%' },
  sceneWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(44, 20, 74, 0.10)' },
  tileGiraffe: { position: 'absolute', width: 82, height: 104, right: 12, bottom: 2 },
  tileBrush: { position: 'absolute', width: 54, height: 54, left: 12, bottom: 14, transform: [{ rotate: '-18deg' }] },
  tileWater: { position: 'absolute', width: 58, height: 58, left: 50, bottom: 0 },
  tilePan: { position: 'absolute', width: 112, height: 86, right: 18, bottom: 12 },
  tileFoodA: { position: 'absolute', width: 58, height: 58, left: 16, top: 16 },
  tileFoodB: { position: 'absolute', width: 48, height: 48, left: 66, bottom: 10 },
  tileAnimal: { position: 'absolute', width: 94, height: 94, right: 16, bottom: 6 },
  tileCarrot: { position: 'absolute', width: 60, height: 60, left: 18, bottom: 12, transform: [{ rotate: '-10deg' }] },
  face: { width: 72, height: 68, borderRadius: 34 },
  eyeLeft: { position: 'absolute', left: 22, top: 25, width: 7, height: 7, borderRadius: 4, backgroundColor: '#1B1238' },
  eyeRight: { position: 'absolute', right: 22, top: 25, width: 7, height: 7, borderRadius: 4, backgroundColor: '#1B1238' },
  smile: { position: 'absolute', bottom: 18, alignSelf: 'center', width: 24, height: 12, borderBottomWidth: 3, borderBottomColor: '#1B1238', borderRadius: 12 },
  chat: { position: 'absolute', right: 32, top: 17, width: 36, height: 26, borderRadius: 13 },
  tooth: { width: 56, height: 68, borderRadius: 23, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#DDE7F2' },
  brush: { position: 'absolute', width: 78, height: 14, borderRadius: 7, bottom: 27, transform: [{ rotate: '-22deg' }] },
  pot: { width: 78, height: 58, borderBottomLeftRadius: 22, borderBottomRightRadius: 22, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  soup: { position: 'absolute', top: 43, width: 60, height: 16, borderRadius: 8 },
  paintDot: { position: 'absolute', width: 30, height: 30, borderRadius: 15 },
  bowl: { position: 'absolute', bottom: 18, width: 64, height: 24, borderBottomLeftRadius: 22, borderBottomRightRadius: 22 },
  shirt: { width: 54, height: 64, borderRadius: 17 },
  sleeveA: { position: 'absolute', left: 39, top: 32, width: 24, height: 34, borderRadius: 13, transform: [{ rotate: '35deg' }] },
  sleeveB: { position: 'absolute', right: 39, top: 32, width: 24, height: 34, borderRadius: 13, transform: [{ rotate: '-35deg' }] },
  roof: { width: 0, height: 0, borderLeftWidth: 42, borderRightWidth: 42, borderBottomWidth: 38, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  house: { width: 70, height: 48, borderRadius: 12, backgroundColor: '#FFFFFF' },
  door: { position: 'absolute', bottom: 23, width: 18, height: 28, borderRadius: 7 },
  countBall: { position: 'absolute', width: 30, height: 30, borderRadius: 15 },
  book: { width: 68, height: 74, borderRadius: 14 },
  sun: { position: 'absolute', right: 41, top: 25, width: 32, height: 32, borderRadius: 16 },
  tileTalkCharacter: { position: 'absolute', right: 10, bottom: -10, width: 92, height: 120 },
  tileDressCharacter: { position: 'absolute', right: 10, bottom: 2, width: 92, height: 120 },
});
