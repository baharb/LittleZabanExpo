import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { neliWorldAssets, roomBackgroundPickers } from '../../assets/neliWorldAssets';
import { AppContext, Lang } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useLandscapeDimensions } from '../../hooks/useLandscapeDimensions';
import BlinkingNeliImage from '../../components/BlinkingNeliImage';
import TopBar from '../../components/TopBar';
import { C } from '../../theme/colors';
import { dir, ff } from '../../theme/fonts';

type Choice = {
  id: string;
  fa: string;
  en: string;
  es: string;
  fr: string;
  kind: 'water' | 'bread' | 'book' | 'hat' | 'shoe' | 'apple' | 'fish' | 'moon' | 'bed' | 'sabzeh';
  color: string;
};

type Scene = {
  id: string;
  place: 'home' | 'rain' | 'table' | 'night' | 'nowruz';
  character: string;
  color: string;
  promptFa: string;
  promptEn: string;
  promptEs: string;
  promptFr: string;
  helperFa: string;
  helperEn: string;
  helperEs: string;
  helperFr: string;
  answer: string;
  choices: Choice[];
};

const SCENES: Scene[] = [
  {
    id: 'thirsty',
    place: 'home',
    character: 'نلی',
    color: '#6C4EFF',
    promptFa: 'سلام! من تشنه‌ام. لطفا آب بده.',
    promptEn: 'Hi! I am thirsty. Please give water.',
    promptEs: 'Hola. Tengo sed. Dame agua, por favor.',
    promptFr: "Salut. J'ai soif. Donne de l'eau, s'il te plait.",
    helperFa: 'کدام یکی آب است؟',
    helperEn: 'Which one is water?',
    helperEs: 'Cual es agua?',
    helperFr: "Lequel est l'eau?",
    answer: 'water',
    choices: [
      { id: 'water', fa: 'آب', en: 'Water', es: 'Agua', fr: 'Eau', kind: 'water', color: '#38BDF8' },
      { id: 'bread', fa: 'نان', en: 'Bread', es: 'Pan', fr: 'Pain', kind: 'bread', color: '#D97706' },
      { id: 'book', fa: 'کتاب', en: 'Book', es: 'Libro', fr: 'Livre', kind: 'book', color: '#EC4899' },
    ],
  },
  {
    id: 'cold',
    place: 'rain',
    character: 'دارا',
    color: '#38BDF8',
    promptFa: 'هوا سرد است. من کلاه می‌خواهم.',
    promptEn: 'It is cold. I want a hat.',
    promptEs: 'Hace frio. Quiero un gorro.',
    promptFr: 'Il fait froid. Je veux un bonnet.',
    helperFa: 'کلاه را پیدا کن.',
    helperEn: 'Find the hat.',
    helperEs: 'Busca el gorro.',
    helperFr: 'Trouve le bonnet.',
    answer: 'hat',
    choices: [
      { id: 'shoe', fa: 'کفش', en: 'Shoe', es: 'Zapato', fr: 'Chaussure', kind: 'shoe', color: '#7C2D12' },
      { id: 'hat', fa: 'کلاه', en: 'Hat', es: 'Gorro', fr: 'Bonnet', kind: 'hat', color: '#A855F7' },
      { id: 'apple', fa: 'سیب', en: 'Apple', es: 'Manzana', fr: 'Pomme', kind: 'apple', color: '#EF4444' },
    ],
  },
  {
    id: 'hungry',
    place: 'table',
    character: 'شیرین',
    color: '#EC4899',
    promptFa: 'من گرسنه‌ام. سیب می‌خواهم.',
    promptEn: 'I am hungry. I want an apple.',
    promptEs: 'Tengo hambre. Quiero una manzana.',
    promptFr: "J'ai faim. Je veux une pomme.",
    helperFa: 'سیب کجاست؟',
    helperEn: 'Where is the apple?',
    helperEs: 'Donde esta la manzana?',
    helperFr: 'Ou est la pomme?',
    answer: 'apple',
    choices: [
      { id: 'apple', fa: 'سیب', en: 'Apple', es: 'Manzana', fr: 'Pomme', kind: 'apple', color: '#EF4444' },
      { id: 'fish', fa: 'ماهی', en: 'Fish', es: 'Pez', fr: 'Poisson', kind: 'fish', color: '#38BDF8' },
      { id: 'moon', fa: 'ماه', en: 'Moon', es: 'Luna', fr: 'Lune', kind: 'moon', color: '#A78BFA' },
    ],
  },
  {
    id: 'sleepy',
    place: 'night',
    character: 'لونا',
    color: '#A855F7',
    promptFa: 'شب شد. من خوابم می‌آید.',
    promptEn: 'It is night. I am sleepy.',
    promptEs: 'Es de noche. Tengo sueño.',
    promptFr: "C'est la nuit. J'ai sommeil.",
    helperFa: 'برای خواب چه می‌خواهیم؟',
    helperEn: 'What do we need for sleep?',
    helperEs: 'Que necesitamos para dormir?',
    helperFr: 'De quoi avons-nous besoin pour dormir?',
    answer: 'bed',
    choices: [
      { id: 'book', fa: 'کتاب', en: 'Book', es: 'Libro', fr: 'Livre', kind: 'book', color: '#EC4899' },
      { id: 'bed', fa: 'تخت', en: 'Bed', es: 'Cama', fr: 'Lit', kind: 'bed', color: '#6C4EFF' },
      { id: 'fish', fa: 'ماهی', en: 'Fish', es: 'Pez', fr: 'Poisson', kind: 'fish', color: '#38BDF8' },
    ],
  },
  {
    id: 'nowruz',
    place: 'nowruz',
    character: 'گلناز',
    color: '#22C55E',
    promptFa: 'نوروز مبارک! سبزه را روی سفره بگذار.',
    promptEn: 'Happy Nowruz! Put sabzeh on the table.',
    promptEs: 'Feliz Nowruz. Pon el sabzeh en la mesa.',
    promptFr: 'Joyeux Nowruz. Mets le sabzeh sur la table.',
    helperFa: 'سبزه کدام است؟',
    helperEn: 'Which one is sabzeh?',
    helperEs: 'Cual es sabzeh?',
    helperFr: 'Lequel est le sabzeh?',
    answer: 'sabzeh',
    choices: [
      { id: 'sabzeh', fa: 'سبزه', en: 'Sabzeh', es: 'Sabzeh', fr: 'Sabzeh', kind: 'sabzeh', color: '#22C55E' },
      { id: 'hat', fa: 'کلاه', en: 'Hat', es: 'Gorro', fr: 'Bonnet', kind: 'hat', color: '#A855F7' },
      { id: 'moon', fa: 'ماه', en: 'Moon', es: 'Luna', fr: 'Lune', kind: 'moon', color: '#A78BFA' },
    ],
  },
];

function promptFor(scene: Scene, lang: Lang) {
  if (lang === 'fa' || lang === 'ar') return scene.promptFa;
  if (lang === 'es') return scene.promptEs;
  if (lang === 'fr') return scene.promptFr;
  return scene.promptEn;
}

function choiceLabel(choice: Choice, lang: Lang) {
  if (lang === 'fa' || lang === 'ar') return choice.fa;
  if (lang === 'es') return choice.es;
  if (lang === 'fr') return choice.fr;
  return choice.en;
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

const CHOICE_IMAGES: Partial<Record<Choice['kind'], any>> = {
  apple: neliWorldAssets.foods.apple,
  bread: neliWorldAssets.foods.bread,
  book: neliWorldAssets.ui.book,
  fish: neliWorldAssets.foods.fish,
  hat: neliWorldAssets.clothes.beanie,
  shoe: neliWorldAssets.clothes.boots,
  water: neliWorldAssets.foods.water,
};

function NeliTalkCharacter({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size * 1.18, alignItems: 'center', justifyContent: 'center' }}>
      <BlinkingNeliImage size={size} height={size * 1.18} preview />
    </View>
  );
}

function ChoiceArt({ choice, size = 92 }: { choice: Choice; size?: number }) {
  const asset = CHOICE_IMAGES[choice.kind];
  if (asset) return <Image source={asset} style={[styles.choiceImage, { width: size, height: size }]} resizeMode="contain" />;
  const color = choice.color;
  const scaled = { transform: [{ scale: size / 70 }] };
  if (choice.kind === 'water') return <View style={[styles.waterDrop, { backgroundColor: color }, scaled]} />;
  if (choice.kind === 'bread') return <View style={[styles.bread, { backgroundColor: color }, scaled]} />;
  if (choice.kind === 'book') return <View style={[styles.book, { backgroundColor: color }, scaled]}><View style={styles.bookPage} /></View>;
  if (choice.kind === 'hat') return <View style={[styles.artMini, { width: size, height: size }]}><View style={[styles.hatTop, { backgroundColor: color }, scaled]} /><View style={[styles.hatBrim, { backgroundColor: color }, scaled]} /></View>;
  if (choice.kind === 'shoe') return <View style={[styles.shoe, { backgroundColor: color }, scaled]} />;
  if (choice.kind === 'apple') return <View style={[styles.artMini, { width: size, height: size }]}><View style={[styles.apple, { backgroundColor: color }, scaled]} /><View style={[styles.appleLeaf, scaled]} /></View>;
  if (choice.kind === 'fish') return <View style={[styles.artMini, { width: size, height: size }]}><View style={[styles.fishBody, { backgroundColor: color }, scaled]} /><View style={[styles.fishTail, { borderLeftColor: '#0EA5E9' }, scaled]} /></View>;
  if (choice.kind === 'moon') return <View style={[styles.moonChoice, { backgroundColor: color, width: size * 0.72, height: size * 0.72, borderRadius: size * 0.36 }]} />;
  if (choice.kind === 'bed') return <View style={[styles.artMini, { width: size, height: size }]}><View style={[styles.bed, { backgroundColor: color }, scaled]} /><View style={[styles.pillow, scaled]} /></View>;
  return <View style={[styles.artMini, { width: size, height: size }]}><View style={[styles.sabzehCup, { backgroundColor: color }, scaled]} /><View style={[styles.sabzehLeafA, scaled]} /><View style={[styles.sabzehLeafB, scaled]} /></View>;
}

export default function ConversationGame() {
  const { lang, addStars } = useContext(AppContext);
  const { navigate } = useNav();
  const { speakFarsiOnly, speakInLang, stop } = useSpeech();
  const { width, height } = useLandscapeDimensions();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const slide = useRef(new Animated.Value(18)).current;

  const scene = SCENES[idx];
  const isFa = lang === 'fa' || lang === 'ar';
  const isLandscape = width > height;
  const backgroundSource = roomBackgroundPickers.talkPlay(width, height);
  const avatarSize = Math.min(Math.max(width * 0.26, 250), isLandscape ? 360 : 320);
  const choices = useMemo(() => shuffle(scene.choices), [scene.id]);
  const choiceCardWidth = useMemo(() => {
    const labels = choices.map(choice => choiceLabel(choice, lang));
    const widestChars = labels.reduce((max, label) => Math.max(max, label.length), 0);
    const estimatedTextWidth = widestChars * (isFa ? 18 : 17);
    return Math.min(Math.max(estimatedTextWidth + 176, 320), 460);
  }, [choices, lang, isFa]);

  const speakScene = () => {
    stop();
    speakFarsiOnly(scene.promptFa, () => {
      if (!isFa) {
        setTimeout(() => speakInLang(promptFor(scene, lang), lang), 260);
      }
    });
  };

  useEffect(() => {
    setSelected(null);
    slide.setValue(18);
    Animated.timing(slide, { toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    const t = setTimeout(speakScene, 320);
    return () => {
      clearTimeout(t);
      stop();
    };
  }, [idx, lang]);

  const choose = (choice: Choice) => {
    if (selected) return;
    setSelected(choice.id);
    const ok = choice.id === scene.answer;
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addStars(2);
      setCorrectCount(prev => prev + 1);
      speakFarsiOnly(choice.fa, () => {
        setTimeout(() => {
          if (idx < SCENES.length - 1) setIdx(prev => prev + 1);
          else setDone(true);
        }, 500);
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      speakInLang(isFa ? 'دوباره تلاش کن' : 'Try again', isFa ? 'fa' : lang, () => {
        setTimeout(() => setSelected(null), 300);
      });
    }
  };

  if (done) {
    return (
      <View style={styles.root}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#35217E' }]} />
        <TopBar title="Talk & Play" titleFa="گفت‌وگو و بازی" showBack dark topInset={10} />
        <View style={styles.finishWrap}>
          <View style={styles.finishBadge}>
            <Image source={neliWorldAssets.ui.ok} style={styles.finishIcon} resizeMode="contain" />
          </View>
          <Text style={[styles.finishTitle, { fontFamily: ff(lang, 'black') }, dir(lang)]}>
            {isFa ? 'گفت‌وگو کامل شد!' : 'Great talking!'}
          </Text>
          <Text style={[styles.finishSub, { fontFamily: ff(lang, 'regular') }, dir(lang)]}>
            {isFa ? `${correctCount} پاسخ درست` : `${correctCount} correct answers`}
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              setIdx(0);
              setCorrectCount(0);
              setDone(false);
            }}
          >
            <Text style={[styles.primaryBtnTxt, { fontFamily: ff(lang, 'black') }]}>
              {isFa ? 'دوباره بازی کن' : 'Play again'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigate({ name: 'InteractiveGames' })}>
            <Text style={[styles.secondaryBtnTxt, { fontFamily: ff(lang, 'bold') }]}>
              {isFa ? 'بازی‌های دیگر' : 'More games'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TopBar title="Talk & Play" titleFa="گفت‌وگو و بازی" showBack dark topInset={10} />
      <View style={styles.sceneBackground}>
        <ImageBackground source={backgroundSource} style={styles.sceneBackdrop} resizeMode="cover">
          <View style={styles.sceneWash} />
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={[styles.sceneLayout, isLandscape ? styles.sceneLayoutLandscape : styles.sceneLayoutPortrait]}>
              <TouchableOpacity style={styles.scenePrompt} onPress={speakScene} activeOpacity={0.88}>
                <Image source={neliWorldAssets.ui.voice} style={styles.speechIcon} resizeMode="contain" />
                <Text style={[styles.promptBubbleText, { fontFamily: ff(lang === 'fa' || lang === 'ar' ? 'fa' : lang, 'black') }, dir(lang)]}>
                  {promptFor(scene, lang)}
                </Text>
              </TouchableOpacity>

              <Animated.View style={[styles.leftColumn, { transform: [{ translateY: slide }] }]}>
                <View style={styles.choiceStack}>
                  {choices.map(choice => {
                    const isPicked = selected === choice.id;
                    const showCorrect = !!selected && choice.id === scene.answer;
                    const showWrong = isPicked && choice.id !== scene.answer;
                      return (
                        <TouchableOpacity
                          key={choice.id}
                          style={[
                            styles.choiceCard,
                            { width: choiceCardWidth },
                            showCorrect && styles.choiceCardCorrect,
                            showWrong && styles.choiceCardWrong,
                          ]}
                        onPress={() => choose(choice)}
                        activeOpacity={0.9}
                      >
                        <View style={styles.choiceArtWrap}>
                          <ChoiceArt choice={choice} size={isLandscape ? 94 : 84} />
                        </View>
                        <View style={styles.choiceTextWrap}>
                          <Text style={[styles.choiceLabel, { fontFamily: ff(lang, 'black') }, dir(lang)]} numberOfLines={1}>
                            {choiceLabel(choice, lang)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>

              <View style={styles.rightColumn}>
                <View style={styles.characterStage}>
                  <NeliTalkCharacter size={avatarSize} />
                </View>
              </View>
            </View>
            <View style={styles.progressRow}>
              {SCENES.map((s, i) => (
                <View key={s.id} style={[styles.stepDot, i <= idx && { backgroundColor: C.yellow }, i === idx && styles.stepDotActive]} />
              ))}
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#AEEBFF' },
  sceneBackground: { flex: 1, overflow: 'hidden' },
  sceneBackdrop: { flex: 1 },
  sceneWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(41, 20, 77, 0.14)' },
  scroll: { flexGrow: 1, paddingLeft: 4, paddingRight: 14, paddingTop: 10, paddingBottom: 20 },
  sceneLayout: { flex: 1, gap: 16, position: 'relative' },
  sceneLayoutLandscape: { flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' },
  sceneLayoutPortrait: { flexDirection: 'column' },
  scenePrompt: {
    position: 'absolute',
    top: 6,
    alignSelf: 'center',
    width: '92%',
    maxWidth: 520,
    zIndex: 25,
    minHeight: 54,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.52)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  leftColumn: {
    flex: 1.08,
    paddingVertical: 8,
    paddingLeft: 40.8,
    paddingRight: 8,
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightColumn: { flex: 0.92, alignItems: 'center', justifyContent: 'center', paddingRight: 16 },
  characterStage: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
    minHeight: 320,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 6, marginBottom: 10, width: '100%' },
  stepDot: { width: 34, height: 10, borderRadius: 7, backgroundColor: 'rgba(37,16,92,0.22)' },
  stepDotActive: { width: 50 },
  speechIcon: { width: 43, height: 43 },
  promptBubbleText: { color: C.textDark, fontSize: 20, lineHeight: 28, flex: 1, textAlign: 'center' },
  choiceStack: { gap: 10, alignItems: 'flex-start', width: '100%', maxWidth: 460, alignSelf: 'flex-start', paddingLeft: 40.8 },
  choiceCard: {
    height: 96,
    width: '100%',
    maxWidth: 460,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.80)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  choiceCardCorrect: { backgroundColor: 'rgba(240, 255, 244, 0.98)' },
  choiceCardWrong: { backgroundColor: 'rgba(255, 241, 242, 0.98)' },
  choiceArtWrap: { width: 102, alignItems: 'center', justifyContent: 'center' },
  choiceTextWrap: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  choiceLabel: { color: C.textDark, fontSize: 18, lineHeight: 24, textAlign: 'right', flexShrink: 1, paddingHorizontal: 10 },
  choiceImage: { width: 92, height: 92 },
  artMini: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center' },
  waterDrop: { width: 42, height: 58, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderBottomLeftRadius: 28, transform: [{ rotate: '45deg' }] },
  bread: { width: 62, height: 46, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  book: { width: 58, height: 66, borderRadius: 10, padding: 7 },
  bookPage: { flex: 1, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.78)' },
  hatTop: { width: 46, height: 38, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  hatBrim: { width: 70, height: 14, borderRadius: 7, marginTop: -2 },
  shoe: { width: 68, height: 34, borderTopLeftRadius: 20, borderBottomLeftRadius: 13, borderBottomRightRadius: 17, marginTop: 24 },
  apple: { width: 52, height: 52, borderRadius: 26 },
  appleLeaf: { position: 'absolute', top: 5, right: 16, width: 20, height: 12, borderRadius: 10, backgroundColor: '#22C55E', transform: [{ rotate: '-25deg' }] },
  fishBody: { width: 54, height: 34, borderRadius: 20 },
  fishTail: {
    position: 'absolute',
    right: 6,
    width: 0,
    height: 0,
    borderTopWidth: 18,
    borderBottomWidth: 18,
    borderLeftWidth: 22,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  moonChoice: { width: 56, height: 56, borderRadius: 28 },
  bed: { width: 70, height: 40, borderRadius: 13 },
  pillow: { position: 'absolute', left: 8, top: 16, width: 22, height: 17, borderRadius: 8, backgroundColor: '#FFFFFF' },
  sabzehCup: { position: 'absolute', bottom: 4, width: 52, height: 34, borderRadius: 12 },
  sabzehLeafA: { position: 'absolute', top: 10, width: 12, height: 42, borderRadius: 8, backgroundColor: '#16A34A', transform: [{ rotate: '-18deg' }] },
  sabzehLeafB: { position: 'absolute', top: 6, width: 12, height: 46, borderRadius: 8, backgroundColor: '#15803D', transform: [{ rotate: '20deg' }] },
  finishWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  finishBadge: { width: 155, height: 155, borderRadius: 78, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  finishIcon: { width: 140, height: 140 },
  finishTitle: { color: '#FFFFFF', fontSize: 29, lineHeight: 38, marginTop: 24, textAlign: 'center' },
  finishSub: { color: 'rgba(255,255,255,0.86)', fontSize: 16, marginTop: 8, textAlign: 'center' },
  primaryBtn: { width: '100%', height: 58, borderRadius: 29, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', marginTop: 28 },
  primaryBtnTxt: { color: C.textDark, fontSize: 17 },
  secondaryBtn: { width: '100%', height: 54, borderRadius: 27, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  secondaryBtnTxt: { color: '#FFFFFF', fontSize: 15 },
});
