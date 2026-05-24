import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppContext } from '../../store/AppContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useLandscapeDimensions } from '../../hooks/useLandscapeDimensions';
import TopBar from '../../components/TopBar';
import { characterAssets } from '../../assets/characterAssets';
import { dir, ff } from '../../theme/fonts';
import { neliWorldAssets } from '../../assets/neliWorldAssets';
import BlinkingNeliImage from '../../components/BlinkingNeliImage';

type IngredientKind = 'rice' | 'herb' | 'egg' | 'tomato' | 'pasta' | 'cheese' | 'water' | 'salt' | 'cucumber' | 'yogurt' | 'driedMint' | 'lemon' | 'lentils' | 'beans' | 'fish' | 'oil' | 'onion' | 'filletChickenRaw' | 'groundBeefRaw' | 'cutRawBeefForStew' | 'grapeLeaves' | 'reshtehAshRaw' | 'zereshk' | 'pizzaBread' | 'pizzaCheese' | 'lappeh' | 'mushroom' | 'bellPepper' | 'olive' | 'kalam' | 'saffron' | 'chickpea';
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
  menuSource: any;
  resultSource: any;
};

const ALL: Record<IngredientKind, Ingredient> = {
  rice: { id: 'rice', fa: 'برنج', en: 'Rice', source: neliWorldAssets.foods.rice, color: '#F8E39A' },
  herb: { id: 'herb', fa: 'سبزی', en: 'Herbs', source: neliWorldAssets.foods.herbs, color: '#22C55E' },
  egg: { id: 'egg', fa: 'تخم مرغ', en: 'Egg', source: neliWorldAssets.foods.eggWhole, color: '#FDE68A' },
  tomato: { id: 'tomato', fa: 'گوجه', en: 'Tomato', source: neliWorldAssets.foods.tomato, color: '#EF4444' },
  pasta: { id: 'pasta', fa: 'پاستا', en: 'Pasta', source: neliWorldAssets.foods.rawPasta, color: '#FBBF24' },
  cheese: { id: 'cheese', fa: 'پنیر', en: 'Cheese', source: neliWorldAssets.foods.cheese, color: '#F59E0B' },
  pizzaBread: { id: 'pizzaBread', fa: 'خمیر پیتزا', en: 'Pizza Bread', source: neliWorldAssets.foods.pizzaBread, color: '#FDBA74' },
  pizzaCheese: { id: 'pizzaCheese', fa: 'پنیر پیتزا', en: 'Pizza Cheese', source: neliWorldAssets.foods.pizzaCheese, color: '#FDE68A' },
  mushroom: { id: 'mushroom', fa: 'قارچ', en: 'Mushroom', source: neliWorldAssets.foods.mushroom, color: '#A78BFA' },
  bellPepper: { id: 'bellPepper', fa: 'فلفل دلمه', en: 'Bell Pepper', source: neliWorldAssets.foods.bellPepper, color: '#FB7185' },
  olive: { id: 'olive', fa: 'زیتون', en: 'Olive', source: neliWorldAssets.foods.olive, color: '#166534' },
  kalam: { id: 'kalam', fa: 'کلم', en: 'Cabbage', source: neliWorldAssets.foods.kalam, color: '#65A30D' },
  water: { id: 'water', fa: 'آب', en: 'Water', source: neliWorldAssets.foods.water, color: '#38BDF8' },
  salt: { id: 'salt', fa: 'نمک', en: 'Salt', source: neliWorldAssets.foods.salt, color: '#94A3B8' },
  cucumber: { id: 'cucumber', fa: 'خیار', en: 'Cucumber', source: neliWorldAssets.foods.cucumber, color: '#4ADE80' },
  yogurt: { id: 'yogurt', fa: 'ماست', en: 'Yogurt', source: neliWorldAssets.foods.yogurt, color: '#F8FAFC' },
  driedMint: { id: 'driedMint', fa: 'نعنا خشک', en: 'Dried Mint', source: neliWorldAssets.foods.driedMint, color: '#22C55E' },
  lemon: { id: 'lemon', fa: 'لیمو', en: 'Lemon', source: neliWorldAssets.foods.lemonSlice, color: '#FDE047' },
  lentils: { id: 'lentils', fa: 'عدس', en: 'Lentils', source: neliWorldAssets.foods.lentils, color: '#A16207' },
  chickpea: { id: 'chickpea', fa: 'نخود', en: 'Chickpea', source: neliWorldAssets.foods.chickpea, color: '#D4A657' },
  lappeh: { id: 'lappeh', fa: 'لپه', en: 'Split Peas', source: neliWorldAssets.foods.lappeh, color: '#C0842A' },
  beans: { id: 'beans', fa: 'لوبیا', en: 'Beans', source: neliWorldAssets.foods.beans, color: '#7C3AED' },
  fish: { id: 'fish', fa: 'ماهی', en: 'Fish', source: neliWorldAssets.foods.fish, color: '#38BDF8' },
  oil: { id: 'oil', fa: 'روغن', en: 'Oil', source: neliWorldAssets.kitchen.oil, color: '#F59E0B' },
  onion: { id: 'onion', fa: 'پیاز', en: 'Onion', source: neliWorldAssets.foods.onion, color: '#C084FC' },
  filletChickenRaw: { id: 'filletChickenRaw', fa: 'فیله', en: 'Chicken Fillet', source: neliWorldAssets.foods.filletChickenRaw, color: '#FBC4AB' },
  groundBeefRaw: { id: 'groundBeefRaw', fa: 'گوشت چرخ کرده', en: 'Ground Beef', source: neliWorldAssets.foods.groundBeefRaw, color: '#D97706' },
  cutRawBeefForStew: { id: 'cutRawBeefForStew', fa: 'گوشت خورشتی', en: 'Beef Chunks', source: neliWorldAssets.foods.cutRawBeefForStew, color: '#B45309' },
  grapeLeaves: { id: 'grapeLeaves', fa: 'برگ مو', en: 'Grape Leaves', source: neliWorldAssets.foods.grapeLeaves, color: '#65A30D' },
  reshtehAshRaw: { id: 'reshtehAshRaw', fa: 'رشته', en: 'Reshteh', source: neliWorldAssets.foods.reshtehAshRaw, color: '#B08968' },
  zereshk: { id: 'zereshk', fa: 'زرشک', en: 'Barberries', source: neliWorldAssets.foods.zereshk, color: '#B91C1C' },
  saffron: { id: 'saffron', fa: 'زعفران', en: 'Saffron', source: neliWorldAssets.foods.saffron, color: '#FACC15' },
};

const RECIPES: Recipe[] = [
  { id: 'sabzi-polo', fa: 'سبزی پلو با ماهی', en: 'Herb Rice with Fish', color: '#24C878', vessel: 'pot', steps: [ALL.rice, ALL.water, ALL.salt, ALL.herb, ALL.fish, ALL.oil], menuSource: neliWorldAssets.persianFoods.sabziPolo, resultSource: neliWorldAssets.persianFoods.sabziPolo },
  { id: 'omelette', fa: 'املت', en: 'Omelette', color: '#FF7B24', vessel: 'pan', steps: [ALL.egg, ALL.oil, ALL.tomato, ALL.salt], menuSource: neliWorldAssets.persianFoods.omelette, resultSource: neliWorldAssets.persianFoods.omelette },
  { id: 'pasta', fa: 'پاستا', en: 'Pasta', color: '#FFD53E', vessel: 'plate', steps: [ALL.water, ALL.oil, ALL.pasta, ALL.cheese, ALL.tomato], menuSource: neliWorldAssets.persianFoods.pasta, resultSource: neliWorldAssets.persianFoods.pasta },
  { id: 'mast-khiar', fa: 'ماست و خیار', en: 'Yogurt Cucumber', color: '#8B5CF6', vessel: 'plate', steps: [ALL.yogurt, ALL.cucumber, ALL.driedMint, ALL.salt], menuSource: neliWorldAssets.persianFoods.mastKhiar, resultSource: neliWorldAssets.persianFoods.mastKhiar },
  { id: 'shirazi-salad', fa: 'سالاد شیرازی', en: 'Shirazi Salad', color: '#F43F5E', vessel: 'plate', steps: [ALL.tomato, ALL.cucumber, ALL.onion, ALL.driedMint, ALL.lemon, ALL.salt], menuSource: neliWorldAssets.persianFoods.shiraziSalad, resultSource: neliWorldAssets.persianFoods.shiraziSalad },
  { id: 'kuku-sabzi', fa: 'کوکو سبزی', en: 'Herb Frittata', color: '#16A34A', vessel: 'pan', steps: [ALL.egg, ALL.herb, ALL.oil, ALL.salt], menuSource: neliWorldAssets.persianFoods.kukuSabzi, resultSource: neliWorldAssets.persianFoods.kukuSabzi },
  { id: 'tahchin', fa: 'ته چین', en: 'Tahchin', color: '#EAB308', vessel: 'pot', steps: [ALL.rice, ALL.egg, ALL.yogurt, ALL.filletChickenRaw, ALL.saffron, ALL.oil, ALL.salt], menuSource: neliWorldAssets.persianFoods.tahchin, resultSource: neliWorldAssets.persianFoods.tahchin },
  { id: 'ash-reshteh', fa: 'آش رشته', en: 'Aash Reshteh', color: '#CA8A04', vessel: 'pot', steps: [ALL.lentils, ALL.chickpea, ALL.beans, ALL.reshtehAshRaw, ALL.herb, ALL.salt], menuSource: neliWorldAssets.persianFoods.ashReshteh, resultSource: neliWorldAssets.persianFoods.ashReshteh },
  { id: 'kebab', fa: 'چلو کباب', en: 'Chelo Kebab', color: '#B45309', vessel: 'plate', steps: [ALL.rice, ALL.groundBeefRaw, ALL.onion, ALL.salt, ALL.oil, ALL.lemon], menuSource: neliWorldAssets.persianFoods.kebab, resultSource: neliWorldAssets.persianFoods.kebab },
  { id: 'jooje-kebab', fa: 'جوجه کباب', en: 'Jooje Kebab', color: '#F97316', vessel: 'plate', steps: [ALL.rice, ALL.filletChickenRaw, ALL.onion, ALL.lemon, ALL.salt, ALL.oil], menuSource: neliWorldAssets.persianFoods.jooje, resultSource: neliWorldAssets.persianFoods.jooje },
  { id: 'dolmeh', fa: 'دلمه', en: 'Dolmeh', color: '#10B981', vessel: 'plate', steps: [ALL.rice, ALL.grapeLeaves, ALL.herb, ALL.onion, ALL.lemon, ALL.salt], menuSource: neliWorldAssets.persianFoods.dolme, resultSource: neliWorldAssets.persianFoods.dolme },
  { id: 'ghormeh-sabzi', fa: 'قورمه سبزی', en: 'Ghormeh Sabzi', color: '#16A34A', vessel: 'pot', steps: [ALL.cutRawBeefForStew, ALL.herb, ALL.beans, ALL.onion, ALL.lemon, ALL.salt, ALL.oil], menuSource: neliWorldAssets.persianFoods.ghormeSabzi, resultSource: neliWorldAssets.persianFoods.ghormeSabzi },
  { id: 'kalam-polo', fa: 'کلم پلو', en: 'Kalam Polo', color: '#14B8A6', vessel: 'pot', steps: [ALL.rice, ALL.groundBeefRaw, ALL.kalam, ALL.onion, ALL.herb, ALL.salt, ALL.oil], menuSource: neliWorldAssets.persianFoods.kalamPolo, resultSource: neliWorldAssets.persianFoods.kalamPolo },
  { id: 'gheimeh', fa: 'قیمه', en: 'Gheimeh', color: '#EF4444', vessel: 'pot', steps: [ALL.cutRawBeefForStew, ALL.lappeh, ALL.onion, ALL.tomato, ALL.lemon, ALL.salt], menuSource: neliWorldAssets.persianFoods.gheimeh, resultSource: neliWorldAssets.persianFoods.gheimeh },
  { id: 'pizza', fa: 'پیتزا', en: 'Pizza', color: '#FB923C', vessel: 'plate', steps: [ALL.pizzaBread, ALL.tomato, ALL.pizzaCheese, ALL.mushroom, ALL.bellPepper, ALL.olive], menuSource: neliWorldAssets.persianFoods.pizza, resultSource: neliWorldAssets.persianFoods.pizza },
  { id: 'zereshk-polo', fa: 'زرشک پلو', en: 'Zereshk Polo', color: '#C026D3', vessel: 'pot', steps: [ALL.rice, ALL.zereshk, ALL.saffron, ALL.oil, ALL.salt], menuSource: neliWorldAssets.persianFoods.zereshkPolo, resultSource: neliWorldAssets.persianFoods.zereshkPolo },
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
  const lineY = target.y !== 0 && target.h > 1 ? lineYBase + height * 0.18 : lineYBase;
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
  const centerY = isLandscape ? height * 0.62 : height * 0.64;
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
    return <Image source={neliWorldAssets.foods.cookingOil} style={{ width: boxW, height: boxH, transform: [{ translateY: -4 }, { scale: 1.4 }] }} resizeMode="contain" />;
  }

  if (ingredient.id === 'pizzaBread') {
    return <Image source={neliWorldAssets.foods.pizzaBread} style={{ width: boxW, height: boxH, transform: [{ translateY: -6 }, { scale: 1.7 }] }} resizeMode="contain" />;
  }

  if (ingredient.id === 'egg') {
    return <Image source={neliWorldAssets.foods.eggWhole} style={{ width: boxW, height: boxH }} resizeMode="contain" />;
  }

  if (ingredient.id === 'cucumber') {
    return <Image source={neliWorldAssets.foods.cucumber} style={{ width: boxW, height: boxH }} resizeMode="contain" />;
  }

  if (ingredient.id === 'yogurt') {
    return <Image source={neliWorldAssets.foods.yogurt} style={{ width: boxW, height: boxH }} resizeMode="contain" />;
  }

  if (ingredient.id === 'lentils') {
    return <Image source={neliWorldAssets.foods.lentils} style={{ width: boxW, height: boxH }} resizeMode="contain" />;
  }

  if (ingredient.id === 'beans') {
    return <Image source={neliWorldAssets.foods.beans} style={{ width: boxW, height: boxH }} resizeMode="contain" />;
  }

  if (ingredient.id === 'reshtehAshRaw') {
    return <Image source={neliWorldAssets.foods.reshtehAshRaw} style={{ width: boxW, height: boxH, transform: [{ scale: 1.5 }] }} resizeMode="contain" />;
  }

  return <Image source={ingredient.source} style={{ width: boxW, height: boxH }} resizeMode="contain" />;
}

function renderReadyDish(recipe: Recipe, width: number, height: number) {
  return <Image source={recipe.resultSource} style={{ width: '100%', height: '100%' }} resizeMode="contain" />;
}

const READY_DISH_SCALE = 2.15622 * 1.61051;
const READY_DISH_TOP_RATIO = 0.78;

function getReadyDishFrame(target: Rect) {
  const width = target.w * READY_DISH_SCALE;
  const height = target.h * READY_DISH_SCALE;
  return {
    left: target.x + target.w * 0.5 - width * 0.5,
    top: target.y - target.h * READY_DISH_TOP_RATIO,
    width,
    height,
  };
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
  const touchWidth = Math.max(slot.w, size + 24);
  const touchHeight = Math.max(slot.h, size + 42);

  useEffect(() => {
    drag.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    setPressed(false);
  }, [drag, resetToken, scale]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onStartShouldSetPanResponderCapture: () => !disabled,
        onMoveShouldSetPanResponder: (_evt, gestureState) => !disabled && (Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3),
        onMoveShouldSetPanResponderCapture: (_evt, gestureState) => !disabled && (Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2),
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: () => {
          drag.stopAnimation();
          scale.stopAnimation();
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
          left: slot.x + slot.w / 2 - touchWidth / 2,
          top: slot.y + slot.h / 2 - touchHeight / 2,
          width: touchWidth,
          height: touchHeight,
          opacity: disabled ? 0.28 : pressed ? 0.95 : 1,
          zIndex: pressed ? 36 : 20,
          elevation: pressed ? 36 : 20,
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

function BowlAddEffect({
  target,
  color,
  size,
  onDone,
}: {
  target: Rect;
  color: string;
  size: number;
  onDone: () => void;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const offsets = useMemo(
    () => [
      { x: -0.26, y: -0.36 },
      { x: -0.1, y: -0.46 },
      { x: 0.08, y: -0.4 },
      { x: 0.23, y: -0.3 },
      { x: 0.0, y: -0.56 },
    ],
    [],
  );

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [onDone, progress]);

  const ringScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1.28] });
  const ringOpacity = progress.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.7, 0.45, 0] });
  const sparkleOpacity = progress.interpolate({ inputRange: [0, 0.68, 1], outputRange: [1, 0.85, 0] });
  const popScale = progress.interpolate({ inputRange: [0, 0.28, 1], outputRange: [0.7, 1.08, 0.9] });
  const center = {
    x: target.x + target.w * 0.5,
    y: target.y + target.h * 0.38,
  };
  const effectSize = Math.max(size * 1.05, Math.min(target.w, target.h) * 0.72);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bowlAddEffect,
        {
          left: center.x - effectSize / 2,
          top: center.y - effectSize / 2,
          width: effectSize,
          height: effectSize,
          opacity: sparkleOpacity,
          transform: [{ scale: popScale }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.bowlAddRing,
          {
            borderColor: color,
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          },
        ]}
      />
      {offsets.map((offset, index) => (
        <Animated.View
          key={`${offset.x}-${offset.y}-${index}`}
          style={[
            styles.bowlAddDot,
            {
              backgroundColor: index % 2 === 0 ? color : '#FFFFFF',
              transform: [
                { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, effectSize * offset.x] }) },
                { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, effectSize * offset.y] }) },
                { scale: progress.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0.7, 1.18, 0.42] }) },
              ],
              opacity: sparkleOpacity,
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

export default function CookingGame() {
  const { lang, addStars } = useContext(AppContext);
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
  const [bowlAdd, setBowlAdd] = useState<{ id: number; color: string } | null>(null);
  const [stageOrigin, setStageOrigin] = useState({ x: 0, y: 0 });
  const [recipeRowBottom, setRecipeRowBottom] = useState(0);

  const recipe = RECIPES[recipeIdx];
  const current = recipe.steps[step];
  const isFa = lang === 'fa' || lang === 'ar';
  const sceneSource = getCookingSceneSource(width, height);
  const textFont = (weight: 'regular' | 'bold' | 'black') => (isFa ? ff('fa', weight) : ff(lang, weight));
  const menuFont = (weight: 'regular' | 'bold' | 'black' = 'bold') => ff('fa', weight);
  const showRecipeThumb = Math.min(width, height) >= 600;
  const recipeRowHeight = showRecipeThumb ? 60 : 38;
  const ingredientSize = Math.max(52, Math.min(108, Math.round(Math.min(width, height) * 0.102)));
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
    setBowlAdd(null);
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
        x: Math.max(0, localPoint.x - ingredientSize / 2),
        y: Math.max(0, localPoint.y - ingredientSize / 2),
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
    if (fly) setBowlAdd({ id: Date.now(), color: fly.ingredient.color });
    setFly(null);
  };

  const resetRecipe = (index = recipeIdx) => {
    setRecipeIdx(index);
    setStep(0);
    setUsedIds([]);
    setDone(false);
    setWrong(false);
    setFly(null);
    setBowlAdd(null);
    setResetToken(prev => prev + 1);
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={sceneSource} style={styles.scene} resizeMode="cover">
        <View style={[styles.sceneWash, done && styles.sceneWashDone]} />
        <TopBar title="Cooking" titleFa="آشپزی" showBack dark topInset={10} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.recipeRow, { height: recipeRowHeight }]}
          contentContainerStyle={styles.recipeRowContent}
          onLayout={event => {
            const { y, height: rowHeight } = event.nativeEvent.layout;
            setRecipeRowBottom(y + rowHeight);
          }}
        >
          {RECIPES.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.recipeTab, index === recipeIdx && { backgroundColor: item.color }]}
              onPress={() => resetRecipe(index)}
            >
              {showRecipeThumb ? (
                <View style={styles.recipeTabImageWrap}>
                  <Image source={item.menuSource} style={styles.recipeTabImage} resizeMode="contain" />
                </View>
              ) : null}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.recipeTabText,
                  !showRecipeThumb && styles.recipeTabTextCompact,
                  isFa && styles.recipeTabTextFa,
                  index === recipeIdx && styles.recipeTabTextOn,
                  { fontFamily: menuFont('bold') },
                ]}
              >
                {isFa ? item.fa : item.en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
              source={characterAssets.neli.poses.cooking}
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

          {bowlAdd ? (
            <BowlAddEffect
              key={bowlAdd.id}
              target={target}
              color={bowlAdd.color}
              size={ingredientSize}
              onDone={() => setBowlAdd(null)}
            />
          ) : null}

          {done ? (
            (() => {
              const readyDishFrame = getReadyDishFrame(target);
              return (
            <View
              pointerEvents="none"
              style={[
                styles.readyDishWrap,
                readyDishFrame,
              ]}
            >
              {renderReadyDish(recipe, readyDishFrame.width, readyDishFrame.height)}
            </View>
              );
            })()
          ) : null}

          <View style={[styles.progressPill, wrong && styles.progressPillWrong]}>
            <Text style={[styles.progressText, { fontFamily: textFont('bold') }, dir(isFa ? 'fa' : lang)]}>
              {step}/{recipe.steps.length}
            </Text>
          </View>
        </View>

        <View style={[styles.prompt, done && styles.promptDone]}>
          {done ? (
            <Text style={[styles.subtitle, styles.donePromptText, { fontFamily: textFont('bold') }, dir(isFa ? 'fa' : lang)]}>
              {isFa ? `${recipe.fa} آماده است!` : `${recipe.en} is ready!`}
            </Text>
          ) : (
            <View style={styles.nextRow}>
              <Text style={[styles.subtitle, { fontFamily: textFont('bold') }, dir(isFa ? 'fa' : lang)]}>
                {isFa ? `بعدی: ${current.fa}` : `Next: ${current.en}`}
              </Text>
              <TouchableOpacity activeOpacity={0.85} style={styles.topSpeakerBtn} onPress={() => say(current.fa, current.en)}>
                <Text style={styles.topSpeakerIcon}>{'\u{1F50A}'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {done ? (
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.restartTapLayer, { top: recipeRowBottom }]}
            onPress={() => resetRecipe()}
          />
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
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    zIndex: 50,
    elevation: 50,
    alignSelf: 'stretch',
    marginHorizontal: 0,
    marginTop: 0,
    overflow: 'hidden',
    borderRadius: 0,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.70)',
  },
  recipeRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recipeTab: {
    width: 108,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingVertical: 0,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  recipeTabImageWrap: {
    width: 87,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  recipeTabImage: {
    width: 84,
    height: 32,
  },
  recipeTabText: { color: '#5F2E19', fontSize: 9, lineHeight: 11, textAlign: 'center' },
  recipeTabTextCompact: { fontSize: 11, lineHeight: 13 },
  recipeTabTextFa: { writingDirection: 'rtl', textAlign: 'center' },
  recipeTabTextOn: { color: '#FFFFFF' },
  prompt: {
    position: 'absolute',
    left: '50%',
    bottom: 18,
    width: 360,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 560,
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 2,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    zIndex: 42,
    elevation: 42,
    transform: [{ translateX: -198 }],
  },
  promptDone: {
    bottom: 26,
  },
  restartTapLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 60,
    elevation: 60,
  },
  title: { color: '#5F2E19', fontSize: 25, lineHeight: 32, textAlign: 'center' },
  subtitle: { color: '#8A4D27', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  donePromptText: { width: '100%', textAlignVertical: 'center' },
  stage: { flex: 1, position: 'relative', paddingBottom: 12, marginTop: 8 },
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
  bowlAddEffect: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 32,
    elevation: 32,
  },
  bowlAddRing: {
    position: 'absolute',
    width: '70%',
    height: '42%',
    borderRadius: 999,
    borderWidth: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  bowlAddDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
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
