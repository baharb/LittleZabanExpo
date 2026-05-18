import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Ellipse, Rect as SvgRect } from 'react-native-svg';
import { AppContext } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useLandscapeDimensions } from '../../hooks/useLandscapeDimensions';
import TopBar from '../../components/TopBar';
import { dir, ff } from '../../theme/fonts';
import { neliWorldAssets } from '../../assets/neliWorldAssets';
import BlinkingNeliImage from '../../components/BlinkingNeliImage';

type IngredientKind = 'rice' | 'herb' | 'egg' | 'tomato' | 'pasta' | 'cheese' | 'water' | 'salt' | 'cucumber' | 'yogurt' | 'driedMint' | 'lemon' | 'lentils' | 'beans' | 'fish' | 'oil' | 'onion';
type Rect = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };
type Slot = { x: number; y: number; w: number; h: number };

type Ingredient = { id: IngredientKind; fa: string; en: string; source: any; color: string };
type Recipe = {
  id: string;
  fa: string;
  en: string;
  color: string;
  vessel: 'pot' | 'pan' | 'plate';
  steps: Ingredient[];
  resultSource: any;
};

const ALL: Record<IngredientKind, Ingredient> = {
  rice: { id: 'rice', fa: 'برنج', en: 'Rice', source: neliWorldAssets.foods.rice, color: '#F8E39A' },
  herb: { id: 'herb', fa: 'سبزی', en: 'Herbs', source: neliWorldAssets.foods.herbs, color: '#22C55E' },
  egg: { id: 'egg', fa: 'تخم مرغ', en: 'Egg', source: neliWorldAssets.foods.egg, color: '#FDE68A' },
  tomato: { id: 'tomato', fa: 'گوجه', en: 'Tomato', source: neliWorldAssets.foods.tomato, color: '#EF4444' },
  pasta: { id: 'pasta', fa: 'پاستا', en: 'Pasta', source: neliWorldAssets.foods.pasta, color: '#FBBF24' },
  cheese: { id: 'cheese', fa: 'پنیر', en: 'Cheese', source: neliWorldAssets.foods.cheese, color: '#F59E0B' },
  water: { id: 'water', fa: 'آب', en: 'Water', source: neliWorldAssets.foods.water, color: '#38BDF8' },
  salt: { id: 'salt', fa: 'نمک', en: 'Salt', source: neliWorldAssets.foods.salt, color: '#94A3B8' },
  cucumber: { id: 'cucumber', fa: 'خیار', en: 'Cucumber', source: neliWorldAssets.foods.cucumber, color: '#4ADE80' },
  yogurt: { id: 'yogurt', fa: 'ماست', en: 'Yogurt', source: neliWorldAssets.foods.yogurt, color: '#F8FAFC' },
  driedMint: { id: 'driedMint', fa: 'نعنا خشک', en: 'Dried Mint', source: neliWorldAssets.foods.driedMint, color: '#22C55E' },
  lemon: { id: 'lemon', fa: 'لیمو', en: 'Lemon', source: neliWorldAssets.foods.lemon, color: '#FDE047' },
  lentils: { id: 'lentils', fa: 'عدس', en: 'Lentils', source: neliWorldAssets.foods.lentils, color: '#A16207' },
  beans: { id: 'beans', fa: 'لوبیا', en: 'Beans', source: neliWorldAssets.foods.beans, color: '#7C3AED' },
  fish: { id: 'fish', fa: 'ماهی', en: 'Fish', source: neliWorldAssets.foods.fish, color: '#38BDF8' },
  oil: { id: 'oil', fa: 'روغن', en: 'Oil', source: neliWorldAssets.kitchen.oil, color: '#F59E0B' },
  onion: { id: 'onion', fa: 'پیاز', en: 'Onion', source: neliWorldAssets.foods.onion, color: '#C084FC' },
};

const RECIPES: Recipe[] = [
  { id: 'sabzi-polo', fa: 'سبزی پلو با ماهی', en: 'Herb Rice with Fish', color: '#24C878', vessel: 'pot', steps: [ALL.rice, ALL.water, ALL.salt, ALL.herb, ALL.fish, ALL.oil], resultSource: neliWorldAssets.persianFoods.sabziPolo },
  { id: 'omelette', fa: 'املت', en: 'Omelette', color: '#FF7B24', vessel: 'pan', steps: [ALL.egg, ALL.oil, ALL.tomato, ALL.salt], resultSource: neliWorldAssets.persianFoods.kukuSabzi },
  { id: 'pasta', fa: 'پاستا', en: 'Pasta', color: '#FFD53E', vessel: 'plate', steps: [ALL.water, ALL.oil, ALL.pasta, ALL.cheese], resultSource: neliWorldAssets.foods.pasta },
  { id: 'mast-khiar', fa: 'ماست و خیار', en: 'Yogurt Cucumber', color: '#8B5CF6', vessel: 'plate', steps: [ALL.yogurt, ALL.cucumber, ALL.driedMint, ALL.salt], resultSource: neliWorldAssets.persianFoods.mastKhiar },
  { id: 'shirazi-salad', fa: 'سالاد شیرازی', en: 'Shirazi Salad', color: '#F43F5E', vessel: 'plate', steps: [ALL.tomato, ALL.cucumber, ALL.onion, ALL.lemon, ALL.salt], resultSource: neliWorldAssets.persianFoods.shiraziSalad },
  { id: 'kuku-sabzi', fa: 'کوکو سبزی', en: 'Herb Frittata', color: '#16A34A', vessel: 'pan', steps: [ALL.egg, ALL.herb, ALL.salt], resultSource: neliWorldAssets.persianFoods.kukuSabzi },
  { id: 'tahchin', fa: 'ته چین', en: 'Tahchin', color: '#EAB308', vessel: 'pot', steps: [ALL.rice, ALL.egg, ALL.yogurt, ALL.salt], resultSource: neliWorldAssets.persianFoods.tahchin },
  { id: 'ash-reshteh', fa: 'آش رشته', en: 'Aash Reshteh', color: '#CA8A04', vessel: 'pot', steps: [ALL.water, ALL.lentils, ALL.beans, ALL.herb, ALL.salt], resultSource: neliWorldAssets.persianFoods.ashReshteh },
];

function hit(rect: Rect, x: number, y: number) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getCounterSlots(width: number, height: number, target: Rect, count: number, vessel: Recipe['vessel']): Slot[] {
  const isLandscape = width > height;
  const cardW = Math.min(isLandscape ? 104 : 88, Math.max(68, Math.floor(width * 0.11)));
  const cardH = Math.min(isLandscape ? 92 : 80, Math.max(64, Math.floor(height * 0.09)));
  const lineYBase = clamp(target.y - cardH * 0.20, height * 0.09, height * 0.36 - cardH);
  const lineY = target.y !== 0 && target.h > 1 ? lineYBase + height * 0.05 : lineYBase;
  const gap = Math.max(4, Math.round(cardW * 0.06));
  const leftCount = Math.ceil(count / 2);
  const rightCount = count - leftCount;
  const leftStart = target.x - gap - leftCount * cardW - Math.max(0, leftCount - 1) * gap;
  const rightStart = target.x + target.w + gap;

  return Array.from({ length: count }, (_unused, index) => {
    const isLeft = index < leftCount;
    const sideIndex = isLeft ? index : index - leftCount;
    const x = isLeft
      ? leftStart + sideIndex * (cardW + gap)
      : rightStart + sideIndex * (cardW + gap);
    return {
      x: clamp(x, 10, width - cardW - 10),
      y: lineY + cardH * 0.02,
      w: cardW,
      h: cardH,
    };
  });
}

function getTargetRect(width: number, height: number, recipe: Recipe): Rect {
  const isLandscape = width > height;
  const centerX = isLandscape ? width * 0.58 : width * 0.56;
  const centerY = isLandscape ? height * 0.43 : height * 0.45;
  const w = isLandscape ? width * 0.20 : width * 0.26;
  const h = isLandscape ? height * 0.16 : height * 0.14;
  const rect = { x: centerX - w / 2, y: centerY - h / 2, w, h };
  return {
    x: rect.x - w / 4 - width * 0.05,
    y: rect.y - h * 0.65 - height * 0.03,
    w,
    h,
  };
}

function getCookingSceneSource(width: number, height: number) {
  const isLandscape = width > height;
  if (isLandscape) {
    return width / height > 1.45 ? neliWorldAssets.rooms.cookingTable : neliWorldAssets.rooms.cookingTableTabletLandscape;
  }
  return height / width > 1.4 ? neliWorldAssets.rooms.cookingTable : neliWorldAssets.rooms.cookingTableTabletPortrait;
}

function renderIngredientArt(ingredient: Ingredient, size: number) {
  const boxW = size + 12;
  const boxH = size + 14;

  if (ingredient.id === 'oil') {
    return (
      <Svg width={boxW} height={boxH} viewBox="0 0 120 140">
        <SvgRect x="38" y="18" width="44" height="14" rx="7" fill="#FF4D8D" />
        <SvgRect x="28" y="30" width="64" height="88" rx="18" fill="#38BDF8" />
        <SvgRect x="31" y="34" width="58" height="10" rx="5" fill="rgba(255,255,255,0.22)" />
        <SvgRect x="36" y="56" width="48" height="48" rx="14" fill="#FACC15" opacity="0.94" />
        <SvgRect x="41" y="40" width="12" height="7" rx="3.5" fill="rgba(255,255,255,0.65)" />
        <Circle cx="62" cy="22" r="6" fill="#FF6AA5" />
      </Svg>
    );
  }

  if (ingredient.id === 'egg') {
    return (
      <Svg width={boxW} height={boxH} viewBox="0 0 120 140">
        <Ellipse cx="60" cy="84" rx="36" ry="45" fill="rgba(90,54,23,0.14)" />
        <Ellipse cx="60" cy="78" rx="34" ry="42" fill="#FFF7EA" />
        <Ellipse cx="60" cy="76" rx="28" ry="36" fill="#FFFFFF" />
        <Ellipse cx="61" cy="68" rx="11" ry="13" fill="#FFE27A" />
        <Ellipse cx="54" cy="61" rx="4.5" ry="6" fill="rgba(255,255,255,0.8)" />
        <SvgRect x="42" y="40" width="10" height="8" rx="4" fill="rgba(255,255,255,0.9)" transform="rotate(-14 42 40)" />
      </Svg>
    );
  }

  if (ingredient.id === 'cucumber') {
    return <Image source={neliWorldAssets.foods.cucumber} style={{ width: boxW, height: boxH }} resizeMode="contain" />;
  }

  if (ingredient.id === 'yogurt') {
    return <Image source={neliWorldAssets.foods.yogurt} style={{ width: boxW, height: boxH }} resizeMode="contain" />;
  }

  if (ingredient.id === 'lentils') {
    return (
      <Svg width={boxW} height={boxH} viewBox="0 0 120 140">
        <Ellipse cx="60" cy="96" rx="42" ry="16" fill="#A16207" opacity="0.24" />
        <Circle cx="35" cy="80" r="11" fill="#8B5A2B" />
        <Circle cx="51" cy="66" r="12" fill="#9A6328" />
        <Circle cx="69" cy="78" r="11" fill="#7C4A1F" />
        <Circle cx="85" cy="65" r="12" fill="#A65E2C" />
        <Circle cx="57" cy="92" r="10" fill="#8B5A2B" />
        <Circle cx="79" cy="92" r="10" fill="#A16207" />
      </Svg>
    );
  }

  if (ingredient.id === 'beans') {
    return (
      <Svg width={boxW} height={boxH} viewBox="0 0 120 140">
        <Ellipse cx="60" cy="94" rx="38" ry="16" fill="#166534" opacity="0.18" />
        <Ellipse cx="39" cy="76" rx="11" ry="16" fill="#22C55E" transform="rotate(-18 39 76)" />
        <Ellipse cx="57" cy="64" rx="11" ry="16" fill="#16A34A" transform="rotate(10 57 64)" />
        <Ellipse cx="76" cy="75" rx="11" ry="16" fill="#22C55E" transform="rotate(26 76 75)" />
        <Ellipse cx="55" cy="91" rx="11" ry="16" fill="#4ADE80" transform="rotate(0 55 91)" />
        <Ellipse cx="78" cy="92" rx="11" ry="16" fill="#16A34A" transform="rotate(-14 78 92)" />
      </Svg>
    );
  }

  return <Image source={ingredient.source} style={{ width: boxW, height: boxH }} resizeMode="contain" />;
}

function renderReadyDish(recipe: Recipe, width: number, height: number) {
  if (recipe.id === 'omelette') {
    return (
      <Svg width={width} height={height} viewBox="0 0 260 220">
        <Ellipse cx="130" cy="134" rx="92" ry="28" fill="rgba(82,44,17,0.18)" />
        <Ellipse cx="130" cy="118" rx="88" ry="62" fill="#FFF3B0" />
        <Ellipse cx="130" cy="116" rx="78" ry="52" fill="#FFD95A" />
        <Ellipse cx="106" cy="104" rx="34" ry="24" fill="#FFE58A" opacity="0.9" />
        <Ellipse cx="156" cy="98" rx="28" ry="20" fill="#FFF1A8" opacity="0.85" />
        <SvgRect x="76" y="104" width="34" height="12" rx="6" fill="#FF7A59" transform="rotate(-12 76 104)" />
        <SvgRect x="172" y="112" width="24" height="10" rx="5" fill="#FF7A59" transform="rotate(16 172 112)" />
        <Circle cx="94" cy="86" r="4.6" fill="#22C55E" />
        <Circle cx="112" cy="79" r="4.6" fill="#22C55E" />
        <Circle cx="151" cy="82" r="4.6" fill="#22C55E" />
        <Circle cx="171" cy="91" r="4.6" fill="#22C55E" />
        <Circle cx="125" cy="122" r="9" fill="#FFF6D5" opacity="0.95" />
        <Ellipse cx="129" cy="117" rx="54" ry="10" fill="rgba(255,255,255,0.26)" />
      </Svg>
    );
  }

  return <Image source={recipe.resultSource} style={{ width: '100%', height: '100%' }} resizeMode="contain" />;
}

function FoodTile({
  ingredient,
  slot,
  size,
  disabled,
  onAttempt,
  resetToken,
}: {
  ingredient: Ingredient;
  slot: Slot;
  size: number;
  disabled: boolean;
  onAttempt: (ingredient: Ingredient, point: Point) => void;
  resetToken: number;
}) {
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    drag.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    setPressed(false);
  }, [drag, resetToken, scale]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_evt, gestureState) => !disabled && (Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3),
        onPanResponderGrant: () => {
          setPressed(true);
          Animated.spring(scale, { toValue: 1.08, useNativeDriver: true }).start();
        },
        onPanResponderMove: Animated.event([null, { dx: drag.x, dy: drag.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_evt, gestureState) => {
          setPressed(false);
          onAttempt(ingredient, { x: gestureState.moveX, y: gestureState.moveY });
          Animated.parallel([
            Animated.spring(drag, { toValue: { x: 0, y: 0 }, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          ]).start();
        },
        onPanResponderTerminate: () => {
          setPressed(false);
          Animated.parallel([
            Animated.spring(drag, { toValue: { x: 0, y: 0 }, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          ]).start();
        },
      }),
    [disabled, drag, ingredient, onAttempt, scale],
  );

  return (
    <Animated.View
      {...pan.panHandlers}
      style={[
        styles.ingredientTile,
        {
          left: slot.x,
          top: slot.y,
          width: slot.w,
          height: slot.h,
          opacity: disabled ? 0.28 : pressed ? 0.95 : 1,
          transform: [{ translateX: drag.x }, { translateY: drag.y }, { scale }],
        },
      ]}
    >
      {renderIngredientArt(ingredient, size)}
      <Text style={[styles.ingredientLabel, { fontFamily: ff('fa', 'bold') }, dir('fa')]}>{ingredient.fa}</Text>
    </Animated.View>
  );
}

function FlyingIngredient({
  ingredient,
  from,
  to,
  size,
  onDone,
}: {
  ingredient: Ingredient;
  from: Point;
  to: Point;
  size: number;
  onDone: () => void;
}) {
  const x = useRef(new Animated.Value(from.x)).current;
  const y = useRef(new Animated.Value(from.y)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const lift = { x: to.x + 6, y: to.y - 14 };
    Animated.sequence([
      Animated.parallel([
        Animated.timing(x, { toValue: lift.x, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(y, { toValue: lift.y, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.92, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(x, { toValue: to.x, duration: 240, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(y, { toValue: to.y, duration: 240, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.58, duration: 240, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 240, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(rotate, { toValue: -1, duration: 240, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [onDone, opacity, rotate, scale, to.x, to.y, x, y]);

  const spin = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.flyItem,
        {
          transform: [{ translateX: x }, { translateY: y }, { scale }, { rotate: spin }],
          opacity,
        },
      ]}
    >
      {renderIngredientArt(ingredient, size)}
    </Animated.View>
  );
}

export default function CookingGame() {
  const { lang, addStars } = useContext(AppContext);
  const { reset } = useNav();
  const { width, height } = useLandscapeDimensions();
  const { speakFarsiOnly, speakInLang, stop } = useSpeech();
  const stageRef = useRef<View>(null);
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [usedIds, setUsedIds] = useState<IngredientKind[]>([]);
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect>({ x: 0, y: 0, w: 1, h: 1 });
  const [fly, setFly] = useState<{ ingredient: Ingredient; from: Point; to: Point } | null>(null);
  const [stageOrigin, setStageOrigin] = useState({ x: 0, y: 0 });

  const recipe = RECIPES[recipeIdx];
  const current = recipe.steps[step];
  const isFa = lang === 'fa' || lang === 'ar';
  const sceneSource = getCookingSceneSource(width, height);
  const textFont = (weight: 'regular' | 'bold' | 'black') => (isFa ? ff('fa', weight) : ff(lang, weight));
  const faFont = (weight: 'regular' | 'bold' | 'black') => ff('fa', weight);
  const menuFont = (weight: 'regular' | 'bold' | 'black' = 'bold') => ff('fa', weight);
  const ingredientSize = Math.max(52, Math.min(92, Math.round(Math.min(width, height) * 0.088)));
  const target = useMemo(() => getTargetRect(width, height, recipe), [height, recipe, width]);
  const slots = useMemo(() => getCounterSlots(width, height, target, recipe.steps.length, recipe.vessel), [height, recipe.steps.length, recipe.vessel, target, width]);
  const chefWidth = Math.min(width * 0.308, height * 0.462);
  const chefHeight = chefWidth * 1.22;
  const chefFrameHeight = chefHeight * 0.74;

  const say = (fa: string, en: string) => {
    stop();
    speakFarsiOnly(fa, () => {
      if (!isFa) setTimeout(() => speakInLang(en, lang), 220);
    });
  };

  useEffect(() => {
    setStep(0);
    setUsedIds([]);
    setDone(false);
    setWrong(false);
    setFly(null);
    setResetToken(prev => prev + 1);
  }, [recipeIdx]);

  useEffect(() => {
    say(`نوبت ${current.fa} است.`, `Now add ${current.en}.`);
  }, [current.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshStageOrigin = () => {
    stageRef.current?.measureInWindow((x, y) => {
      setStageOrigin({ x, y });
    });
  };

  const handleDrop = (ingredient: Ingredient, point: Point) => {
    if (done || usedIds.includes(ingredient.id)) return;
    const localPoint = {
      x: point.x - stageOrigin.x,
      y: point.y - stageOrigin.y,
    };
    if (ingredient.id !== current.id || !hit(target, localPoint.x, localPoint.y)) {
      setWrong(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => setWrong(false), 500);
      say('این یکی درست نیست.', 'That one is not correct.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addStars(1);
    setUsedIds(prev => [...prev, ingredient.id]);
    setFly({
      ingredient,
      from: {
        x: Math.max(0, point.x - ingredientSize / 2),
        y: Math.max(0, point.y - ingredientSize / 2),
      },
      to: {
        x: target.x + target.w * 0.58 - ingredientSize / 2,
        y: target.y + target.h * 0.28 - ingredientSize / 2,
      },
    });
    say(ingredient.fa, ingredient.en);

    if (step >= recipe.steps.length - 1) {
      setDone(true);
      setTimeout(() => say('آفرین! غذا آماده شد.', 'Great job! The food is ready.'), 650);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleFlyDone = () => {
    setFly(null);
  };

  const resetRecipe = (index = recipeIdx) => {
    setRecipeIdx(index);
    setStep(0);
    setUsedIds([]);
    setDone(false);
    setWrong(false);
    setFly(null);
    setResetToken(prev => prev + 1);
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={sceneSource} style={styles.scene} resizeMode="cover">
        <View style={[styles.sceneWash, done && styles.sceneWashDone]} />
        <TopBar title="Cooking" titleFa="آشپزی" showBack dark topInset={10} />

        <View style={styles.recipeRow}>
          {RECIPES.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.recipeTab, index === recipeIdx && { backgroundColor: item.color }]}
              onPress={() => resetRecipe(index)}
            >
              <Text style={[styles.recipeTabText, index === recipeIdx && styles.recipeTabTextOn, { fontFamily: menuFont('bold') }, dir('fa')]}>
                {isFa ? item.fa : item.en}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.prompt}>
          {done ? (
            <Text style={[styles.subtitle, styles.donePromptText, { fontFamily: textFont('bold') }, dir(isFa ? 'fa' : lang)]}>
              {isFa ? 'غذا آماده است!' : 'Food is ready!'}
            </Text>
          ) : (
            <View style={styles.nextRow}>
              <Text style={[styles.subtitle, { fontFamily: textFont('bold') }, dir(isFa ? 'fa' : lang)]}>
                {isFa ? `بعدی: ${current.fa}` : `Next: ${current.en}`}
              </Text>
              <TouchableOpacity activeOpacity={0.85} style={styles.topSpeakerBtn} onPress={() => say(current.fa, current.en)}>
                <Text style={styles.topSpeakerIcon}>{'🔊'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View ref={stageRef} style={styles.stage} onLayout={refreshStageOrigin}>
          <View
            pointerEvents="none"
            style={[
              styles.chefNeliFrame,
              {
                left: target.x + target.w * 0.5 - chefWidth * 0.5,
                top: target.y - chefHeight * 0.60,
                width: chefWidth,
                height: chefFrameHeight,
              },
            ]}
          >
            <Image
              source={require('../../../assets/neli-world/characters/Neli/17_cooking_clean.png')}
              style={[styles.chefNeli, { width: chefWidth, height: chefHeight }]}
              resizeMode="contain"
            />
            <BlinkingNeliImage
              size={chefWidth * 0.841}
              height={chefHeight * 0.841}
              showBase={false}
              style={[
                styles.chefNeliBlink,
                {
                  left: chefWidth * 0.058,
                  top: chefHeight * 0.097,
                },
              ]}
              introVisibleMs={800}
              repeatMs={3000}
              blinkClosedMs={250}
            />
          </View>

          <View
            pointerEvents="none"
            style={[
              styles.targetDropZone,
              wrong && styles.targetDropZoneWrong,
              { left: target.x, top: target.y, width: target.w, height: target.h },
            ]}
            onLayout={event => {
              const { x, y, width: w, height: h } = event.nativeEvent.layout;
              setTargetRect({ x, y, w, h });
            }}
          >
          </View>

          <View
            pointerEvents="none"
            style={[
              styles.counterBowl,
              {
                left: target.x - target.w * 0.022,
                top: target.y - target.h * 0.038,
                width: target.w * 1.044,
                height: target.h * 1.044,
              },
            ]}
          >
            <Image source={neliWorldAssets.kitchen.bowl} style={styles.counterBowlImage} resizeMode="contain" />
          </View>

          {recipe.steps.map((ingredient, index) => {
            const slot = slots[index];
            const disabled = usedIds.includes(ingredient.id) || done;
            return (
              <FoodTile
                key={ingredient.id}
                ingredient={ingredient}
                slot={slot}
                size={ingredientSize}
                disabled={disabled}
                onAttempt={handleDrop}
                resetToken={resetToken}
              />
            );
          })}

          {fly ? (
            <FlyingIngredient
              ingredient={fly.ingredient}
              from={fly.from}
              to={fly.to}
              size={ingredientSize}
              onDone={handleFlyDone}
            />
          ) : null}

          {done ? (
            <View
              pointerEvents="none"
              style={[
                styles.readyDishWrap,
                {
                  left: target.x - target.w * 0.48,
                  top: target.y - target.h * 0.68,
                  width: target.w * 2.15622,
                  height: target.h * 2.15622,
                },
              ]}
            >
              {renderReadyDish(recipe, target.w * 2.15622, target.h * 2.15622)}
            </View>
          ) : null}

          <View style={[styles.progressPill, wrong && styles.progressPillWrong]}>
            <Text style={[styles.progressText, { fontFamily: textFont('bold') }, dir(isFa ? 'fa' : lang)]}>
              {step}/{recipe.steps.length}
            </Text>
          </View>
        </View>

        {done ? (
          <View style={styles.doneRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => resetRecipe()}>
              <Text style={[styles.secondaryText, { fontFamily: faFont('bold') }, dir('fa')]}>{isFa ? 'دوباره' : 'Again'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: recipe.color }]} onPress={() => reset({ name: 'Main', tab: 'Games' })}>
              <Text style={[styles.primaryText, { fontFamily: textFont('bold') }, dir(isFa ? 'fa' : lang)]}>{isFa ? 'بازی‌ها' : 'Games'}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4E1B9' },
  scene: { flex: 1 },
  sceneWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(54, 31, 14, 0.06)' },
  sceneWashDone: { backgroundColor: 'rgba(255,255,255,0.40)' },
  recipeRow: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'stretch',
    marginHorizontal: 0,
    marginTop: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 0,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.88)',
  },
  recipeTab: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  recipeTabText: { color: '#5F2E19', fontSize: 11, lineHeight: 14, textAlign: 'center' },
  recipeTabTextOn: { color: '#FFFFFF' },
  prompt: {
    alignSelf: 'center',
    alignItems: 'center',
    minWidth: 250,
    maxWidth: 560,
    minHeight: 44,
    marginHorizontal: 18,
    marginTop: 10,
    paddingHorizontal: 18,
    paddingVertical: 2,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  title: { color: '#5F2E19', fontSize: 25, lineHeight: 32, textAlign: 'center' },
  subtitle: { color: '#8A4D27', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  donePromptText: { width: '100%' },
  stage: { flex: 1, position: 'relative', paddingBottom: 12, marginTop: 44 },
  chefNeliFrame: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 7,
    elevation: 7,
  },
  chefNeli: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  chefNeliBlink: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    elevation: 2,
  },
  targetDropZone: {
    position: 'absolute',
    borderRadius: 30,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  targetDropZoneWrong: {
    transform: [{ rotate: '-2deg' }],
  },
  ingredientTile: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 20,
    elevation: 20,
  },
  ingredientImage: {
    marginTop: 0,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  counterBowl: {
    position: 'absolute',
    zIndex: 12,
    elevation: 12,
  },
  counterBowlImage: {
    width: '100%',
    height: '100%',
  },
  readyDishWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 34,
    elevation: 34,
  },
  readyDish: {
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  topSpeakerBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(95, 46, 25, 0.12)',
  },
  topSpeakerIcon: {
    fontSize: 13,
    lineHeight: 16,
  },
  ingredientLabel: {
    marginTop: 4,
    color: '#5B4530',
    fontSize: 11,
    textAlign: 'center',
  },
  flyItem: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    elevation: 30,
  },
  progressPill: {
    position: 'absolute',
    top: 12,
    right: 16,
    minWidth: 72,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  progressPillWrong: {
    transform: [{ rotate: '-3deg' }],
  },
  progressText: {
    color: '#0F766E',
    fontSize: 14,
    textAlign: 'center',
  },
  doneRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#0EA5E9',
  },
  secondaryText: {
    color: '#0284C7',
    fontSize: 14,
    fontWeight: '900',
  },
  primaryBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
