import React, { useContext } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import TopBar from '../components/TopBar';
import CharacterAvatar from '../components/CharacterAvatar';
import { characterAssets } from '../assets/characterAssets';
import { neliWorldAssets, roomBackgroundPickers } from '../assets/neliWorldAssets';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';
import { clamp, useResponsive } from '../theme/responsive';
import { BOX_CHARACTER_HEIGHT, BOX_CHARACTER_WIDTH } from '../theme/characterSizes';

type Action = {
  en: string;
  fa: string;
  descEn: string;
  descFa: string;
  route: any;
  colors: readonly [string, string];
  art: string;
};

const TODAY: Action[] = [
  { en: 'Talk', fa: 'گفتگو', descEn: 'Listen and answer', descFa: 'گوش بده و جواب بده', route: { name: 'ConversationGame' }, colors: ['#24C878', '#119C65'], art: 'talk' },
  { en: 'Dress', fa: 'لباس', descEn: 'Drag clothes', descFa: 'لباس را بکش', route: { name: 'DressUp' }, colors: ['#FF78A8', '#C84B7A'], art: 'dress' },
  { en: 'Brush', fa: 'مسواک', descEn: 'Move the brush', descFa: 'مسواک را حرکت بده', route: { name: 'ToothBrush' }, colors: ['#53C8FF', '#2D8CFF'], art: 'teeth' },
  { en: 'Color', fa: 'رنگ', descEn: 'Paint pictures', descFa: 'تصویرها را رنگ کن', route: { name: 'Coloring' }, colors: ['#B88CFF', '#7C3AED'], art: 'paint' },
  { en: 'Story', fa: 'قصه', descEn: 'Listen to a book', descFa: 'داستان گوش بده', route: { name: 'Audiobooks' }, colors: ['#FFD166', '#F59E0B'], art: 'story' },
  { en: 'Games', fa: 'بازی‌ها', descEn: 'Open game library', descFa: 'کتابخانه بازی ها', route: { name: 'Main', tab: 'Games' }, colors: ['#6D3DF4', '#20B8D7'], art: 'games' },
];

function HomeCharacterArt({ characterId, style, size, talking = false }: { characterId: string; style?: any; size: number; talking?: boolean }) {
  return <CharacterAvatar characterId={characterId} size={size} talking={talking} floating={false} style={style} />;
}

function ActionScene({
  type,
  characterId,
  width,
  height,
  previewSize,
}: {
  type: string;
  characterId: string;
  width: number;
  height: number;
  previewSize: number;
}) {
  const tall = BOX_CHARACTER_HEIGHT;
  if (type === 'talk') {
    return (
      <ImageBackground source={roomBackgroundPickers.talkPlay(width, height)} style={styles.sceneFill} imageStyle={styles.sceneImageCover}>
        <View style={styles.sceneWash} />
        <CharacterAvatar
          characterId="neli"
          size={previewSize}
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
  if (type === 'dress') {
    return (
      <ImageBackground source={roomBackgroundPickers.bedroom(width, height)} style={styles.sceneFill} imageStyle={styles.sceneImage}>
        <CharacterAvatar characterId="neli" size={previewSize} floating={false} style={styles.sceneNeliSmall} />
      </ImageBackground>
    );
  }
    if (type === 'teeth') {
      return (
        <ImageBackground source={neliWorldAssets.rooms.brushTeethBathroom} style={styles.sceneFill} imageStyle={styles.sceneImage}>
          <Image source={characterAssets.lila.poses.bigSmile} style={[styles.sceneGiraffe, { width: previewSize, height: tall }]} resizeMode="contain" />
        </ImageBackground>
      );
    }
  if (type === 'paint') {
    return (
      <View style={[styles.sceneFill, styles.paintScene]}>
        <Image source={neliWorldAssets.ui.paintbrush} style={styles.paintBrushImage} resizeMode="contain" />
        <View style={styles.paintPaletteBig}>
          {['#FF3B86', '#FFD400', '#13C8C5', '#56D600', '#078BFF'].map(color => <View key={color} style={[styles.paintBlob, { backgroundColor: color }]} />)}
        </View>
      </View>
    );
  }
  if (type === 'story') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.studyRoom ?? neliWorldAssets.rooms.livingRoom} style={styles.sceneFill} imageStyle={styles.sceneImage}>
        <Image source={neliWorldAssets.ui.book} style={styles.storyBookBig} resizeMode="contain" />
        <HomeCharacterArt characterId={characterId} style={[styles.storyNeli, { width: BOX_CHARACTER_WIDTH, height: BOX_CHARACTER_HEIGHT }]} size={BOX_CHARACTER_WIDTH} />
      </ImageBackground>
    );
  }
  return (
    <View style={[styles.sceneFill, styles.gamesScene]}>
      <Image source={neliWorldAssets.ui.gamepad} style={styles.gamepadBig} resizeMode="contain" />
      <Image source={neliWorldAssets.ui.star} style={[styles.gameStar, { left: 22, top: 24 }]} resizeMode="contain" />
      <Image source={neliWorldAssets.ui.trophy} style={styles.gameTrophy} resizeMode="contain" />
    </View>
  );
}

export default function HomeScreen() {
  const { lang, stars, age, selectedCharacterId } = useContext(AppContext);
  const { navigate } = useNav();
  const { width, height } = useWindowDimensions();
  const responsive = useResponsive();
  const ui = Math.min(width / 390, height / 844);
  const isFa = lang === 'fa' || lang === 'ar';

  const contentWidth = responsive.sideRail ? width - 92 : width;
  const columns = contentWidth >= 960 ? 4 : contentWidth >= 680 ? 3 : 2;
  const gap = 12;
  const cardW = (contentWidth - responsive.horizontalPadding * 2 - gap * (columns - 1)) / columns;
  const compactHero = responsive.isLandscape && !responsive.isTablet;
  const actions = TODAY;

  return (
    <View style={styles.root}>
      <TopBar title="Little Zaban" titleFa="لیتل زبان" dark showBack={false} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: responsive.horizontalPadding }]} showsVerticalScrollIndicator={false}>
        <View style={[
          styles.hero,
          compactHero && styles.heroCompact,
          {
            minHeight: Math.max(150, Math.round(202 * ui)),
            padding: Math.max(12, Math.round(16 * ui)),
            borderRadius: Math.max(28, Math.round(34 * ui)),
          },
        ]}>
          <View style={styles.heroText}>
            <Text style={[styles.kicker, { fontFamily: ff(lang, 'bold'), fontSize: Math.max(12, Math.round(13 * ui)), marginBottom: Math.max(4, Math.round(6 * ui)) }, dir(lang)]}>
              {isFa ? `مسیر امروز، سن ${age || 4}` : `Today, age ${age || 4}`}
            </Text>
            <Text style={[styles.heroTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(23, Math.round(27 * ui)), lineHeight: Math.max(29, Math.round(34 * ui)) }, dir(lang)]}>
              {isFa ? 'فارسی را با بازی یاد بگیر' : 'Learn Persian through play'}
            </Text>
            <Text style={[styles.heroSub, { fontFamily: ff(lang, 'regular'), fontSize: Math.max(12, Math.round(13 * ui)), lineHeight: Math.max(17, Math.round(19 * ui)), marginTop: Math.max(4, Math.round(6 * ui)) }, dir(lang)]}>
              {isFa ? 'یک صفحه ساده برای شروع. همه بازی ها در تب بازی هاست.' : 'A simple starting page. All games are in the Games tab.'}
            </Text>
            <View style={[styles.starPill, { borderRadius: Math.max(16, Math.round(18 * ui)), marginTop: Math.max(10, Math.round(14 * ui)), paddingHorizontal: Math.max(10, Math.round(12 * ui)), paddingVertical: Math.max(5, Math.round(6 * ui)) }]}>
              <Text style={[styles.starTxt, { fontFamily: ff(lang, 'bold'), fontSize: Math.max(12, Math.round(13 * ui)) }]}>★ {stars}</Text>
            </View>
          </View>
          <View style={[styles.neliWrap, { width: BOX_CHARACTER_WIDTH * Math.max(0.92, ui), height: (BOX_CHARACTER_HEIGHT + 12) * Math.max(0.92, ui) }]}>
            <HomeCharacterArt characterId={selectedCharacterId} size={BOX_CHARACTER_WIDTH} style={{ width: BOX_CHARACTER_WIDTH, height: BOX_CHARACTER_HEIGHT }} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(18, Math.round(20 * ui)), marginBottom: Math.max(8, Math.round(11 * ui)) }, dir(lang)]}>
          {isFa ? 'امروز چه کار کنیم؟' : 'What shall we do today?'}
        </Text>
        <View style={styles.grid}>
          {actions.map(item => (
            <TouchableOpacity key={item.en} style={[styles.card, { width: cardW, height: Math.max(204, Math.round(226 * ui)), borderRadius: Math.max(24, Math.round(26 * ui)) }]} onPress={() => navigate(item.route)} activeOpacity={0.86}>
              <View style={styles.cardArt}>
                <ActionScene type={item.art} characterId={selectedCharacterId} width={width} height={height} previewSize={Math.max(92, Math.round(BOX_CHARACTER_WIDTH * Math.max(0.92, ui)))} />
                <View style={styles.cardShade} />
                <View style={styles.cardTextBand}>
                  <Text style={[styles.cardTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)), lineHeight: Math.max(20, Math.round(23 * ui)) }, dir(lang)]} numberOfLines={1}>
                    {isFa ? item.fa : item.en}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2B1268' },
  scroll: { paddingHorizontal: 14, paddingBottom: 34 },
  hero: { flexDirection: 'row', alignItems: 'center', borderRadius: 34, padding: 16, marginBottom: 18, minHeight: 202, backgroundColor: '#FFFFFF', shadowColor: '#170736', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  heroCompact: { minHeight: 150, paddingVertical: 12 },
  heroText: { flex: 1 },
  kicker: { color: '#7C3AED', fontSize: 13, marginBottom: 6 },
  heroTitle: { color: '#221044', fontSize: 27, lineHeight: 34 },
  heroSub: { color: '#6B5A89', fontSize: 13, lineHeight: 19, marginTop: 6 },
  neliWrap: { width: 134, height: 154, alignItems: 'center', justifyContent: 'center' },
  starPill: { alignSelf: 'flex-start', backgroundColor: '#FFE57A', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 6, marginTop: 14 },
  starTxt: { color: '#7A4B00', fontSize: 13 },
  sectionTitle: { color: '#fff', fontSize: 20, marginBottom: 11 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { height: 226, borderRadius: 26, overflow: 'hidden', borderWidth: 6, borderColor: '#FFFFFF', backgroundColor: '#AEEBFF', shadowColor: '#170736', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 14, elevation: 8 },
  cardArt: { flex: 1, overflow: 'hidden' },
  cardShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 48, backgroundColor: 'rgba(37,16,92,0.62)' },
  cardTextBand: { position: 'absolute', left: 10, right: 10, bottom: 9, minHeight: 28, justifyContent: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 18, lineHeight: 23, textAlign: 'left' },
  cardDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 11, lineHeight: 15, textAlign: 'left' },
  sceneFill: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' },
  sceneImage: { width: '100%', height: '100%' },
  sceneImageCover: { width: '100%', height: '100%' },
  sceneWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(44, 20, 74, 0.10)' },
  sceneNeliLarge: { position: 'absolute', width: 118, height: 154, right: 8, bottom: 18 },
  sceneNeliSmall: { position: 'absolute', width: 104, height: 136, right: 8, bottom: 10 },
  sceneGiraffe: { position: 'absolute', width: 116, height: 150, right: 8, bottom: 14 },
  paintScene: { backgroundColor: '#B88CFF', alignItems: 'center', justifyContent: 'center' },
  paintBrushImage: { position: 'absolute', width: 94, height: 94, right: 14, top: 28, transform: [{ rotate: '-18deg' }] },
  paintPaletteBig: { position: 'absolute', left: 18, bottom: 68, width: 112, height: 82, borderRadius: 42, backgroundColor: '#FFFFFF', flexDirection: 'row', flexWrap: 'wrap', padding: 13, gap: 7 },
  paintBlob: { width: 24, height: 24, borderRadius: 12 },
  storyBookBig: { position: 'absolute', width: 110, height: 110, left: 14, bottom: 58 },
  storyNeli: { position: 'absolute', width: 98, height: 128, right: 10, bottom: 14 },
  gamesScene: { backgroundColor: '#53D5FF', alignItems: 'center', justifyContent: 'center' },
  gamepadBig: { position: 'absolute', width: 118, height: 118, left: 20, bottom: 54 },
  gameStar: { position: 'absolute', width: 48, height: 48 },
  gameTrophy: { position: 'absolute', width: 80, height: 80, right: 18, top: 36 },
  face: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFD1D9', alignItems: 'center', justifyContent: 'center' },
  eyeRow: { flexDirection: 'row', gap: 12, marginBottom: 7 },
  eye: { width: 7, height: 9, borderRadius: 5, backgroundColor: '#25105C' },
  teeth: { flexDirection: 'row', gap: 2, backgroundColor: '#25105C', borderRadius: 10, padding: 5 },
  tooth: { width: 8, height: 12, borderRadius: 3, backgroundColor: '#fff' },
  palette: { width: 72, height: 54, borderRadius: 27, backgroundColor: '#fff', flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 6 },
  paintDot: { width: 17, height: 17, borderRadius: 9 },
  talkNeliArt: { width: 104, height: 96, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  talkNeliImage: { width: 96, height: 116, marginTop: 18 },
  talkWhiteIcon: { position: 'absolute', right: 3, top: 4, width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', gap: 2 },
  talkWhiteDot: { position: 'absolute', left: 7, width: 7, height: 12, borderRadius: 5, backgroundColor: '#23C878' },
  talkWhiteLine: { width: 14, height: 4, borderRadius: 4, backgroundColor: '#23C878', marginLeft: 8 },
  talkFace: { width: 68, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  talkEyeLeft: { position: 'absolute', left: 22, top: 24, width: 7, height: 7, borderRadius: 4, backgroundColor: '#25105C' },
  talkEyeRight: { position: 'absolute', right: 22, top: 24, width: 7, height: 7, borderRadius: 4, backgroundColor: '#25105C' },
  talkSmile: { position: 'absolute', bottom: 18, width: 24, height: 12, borderBottomWidth: 3, borderBottomColor: '#25105C', borderRadius: 12 },
  chatBubble: { position: 'absolute', right: -10, top: 5, width: 26, height: 20, borderRadius: 10, backgroundColor: '#FFD60A' },
  talkWaterBig: { position: 'absolute', left: 14, bottom: 18, width: 88, height: 88 },
  talkVoiceBig: { position: 'absolute', left: 18, top: 16, width: 54, height: 54 },
  flatDressArt: { width: 74, height: 72, alignItems: 'center', justifyContent: 'center' },
  dressTop: { width: 32, height: 26, borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: '#FFD60A', marginBottom: -1 },
  dressSkirt: { width: 0, height: 0, borderLeftWidth: 34, borderRightWidth: 34, borderBottomWidth: 46, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FF4FD8' },
  bookArt: { width: 74, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  bookLeft: { width: 32, height: 48, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, backgroundColor: '#FFFFFF' },
  bookRight: { width: 32, height: 48, borderTopRightRadius: 12, borderBottomRightRadius: 12, backgroundColor: '#FFD60A' },
  bookDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF4FD8' },
  gameArt: { width: 76, height: 64, alignItems: 'center', justifyContent: 'center' },
  gameDot: { position: 'absolute', width: 36, height: 36, borderRadius: 18 },
});
