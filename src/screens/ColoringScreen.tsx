import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import Svg, { Path } from 'react-native-svg';
import TopBar from '../components/TopBar';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { ff } from '../theme/fonts';
import { neliWorldAssets } from '../assets/neliWorldAssets';

type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; size: number };

type PaintingScene = {
  id: string;
  title: string;
  titleFa: string;
  bg: string;
  thumb: any;
  image: any;
  outline: any;
};

type Crayon = {
  color: string;
  label: string;
  sprite: any;
};

const CRAYONS: Crayon[] = [
  { color: '#F43F1D', label: 'Red', sprite: require('../../assets/neli-world/painting/crayons/crayon_red.png') },
  { color: '#FF7A1A', label: 'Orange', sprite: require('../../assets/neli-world/painting/crayons/crayon_orange.png') },
  { color: '#FFB020', label: 'Amber', sprite: require('../../assets/neli-world/painting/crayons/crayon_amber.png') },
  { color: '#F7E31A', label: 'Yellow', sprite: require('../../assets/neli-world/painting/crayons/crayon_yellow.png') },
  { color: '#8CD62A', label: 'Lime', sprite: require('../../assets/neli-world/painting/crayons/crayon_lime.png') },
  { color: '#1FB34A', label: 'Green', sprite: require('../../assets/neli-world/painting/crayons/crayon_green.png') },
  { color: '#20B8C7', label: 'Teal', sprite: require('../../assets/neli-world/painting/crayons/crayon_teal.png') },
  { color: '#4DD0E1', label: 'Aqua', sprite: require('../../assets/neli-world/painting/crayons/crayon_aqua.png') },
  { color: '#1E45D8', label: 'Blue', sprite: require('../../assets/neli-world/painting/crayons/crayon_blue.png') },
  { color: '#4B5CFF', label: 'Indigo', sprite: require('../../assets/neli-world/painting/crayons/crayon_indigo.png') },
  { color: '#9B30FF', label: 'Purple', sprite: require('../../assets/neli-world/painting/crayons/crayon_purple.png') },
  { color: '#E91E63', label: 'Pink', sprite: require('../../assets/neli-world/painting/crayons/crayon_pink.png') },
  { color: '#FF5F7A', label: 'Rose', sprite: require('../../assets/neli-world/painting/crayons/crayon_rose.png') },
  { color: '#8D6E63', label: 'Brown', sprite: require('../../assets/neli-world/painting/crayons/crayon_brown.png') },
  { color: '#9E9E9E', label: 'Gray', sprite: require('../../assets/neli-world/painting/crayons/crayon_gray.png') },
  { color: '#263238', label: 'Black', sprite: require('../../assets/neli-world/painting/crayons/crayon_black.png') },
];

const BRUSH_SIZES = [17, 26, 36] as const;
const BRUSH_ICONS = {
  17: require('../../assets/neli-world/painting/brushes/1.png'),
  26: require('../../assets/neli-world/painting/brushes/2.png'),
  36: require('../../assets/neli-world/painting/brushes/3.png'),
} as const;

const PAINT_CARD_BORDERS = [
  '#FF3B86',
  '#FFD400',
  '#56D600',
  '#9B30FF',
  '#FF7A00',
  '#FF4FD8',
  '#FF6B00',
  '#8D6E63',
] as const;

const PAINTINGS: PaintingScene[] = [
  {
    id: '01',
    title: 'Puppy Cycling',
    titleFa: 'توله‌سگ دوچرخه‌سوار',
    bg: '#BFE6FF',
    thumb: require('../../assets/neli-world/painting/thumbs/01_puppy_cycling_in_the_park.png'),
    image: require('../../assets/neli-world/painting/01_puppy_cycling_in_the_park.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/01_puppy_cycling_in_the_park_outline.png'),
  },
  {
    id: '02',
    title: 'Playful Mouse',
    titleFa: 'موش بازیگوش',
    bg: '#FFE3F0',
    thumb: require('../../assets/neli-world/painting/thumbs/02_playful_mouse_in_a_park_playground.png'),
    image: require('../../assets/neli-world/painting/02_playful_mouse_in_a_park_playground.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/02_playful_mouse_in_a_park_playground_outline.png'),
  },
  {
    id: '03',
    title: 'Underwater Turtle',
    titleFa: 'لاک‌پشت زیر آب',
    bg: '#D8FBFF',
    thumb: require('../../assets/neli-world/painting/thumbs/03_cheerful_underwater_world_with_a_turtle.png'),
    image: require('../../assets/neli-world/painting/03_cheerful_underwater_world_with_a_turtle.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/03_cheerful_underwater_world_with_a_turtle_outline.png'),
  },
  {
    id: '04',
    title: 'Dolphin Waves',
    titleFa: 'دلفین و قایق',
    bg: '#D6F0FF',
    thumb: require('../../assets/neli-world/painting/thumbs/04_dolphin_and_sailboat_on_the_waves.png'),
    image: require('../../assets/neli-world/painting/04_dolphin_and_sailboat_on_the_waves.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/04_dolphin_and_sailboat_on_the_waves_outline.png'),
  },
  {
    id: '05',
    title: 'Jungle Friends',
    titleFa: 'دوستان جنگل',
    bg: '#DFF7D8',
    thumb: require('../../assets/neli-world/painting/thumbs/05_jungle_friends_in_the_sunshine.png'),
    image: require('../../assets/neli-world/painting/05_jungle_friends_in_the_sunshine.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/05_jungle_friends_in_the_sunshine_outline.png'),
  },
  {
    id: '07',
    title: 'Smiling Dinosaur',
    titleFa: 'دایناسور خندان',
    bg: '#E9F4FF',
    thumb: require('../../assets/neli-world/painting/thumbs/07_smiling_dinosaur_in_a_prehistoric_landscape.png'),
    image: require('../../assets/neli-world/painting/07_smiling_dinosaur_in_a_prehistoric_landscape.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/07_smiling_dinosaur_in_a_prehistoric_landscape_outline.png'),
  },
  {
    id: '08',
    title: 'Astronaut',
    titleFa: 'فضانورد',
    bg: '#E8E6FF',
    thumb: require('../../assets/neli-world/painting/thumbs/08_astronaut_waving_in_outer_space.png'),
    image: require('../../assets/neli-world/painting/08_astronaut_waving_in_outer_space.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/08_astronaut_waving_in_outer_space_outline.png'),
  },
  {
    id: '09',
    title: 'Princess',
    titleFa: 'شاهزاده',
    bg: '#FFE5F3',
    thumb: require('../../assets/neli-world/painting/thumbs/09_princess_waving_in_a_fairy_tale_landscape.png'),
    image: require('../../assets/neli-world/painting/09_princess_waving_in_a_fairy_tale_landscape.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/09_princess_waving_in_a_fairy_tale_landscape_outline.png'),
  },
  {
    id: '10',
    title: 'Playful Monkey',
    titleFa: 'میمون بازیگوش',
    bg: '#F2F0C6',
    thumb: require('../../assets/neli-world/painting/thumbs/10_playful_monkey_in_the_jungle.png'),
    image: require('../../assets/neli-world/painting/10_playful_monkey_in_the_jungle.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/10_playful_monkey_in_the_jungle_outline.png'),
  },
  {
    id: '11',
    title: 'Lamb Picnic',
    titleFa: 'بره و پیک‌نیک',
    bg: '#FFF1D9',
    thumb: require('../../assets/neli-world/painting/thumbs/11_lamb_s_sunny_day_picnic_reading.png'),
    image: require('../../assets/neli-world/painting/11_lamb_s_sunny_day_picnic_reading.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/11_lamb_s_sunny_day_picnic_reading_outline.png'),
  },
  {
    id: '12',
    title: 'Cute Kitten',
    titleFa: 'گربه‌کُرکی',
    bg: '#FFF0FB',
    thumb: require('../../assets/neli-world/painting/thumbs/12_cute_kitten_in_candy_playground.png'),
    image: require('../../assets/neli-world/painting/12_cute_kitten_in_candy_playground.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/12_cute_kitten_in_candy_playground_outline.png'),
  },
  {
    id: '13',
    title: 'Owl Teacher',
    titleFa: 'جغد معلم',
    bg: '#F2F4FF',
    thumb: require('../../assets/neli-world/painting/thumbs/13_owl_teacher_in_a_classroom_setting.png'),
    image: require('../../assets/neli-world/painting/13_owl_teacher_in_a_classroom_setting.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/13_owl_teacher_in_a_classroom_setting_outline.png'),
  },
  {
    id: '14',
    title: 'Joyful Giraffe',
    titleFa: 'زرافه شاد',
    bg: '#FFF2D2',
    thumb: require('../../assets/neli-world/painting/thumbs/14_joyful_giraffe_in_a_sunny_savanna.png'),
    image: require('../../assets/neli-world/painting/14_joyful_giraffe_in_a_sunny_savanna.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/14_joyful_giraffe_in_a_sunny_savanna_outline.png'),
  },
  {
    id: '15',
    title: 'Animal Friends',
    titleFa: 'دوستان حیوانات',
    bg: '#EAF9FF',
    thumb: require('../../assets/neli-world/painting/thumbs/15_animal_friends_in_the_park.png'),
    image: require('../../assets/neli-world/painting/15_animal_friends_in_the_park.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/15_animal_friends_in_the_park_outline.png'),
  },
  {
    id: '16',
    title: 'Octopus Friends',
    titleFa: 'اختاپوس و دوستان',
    bg: '#DDFBFF',
    thumb: require('../../assets/neli-world/painting/thumbs/16_happy_octopus_and_underwater_friends.png'),
    image: require('../../assets/neli-world/painting/16_happy_octopus_and_underwater_friends.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/16_happy_octopus_and_underwater_friends_outline.png'),
  },
  {
    id: '17',
    title: 'Jungle Swing',
    titleFa: 'تاب جنگلی',
    bg: '#E4F8D7',
    thumb: require('../../assets/neli-world/painting/thumbs/17_jungle_friends_in_a_playful_swing.png'),
    image: require('../../assets/neli-world/painting/17_jungle_friends_in_a_playful_swing.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/17_jungle_friends_in_a_playful_swing_outline.png'),
  },
  {
    id: '18',
    title: 'Farm Animals',
    titleFa: 'حیوانات مزرعه',
    bg: '#FFF6D8',
    thumb: require('../../assets/neli-world/painting/thumbs/18_cheerful_farm_animals_in_a_playful_scene.png'),
    image: require('../../assets/neli-world/painting/18_cheerful_farm_animals_in_a_playful_scene.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/18_cheerful_farm_animals_in_a_playful_scene_outline.png'),
  },
  {
    id: '19',
    title: 'Owl Astronaut',
    titleFa: 'جغد فضانورد',
    bg: '#EAE6FF',
    thumb: require('../../assets/neli-world/painting/thumbs/19_owl_astronaut_explores_outer_space.png'),
    image: require('../../assets/neli-world/painting/19_owl_astronaut_explores_outer_space.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/19_owl_astronaut_explores_outer_space_outline.png'),
  },
  {
    id: '20',
    title: 'Castle Garden',
    titleFa: 'باغ قلعه',
    bg: '#FFE8F2',
    thumb: require('../../assets/neli-world/painting/thumbs/20_princess_and_friends_in_the_castle_garden.png'),
    image: require('../../assets/neli-world/painting/20_princess_and_friends_in_the_castle_garden.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/20_princess_and_friends_in_the_castle_garden_outline.png'),
  },
  {
    id: '21',
    title: 'Lamb Meadow',
    titleFa: 'بره در چمنزار',
    bg: '#F4FCE8',
    thumb: require('../../assets/neli-world/painting/thumbs/01_lamb_reading_in_sunny_meadow.png'),
    image: require('../../assets/neli-world/painting/01_lamb_reading_in_sunny_meadow.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/01_lamb_reading_in_sunny_meadow_outline.png'),
  },
  {
    id: '22',
    title: 'Cute Kitty',
    titleFa: 'گربه ناز',
    bg: '#FFF0F8',
    thumb: require('../../assets/neli-world/painting/thumbs/02_cheerful_kitty_candy_playground.png'),
    image: require('../../assets/neli-world/painting/02_cheerful_kitty_candy_playground.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/02_cheerful_kitty_candy_playground_outline.png'),
  },
  {
    id: '23',
    title: 'Owl Classroom',
    titleFa: 'جغد کلاس',
    bg: '#EEF3FF',
    thumb: require('../../assets/neli-world/painting/thumbs/03_owl_teacher_classroom.png'),
    image: require('../../assets/neli-world/painting/03_owl_teacher_classroom.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/03_owl_teacher_classroom_outline.png'),
  },
  {
    id: '24',
    title: 'Savanna Giraffe',
    titleFa: 'زرافه ساوانا',
    bg: '#FFF4D8',
    thumb: require('../../assets/neli-world/painting/thumbs/04_cheerful_giraffe_savanna.png'),
    image: require('../../assets/neli-world/painting/04_cheerful_giraffe_savanna.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/04_cheerful_giraffe_savanna_outline.png'),
  },
  {
    id: '25',
    title: 'Teddy Bear',
    titleFa: 'خرس عروسکی',
    bg: '#FFF0E0',
    thumb: require('../../assets/neli-world/painting/thumbs/05_teddy_bear_in_park.png'),
    image: require('../../assets/neli-world/painting/05_teddy_bear_in_park.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/05_teddy_bear_in_park_outline.png'),
  },
  {
    id: '26',
    title: 'Smiling Fish',
    titleFa: 'ماهی خندان',
    bg: '#E3FBFF',
    thumb: require('../../assets/neli-world/painting/thumbs/06_smiling_fish_underwater.png'),
    image: require('../../assets/neli-world/painting/06_smiling_fish_underwater.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/06_smiling_fish_underwater_outline.png'),
  },
  {
    id: '27',
    title: 'Happy Bunny',
    titleFa: 'خرگوش شاد',
    bg: '#F5FFE8',
    thumb: require('../../assets/neli-world/painting/thumbs/07_happy_bunny_garden.png'),
    image: require('../../assets/neli-world/painting/07_happy_bunny_garden.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/07_happy_bunny_garden_outline.png'),
  },
  {
    id: '28',
    title: 'Dino Tropical',
    titleFa: 'دایناسور گرمسیری',
    bg: '#E8FFF5',
    thumb: require('../../assets/neli-world/painting/thumbs/08_cute_dinosaur_tropical.png'),
    image: require('../../assets/neli-world/painting/08_cute_dinosaur_tropical.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/08_cute_dinosaur_tropical_outline.png'),
  },
  {
    id: '29',
    title: 'Rocket Space',
    titleFa: 'راکت فضایی',
    bg: '#ECEBFF',
    thumb: require('../../assets/neli-world/painting/thumbs/09_rocket_in_space.png'),
    image: require('../../assets/neli-world/painting/09_rocket_in_space.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/09_rocket_in_space_outline.png'),
  },
  {
    id: '30',
    title: 'Animal Park',
    titleFa: 'حیوانات پارک',
    bg: '#E9FFF3',
    thumb: require('../../assets/neli-world/painting/thumbs/10_animal_friends_in_park.png'),
    image: require('../../assets/neli-world/painting/10_animal_friends_in_park.png'),
    outline: require('../../assets/neli-world/painting/line-overlays/10_animal_friends_in_park_outline.png'),
  },
];

const SIMPLE_PAINTING_IDS = new Set(['21', '25', '26', '27', '29', '24', '28', '22', '23', '30']);
const ORDERED_PAINTINGS = [...PAINTINGS].sort((a, b) => {
  const aSimple = SIMPLE_PAINTING_IDS.has(a.id);
  const bSimple = SIMPLE_PAINTING_IDS.has(b.id);
  if (aSimple !== bSimple) return aSimple ? -1 : 1;
  return Number(a.id) - Number(b.id);
});

function pathFromPoints(points: Point[]) {
  if (!points.length) return '';
  const [first, ...rest] = points;
  return `M ${first.x.toFixed(1)} ${first.y.toFixed(1)} ${rest.map(pt => `L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')}`;
}

function CrayonButton({
  color,
  selected,
  onPress,
  index,
  top,
  height,
  sprite,
}: {
  color: string;
  selected: boolean;
  onPress: () => void;
  index: number;
  top: number;
  height: number;
  sprite: any;
}) {
  return (
    <TouchableOpacity
      onPressIn={onPress}
      onPress={onPress}
      activeOpacity={0.9}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      style={[
        styles.crayonTap,
        { top, zIndex: selected ? 999 : CRAYONS.length - index, height },
        selected && styles.crayonTapSelected,
      ]}
    >
      <Image
        source={sprite}
        resizeMode="contain"
        style={styles.crayonImage}
      />
    </TouchableOpacity>
  );
}

function BrushSizeButton({
  size,
  selected,
  onPress,
  iconSource,
}: {
  size: number;
  selected: boolean;
  onPress: () => void;
  iconSource: any;
}) {
  const iconScale = size === 17 ? 1.0 : size === 26 ? 1.24 : 1.16;
  const iconRightMargin = size === 36 ? 12 : 0;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.brushSizeBtn, selected && styles.brushSizeBtnSelected]}
    >
      {selected ? <View style={styles.brushSelectedHalo} /> : null}
      <Image
        source={iconSource}
        style={[
          styles.brushIcon,
          {
            marginRight: iconRightMargin,
            transform: [{ rotate: '180deg' }, { scale: iconScale }],
          },
        ]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

function CuteActionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.92} style={styles.cuteActionBtn}>
      <Text style={styles.cuteActionText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ColoringScreen() {
  const { lang } = useContext(AppContext);
  const { reset } = useNav();
  const { width, height } = useWindowDimensions();
  const isFa = lang === 'fa' || lang === 'ar';

  const [mode, setMode] = useState<'pick' | 'paint'>('pick');
  const [sceneIdx, setSceneIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(CRAYONS[0].color);
  const [brushSize, setBrushSize] = useState<typeof BRUSH_SIZES[number]>(BRUSH_SIZES[1]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [pointer, setPointer] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({
    w: Math.max(width - 12, 320),
    h: Math.max(height - 120, 360),
  });
  const currentStroke = useRef<Stroke | null>(null);
  const selectedColorRef = useRef(selectedColor);
  const brushSizeRef = useRef(brushSize);

  const scene = ORDERED_PAINTINGS[sceneIdx];
  const canvasWidth = stageSize.w;
  const canvasHeight = stageSize.h;
  const sceneSource = Image.resolveAssetSource(scene.image);
  const paintBounds = useMemo(() => {
    const leftGap = 128;
    const rightGap = 124;
    const sourceW = sceneSource.width || 1;
    const sourceH = sceneSource.height || 1;
    const availableW = Math.max(canvasWidth - leftGap - rightGap, 1);
    const availableH = canvasHeight;
    const scale = Math.min(availableW / sourceW, availableH / sourceH);
    const imageW = sourceW * scale;
    const imageH = sourceH * scale;
    const left = leftGap + (availableW - imageW) / 2;
    const top = (canvasHeight - imageH) / 2;
    return {
      left,
      top,
      right: left + imageW,
      bottom: top + imageH,
    };
  }, [canvasHeight, canvasWidth, sceneSource.height, sceneSource.width]);
  const railTop = Math.max(8, Math.round(canvasHeight * 0.02));
  const actionRailTop = Math.max(8, Math.round(canvasHeight * 0.5 - 52));
  const crayonColumnHeight = Math.max(canvasHeight - railTop * 2, 360);
  const crayonRowStep = crayonColumnHeight / CRAYONS.length;
  const crayonTapHeight = Math.max(Math.round(crayonRowStep), 32);

  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  useEffect(() => {
    setSelectedColor(CRAYONS[0].color);
    setBrushSize(BRUSH_SIZES[1]);
  }, [scene.id]);

  const clearPainting = useCallback(() => {
    setStrokes([]);
    currentStroke.current = null;
    setPointer(prev => ({ ...prev, visible: false }));
  }, []);

  const selectCrayon = useCallback((color: string) => {
    setSelectedColor(color);
    selectedColorRef.current = color;
    currentStroke.current = null;
    setPointer(prev => ({ ...prev, visible: false }));
  }, []);

  const openScene = useCallback(
    (index: number) => {
      setSceneIdx(index);
      setMode('paint');
      clearPainting();
    },
    [clearPainting],
  );

  const closeGallery = useCallback(() => {
    reset({ name: 'Main', tab: 'Games' });
  }, [reset]);

  const closePainting = useCallback(() => {
    currentStroke.current = null;
    setPointer(prev => ({ ...prev, visible: false }));
    setMode('pick');
  }, []);

  const isControlArea = useCallback(
    (x: number, y: number) => {
      const leftGap = 128;
      const rightGap = 124;
      if (x < leftGap) return true;
      if (x > canvasWidth - rightGap) return true;
      return false;
    },
    [canvasWidth],
  );

  const isPaintablePoint = useCallback(
    (x: number, y: number) =>
      x >= paintBounds.left &&
      x <= paintBounds.right &&
      y >= paintBounds.top &&
      y <= paintBounds.bottom,
    [paintBounds.bottom, paintBounds.left, paintBounds.right, paintBounds.top],
  );

  const paintAt = useCallback(
    (px: number, py: number) => {
      const localX = px;
      const localY = py;
      if (localX < 0 || localY < 0 || localX > canvasWidth || localY > canvasHeight) return;
      if (!isPaintablePoint(localX, localY)) return;

      setPointer({ visible: true, x: localX, y: localY });

      if (!currentStroke.current) {
        currentStroke.current = {
          points: [{ x: localX, y: localY }],
          color: selectedColorRef.current,
          size: brushSizeRef.current,
        };
        setStrokes(prev => [...prev, currentStroke.current!]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }

      const last = currentStroke.current.points[currentStroke.current.points.length - 1];
      if (Math.hypot(localX - last.x, localY - last.y) < 1.5) return;

      currentStroke.current.points = [...currentStroke.current.points, { x: localX, y: localY }];
      setStrokes(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...currentStroke.current! };
        return next;
      });
    },
    [canvasHeight, canvasWidth, isPaintablePoint],
  );

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponderCapture: evt =>
          mode === 'paint' &&
          isPaintablePoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY) &&
          !isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onMoveShouldSetPanResponderCapture: evt =>
          mode === 'paint' &&
          isPaintablePoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY) &&
          !isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onStartShouldSetPanResponder: evt =>
          mode === 'paint' &&
          isPaintablePoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY) &&
          !isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onMoveShouldSetPanResponder: evt =>
          mode === 'paint' &&
          isPaintablePoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY) &&
          !isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onPanResponderGrant: evt => {
          if (
            isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY) ||
            !isPaintablePoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY)
          ) {
            return;
          }
          currentStroke.current = null;
          paintAt(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        },
        onPanResponderMove: evt => {
          if (
            isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY) ||
            !isPaintablePoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY)
          ) {
            return;
          }
          paintAt(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        },
        onPanResponderRelease: () => {
          currentStroke.current = null;
          setPointer(prev => ({ ...prev, visible: false }));
        },
        onPanResponderTerminate: () => {
          currentStroke.current = null;
          setPointer(prev => ({ ...prev, visible: false }));
        },
      }),
    [isControlArea, isPaintablePoint, mode, paintAt],
  );

  if (mode === 'pick') {
    return (
      <View style={[styles.root, { backgroundColor: '#18D8CE' }]}>
        <TopBar title="Painting" titleFa="نقاشی" showClose dark onBack={closeGallery} />
        <ScrollView contentContainerStyle={styles.gallery} showsVerticalScrollIndicator={false}>
          {ORDERED_PAINTINGS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => openScene(index)}
              style={[styles.paintCard, { borderColor: PAINT_CARD_BORDERS[index % PAINT_CARD_BORDERS.length] }]}
            >
              <View style={styles.paintCardImageWrap}>
                <Image
                  source={item.thumb}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: '#18D8CE' }]}>
      <TopBar title="Painting" titleFa="نقاشی" showClose dark onBack={closePainting} />

      <View style={styles.paintStageOuter}>
        <View
          style={styles.paintStage}
          {...pan.panHandlers}
          onLayout={event => {
            const { width: w, height: h } = event.nativeEvent.layout;
            if (w > 0 && h > 0) {
              setStageSize({ w, h });
            }
          }}
        >
          <View
            pointerEvents="none"
            style={[
              styles.paintPaperWrap,
              {
                left: paintBounds.left,
                top: paintBounds.top,
                width: paintBounds.right - paintBounds.left,
                height: paintBounds.bottom - paintBounds.top,
              },
            ]}
          >
            <View style={styles.paintPaper} />
          </View>

          <View
            style={[styles.crayonRail, { top: railTop, height: crayonColumnHeight, left: -84 }]}
            pointerEvents="box-none"
          >
            <View style={[styles.crayonPack, { height: crayonColumnHeight }]}>
              {CRAYONS.map((crayon, index) => (
                <CrayonButton
                  key={crayon.color}
                  color={crayon.color}
                  selected={selectedColor === crayon.color}
                  index={index}
                  top={index * crayonRowStep}
                  height={crayonTapHeight}
                  sprite={crayon.sprite}
                  onPress={() => selectCrayon(crayon.color)}
                />
              ))}
            </View>
          </View>

          <View style={[styles.rightActionRail, { top: actionRailTop }]} pointerEvents="box-none">
            <CuteActionButton label={isFa ? 'پاک کن' : 'Clear'} onPress={clearPainting} />
            <CuteActionButton label={isFa ? 'صفحه‌ها' : 'Pages'} onPress={() => setMode('pick')} />
          </View>

          <Svg width={canvasWidth} height={canvasHeight} style={StyleSheet.absoluteFill} pointerEvents="none">
            {strokes.map((stroke, index) => {
              const d = pathFromPoints(stroke.points);
              if (!d) return null;
              return (
                <Path
                  key={`stroke-${index}`}
                  d={d}
                  stroke={stroke.color}
                  strokeWidth={Math.max(stroke.size * 0.72, 5)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={0.95}
                />
              );
            })}
          </Svg>

          <View
            pointerEvents="none"
            style={[
              styles.paintOutlineWrap,
              {
                left: paintBounds.left,
                top: paintBounds.top,
                width: paintBounds.right - paintBounds.left,
                height: paintBounds.bottom - paintBounds.top,
              },
            ]}
          >
            <Image source={scene.outline} style={styles.paintOutlineImage} resizeMode="contain" />
          </View>

          {pointer.visible ? (
            <View
              pointerEvents="none"
              style={[
                styles.pointerBrush,
                {
                  left: pointer.x - brushSize * 0.42,
                  top: pointer.y - brushSize * 0.9,
                  width: brushSize * 1.74,
                  height: brushSize * 1.74,
                },
              ]}
            >
              <Image source={neliWorldAssets.ui.paintbrush} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            </View>
          ) : null}

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  gallery: {
    paddingHorizontal: 10,
    paddingBottom: 22,
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paintCard: {
    width: '23.5%',
    height: 226,
    borderRadius: 26,
    marginBottom: 10,
    padding: 0,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#170736',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 6,
    borderColor: '#FFFFFF',
  },
  paintCardImageWrap: {
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  paintCardImage: {
    width: '100%',
    height: '100%',
  },
  paintStageOuter: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  paintStage: {
    flex: 1,
    width: '100%',
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0,
    elevation: 0,
  },
  paintPaperWrap: {
    position: 'absolute',
    zIndex: 0,
  },
  paintPaper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  paintOutlineWrap: {
    position: 'absolute',
    zIndex: 3,
  },
  paintOutlineImage: {
    width: '100%',
    height: '100%',
  },
  brushSizeRail: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 0,
    width: 72,
  },
  brushSizeBtn: {
    width: 72,
    height: 52,
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    borderWidth: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  brushSizeBtnSelected: {
    transform: [{ translateY: 1 }, { scale: 1.01 }],
  },
  brushSelectedHalo: {
    position: 'absolute',
    width: 118,
    height: 88,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.68)',
    zIndex: 0,
  },
  brushIcon: {
    width: '160%',
    height: '160%',
    zIndex: 1,
  },
  crayonRail: {
    position: 'absolute',
    zIndex: 9,
  },
  crayonPack: {
    width: 190,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'transparent',
  },
  crayonTap: {
    position: 'absolute',
    width: 190,
    left: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  crayonTapSelected: {
    transform: [{ translateX: 12 }],
    shadowColor: '#173A6E',
    shadowOpacity: 0.24,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  crayonImage: {
    width: '100%',
    height: '100%',
  },
  rightToolRail: {
    position: 'absolute',
    right: 18,
    alignItems: 'center',
    gap: 10,
    zIndex: 10,
    width: 72,
  },
  rightActionRail: {
    position: 'absolute',
    right: 18,
    width: 124,
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  pointerBrush: {
    position: 'absolute',
    zIndex: 10,
    transform: [{ rotate: '-10deg' }],
  },
  cuteActionBtn: {
    width: 122,
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: '#2D1B69',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cuteActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: ff('fa', 'bold'),
  },
});
