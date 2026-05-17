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
import { dir, ff } from '../theme/fonts';
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
};

type Crayon = {
  color: string;
  label: string;
  sprite: any;
};

const CRAYONS: Crayon[] = [
  { color: '#F43F1D', label: 'Red', sprite: require('../../assets/neli-world/painting/crayons/crayon_red.png') },
  { color: '#FF7A1A', label: 'Orange', sprite: require('../../assets/neli-world/painting/crayons/crayon_orange.png') },
  { color: '#F7E31A', label: 'Yellow', sprite: require('../../assets/neli-world/painting/crayons/crayon_yellow.png') },
  { color: '#8CD62A', label: 'Lime', sprite: require('../../assets/neli-world/painting/crayons/crayon_lime.png') },
  { color: '#1FB34A', label: 'Green', sprite: require('../../assets/neli-world/painting/crayons/crayon_green.png') },
  { color: '#20B8C7', label: 'Teal', sprite: require('../../assets/neli-world/painting/crayons/crayon_teal.png') },
  { color: '#1E45D8', label: 'Blue', sprite: require('../../assets/neli-world/painting/crayons/crayon_blue.png') },
  { color: '#4B5CFF', label: 'Indigo', sprite: require('../../assets/neli-world/painting/crayons/crayon_indigo.png') },
  { color: '#9B30FF', label: 'Purple', sprite: require('../../assets/neli-world/painting/crayons/crayon_purple.png') },
  { color: '#E91E63', label: 'Pink', sprite: require('../../assets/neli-world/painting/crayons/crayon_pink.png') },
  { color: '#FF5F7A', label: 'Rose', sprite: require('../../assets/neli-world/painting/crayons/crayon_rose.png') },
  { color: '#FFB020', label: 'Amber', sprite: require('../../assets/neli-world/painting/crayons/crayon_amber.png') },
  { color: '#8D6E63', label: 'Brown', sprite: require('../../assets/neli-world/painting/crayons/crayon_brown.png') },
  { color: '#263238', label: 'Black', sprite: require('../../assets/neli-world/painting/crayons/crayon_black.png') },
  { color: '#9E9E9E', label: 'Gray', sprite: require('../../assets/neli-world/painting/crayons/crayon_gray.png') },
  { color: '#4DD0E1', label: 'Aqua', sprite: require('../../assets/neli-world/painting/crayons/crayon_aqua.png') },
];

const BRUSH_SIZES = [14, 22, 30] as const;

const PAINTINGS: PaintingScene[] = [
  {
    id: '01',
    title: 'Puppy Cycling',
    titleFa: 'توله‌سگ دوچرخه‌سوار',
    bg: '#BFE6FF',
    thumb: require('../../assets/neli-world/painting/thumbs/01_puppy_cycling_in_the_park.png'),
    image: require('../../assets/neli-world/painting/01_puppy_cycling_in_the_park.png'),
  },
  {
    id: '02',
    title: 'Playful Mouse',
    titleFa: 'موش بازیگوش',
    bg: '#FFE3F0',
    thumb: require('../../assets/neli-world/painting/thumbs/02_playful_mouse_in_a_park_playground.png'),
    image: require('../../assets/neli-world/painting/02_playful_mouse_in_a_park_playground.png'),
  },
  {
    id: '03',
    title: 'Underwater Turtle',
    titleFa: 'لاک‌پشت زیر آب',
    bg: '#D8FBFF',
    thumb: require('../../assets/neli-world/painting/thumbs/03_cheerful_underwater_world_with_a_turtle.png'),
    image: require('../../assets/neli-world/painting/03_cheerful_underwater_world_with_a_turtle.png'),
  },
  {
    id: '04',
    title: 'Dolphin Waves',
    titleFa: 'دلفین و قایق',
    bg: '#D6F0FF',
    thumb: require('../../assets/neli-world/painting/thumbs/04_dolphin_and_sailboat_on_the_waves.png'),
    image: require('../../assets/neli-world/painting/04_dolphin_and_sailboat_on_the_waves.png'),
  },
  {
    id: '05',
    title: 'Jungle Friends',
    titleFa: 'دوستان جنگل',
    bg: '#DFF7D8',
    thumb: require('../../assets/neli-world/painting/thumbs/05_jungle_friends_in_the_sunshine.png'),
    image: require('../../assets/neli-world/painting/05_jungle_friends_in_the_sunshine.png'),
  },
  {
    id: '07',
    title: 'Smiling Dinosaur',
    titleFa: 'دایناسور خندان',
    bg: '#E9F4FF',
    thumb: require('../../assets/neli-world/painting/thumbs/07_smiling_dinosaur_in_a_prehistoric_landscape.png'),
    image: require('../../assets/neli-world/painting/07_smiling_dinosaur_in_a_prehistoric_landscape.png'),
  },
  {
    id: '08',
    title: 'Astronaut',
    titleFa: 'فضانورد',
    bg: '#E8E6FF',
    thumb: require('../../assets/neli-world/painting/thumbs/08_astronaut_waving_in_outer_space.png'),
    image: require('../../assets/neli-world/painting/08_astronaut_waving_in_outer_space.png'),
  },
  {
    id: '09',
    title: 'Princess',
    titleFa: 'شاهزاده',
    bg: '#FFE5F3',
    thumb: require('../../assets/neli-world/painting/thumbs/09_princess_waving_in_a_fairy_tale_landscape.png'),
    image: require('../../assets/neli-world/painting/09_princess_waving_in_a_fairy_tale_landscape.png'),
  },
  {
    id: '10',
    title: 'Playful Monkey',
    titleFa: 'میمون بازیگوش',
    bg: '#F2F0C6',
    thumb: require('../../assets/neli-world/painting/thumbs/10_playful_monkey_in_the_jungle.png'),
    image: require('../../assets/neli-world/painting/10_playful_monkey_in_the_jungle.png'),
  },
  {
    id: '11',
    title: 'Lamb Picnic',
    titleFa: 'بره و پیک‌نیک',
    bg: '#FFF1D9',
    thumb: require('../../assets/neli-world/painting/thumbs/11_lamb_s_sunny_day_picnic_reading.png'),
    image: require('../../assets/neli-world/painting/11_lamb_s_sunny_day_picnic_reading.png'),
  },
  {
    id: '12',
    title: 'Cute Kitten',
    titleFa: 'گربه‌کُرکی',
    bg: '#FFF0FB',
    thumb: require('../../assets/neli-world/painting/thumbs/12_cute_kitten_in_candy_playground.png'),
    image: require('../../assets/neli-world/painting/12_cute_kitten_in_candy_playground.png'),
  },
  {
    id: '13',
    title: 'Owl Teacher',
    titleFa: 'جغد معلم',
    bg: '#F2F4FF',
    thumb: require('../../assets/neli-world/painting/thumbs/13_owl_teacher_in_a_classroom_setting.png'),
    image: require('../../assets/neli-world/painting/13_owl_teacher_in_a_classroom_setting.png'),
  },
  {
    id: '14',
    title: 'Joyful Giraffe',
    titleFa: 'زرافه شاد',
    bg: '#FFF2D2',
    thumb: require('../../assets/neli-world/painting/thumbs/14_joyful_giraffe_in_a_sunny_savanna.png'),
    image: require('../../assets/neli-world/painting/14_joyful_giraffe_in_a_sunny_savanna.png'),
  },
  {
    id: '15',
    title: 'Animal Friends',
    titleFa: 'دوستان حیوانات',
    bg: '#EAF9FF',
    thumb: require('../../assets/neli-world/painting/thumbs/15_animal_friends_in_the_park.png'),
    image: require('../../assets/neli-world/painting/15_animal_friends_in_the_park.png'),
  },
  {
    id: '16',
    title: 'Octopus Friends',
    titleFa: 'اختاپوس و دوستان',
    bg: '#DDFBFF',
    thumb: require('../../assets/neli-world/painting/thumbs/16_happy_octopus_and_underwater_friends.png'),
    image: require('../../assets/neli-world/painting/16_happy_octopus_and_underwater_friends.png'),
  },
  {
    id: '17',
    title: 'Jungle Swing',
    titleFa: 'تاب جنگلی',
    bg: '#E4F8D7',
    thumb: require('../../assets/neli-world/painting/thumbs/17_jungle_friends_in_a_playful_swing.png'),
    image: require('../../assets/neli-world/painting/17_jungle_friends_in_a_playful_swing.png'),
  },
  {
    id: '18',
    title: 'Farm Animals',
    titleFa: 'حیوانات مزرعه',
    bg: '#FFF6D8',
    thumb: require('../../assets/neli-world/painting/thumbs/18_cheerful_farm_animals_in_a_playful_scene.png'),
    image: require('../../assets/neli-world/painting/18_cheerful_farm_animals_in_a_playful_scene.png'),
  },
  {
    id: '19',
    title: 'Owl Astronaut',
    titleFa: 'جغد فضانورد',
    bg: '#EAE6FF',
    thumb: require('../../assets/neli-world/painting/thumbs/19_owl_astronaut_explores_outer_space.png'),
    image: require('../../assets/neli-world/painting/19_owl_astronaut_explores_outer_space.png'),
  },
  {
    id: '20',
    title: 'Castle Garden',
    titleFa: 'باغ قلعه',
    bg: '#FFE8F2',
    thumb: require('../../assets/neli-world/painting/thumbs/20_princess_and_friends_in_the_castle_garden.png'),
    image: require('../../assets/neli-world/painting/20_princess_and_friends_in_the_castle_garden.png'),
  },
  {
    id: '21',
    title: 'Lamb Meadow',
    titleFa: 'بره در چمنزار',
    bg: '#F4FCE8',
    thumb: require('../../assets/neli-world/painting/thumbs/01_lamb_reading_in_sunny_meadow.png'),
    image: require('../../assets/neli-world/painting/01_lamb_reading_in_sunny_meadow.png'),
  },
  {
    id: '22',
    title: 'Cute Kitty',
    titleFa: 'گربه ناز',
    bg: '#FFF0F8',
    thumb: require('../../assets/neli-world/painting/thumbs/02_cheerful_kitty_candy_playground.png'),
    image: require('../../assets/neli-world/painting/02_cheerful_kitty_candy_playground.png'),
  },
  {
    id: '23',
    title: 'Owl Classroom',
    titleFa: 'جغد کلاس',
    bg: '#EEF3FF',
    thumb: require('../../assets/neli-world/painting/thumbs/03_owl_teacher_classroom.png'),
    image: require('../../assets/neli-world/painting/03_owl_teacher_classroom.png'),
  },
  {
    id: '24',
    title: 'Savanna Giraffe',
    titleFa: 'زرافه ساوانا',
    bg: '#FFF4D8',
    thumb: require('../../assets/neli-world/painting/thumbs/04_cheerful_giraffe_savanna.png'),
    image: require('../../assets/neli-world/painting/04_cheerful_giraffe_savanna.png'),
  },
  {
    id: '25',
    title: 'Teddy Bear',
    titleFa: 'خرس عروسکی',
    bg: '#FFF0E0',
    thumb: require('../../assets/neli-world/painting/thumbs/05_teddy_bear_in_park.png'),
    image: require('../../assets/neli-world/painting/05_teddy_bear_in_park.png'),
  },
  {
    id: '26',
    title: 'Smiling Fish',
    titleFa: 'ماهی خندان',
    bg: '#E3FBFF',
    thumb: require('../../assets/neli-world/painting/thumbs/06_smiling_fish_underwater.png'),
    image: require('../../assets/neli-world/painting/06_smiling_fish_underwater.png'),
  },
  {
    id: '27',
    title: 'Happy Bunny',
    titleFa: 'خرگوش شاد',
    bg: '#F5FFE8',
    thumb: require('../../assets/neli-world/painting/thumbs/07_happy_bunny_garden.png'),
    image: require('../../assets/neli-world/painting/07_happy_bunny_garden.png'),
  },
  {
    id: '28',
    title: 'Dino Tropical',
    titleFa: 'دایناسور گرمسیری',
    bg: '#E8FFF5',
    thumb: require('../../assets/neli-world/painting/thumbs/08_cute_dinosaur_tropical.png'),
    image: require('../../assets/neli-world/painting/08_cute_dinosaur_tropical.png'),
  },
  {
    id: '29',
    title: 'Rocket Space',
    titleFa: 'راکت فضایی',
    bg: '#ECEBFF',
    thumb: require('../../assets/neli-world/painting/thumbs/09_rocket_in_space.png'),
    image: require('../../assets/neli-world/painting/09_rocket_in_space.png'),
  },
  {
    id: '30',
    title: 'Animal Park',
    titleFa: 'حیوانات پارک',
    bg: '#E9FFF3',
    thumb: require('../../assets/neli-world/painting/thumbs/10_animal_friends_in_park.png'),
    image: require('../../assets/neli-world/painting/10_animal_friends_in_park.png'),
  },
];

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
}: {
  size: number;
  selected: boolean;
  onPress: () => void;
}) {
  const iconSize = 16 + size * 0.75;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.brushSizeBtn, selected && styles.brushSizeBtnSelected]}
    >
      <Image source={neliWorldAssets.ui.paintbrush} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
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

  const scene = PAINTINGS[sceneIdx];
  const canvasWidth = stageSize.w;
  const canvasHeight = stageSize.h;
  const railTop = Math.max(8, Math.round(canvasHeight * 0.02));
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

  const isControlArea = useCallback(
    (x: number, y: number) => {
      if (x < 300) return true;
      if (x > canvasWidth - 96) return true;
      return false;
    },
    [canvasWidth],
  );

  const paintAt = useCallback(
    (px: number, py: number) => {
      const localX = px;
      const localY = py;
      if (localX < 0 || localY < 0 || localX > canvasWidth || localY > canvasHeight) return;

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
    [canvasHeight, canvasWidth],
  );

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponderCapture: evt =>
          mode === 'paint' && !isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onMoveShouldSetPanResponderCapture: evt =>
          mode === 'paint' && !isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onStartShouldSetPanResponder: evt =>
          mode === 'paint' && !isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onMoveShouldSetPanResponder: evt =>
          mode === 'paint' && !isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
        onPanResponderGrant: evt => {
          if (isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY)) return;
          currentStroke.current = null;
          paintAt(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        },
        onPanResponderMove: evt => {
          if (isControlArea(evt.nativeEvent.locationX, evt.nativeEvent.locationY)) return;
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
    [isControlArea, mode, paintAt],
  );

  if (mode === 'pick') {
    return (
      <View style={[styles.root, { backgroundColor: '#7CCBFF' }]}>
        <TopBar title="Painting" titleFa="نقاشی" showBack dark />
        <View style={styles.pickHeader}>
          <Text style={[styles.pickTitle, { fontFamily: ff(lang, 'black') }, dir(lang)]}>
            {isFa ? 'یک نقاشی را انتخاب کن' : 'Pick a painting'}
          </Text>
          <Text style={[styles.pickSub, { fontFamily: ff(lang, 'regular') }, dir(lang)]}>
            {isFa ? 'روی یکی از تصویرها بزن تا با انگشت رنگ کنی' : 'Tap a page and paint with your finger'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.gallery} showsVerticalScrollIndicator={false}>
          {PAINTINGS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => openScene(index)}
              style={[styles.paintCard, { backgroundColor: item.bg }]}
            >
              <View style={styles.paintCardImageWrap}>
                <Image
                  source={item.thumb}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
              <Text style={[styles.paintCardTitle, { fontFamily: ff(lang, 'black') }, dir(lang)]}>
                {isFa ? item.titleFa : item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: '#7CCBFF' }]}>
      <TopBar title="Painting" titleFa="نقاشی" showBack dark onBack={() => setMode('pick')} />

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
          <View pointerEvents="none" style={styles.paintImageWrap}>
            <Image source={scene.image} style={styles.paintImage} resizeMode="contain" />
          </View>

          <View
            style={[styles.crayonRail, { top: railTop, height: crayonColumnHeight, left: 0 }]}
            pointerEvents="box-none"
          >
            <View
              pointerEvents="none"
              style={[
                styles.crayonStick,
                { height: crayonColumnHeight - 12 },
              ]}
            />
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

          <View style={[styles.rightToolRail, { top: railTop }]} pointerEvents="box-none">
            <View style={styles.brushSizeRail}>
              {BRUSH_SIZES.map(size => (
                <BrushSizeButton
                  key={size}
                  size={size}
                  selected={brushSize === size}
                  onPress={() => setBrushSize(size)}
                />
              ))}
            </View>

            <View style={[styles.actionRail, { marginTop: 22 }]}>
              <CuteActionButton label={isFa ? 'پاک کن' : 'Clear'} onPress={clearPainting} />
              <CuteActionButton label={isFa ? 'صفحه‌ها' : 'Pages'} onPress={() => setMode('pick')} />
            </View>
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

          {pointer.visible ? (
            <View
              pointerEvents="none"
              style={[
                styles.pointerBrush,
                {
                  left: pointer.x - brushSize * 0.42,
                  top: pointer.y - brushSize * 0.9,
                  width: brushSize * 1.45,
                  height: brushSize * 1.45,
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
  pickHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  pickTitle: { color: '#173A6E', fontSize: 24, textAlign: 'center' },
  pickSub: { color: '#355C85', fontSize: 13, textAlign: 'center', marginTop: 4 },
  gallery: {
    paddingHorizontal: 12,
    paddingBottom: 22,
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paintCard: {
    width: '31.5%',
    borderRadius: 18,
    marginBottom: 10,
    padding: 8,
    shadowColor: '#173A6E',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  paintCardImageWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    aspectRatio: 4 / 3,
  },
  paintCardImage: {
    width: '100%',
    height: '100%',
  },
  paintCardTitle: {
    color: '#173A6E',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
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
    borderRadius: 22,
    overflow: 'visible',
    backgroundColor: '#FFFFFF',
    shadowColor: '#173A6E',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  paintImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  paintImageWrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  paintTouchLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  brushSizeRail: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    width: 72,
  },
  brushSizeBtn: {
    width: 68,
    height: 54,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(23,58,110,0.12)',
  },
  brushSizeBtnSelected: {
    transform: [{ translateY: 3 }, { scale: 1.05 }],
    borderColor: '#173A6E',
  },
  crayonRail: {
    position: 'absolute',
    zIndex: 9,
  },
  crayonStick: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 10,
    borderRadius: 6,
    backgroundColor: '#E3B04E',
    opacity: 0.95,
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
    transform: [{ translateX: 6 }],
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
    right: 8,
    alignItems: 'center',
    gap: 10,
    zIndex: 10,
    width: 92,
  },
  pointerBrush: {
    position: 'absolute',
    zIndex: 10,
    transform: [{ rotate: '-10deg' }],
  },
  actionRail: {
    alignItems: 'center',
    gap: 8,
  },
  cuteActionBtn: {
    width: 102,
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
