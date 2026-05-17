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
import { AppContext } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useLandscapeDimensions } from '../../hooks/useLandscapeDimensions';
import TopBar from '../../components/TopBar';
import { dir, ff } from '../../theme/fonts';
import { neliWorldAssets, roomBackgroundPickers } from '../../assets/neliWorldAssets';

type IngredientKind = 'rice' | 'herb' | 'egg' | 'tomato' | 'pasta' | 'cheese' | 'water' | 'salt';
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
};

const RECIPES: Recipe[] = [
  { id: 'sabzi-polo', fa: 'سبزی پلو', en: 'Herb Rice', color: '#24C878', vessel: 'pot', steps: [ALL.rice, ALL.water, ALL.herb, ALL.salt] },
  { id: 'omelette', fa: 'املت', en: 'Omelette', color: '#FF7B24', vessel: 'pan', steps: [ALL.egg, ALL.tomato, ALL.salt] },
  { id: 'pasta', fa: 'پاستا', en: 'Pasta', color: '#FFD53E', vessel: 'plate', steps: [ALL.pasta, ALL.water, ALL.cheese] },
];

const COUNTER_ORDER: IngredientKind[] = ['rice', 'herb', 'egg', 'tomato', 'pasta', 'cheese', 'water', 'salt'];

function hit(rect: Rect, x: number, y: number) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function getCounterSlots(width: number, height: number): Slot[] {
  const isLandscape = width > height;
  const cols = 4;
  const gapX = isLandscape ? 10 : 12;
  const gapY = isLandscape ? 10 : 12;
  const cardW = Math.min(isLandscape ? 124 : 92, Math.max(72, Math.floor((width - 44 - gapX * (cols - 1)) / cols)));
  const cardH = isLandscape ? 108 : 96;
  const totalW = cardW * cols + gapX * (cols - 1);
  const left = Math.max(18, Math.floor((width - totalW) / 2));
  const bandTop = Math.max(height - (cardH * 2 + gapY + 42), Math.floor(height * (isLandscape ? 0.71 : 0.73)));

  return COUNTER_ORDER.map((_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      x: left + col * (cardW + gapX),
      y: bandTop + row * (cardH + gapY),
      w: cardW,
      h: cardH,
    };
  });
}

function getTargetRect(width: number, height: number, recipe: Recipe): Rect {
  const isLandscape = width > height;
  const centerX = isLandscape ? width * 0.56 : width * 0.54;
  const centerY =
    recipe.vessel === 'pan'
      ? (isLandscape ? height * 0.43 : height * 0.46)
      : recipe.vessel === 'plate'
        ? (isLandscape ? height * 0.42 : height * 0.44)
        : (isLandscape ? height * 0.40 : height * 0.43);
  const w = isLandscape ? width * 0.25 : width * 0.32;
  const h = isLandscape ? height * 0.22 : height * 0.19;
  return { x: centerX - w / 2, y: centerY - h / 2, w, h };
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
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
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
          opacity: disabled ? 0.34 : pressed ? 0.95 : 1,
          transform: [{ translateX: drag.x }, { translateY: drag.y }, { scale }],
        },
      ]}
    >
      <View style={[styles.ingredientCard, { borderColor: `${ingredient.color}55` }, disabled && styles.ingredientCardDisabled]}>
        <Image source={ingredient.source} style={{ width: size, height: size }} resizeMode="contain" />
      </View>
      <Text style={[styles.ingredientLabel, { fontFamily: ff('fa', 'bold') }]}>{ingredient.fa}</Text>
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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(x, { toValue: to.x, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(y, { toValue: to.y, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.7, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [onDone, opacity, scale, to.x, to.y, x, y]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.flyItem,
        {
          transform: [{ translateX: x }, { translateY: y }, { scale }],
          opacity,
        },
      ]}
    >
      <Image source={ingredient.source} style={{ width: size, height: size }} resizeMode="contain" />
    </Animated.View>
  );
}

export default function CookingGame() {
  const { lang, addStars } = useContext(AppContext);
  const { reset } = useNav();
  const { width, height } = useLandscapeDimensions();
  const { speakFarsiOnly, speakInLang, stop } = useSpeech();
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [usedIds, setUsedIds] = useState<IngredientKind[]>([]);
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect>({ x: 0, y: 0, w: 1, h: 1 });
  const [fly, setFly] = useState<{ ingredient: Ingredient; from: Point; to: Point } | null>(null);

  const recipe = RECIPES[recipeIdx];
  const current = recipe.steps[step];
  const isFa = lang === 'fa' || lang === 'ar';
  const sceneSource = roomBackgroundPickers.kitchen(width, height);
  const textFont = (weight: 'regular' | 'bold' | 'black') => (isFa ? ff('fa', weight) : ff(lang, weight));
  const slots = useMemo(() => getCounterSlots(width, height), [height, width]);
  const ingredientSize = Math.max(48, Math.min(84, Math.round(Math.min(width, height) * 0.082)));
  const target = useMemo(() => getTargetRect(width, height, recipe), [height, recipe, width]);

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

  const handleDrop = (ingredient: Ingredient, point: Point) => {
    if (done || usedIds.includes(ingredient.id)) return;
    if (ingredient.id !== current.id || !hit(target, point.x, point.y)) {
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
        x: target.x + target.w * 0.5 - ingredientSize / 2,
        y: target.y + target.h * 0.5 - ingredientSize / 2,
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
        <View style={styles.sceneWash} />
        <TopBar title="Cooking" titleFa="آشپزی" showBack dark topInset={10} />

        <View style={styles.recipeRow}>
          {RECIPES.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.recipeTab, index === recipeIdx && { backgroundColor: item.color }]}
              onPress={() => resetRecipe(index)}
            >
              <Text style={[styles.recipeTabText, index === recipeIdx && styles.recipeTabTextOn, { fontFamily: textFont('bold') }]}>
                {isFa ? item.fa : item.en}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.prompt}>
          <Text style={[styles.title, { fontFamily: textFont('black') }, dir(lang)]}>{isFa ? recipe.fa : recipe.en}</Text>
          <Text style={[styles.subtitle, { fontFamily: textFont('bold') }, dir(lang)]}>
            {done
              ? isFa
                ? 'غذا آماده است!'
                : 'Food is ready!'
              : isFa
                ? `بعدی: ${current.fa}`
                : `Next: ${current.en}`}
          </Text>
        </View>

        <View style={styles.stage}>
          <View
            style={[styles.targetGlow, wrong && styles.targetGlowWrong, { left: target.x, top: target.y, width: target.w, height: target.h }]}
            onLayout={event => {
              const { x, y, width: w, height: h } = event.nativeEvent.layout;
              setTargetRect({ x, y, w, h });
            }}
          >
            <View style={styles.targetInner}>
              <Text style={[styles.targetText, { fontFamily: textFont('bold') }, dir(lang)]}>
                {isFa ? 'روی ظرف بکش' : 'Drag into the pan'}
              </Text>
            </View>
          </View>

          <View style={styles.counterShelf}>
            <Text style={[styles.counterLabel, { fontFamily: textFont('bold') }, dir(lang)]}>
              {isFa ? 'روی پیشخوان' : 'On the counter'}
            </Text>
          </View>

          {slots.map((slot, index) => {
            const ingredient = ALL[COUNTER_ORDER[index]];
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

          <View style={[styles.progressPill, wrong && styles.progressPillWrong]}>
            <Text style={[styles.progressText, { fontFamily: textFont('bold') }]}>
              {step}/{recipe.steps.length}
            </Text>
          </View>
        </View>

        {done ? (
          <View style={styles.doneRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => resetRecipe()}>
              <Text style={[styles.secondaryText, { fontFamily: textFont('bold') }]}>{isFa ? 'دوباره' : 'Again'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: recipe.color }]} onPress={() => reset({ name: 'Main', tab: 'Games' })}>
              <Text style={[styles.primaryText, { fontFamily: textFont('bold') }]}>{isFa ? 'بازی‌ها' : 'Games'}</Text>
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
  recipeRow: { flexDirection: 'row', gap: 8, marginHorizontal: 14, marginTop: 8 },
  recipeTab: {
    flex: 1,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 4.5,
    borderColor: '#FFFFFF',
  },
  recipeTabText: { color: '#5F2E19', fontSize: 11, fontWeight: '900' },
  recipeTabTextOn: { color: '#FFFFFF' },
  prompt: {
    alignSelf: 'center',
    minWidth: 250,
    maxWidth: 560,
    marginHorizontal: 18,
    marginTop: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  title: { color: '#5F2E19', fontSize: 25, lineHeight: 32, textAlign: 'center' },
  subtitle: { color: '#8A4D27', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  stage: { flex: 1, position: 'relative', paddingBottom: 12 },
  targetGlow: {
    position: 'absolute',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  targetGlowWrong: {
    transform: [{ rotate: '-2deg' }],
    borderColor: 'rgba(255, 90, 90, 0.65)',
  },
  targetInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  targetText: { color: '#FFFFFF', fontSize: 13, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.18)', textShadowRadius: 6 },
  counterShelf: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
    height: 148,
    borderRadius: 28,
    backgroundColor: 'rgba(255,245,230,0.92)',
    borderWidth: 4,
    borderColor: '#FFF8EF',
    shadowColor: '#7C4A1F',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  counterLabel: {
    position: 'absolute',
    top: 8,
    left: 16,
    color: '#A35C2E',
    fontSize: 12,
  },
  ingredientTile: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ingredientCard: {
    width: '100%',
    height: '72%',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ingredientCardDisabled: {
    backgroundColor: 'rgba(255,255,255,0.55)',
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
