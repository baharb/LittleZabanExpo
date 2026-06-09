import React, { useContext } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import TopBar from '../components/TopBar';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';
import { useResponsive } from '../theme/responsive';
import CharacterAvatar from '../components/CharacterAvatar';
import { characterAssets } from '../assets/characterAssets';
import { neliWorldAssets, roomBackgroundPickers, roomBackgroundVariants } from '../assets/neliWorldAssets';
import { SOLAR_SYSTEM_BACKGROUND, SOLAR_SYSTEM_PLANETS } from '../assets/solarSystemPuzzle';
import { BOX_CHARACTER_WIDTH } from '../theme/characterSizes';

type Kind = 'talk' | 'dress' | 'tooth' | 'animal' | 'cook' | 'paint' | 'routine' | 'room' | 'memory' | 'quiz' | 'color' | 'count' | 'culture' | 'tracing' | 'firstTracing' | 'alphabet' | 'alphabetTrain' | 'video' | 'iranPuzzle' | 'solarPuzzle';
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
  group: 'play' | 'learn' | 'alphabet';
};

const GAMES: Tile[] = [
  { id: 'talk', route: { name: 'ConversationGame' }, en: 'Talk with Neli', fa: 'گفت‌وگو با نلی', descEn: 'Listen and answer', descFa: 'بشنو و جواب بده', kind: 'talk', color: '#6C4EFF', accent: '#FACC15', group: 'play' },
  { id: 'dress', route: { name: 'DressUp' }, en: 'Dress Up', fa: 'لباس بپوش', descEn: 'Drag clothes onto Neli', descFa: 'لباس را روی نلی بکش', kind: 'dress', color: '#EC4899', accent: '#FDE68A', group: 'play' },
  { id: 'teeth', route: { name: 'ToothBrush' }, en: 'Brush Teeth', fa: 'مسواک زدن', descEn: 'Move the brush', descFa: 'مسواک را حرکت بده', kind: 'tooth', color: '#38BDF8', accent: '#6C4EFF', group: 'play' },
  { id: 'animals', route: { name: 'FeedAnimals' }, en: 'Feed Animals', fa: 'غذا بده', descEn: 'Drag food to animals', descFa: 'غذا را به حیوان بده', kind: 'animal', color: '#22C55E', accent: '#FACC15', group: 'play' },
  { id: 'cook', route: { name: 'Cooking' }, en: 'Cooking', fa: 'آشپزی', descEn: 'Make fun recipes', descFa: 'غذا درست کن', kind: 'cook', color: '#FB923C', accent: '#FACC15', group: 'play' },
  { id: 'coloring', route: { name: 'Coloring' }, en: 'Painting', fa: 'نقاشی', descEn: 'Paint picture pages', descFa: 'صفحه‌ها را رنگ کن', kind: 'paint', color: '#A855F7', accent: '#FF80C0', group: 'play' },
  { id: 'iranPuzzle', route: { name: 'IranPuzzle' }, en: 'Iran Puzzle', fa: 'پازل ایران', descEn: 'Drag the provinces', descFa: 'استان‌ها را جابجا کن', kind: 'iranPuzzle', color: '#F97316', accent: '#FFF0E2', group: 'learn' },
  { id: 'solarPuzzle', route: { name: 'SolarPuzzle' }, en: 'Solar System', fa: 'منظومه خورشیدی', descEn: 'Place each planet', descFa: 'هر سیاره را بگذار', kind: 'solarPuzzle', color: '#38BDF8', accent: '#EAF7FF', group: 'learn' },
  { id: 'interactiveTracing', route: { name: 'InteractiveFarsiTrace' }, en: 'Trace a Letter', fa: 'شکل کشی حرف', descEn: 'Follow the stroke order', descFa: 'روی خط حرف برو', kind: 'firstTracing', color: '#19BDF2', accent: '#FFE66D', group: 'alphabet' },
  { id: 'alphabet', route: { name: 'AlphabetShow' }, en: 'Alphabet Show', fa: 'نمایش الفبا', descEn: 'Letters, words, and motion', descFa: 'حرف، واژه و حرکت', kind: 'alphabet', color: '#8B5CF6', accent: '#38BDF8', group: 'alphabet' },
  { id: 'alphabetTrain', route: { name: 'AlphabetTrain' }, en: 'Alphabet Train', fa: 'قطار الفبا', descEn: 'Ride the letters and words', descFa: 'سوار قطار حرف‌ها شو', kind: 'alphabetTrain', color: '#06B6D4', accent: '#FACC15', group: 'alphabet' },
  { id: 'memory', route: { name: 'Game', gameId: 'memory' }, en: 'Memory Match', fa: 'بازی حافظه', descEn: 'Find pairs', descFa: 'جفت‌ها را پیدا کن', kind: 'memory', color: '#6C4EFF', accent: '#FACC15', group: 'learn' },
  { id: 'quiz', route: { name: 'Game', gameId: 'quiz' }, en: 'Word Quiz', fa: 'مسابقه کلمه', descEn: 'See and choose', descFa: 'ببین و انتخاب کن', kind: 'quiz', color: '#38BDF8', accent: '#A855F7', group: 'learn' },
  { id: 'colors', route: { name: 'Game', gameId: 'colormatch' }, en: 'Color Play', fa: 'بازی رنگ', descEn: 'Match playful colors', descFa: 'رنگ درست را پیدا کن', kind: 'color', color: '#EC4899', accent: '#FACC15', group: 'learn' },
  { id: 'counting', route: { name: 'Game', gameId: 'counting' }, en: 'Counting', fa: 'شمارش', descEn: 'Count with pictures', descFa: 'با تصویر بشمار', kind: 'count', color: '#FACC15', accent: '#6C4EFF', group: 'learn' },
];

const GROUPS = [
  { id: 'play', en: 'Touch Games', fa: 'بازی‌های لمسی' },
  { id: 'learn', en: 'Learning Games', fa: 'بازی‌های یادگیری' },
  { id: 'alphabet', en: 'Alphabet', fa: 'الفبا' },
] as const;

const solarPlanetSource = (id: string) => SOLAR_SYSTEM_PLANETS.find(planet => planet.id === id)?.source ?? SOLAR_SYSTEM_PLANETS[0].source;

function TileArt({ kind, color, accent, characterId, width, height }: { kind: Kind; color: string; accent: string; characterId: string; width: number; height: number }) {
  if (kind === 'talk') {
    return (
      <ImageBackground source={roomBackgroundPickers.talkPlay(width, height)} style={styles.sceneArt} imageStyle={styles.sceneArtImageCover}>
        <View style={styles.sceneWash} />
        <CharacterAvatar
          characterId="neli"
          size={118}
          talking
          talkPattern="home"
          talkMouthScale={0.86}
          talkMouthOffsetXPercent={0.46}
          talkMouthOffsetY={0}
          floating={false}
          style={styles.sceneNeliLarge}
        />
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
        <Image source={characterAssets.lila.poses.bigSmile} style={styles.sceneGiraffe} resizeMode="contain" />
      </ImageBackground>
    );
  }
  if (kind === 'cook') {
    return (
      <ImageBackground
        source={roomBackgroundVariants.kitchen.brightAndCheerful.universal}
        style={styles.sceneArt}
        imageStyle={styles.sceneArtImage}
      >
        <View style={styles.sceneWashSoft} />
        <Image source={characterAssets.neli.poses.cooking} style={styles.tileCookNeli} resizeMode="contain" />
      </ImageBackground>
    );
  }
  if (kind === 'animal') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.feedAnimalsJungle} style={styles.sceneArt} imageStyle={styles.sceneArtImage}>
        <Image source={neliWorldAssets.animals.monkey} style={styles.tileMonkey} resizeMode="contain" />
        <View style={styles.sceneWashSoft} />
      </ImageBackground>
    );
  }
  if (kind === 'paint') {
    return (
      <View style={styles.paintingCardScene}>
        <Image source={neliWorldAssets.painting.cardBunny} style={styles.paintingCardImage} resizeMode="contain" />
      </View>
    );
  }
  if (kind === 'memory') {
    return (
      <View style={styles.memoryScene}>
        <View style={[styles.memoryCardBack, styles.memoryCardBackOne]} />
        <View style={[styles.memoryCardBack, styles.memoryCardBackTwo]} />
        <View style={[styles.memoryCardBack, styles.memoryCardBackThree]} />
        <Image source={characterAssets.lila.poses.thinkingAlt} style={styles.memoryLila} resizeMode="contain" />
      </View>
    );
  }
  if (kind === 'color') return <View style={styles.art}>{[color, accent, '#22C55E', '#38BDF8'].map((c, i) => <View key={c} style={[styles.paintDot, { backgroundColor: c, left: 42 + (i % 2) * 38, top: 24 + Math.floor(i / 2) * 38 }]} />)}</View>;
  if (kind === 'room') return <View style={styles.art}><View style={[styles.roof, { borderBottomColor: color }]} /><View style={styles.house} /><View style={[styles.door, { backgroundColor: accent }]} /></View>;
  if (kind === 'tracing') return <View style={styles.art}><Image source={neliWorldAssets.ui.brush} style={styles.tileBrush} resizeMode="contain" /><Image source={neliWorldAssets.ui.book} style={styles.tileWater} resizeMode="contain" /></View>;
  if (kind === 'firstTracing') return (
    <View style={styles.firstTracingScene}>
      <View style={[styles.firstTracingBubble, styles.firstTracingBubbleA]}><Text style={styles.firstTracingLetter}>ا</Text></View>
      <View style={[styles.firstTracingBubble, styles.firstTracingBubbleB]}><Text style={styles.firstTracingLetter}>ب</Text></View>
      <Image source={neliWorldAssets.ui.brush} style={styles.firstTracingBrush} resizeMode="contain" />
      <Image source={require('../../assets/neli-world/fruits/orange.png')} style={styles.firstTracingOrange} resizeMode="contain" />
    </View>
  );
  if (kind === 'alphabet') return (
    <View style={styles.alphabetScene}>
      <View style={[styles.alphabetBubble, styles.alphabetBubbleAlef]}><Text style={styles.alphabetLetter}>ا</Text></View>
      <View style={[styles.alphabetBubble, styles.alphabetBubbleBe]}><Text style={styles.alphabetLetter}>ب</Text></View>
      <View style={[styles.alphabetBubble, styles.alphabetBubblePe]}><Text style={styles.alphabetLetter}>پ</Text></View>
    </View>
  );
  if (kind === 'alphabetTrain') return (
    <View style={styles.alphabetTrainScene}>
      <View style={styles.alphabetTrainSmoke} />
      <View style={styles.alphabetTrainEngine}>
        <CharacterAvatar characterId={characterId} size={72} floating={false} />
      </View>
      <View style={styles.alphabetTrainCar}>
        <Text style={styles.alphabetTrainLetter}>ا</Text>
      </View>
      <View style={[styles.alphabetTrainCar, styles.alphabetTrainCarAlt]}>
        <Text style={styles.alphabetTrainLetter}>ب</Text>
      </View>
    </View>
  );
  if (kind === 'video') return (
    <View style={styles.videoScene}>
      <View style={[styles.videoFrame, styles.videoFrameBack]} />
      <View style={styles.videoFrame}>
        <View style={styles.videoPlay}>
          <Text style={styles.videoPlayText}>▶</Text>
        </View>
      </View>
      <View style={[styles.videoSpark, styles.videoSparkOne]} />
      <View style={[styles.videoSpark, styles.videoSparkTwo]} />
    </View>
  );
  if (kind === 'iranPuzzle') return (
    <ImageBackground source={neliWorldAssets.puzzle.iranMaster} style={styles.sceneArt} imageStyle={styles.sceneArtImage}>
      <View style={styles.sceneWashSoft} />
      <View style={styles.iranPuzzleFrame}>
        <Text style={[styles.iranPuzzleLabel, { fontFamily: ff('en', 'black') }]}>IRAN</Text>
      </View>
    </ImageBackground>
  );
  if (kind === 'solarPuzzle') return (
    <ImageBackground source={SOLAR_SYSTEM_BACKGROUND} style={styles.sceneArt} imageStyle={[styles.sceneArtImage, styles.solarPreviewBg]}>
      <View style={styles.solarPreviewWash} />
      <Image source={solarPlanetSource('jupiter')} style={[styles.solarPreviewPlanet, styles.solarPreviewJupiter]} resizeMode="contain" />
      <Image source={solarPlanetSource('earth')} style={[styles.solarPreviewPlanet, styles.solarPreviewEarth]} resizeMode="contain" />
      <Image source={solarPlanetSource('saturn')} style={[styles.solarPreviewPlanet, styles.solarPreviewSaturn]} resizeMode="contain" />
      <Image source={solarPlanetSource('mars')} style={[styles.solarPreviewPlanet, styles.solarPreviewMars]} resizeMode="contain" />
    </ImageBackground>
  );
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
  const gap = Math.max(10, Math.round(12 * ui));
  const columns = 4;
  const usableWidth = responsive.contentWidth - responsive.horizontalPadding * 2 - gap * (columns - 1);
  const cardW = usableWidth / columns - Math.max(2, Math.round(4 * ui));

  return (
    <View style={styles.root}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#35217E' }]} />
      <TopBar title="Games" titleFa="بازی‌ها" dark />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: responsive.horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {GROUPS.map(group => (
          <View key={group.id} style={styles.group}>
            <Text style={[styles.groupTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(17, Math.round(19 * ui)), marginBottom: Math.max(8, Math.round(10 * ui)) }, dir(lang)]}>{isFa ? group.fa : group.en}</Text>
            <View style={[styles.grid, { columnGap: gap, rowGap: gap }]}>
              {GAMES.filter(game => game.group === group.id).map(game => (
                <TouchableOpacity key={game.id} style={[styles.card, { width: cardW, height: Math.max(196, Math.round(207 * ui)), borderRadius: Math.max(20, Math.round(22 * ui)) }]} onPress={() => navigate(game.route)} activeOpacity={0.88}>
                  <View style={[styles.thumb, { backgroundColor: '#AEEBFF', borderRadius: Math.max(20, Math.round(22 * ui)) }]}>
                    <TileArt kind={game.kind} color={game.color} accent={game.accent} characterId={selectedCharacterId} width={width} height={height} />
                    <View style={styles.cardShade} />
                    <View style={styles.cardTextBand}>
                      <Text style={[styles.cardTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(12, Math.round(13 * ui)) }, dir(lang)]} numberOfLines={2}>{isFa ? game.fa : game.en}</Text>
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
  group: { marginBottom: 18 },
  groupTitle: { color: '#FFFFFF', fontSize: 19, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { backgroundColor: '#AEEBFF', borderRadius: 26, overflow: 'hidden', borderWidth: 6, borderColor: '#FFFFFF', shadowColor: '#170736', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 14, elevation: 8 },
  thumb: { flex: 1, overflow: 'hidden' },
  cardShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 48, backgroundColor: 'rgba(37,16,92,0.62)' },
  cardTextBand: { position: 'absolute', left: 10, right: 10, bottom: 9, minHeight: 28, justifyContent: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 16, textAlign: 'left' },
  art: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  memoryScene: { flex: 1, width: '100%', height: '100%', backgroundColor: '#5E46D4', alignItems: 'center', justifyContent: 'center' },
  memoryCardBack: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: '#FFF6B8',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    shadowColor: '#140A36',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  memoryCardBackOne: { left: 14, top: 24, transform: [{ rotate: '-10deg' }] },
  memoryCardBackTwo: { right: 14, top: 34, transform: [{ rotate: '10deg' }] },
  memoryCardBackThree: { left: '50%', marginLeft: -38, bottom: 22, transform: [{ rotate: '-2deg' }] },
  memoryLila: { width: 156, height: 204, position: 'absolute', bottom: -10, alignSelf: 'center' },
  sceneArt: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' },
  sceneArtImage: { width: '100%', height: '100%' },
  sceneArtImageCover: { width: '100%', height: '100%' },
  sceneWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(44, 20, 74, 0.10)' },
  sceneWashSoft: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.06)' },
  paintingCardScene: { flex: 1, width: '100%', height: '100%', backgroundColor: '#18C977', alignItems: 'center', justifyContent: 'center' },
  paintingCardImage: { width: '100%', height: '100%' },
  solarPreviewBg: { width: '100%', height: '100%', transform: [{ scale: 1.1 }] },
  solarPreviewWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 8, 32, 0.08)' },
  solarPreviewPlanet: {
    position: 'absolute',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  solarPreviewJupiter: { width: 58, height: 58, right: 16, top: 18 },
  solarPreviewEarth: { width: 38, height: 38, left: 30, top: 58 },
  solarPreviewSaturn: { width: 68, height: 48, right: 74, bottom: 42 },
  solarPreviewMars: { width: 30, height: 30, left: 102, top: 30 },
  solarCardArt: { backgroundColor: '#07112D' },
  solarCardStarOne: { position: 'absolute', left: 28, top: 34, width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF7C2' },
  solarCardStarTwo: { position: 'absolute', right: 42, top: 26, width: 5, height: 5, borderRadius: 3, backgroundColor: '#BFEAFF' },
  solarCardStarThree: { position: 'absolute', right: 72, bottom: 58, width: 3, height: 3, borderRadius: 2, backgroundColor: '#FFEFB0' },
  sceneNeliLarge: { position: 'absolute', width: 177, height: 231, alignSelf: 'center', bottom: -40.2 },
  sceneGiraffe: { position: 'absolute', width: 172.2, height: 218.4, alignSelf: 'center', bottom: -14 },
  tileGiraffe: { position: 'absolute', width: 172.2, height: 218.4, alignSelf: 'center', bottom: -14 },
  tileBrush: { position: 'absolute', width: 54, height: 54, left: 12, bottom: 14, transform: [{ rotate: '-18deg' }] },
  tileWater: { position: 'absolute', width: 58, height: 58, left: 50, bottom: 0 },
  firstTracingScene: { flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF0DE', alignItems: 'center', justifyContent: 'center' },
  firstTracingBubble: { position: 'absolute', width: 82, height: 82, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#FFFFFF', shadowColor: '#170736', shadowOpacity: 0.14, shadowRadius: 9, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  firstTracingBubbleA: { left: 20, top: 26, backgroundColor: '#19BDF2', transform: [{ rotate: '-8deg' }] },
  firstTracingBubbleB: { right: 22, top: 46, backgroundColor: '#6C4EFF', transform: [{ rotate: '7deg' }] },
  firstTracingLetter: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 38, lineHeight: 50 },
  firstTracingBrush: { position: 'absolute', width: 72, height: 72, left: 26, bottom: 20, transform: [{ rotate: '-18deg' }] },
  firstTracingOrange: { position: 'absolute', width: 82, height: 82, right: 24, bottom: 18 },
  alphabetScene: { flex: 1, width: '100%', height: '100%', backgroundColor: '#F5ECFF', alignItems: 'center', justifyContent: 'center' },
  alphabetBubble: { position: 'absolute', width: 78, height: 78, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#FFFFFF', shadowColor: '#170736', shadowOpacity: 0.16, shadowRadius: 8, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  alphabetBubbleAlef: { left: 18, top: 20, backgroundColor: '#8B5CF6', transform: [{ rotate: '-8deg' }] },
  alphabetBubbleBe: { right: 18, top: 34, backgroundColor: '#38BDF8', transform: [{ rotate: '8deg' }] },
  alphabetBubblePe: { bottom: 24, backgroundColor: '#F97316', transform: [{ rotate: '-2deg' }] },
  alphabetLetter: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 34 },
  alphabetTrainScene: { flex: 1, width: '100%', height: '100%', backgroundColor: '#DFF7FF', alignItems: 'center', justifyContent: 'center' },
  alphabetTrainSmoke: { position: 'absolute', left: 18, top: 18, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.8)' },
  alphabetTrainEngine: { position: 'absolute', left: 14, bottom: 14, width: 82, height: 108, borderRadius: 28, backgroundColor: '#06B6D4', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFFFFF' },
  alphabetTrainCar: { position: 'absolute', right: 18, top: 24, width: 84, height: 104, borderRadius: 26, backgroundColor: '#8B5CF6', borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  alphabetTrainCarAlt: { right: 112, top: 54, backgroundColor: '#F97316' },
  alphabetTrainLetter: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 30 },
  videoScene: { flex: 1, width: '100%', height: '100%', backgroundColor: '#FCE7F3', alignItems: 'center', justifyContent: 'center' },
  videoFrame: { position: 'absolute', width: 138, height: 96, borderRadius: 24, backgroundColor: '#EC4899', borderWidth: 6, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#170736', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  videoFrameBack: { backgroundColor: '#38BDF8', transform: [{ rotate: '-9deg' }, { translateX: -18 }, { translateY: -10 }] },
  videoPlay: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FACC15', alignItems: 'center', justifyContent: 'center' },
  videoPlayText: { color: '#25105C', fontSize: 22, marginLeft: 4 },
  videoSpark: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: '#FACC15' },
  videoSparkOne: { left: 22, top: 22 },
  videoSparkTwo: { right: 24, bottom: 36, backgroundColor: '#38BDF8' },
  tileCookNeli: { position: 'absolute', width: 158.4, height: 208.8, alignSelf: 'center', bottom: -4 },
  tileMonkey: { position: 'absolute', left: 0, top: -10, width: 112, height: 112, transform: [{ rotate: '-8deg' }] },
  tileAnimal: { position: 'absolute', width: 94, height: 94, right: 16, bottom: 6 },
  tileCarrot: { position: 'absolute', width: 60, height: 60, left: 18, bottom: 12, transform: [{ rotate: '-10deg' }] },
  iranPuzzleFrame: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  iranPuzzleLabel: { color: '#F97316', fontSize: 12, letterSpacing: 0.8 },
  solarSun: {
    position: 'absolute',
    left: 16,
    top: 18,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FDBA74',
    shadowColor: '#FDBA74',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  solarOrbit: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 56,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  solarOrbitSmall: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 92,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  solarPlanet: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  solarPlanetOne: { left: 68, top: 46, backgroundColor: '#CBD5E1' },
  solarPlanetTwo: { left: 136, top: 46, backgroundColor: '#38BDF8' },
  solarPlanetThree: { left: 210, top: 42, width: 28, height: 28, borderRadius: 14, backgroundColor: '#F59E0B' },
  solarLabelWrap: {
    position: 'absolute',
    right: 14,
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(8, 13, 34, 0.5)',
  },
  solarLabel: { color: '#FFFFFF', fontSize: 12 },
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

