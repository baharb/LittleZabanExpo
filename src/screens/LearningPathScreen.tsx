import React, { useContext } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import TopBar from '../components/TopBar';
import CharacterAvatar from '../components/CharacterAvatar';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';

type PathStep = {
  id: string;
  label: string;
  labelFa: string;
  type: 'section' | 'game' | 'tracing' | 'coloring' | 'video' | 'sel' | 'physical';
  stars: number;
  color: string;
  art: string;
};

const PATH: PathStep[] = [
  { id: 'alphabet', label: 'Letters', labelFa: 'حروف', type: 'section', stars: 10, color: '#5E8CFF', art: 'letters' },
  { id: 'numbers', label: 'Numbers', labelFa: 'اعداد', type: 'section', stars: 10, color: '#FFD166', art: 'numbers' },
  { id: 'colors', label: 'Colors', labelFa: 'رنگ ها', type: 'section', stars: 10, color: '#FF78A8', art: 'colors' },
  { id: 'tracing', label: 'Tracing', labelFa: 'تمرین حروف', type: 'tracing', stars: 15, color: '#7EF0C1', art: 'pencil' },
  { id: 'animals', label: 'Animals', labelFa: 'حیوانات', type: 'section', stars: 10, color: '#FFB86B', art: 'animal' },
  { id: 'family', label: 'Family', labelFa: 'خانواده', type: 'section', stars: 10, color: '#F06BA8', art: 'family' },
  { id: 'quiz', label: 'Word Quiz', labelFa: 'مسابقه', type: 'game', stars: 20, color: '#6ED7FF', art: 'quiz' },
  { id: 'food', label: 'Food', labelFa: 'غذا', type: 'section', stars: 10, color: '#FF9A3D', art: 'food' },
  { id: 'coloring', label: 'Coloring', labelFa: 'نقاشی', type: 'coloring', stars: 15, color: '#B88CFF', art: 'paint' },
  { id: 'memory', label: 'Memory', labelFa: 'حافظه', type: 'game', stars: 20, color: '#9B7CFF', art: 'memory' },
  { id: 'nowruz', label: 'Nowruz', labelFa: 'نوروز', type: 'section', stars: 15, color: '#72E0B8', art: 'culture' },
  { id: 'sel', label: 'Feelings', labelFa: 'احساسات', type: 'sel', stars: 15, color: '#FF78A8', art: 'heart' },
];

function StepArt({ type }: { type: string }) {
  const map: Record<string, any> = {
    letters: neliWorldAssets.ui.book,
    numbers: neliWorldAssets.ui.trophy,
    colors: neliWorldAssets.ui.paintbrush,
    pencil: neliWorldAssets.ui.paintbrush,
    animal: neliWorldAssets.animals.panda,
    family: neliWorldAssets.characters.neli,
    quiz: neliWorldAssets.ui.star,
    food: neliWorldAssets.foods.pasta,
    paint: neliWorldAssets.ui.paintbrush,
    memory: neliWorldAssets.ui.gamepad,
    culture: neliWorldAssets.persianFoods.sabziPolo,
    heart: neliWorldAssets.ui.heart,
    locked: neliWorldAssets.ui.lock,
  };
  const source = map[type] ?? neliWorldAssets.ui.star;

  if (type === 'animal') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.feedAnimalsJungle} style={styles.artStage} imageStyle={styles.artBg}>
        <Image source={source} style={styles.stepImageLarge} resizeMode="contain" />
      </ImageBackground>
    );
  }

  if (type === 'food' || type === 'culture') {
    return (
      <ImageBackground source={neliWorldAssets.rooms.kitchen} style={styles.artStage} imageStyle={styles.artBg}>
        <Image source={source} style={styles.stepImageLarge} resizeMode="contain" />
      </ImageBackground>
    );
  }

  return (
    <View style={styles.artStage}>
      <Image source={source} style={type === 'family' ? styles.stepNeli : styles.stepImage} resizeMode="contain" />
    </View>
  );
}

export default function LearningPathScreen() {
  const { lang, completedSections, stars, pathProgress, setPathProgress, selectedCharacterId } = useContext(AppContext);
  const { navigate } = useNav();
  const { width, height } = useWindowDimensions();
  const ui = Math.min(width / 390, height / 844);
  const isFa = lang === 'fa' || lang === 'ar';

  const handleStep = (step: PathStep, index: number) => {
    if (index > pathProgress + 1) return;
    if (index > pathProgress) setPathProgress(index);

    switch (step.type) {
      case 'section': navigate({ name: 'Section', id: step.id }); break;
      case 'game': navigate({ name: 'Game', gameId: step.id }); break;
      case 'tracing': navigate({ name: 'LetterTracing' }); break;
      case 'coloring': navigate({ name: 'Coloring' }); break;
      case 'video': navigate({ name: 'VideoShows' }); break;
      case 'sel': navigate({ name: 'SEL' }); break;
      case 'physical': navigate({ name: 'PhysicalActivity' }); break;
    }
  };

  const progress = Math.min(100, Math.round(((pathProgress + 1) / PATH.length) * 100));

  return (
    <View style={styles.root}>
      <TopBar title="Learning Path" titleFa="مسیر یادگیری" showBack dark />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { minHeight: Math.max(154, Math.round(168 * ui)), padding: Math.max(14, Math.round(16 * ui)), borderRadius: Math.max(26, Math.round(30 * ui)), gap: Math.max(12, Math.round(16 * ui)) }]}>
          <CharacterAvatar characterId={selectedCharacterId} size={Math.max(100, Math.round(112 * ui))} />
          <View style={styles.heroCopy}>
            <Text style={[styles.kicker, { fontFamily: ff(lang, 'bold'), fontSize: Math.max(12, Math.round(13 * ui)), marginBottom: Math.max(4, Math.round(5 * ui)) }, dir(lang)]}>
              {isFa ? `${stars} ستاره` : `${stars} stars`}
            </Text>
            <Text style={[styles.heroTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(22, Math.round(25 * ui)), lineHeight: Math.max(29, Math.round(34 * ui)), marginBottom: Math.max(10, Math.round(14 * ui)) }, dir(lang)]}>
              {isFa ? 'مسیر ساده فارسی' : 'A Simple Persian Path'}
            </Text>
            <View style={[styles.progressTrack, { height: Math.max(12, Math.round(14 * ui)) }]}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          {PATH.map((step, index) => {
            const locked = index > pathProgress + 1;
            const done = completedSections.includes(step.id);
            return (
              <TouchableOpacity key={step.id} style={[styles.card, locked && styles.cardLocked]} onPress={() => handleStep(step, index)} activeOpacity={locked ? 1 : 0.86}>
                <View style={[styles.thumb, { backgroundColor: locked ? '#6B647A' : step.color, height: Math.max(88, Math.round(96 * ui)), borderRadius: Math.max(18, Math.round(20 * ui)), marginBottom: Math.max(8, Math.round(10 * ui)) }]}>
                  <StepArt type={locked ? 'locked' : step.art} />
                </View>
                <Text style={[styles.cardTitle, { fontFamily: ff(lang, 'bold'), fontSize: Math.max(14, Math.round(15 * ui)) }, dir(lang)]} numberOfLines={1}>
                  {locked ? (isFa ? 'قفل' : 'Locked') : isFa ? step.labelFa : step.label}
                </Text>
                <Text style={[styles.cardSub, { fontFamily: ff(lang, 'regular'), fontSize: Math.max(11, Math.round(12 * ui)) }]}>
                  {done ? (isFa ? 'انجام شد' : 'Done') : `+${step.stars}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#25105C' },
  scroll: { paddingHorizontal: 14, paddingBottom: 34 },
  hero: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 6, borderColor: '#FFFFFF' },
  heroNeli: { width: 110, height: 142, marginBottom: -12 },
  heroCopy: { flex: 1 },
  kicker: { color: '#7C3AED', fontWeight: '900', marginBottom: 5 },
  heroTitle: { color: '#221044', fontWeight: '900' },
  progressTrack: { height: 14, borderRadius: 8, backgroundColor: '#E9E2FA', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 8, backgroundColor: '#24C878' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47.8%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 10, minHeight: 178, borderWidth: 4.5, borderColor: '#FFFFFF' },
  cardLocked: { opacity: 0.72 },
  thumb: { borderRadius: 20, overflow: 'hidden' },
  cardTitle: { color: '#25105C', fontSize: 15, fontWeight: '900', textAlign: 'center' },
  cardSub: { color: '#7C6B91', fontSize: 12, textAlign: 'center', marginTop: 4 },
  artStage: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  artBg: { width: '100%', height: '100%' },
  stepImage: { width: 74, height: 74 },
  stepImageLarge: { width: 96, height: 96 },
  stepNeli: { width: 82, height: 108, marginBottom: -12 },
});
