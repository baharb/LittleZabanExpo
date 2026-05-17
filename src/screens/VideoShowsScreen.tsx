import React, { useContext, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppContext } from '../store/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import TopBar from '../components/TopBar';
import CharacterAvatar from '../components/CharacterAvatar';
import { characterAssets } from '../assets/characterAssets';
import { C } from '../theme/colors';
import { dir, ff } from '../theme/fonts';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { useResponsive } from '../theme/responsive';

type SceneKind = 'wake' | 'brush' | 'breakfast' | 'play' | 'sleep' | 'haftsin' | 'family' | 'jungle' | 'sea';
type Show = {
  id: string;
  fa: string;
  en: string;
  color: string;
  accent: string;
  scenes: { kind: SceneKind; fa: string; en: string }[];
};

const SHOWS: Show[] = [
  {
    id: 'neli-day',
    fa: 'روز نلی',
    en: "Neli's Day",
    color: '#6C4EFF',
    accent: '#FACC15',
    scenes: [
      { kind: 'wake', fa: 'نلی صبح از خواب بیدار شد.', en: 'Neli woke up in the morning.' },
      { kind: 'brush', fa: 'او دندان‌هایش را مسواک زد.', en: 'She brushed her teeth.' },
      { kind: 'breakfast', fa: 'نلی صبحانه خورد.', en: 'Neli had breakfast.' },
      { kind: 'play', fa: 'او با دوست‌هایش بازی کرد.', en: 'She played with friends.' },
      { kind: 'sleep', fa: 'شب شد و نلی خوابید.', en: 'At night, Neli went to sleep.' },
    ],
  },
  {
    id: 'nowruz',
    fa: 'جشن نوروز',
    en: 'Nowruz Celebration',
    color: '#22C55E',
    accent: '#EC4899',
    scenes: [
      { kind: 'haftsin', fa: 'نوروز جشن سال نوی ایرانی است.', en: 'Nowruz is the Persian new year.' },
      { kind: 'wake', fa: 'خانه را تمیز و روشن می‌کنیم.', en: 'We make the home clean and bright.' },
      { kind: 'haftsin', fa: 'سفره هفت‌سین را می‌چینیم.', en: 'We set up the Haft-Sin table.' },
      { kind: 'family', fa: 'به دیدن خانواده می‌رویم.', en: 'We visit family.' },
      { kind: 'play', fa: 'همه با هم شادی می‌کنیم.', en: 'Everyone celebrates together.' },
    ],
  },
  {
    id: 'animals',
    fa: 'دنیای حیوانات',
    en: 'Animal World',
    color: '#FB923C',
    accent: '#38BDF8',
    scenes: [
      { kind: 'jungle', fa: 'شیر در جنگل زندگی می‌کند.', en: 'The lion lives in the jungle.' },
      { kind: 'sea', fa: 'دلفین در آب شنا می‌کند.', en: 'The dolphin swims in the water.' },
      { kind: 'play', fa: 'پرنده‌ها آواز می‌خوانند.', en: 'Birds sing songs.' },
      { kind: 'family', fa: 'حیوانات هم خانواده دارند.', en: 'Animals have families too.' },
      { kind: 'jungle', fa: 'با طبیعت مهربان باشیم.', en: 'Let us be kind to nature.' },
    ],
  },
];

function ShowArt({ kind, color, accent, characterId }: { kind: SceneKind; color: string; accent: string; characterId: string }) {
  if (kind === 'wake' || kind === 'sleep') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.bedroom} style={styles.scene} imageStyle={styles.sceneImage}>
        {kind === 'sleep' ? <View style={styles.nightWash} /> : null}
        <CharacterAvatar characterId={characterId} size={122} />
      </ImageBackground>
    );
  }
    if (kind === 'brush') {
      return (
        <ImageBackground source={neliWorldAssets.rooms.brushTeethBathroom} style={styles.scene} imageStyle={styles.sceneImage}>
          <Image source={characterAssets.lila.poses.bigSmile} style={styles.showGiraffe} resizeMode="contain" />
          <Image source={neliWorldAssets.bathroom.toothbrush} style={styles.showSmall} resizeMode="contain" />
        </ImageBackground>
      );
    }
  if (kind === 'breakfast') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.cookingTable} style={styles.scene} imageStyle={styles.sceneImage}>
        <Image source={neliWorldAssets.foods.egg} style={styles.showFood} resizeMode="contain" />
        <Image source={neliWorldAssets.kitchen.plate} style={styles.showPlate} resizeMode="contain" />
      </ImageBackground>
    );
  }
  if (kind === 'haftsin') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.garden} style={styles.scene} imageStyle={styles.sceneImage}>
        <Image source={neliWorldAssets.persianFoods.sabziPolo} style={styles.showFood} resizeMode="contain" />
        <Image source={neliWorldAssets.foods.apple} style={styles.showSmall} resizeMode="contain" />
      </ImageBackground>
    );
  }
  if (kind === 'family' || kind === 'play') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.garden} style={styles.scene} imageStyle={styles.sceneImage}>
        <CharacterAvatar characterId={characterId} size={122} />
        <Image source={neliWorldAssets.animals.rabbit} style={styles.showSmall} resizeMode="contain" />
      </ImageBackground>
    );
  }
  if (kind === 'jungle') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.feedAnimalsJungle} style={styles.scene} imageStyle={styles.sceneImage}>
        <Image source={neliWorldAssets.animals.elephant} style={styles.showGiraffe} resizeMode="contain" />
      </ImageBackground>
    );
  }
  if (kind === 'sea') {
    return (
      <View style={[styles.scene, { backgroundColor: '#8EEBFF' }]}>
        <Image source={neliWorldAssets.foods.fish} style={styles.showFood} resizeMode="contain" />
        <Image source={neliWorldAssets.foods.water} style={styles.showSmall} resizeMode="contain" />
      </View>
    );
  }
  if (kind === 'wake') {
    return (
      <View style={styles.scene}>
        <View style={[styles.sun, { backgroundColor: accent }]} />
        <View style={[styles.bed, { backgroundColor: color }]} />
        <View style={styles.pillow} />
        <Character color={color} small />
      </View>
    );
  }
  if (kind === 'brush') {
    return (
      <View style={styles.scene}>
        <Character color={color} />
        <View style={styles.tooth} />
        <View style={[styles.brush, { backgroundColor: accent }]} />
      </View>
    );
  }
  if (kind === 'breakfast') {
    return (
      <View style={styles.scene}>
        <View style={[styles.table, { backgroundColor: color }]} />
        <View style={styles.plate} />
        <View style={[styles.food, { backgroundColor: accent }]} />
      </View>
    );
  }
  if (kind === 'sleep') {
    return (
      <View style={[styles.scene, { backgroundColor: '#33205F' }]}>
        <View style={[styles.moon, { backgroundColor: accent }]} />
        {[0, 1, 2, 3].map(i => <View key={i} style={[styles.star, { left: 54 + i * 46, top: 40 + (i % 2) * 38 }]} />)}
        <View style={[styles.bed, { backgroundColor: color }]} />
      </View>
    );
  }
  if (kind === 'haftsin') {
    return (
      <View style={styles.scene}>
        <View style={[styles.table, { backgroundColor: accent }]} />
        <View style={[styles.sabzeh, { backgroundColor: color }]} />
        <View style={[styles.egg, { backgroundColor: '#EC4899', left: 74 }]} />
        <View style={[styles.egg, { backgroundColor: '#38BDF8', right: 74 }]} />
      </View>
    );
  }
  if (kind === 'family') {
    return (
      <View style={styles.scene}>
        <Character color={color} />
        <Character color={accent} small />
        <View style={[styles.heart, { backgroundColor: '#FF80C0' }]} />
      </View>
    );
  }
  if (kind === 'jungle') {
    return (
      <View style={styles.scene}>
        <View style={styles.grass} />
        <View style={[styles.animalHead, { backgroundColor: color }]} />
        <View style={[styles.tree, { backgroundColor: '#22C55E', left: 42 }]} />
        <View style={[styles.tree, { backgroundColor: '#16A34A', right: 42 }]} />
      </View>
    );
  }
  if (kind === 'sea') {
    return (
      <View style={styles.scene}>
        <View style={[styles.wave, { backgroundColor: color }]} />
        <View style={[styles.fishBody, { backgroundColor: accent }]} />
        <View style={[styles.fishTail, { borderLeftColor: '#0EA5E9' }]} />
      </View>
    );
  }
  return (
    <View style={styles.scene}>
      <Character color={color} />
      <View style={[styles.ball, { backgroundColor: accent }]} />
    </View>
  );
}

function Character({ color, small = false }: { color: string; small?: boolean }) {
  const size = small ? 78 : 118;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[styles.charHair, { width: size * 0.84, height: size * 0.35 }]} />
      <View style={[styles.charFace, { width: size * 0.8, height: size * 0.74, borderRadius: size * 0.36, backgroundColor: color }]}>
        <View style={[styles.eyeLeft, { left: size * 0.24, top: size * 0.28 }]} />
        <View style={[styles.eyeRight, { right: size * 0.24, top: size * 0.28 }]} />
        <View style={[styles.smile, { bottom: size * 0.2 }]} />
      </View>
    </View>
  );
}

export default function VideoShowsScreen() {
  const { lang, selectedCharacterId } = useContext(AppContext);
  const { speakFarsiOnly, speakInLang, stop } = useSpeech();
  const { width, height } = useWindowDimensions();
  const responsive = useResponsive();
  const [showIdx, setShowIdx] = useState<number | null>(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const slide = useRef(new Animated.Value(0)).current;
  const isFa = lang === 'fa' || lang === 'ar';
  const show = showIdx !== null ? SHOWS[showIdx] : null;
  const scene = show?.scenes[sceneIdx];
  const scale = Math.min(width / 390, height / 844);
  const sceneWidth = Math.min(width * 0.92, Math.max(330, 390 * scale));
  const gap = 12;
  const minCardWidth = 220;
  const columns = Math.max(2, Math.min(3, Math.floor((responsive.contentWidth - responsive.horizontalPadding * 2 + gap) / (minCardWidth + gap))));
  const cardW = (responsive.contentWidth - responsive.horizontalPadding * 2 - gap * (columns - 1)) / columns;
  const characterId = selectedCharacterId;

  const speakScene = (s: Show['scenes'][number]) => {
    stop();
    speakFarsiOnly(s.fa, () => {
      if (!isFa) setTimeout(() => speakInLang(s.en, lang), 250);
    });
  };

  const animateIn = () => {
    slide.setValue(28);
    Animated.spring(slide, { toValue: 0, tension: 90, friction: 9, useNativeDriver: true }).start();
  };

  const openShow = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowIdx(index);
    setSceneIdx(0);
    setTimeout(() => {
      animateIn();
      speakScene(SHOWS[index].scenes[0]);
    }, 200);
  };

  const goScene = (next: number) => {
    if (!show || next < 0 || next >= show.scenes.length) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSceneIdx(next);
    animateIn();
    speakScene(show.scenes[next]);
  };

  if (!show) {
    return (
      <View style={styles.root}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#35217E' }]} />
        <TopBar title="Video Stories" titleFa="قصه تصویری" showBack dark />
        <ScrollView contentContainerStyle={[styles.grid, { paddingHorizontal: responsive.horizontalPadding }]} showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, { padding: Math.max(16, Math.round(20 * scale)) }]}>
            <Text style={[styles.kicker, { fontFamily: ff(lang, 'bold') }, dir(lang)]}>
              {isFa ? 'نمایش‌های کوتاه' : 'Short visual stories'}
            </Text>
            <Text style={[styles.title, { fontFamily: ff(lang, 'black') }, dir(lang)]}>
              {isFa ? 'یک نمایش انتخاب کن' : 'Pick a show'}
            </Text>
          </View>
          {SHOWS.map((s, i) => (
            <TouchableOpacity key={s.id} style={[styles.showCard, { width: cardW }]} onPress={() => openShow(i)} activeOpacity={0.88}>
              <View style={[styles.thumb, { backgroundColor: s.color + '22' }]}>
                <ShowArt kind={s.scenes[0].kind} color={s.color} accent={s.accent} characterId={selectedCharacterId} />
              </View>
              <Text style={[styles.showFa, { fontFamily: ff('fa', 'black') }]}>{s.fa}</Text>
              <Text style={styles.showEn}>{s.en}</Text>
              <View style={[styles.playBadge, { backgroundColor: s.color }]}>
                <Text style={styles.playBadgeText}>{isFa ? `${s.scenes.length} صحنه` : `${s.scenes.length} scenes`}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: show.color }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#35217E' }]} />
      <TopBar title={show.en} titleFa={show.fa} showBack dark onBack={() => { stop(); setShowIdx(null); }} />
      <View style={styles.dotsRow}>
        {show.scenes.map((_, i) => <View key={i} style={[styles.dot, i === sceneIdx && styles.dotOn]} />)}
      </View>
      <Animated.View style={[styles.sceneWrap, { width: sceneWidth, transform: [{ translateY: slide }] }]}>
        {scene ? <ShowArt kind={scene.kind} color={show.color} accent={show.accent} characterId={selectedCharacterId} /> : null}
      </Animated.View>
      {scene ? (
        <View style={styles.textCard}>
          <Text style={[styles.sceneFa, { fontFamily: ff('fa', 'black') }]}>{scene.fa}</Text>
          {!isFa ? <Text style={styles.sceneEn}>{scene.en}</Text> : null}
        </View>
      ) : null}
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.ctrlBtn, sceneIdx === 0 && styles.off]} disabled={sceneIdx === 0} onPress={() => goScene(sceneIdx - 1)}>
          <Text style={styles.ctrlText}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listenBtn, { backgroundColor: show.accent }]} onPress={() => scene && speakScene(scene)}>
          <Text style={styles.listenText}>{isFa ? 'بشنو' : 'Listen'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctrlBtn, sceneIdx === show.scenes.length - 1 && styles.off]} disabled={sceneIdx === show.scenes.length - 1} onPress={() => goScene(sceneIdx + 1)}>
          <Text style={styles.ctrlText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#35217E' },
  grid: { paddingBottom: 34, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  hero: { width: '100%', borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.94)', padding: 20 },
  kicker: { color: C.purple, fontSize: 13, marginBottom: 7 },
  title: { color: C.textDark, fontSize: 30, lineHeight: 38 },
  showCard: { borderRadius: 28, backgroundColor: '#FFFFFF', padding: 12, alignItems: 'center' },
  thumb: { width: '100%', height: 128, borderRadius: 24, overflow: 'hidden', marginBottom: 10 },
  showFa: { color: C.textDark, fontSize: 17, textAlign: 'center' },
  showEn: { fontFamily: ff('fa', 'bold'), color: C.textMid, fontSize: 12, textAlign: 'center', marginTop: 2 },
  playBadge: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, marginTop: 10 },
  playBadgeText: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 11 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 12 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotOn: { width: 34, backgroundColor: C.yellow },
  sceneWrap: { alignSelf: 'center', borderRadius: 30, overflow: 'hidden' },
  textCard: { borderRadius: 28, backgroundColor: '#FFFFFF', margin: 16, padding: 18 },
  sceneFa: { color: C.textDark, fontSize: 22, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  sceneEn: { fontFamily: ff('fa', 'bold'), color: C.textMid, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 16 },
  ctrlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  off: { opacity: 0.35 },
  ctrlText: { fontFamily: ff('fa', 'black'), color: C.purpleDeep, fontSize: 24 },
  listenBtn: { height: 56, borderRadius: 28, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  listenText: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 15 },
  scene: { width: '100%', height: 230, borderRadius: 28, backgroundColor: '#E9F7FF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sceneImage: { width: '100%', height: '100%' },
  nightWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30,20,80,0.42)' },
  showNeli: { position: 'absolute', right: 52, bottom: -10, width: 132, height: 174 },
  showGiraffe: { position: 'absolute', right: 40, bottom: -8, width: 150, height: 190 },
  showSmall: { position: 'absolute', left: 44, bottom: 32, width: 86, height: 86 },
  showFood: { width: 150, height: 150 },
  showPlate: { position: 'absolute', right: 48, bottom: 26, width: 124, height: 96 },
  charHair: { position: 'absolute', top: 8, borderRadius: 34, backgroundColor: C.yellow },
  charFace: { borderWidth: 6, borderColor: '#FFFFFF' },
  eyeLeft: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: '#1B1238' },
  eyeRight: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: '#1B1238' },
  smile: { position: 'absolute', alignSelf: 'center', width: 30, height: 14, borderBottomWidth: 4, borderBottomColor: '#1B1238', borderRadius: 14 },
  sun: { position: 'absolute', top: 28, right: 36, width: 54, height: 54, borderRadius: 27 },
  bed: { position: 'absolute', bottom: 52, width: 160, height: 58, borderRadius: 18 },
  pillow: { position: 'absolute', bottom: 83, left: 90, width: 44, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF' },
  tooth: { position: 'absolute', right: 70, bottom: 70, width: 54, height: 64, borderRadius: 24, backgroundColor: '#FFFFFF' },
  brush: { position: 'absolute', right: 58, bottom: 76, width: 86, height: 14, borderRadius: 7, transform: [{ rotate: '-20deg' }] },
  table: { position: 'absolute', bottom: 58, width: 200, height: 24, borderRadius: 12 },
  plate: { width: 106, height: 76, borderRadius: 38, backgroundColor: '#FFFFFF' },
  food: { position: 'absolute', width: 50, height: 36, borderRadius: 18 },
  moon: { position: 'absolute', top: 36, right: 48, width: 54, height: 54, borderRadius: 27 },
  star: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' },
  sabzeh: { width: 72, height: 58, borderRadius: 20 },
  egg: { position: 'absolute', bottom: 78, width: 32, height: 43, borderRadius: 20 },
  heart: { position: 'absolute', top: 52, right: 72, width: 30, height: 30, borderRadius: 15 },
  grass: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 62, backgroundColor: '#B7F7C8' },
  animalHead: { width: 110, height: 100, borderRadius: 50 },
  tree: { position: 'absolute', bottom: 62, width: 46, height: 70, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  wave: { position: 'absolute', bottom: 42, width: 280, height: 64, borderRadius: 34, transform: [{ rotate: '-7deg' }] },
  fishBody: { width: 84, height: 50, borderRadius: 28 },
  fishTail: { position: 'absolute', right: 92, width: 0, height: 0, borderTopWidth: 26, borderBottomWidth: 26, borderLeftWidth: 34, borderTopColor: 'transparent', borderBottomColor: 'transparent' },
  ball: { position: 'absolute', bottom: 58, right: 70, width: 48, height: 48, borderRadius: 24 },
});
