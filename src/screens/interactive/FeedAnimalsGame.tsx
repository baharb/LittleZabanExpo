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
import { neliWorldAssets } from '../../assets/neliWorldAssets';
import { FEED_ANIMAL_SVG_MAP } from '../../components/Characters';

type AnimalId = 'rabbit' | 'cat' | 'elephant' | 'panda' | 'bear';
type FoodId = 'carrot' | 'fish' | 'banana' | 'apple' | 'honey';
type Rect = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };

type Animal = {
  id: AnimalId;
  fa: string;
  en: string;
  foodId: FoodId;
  foodFa: string;
  foodEn: string;
  color: string;
};

type Food = {
  id: FoodId;
  fa: string;
  en: string;
  source: any;
  color: string;
};

const ANIMALS: Animal[] = [
  { id: 'rabbit', fa: 'خرگوش', en: 'Rabbit', foodId: 'carrot', foodFa: 'هویج', foodEn: 'Carrot', color: '#FF8E3C' },
  { id: 'cat', fa: 'گربه', en: 'Cat', foodId: 'fish', foodFa: 'ماهی', foodEn: 'Fish', color: '#FDBA74' },
  { id: 'elephant', fa: 'فیل', en: 'Elephant', foodId: 'banana', foodFa: 'موز', foodEn: 'Banana', color: '#7C3AED' },
  { id: 'panda', fa: 'پاندا', en: 'Panda', foodId: 'apple', foodFa: 'سیب', foodEn: 'Apple', color: '#111827' },
  { id: 'bear', fa: 'خرس', en: 'Bear', foodId: 'honey', foodFa: 'عسل', foodEn: 'Honey', color: '#8B5E3C' },
];

const FOODS: Food[] = [
  { id: 'carrot', fa: 'هویج', en: 'Carrot', source: neliWorldAssets.foods.carrot, color: '#F97316' },
  { id: 'fish', fa: 'ماهی', en: 'Fish', source: neliWorldAssets.foods.fish, color: '#38BDF8' },
  { id: 'banana', fa: 'موز', en: 'Banana', source: neliWorldAssets.foods.banana, color: '#FACC15' },
  { id: 'apple', fa: 'سیب', en: 'Apple', source: neliWorldAssets.foods.apple, color: '#EF4444' },
  { id: 'honey', fa: 'عسل', en: 'Honey', source: neliWorldAssets.foods.honey, color: '#EAB308' },
];

const TRAY_ORDER: FoodId[] = ['banana', 'apple', 'carrot', 'honey', 'fish'];

const FOOD_BY_ID = Object.fromEntries(FOODS.map(item => [item.id, item])) as Record<FoodId, Food>;
const ANIMAL_BY_FOOD_ID = Object.fromEntries(ANIMALS.map(animal => [animal.foodId, animal])) as Record<FoodId, Animal>;

function hit(rect: Rect, x: number, y: number) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function getFedPlacement(target: Rect, foodSize: number, animalId: AnimalId): Rect {
  const offsets: Record<AnimalId, { x: number; y: number; scale: number }> = {
    rabbit: { x: 0.54, y: 0.54, scale: 0.98 },
    cat: { x: 0.56, y: 0.56, scale: 0.98 },
    elephant: { x: 0.58, y: 0.50, scale: 1.04 },
    panda: { x: 0.52, y: 0.48, scale: 0.98 },
    bear: { x: 0.55, y: 0.53, scale: 1.00 },
  };
  const offset = offsets[animalId];
  const size = Math.max(42, Math.round(foodSize * offset.scale));
  return {
    x: target.x + target.w * offset.x - size * 0.5,
    y: target.y + target.h * offset.y - size * 0.5,
    w: size,
    h: size,
  };
}

function getFedAnchor(animalId: AnimalId, foodSize: number) {
  const anchors: Record<AnimalId, { x: number; y: number; scale: number }> = {
    rabbit: { x: 0.54, y: 0.53, scale: 0.98 },
    cat: { x: 0.56, y: 0.55, scale: 0.98 },
    elephant: { x: 0.58, y: 0.49, scale: 1.02 },
    panda: { x: 0.52, y: 0.47, scale: 0.98 },
    bear: { x: 0.55, y: 0.52, scale: 1.00 },
  };
  const anchor = anchors[animalId];
  const size = Math.max(42, Math.round(foodSize * anchor.scale));
  return {
    left: Math.round(110 * anchor.x - size * 0.5),
    top: Math.round(150 * anchor.y - size * 0.5),
    width: size,
    height: size,
  };
}

function animalSlots(width: number, height: number) {
  const isLandscape = width > height;
  const w = 110;
  const h = 150;
  const yShift = Math.round(height * 0.06);
  if (isLandscape) {
    return [
      { x: Math.max(6, Math.round(width * 0.03)), y: Math.max(18, Math.round(height * 0.15)) + yShift, w, h },
      { x: Math.max(6, Math.round(width * 0.22)), y: Math.max(10, Math.round(height * 0.09)) + yShift, w, h },
      { x: Math.max(6, Math.round(width * 0.42)), y: Math.max(18, Math.round(height * 0.15)) + yShift, w, h },
      { x: Math.max(6, Math.round(width * 0.62)), y: Math.max(10, Math.round(height * 0.09)) + yShift, w, h },
      { x: Math.max(6, Math.round(width * 0.80)), y: Math.max(18, Math.round(height * 0.16)) + yShift, w, h },
    ];
  }
  return [
    { x: Math.max(8, Math.round(width * 0.06)), y: Math.max(14, Math.round(height * 0.10)) + yShift, w, h },
    { x: Math.max(8, Math.round(width - width * 0.06 - w)), y: Math.max(14, Math.round(height * 0.10)) + yShift, w, h },
    { x: Math.max(8, Math.round(width * 0.08)), y: Math.max(14, Math.round(height * 0.38)) + yShift, w, h },
    { x: Math.max(8, Math.round(width - width * 0.08 - w)), y: Math.max(14, Math.round(height * 0.38)) + yShift, w, h },
    { x: Math.max(8, Math.round(width * 0.5 - w / 2)), y: Math.max(14, Math.round(height * 0.62)) + yShift, w, h },
  ];
}

function foodSlots(width: number, height: number) {
  const isLandscape = width > height;
  const cols = isLandscape ? 5 : 3;
  const cardW = Math.min(isLandscape ? 92 : 86, Math.max(64, (width - 44 - 10 * (cols - 1)) / cols));
  const cardH = isLandscape ? 96 : 90;
  const gapX = 10;
  const gapY = 10;
  const totalW = cardW * cols + gapX * (cols - 1);
  const left = Math.max(18, Math.round((width - totalW) / 2));
  const top = Math.round(height * (isLandscape ? 0.34 : 0.42)) + Math.round(height * 0.06);

  return TRAY_ORDER.map((_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      x: left + col * (cardW + gapX),
      y: top + row * (cardH + gapY),
      w: cardW,
      h: cardH,
    };
  });
}

function AnimalSpot({
  animal,
  active,
  width,
}: {
  animal: Animal;
  active: boolean;
  width: number;
}) {
  const AnimalSvg = FEED_ANIMAL_SVG_MAP[animal.id] ?? FEED_ANIMAL_SVG_MAP.panda;

  return (
    <View style={styles.animalSpot}>
      <View style={[styles.animalCard, active && styles.animalCardActive]}>
        <AnimalSvg size={Math.max(88, Math.min(128, width * 0.14))} />
      </View>
      <Text style={[styles.animalLabel, { fontFamily: ff('fa', 'bold') }]}>{animal.fa}</Text>
    </View>
  );
}

function FoodTile({
  food,
  slot,
  size,
  disabled,
  onAttempt,
  resetToken,
}: {
  food: Food;
  slot: Rect;
  size: number;
  disabled: boolean;
  onAttempt: (food: Food, point: Point) => void;
  resetToken: number;
}) {
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    drag.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    setPressed(false);
  }, [resetToken, drag, scale]);

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
          onAttempt(food, { x: gestureState.moveX, y: gestureState.moveY });
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
    [disabled, drag, food, onAttempt, scale],
  );

  return (
    <Animated.View
      {...pan.panHandlers}
      style={[
        styles.foodTile,
        !disabled && styles.foodTileActive,
        {
          left: slot.x,
          top: slot.y,
          width: slot.w,
          height: slot.h,
          opacity: disabled ? 0.34 : pressed ? 0.96 : 1,
          transform: [{ translateX: drag.x }, { translateY: drag.y }, { scale }],
        },
      ]}
    >
      <Image
        source={food.source}
        style={[
          styles.foodImage,
          {
            width: size + 8,
            height: size + 8,
          },
        ]}
        resizeMode="contain"
      />
      <Text style={[styles.foodLabel, { fontFamily: ff('fa', 'bold') }]}>{food.fa}</Text>
    </Animated.View>
  );
}

function FlyingFood({
  food,
  from,
  to,
  size,
  onDone,
}: {
  food: Food;
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
      Animated.timing(x, { toValue: to.x, duration: 540, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(y, { toValue: to.y, duration: 540, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.62, duration: 540, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 540, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [onDone, opacity, scale, to.x, to.y, x, y]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.flyingFood,
        {
          transform: [{ translateX: x }, { translateY: y }, { scale }],
          opacity,
        },
      ]}
    >
      <Image source={food.source} style={{ width: size, height: size }} resizeMode="contain" />
    </Animated.View>
  );
}

export default function FeedAnimalsGame() {
  const { lang, addStars } = useContext(AppContext);
  const { reset } = useNav();
  const { width, height } = useLandscapeDimensions();
  const { speakFarsiOnly, speakInLang, stop } = useSpeech();
  const stageRef = useRef<View>(null);
  const isFa = lang === 'fa' || lang === 'ar';
  const sceneSource = useMemo(() => {
    if (width > height) {
      return width / height > 1.45 ? neliWorldAssets.rooms.feedAnimalsJungle : neliWorldAssets.rooms.feedAnimalsJungleTabletLandscape;
    }
    return height / width > 1.4 ? neliWorldAssets.rooms.feedAnimalsJunglePortrait : neliWorldAssets.rooms.feedAnimalsJungleTabletPortrait;
  }, [height, width]);

  const [fedIds, setFedIds] = useState<FoodId[]>([]);
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [stageOrigin, setStageOrigin] = useState({ x: 0, y: 0 });
  const [animalRects, setAnimalRects] = useState<Record<AnimalId, Rect>>({
    rabbit: { x: 0, y: 0, w: 1, h: 1 },
    cat: { x: 0, y: 0, w: 1, h: 1 },
    elephant: { x: 0, y: 0, w: 1, h: 1 },
    panda: { x: 0, y: 0, w: 1, h: 1 },
    bear: { x: 0, y: 0, w: 1, h: 1 },
  });
  const [fly, setFly] = useState<{ food: Food; from: Point; to: Point } | null>(null);
  const [fedFoodByAnimal, setFedFoodByAnimal] = useState<Record<AnimalId, FoodId | null>>({
    rabbit: null,
    cat: null,
    elephant: null,
    panda: null,
    bear: null,
  });

  const currentAnimal = useMemo(() => ANIMALS.find(animal => !fedIds.includes(animal.foodId)) ?? ANIMALS[ANIMALS.length - 1], [fedIds]);
  const currentFood = FOOD_BY_ID[currentAnimal.foodId];
  const animalLayout = useMemo(() => animalSlots(width, height), [height, width]);
  const foodLayout = useMemo(() => foodSlots(width, height), [height, width]);
  const foodSize = Math.max(48, Math.min(78, Math.round(Math.min(width, height) * 0.085)));

  const say = (fa: string, en: string) => {
    stop();
    speakFarsiOnly(fa, () => {
      if (!isFa) setTimeout(() => speakInLang(en, lang), 220);
    });
  };

  useEffect(() => {
    if (!done) {
      say(`به ${currentAnimal.fa} غذا بده.`, `Feed the ${currentAnimal.en}.`);
    }
  }, [currentAnimal.id, done]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!done && fedIds.length === ANIMALS.length) {
      setDone(true);
      say('آفرین! همه حیوان‌ها سیر شدند.', 'Great job! All the animals are full.');
    }
  }, [done, fedIds.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshStageOrigin = () => {
    stageRef.current?.measureInWindow((x, y) => {
      setStageOrigin({ x, y });
    });
  };

  const handleAttempt = (food: Food, point: Point) => {
    if (done) return;
    const matchedAnimal = ANIMAL_BY_FOOD_ID[food.id];
    const target = animalRects[matchedAnimal.id];
    const localPoint = {
      x: point.x - stageOrigin.x,
      y: point.y - stageOrigin.y,
    };
    const marginX = Math.max(36, target.w * 0.52);
    const marginY = Math.max(30, target.h * 0.38);
    const nearTarget =
      localPoint.x >= target.x - marginX &&
      localPoint.x <= target.x + target.w + marginX &&
      localPoint.y >= target.y - marginY &&
      localPoint.y <= target.y + target.h + marginY;

    if (!nearTarget) {
      setWrong(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => setWrong(false), 480);
      say('این غذا برای این حیوان نیست.', 'That is not the right food.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addStars(1);
    setFedIds(prev => (prev.includes(food.id) ? prev : [...prev, food.id]));
    const fedPlacement = getFedPlacement(target, foodSize, matchedAnimal.id);
    setFedFoodByAnimal(prev => ({
      ...prev,
      [matchedAnimal.id]: food.id,
    }));
    setFly({
      food,
      from: {
        x: Math.max(0, point.x - foodSize / 2),
        y: Math.max(0, point.y - foodSize / 2),
      },
      to: { x: fedPlacement.x, y: fedPlacement.y },
    });
    say(`${food.fa} برای ${matchedAnimal.fa}.`, `${food.en} for the ${matchedAnimal.en}.`);
  };

  const handleFlyDone = () => {
    setFly(null);
  };

  const resetGame = () => {
    setFedIds([]);
    setDone(false);
    setWrong(false);
    setFly(null);
    setFedFoodByAnimal({
      rabbit: null,
      cat: null,
      elephant: null,
      panda: null,
      bear: null,
    });
    setResetToken(prev => prev + 1);
    say('بیا دوباره غذا بدهیم.', 'Let us feed them again.');
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={sceneSource} style={styles.scene} resizeMode="cover">
        <View style={styles.sceneWash} />
        <TopBar title="Feed Animals" titleFa="غذا دادن به حیوان‌ها" showBack dark topInset={10} />

        <View style={styles.header}>
          <Text style={[styles.kicker, { fontFamily: ff(isFa ? 'fa' : lang, 'bold') }, dir(lang)]}>
            {isFa ? 'غذای درست را روی حیوان بکش' : 'Drag the correct food over the animal'}
          </Text>
        </View>

        <View ref={stageRef} style={styles.stage} onLayout={refreshStageOrigin}>
          {animalLayout.map((slot, index) => {
            const animal = ANIMALS[index];
            const active = animal.id === currentAnimal.id;
            const fed = fedIds.includes(animal.foodId);
            const fedFoodId = fedFoodByAnimal[animal.id];
            return (
              <View
                key={animal.id}
                style={[styles.animalWrap, { left: slot.x, top: slot.y, width: slot.w, height: slot.h }]}
                onLayout={event => {
                  const { x, y, width: w, height: h } = event.nativeEvent.layout;
                  setAnimalRects(prev => ({ ...prev, [animal.id]: { x, y, w, h } }));
                }}
              >
                <AnimalSpot animal={animal} active={active} width={width} />
                {fedFoodId ? (
                  <View
                    pointerEvents="none"
                    style={[
                      styles.animalFoodOverlay,
                      getFedAnchor(animal.id, foodSize),
                    ]}
                  >
                    <Image
                      source={FOOD_BY_ID[fedFoodId].source}
                      style={styles.animalFoodImage}
                      resizeMode="contain"
                    />
                  </View>
                ) : null}
              </View>
            );
          })}

          {foodLayout.map((slot, index) => {
            const food = FOOD_BY_ID[TRAY_ORDER[index]];
            const disabled = fedIds.includes(food.id) || done;
            return (
              <FoodTile
                key={food.id}
                food={food}
                slot={slot}
                size={foodSize}
                disabled={disabled}
                onAttempt={handleAttempt}
                resetToken={resetToken}
              />
            );
          })}

          {fly ? (
            <FlyingFood
              food={fly.food}
              from={fly.from}
              to={fly.to}
              size={foodSize}
              onDone={handleFlyDone}
            />
          ) : null}

          <View style={[styles.progressPill, wrong && styles.progressPillWrong]}>
            <Text style={[styles.progressText, { fontFamily: ff(isFa ? 'fa' : lang, 'bold') }, dir(lang)]}>
              {fedIds.length}/{FOODS.length}
            </Text>
          </View>
        </View>

        {done ? (
          <View style={styles.doneRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={resetGame}>
              <Text style={[styles.secondaryText, { fontFamily: ff(isFa ? 'fa' : lang, 'bold') }]}>{isFa ? 'دوباره' : 'Again'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => reset({ name: 'Main', tab: 'Games' })}>
              <Text style={[styles.primaryText, { fontFamily: ff(isFa ? 'fa' : lang, 'bold') }]}>{isFa ? 'بازی‌ها' : 'Games'}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#DFF7FF' },
  scene: { flex: 1 },
  sceneWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(40, 24, 12, 0.06)' },
  header: {
    alignSelf: 'center',
    width: '56%',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.50)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: { color: '#0F766E', fontSize: 13, textAlign: 'center' },
  title: { color: '#334155', fontSize: 24, lineHeight: 30, textAlign: 'center' },
  subtitle: { color: '#64748B', fontSize: 13, lineHeight: 18, textAlign: 'center', marginTop: 4 },
  stage: { flex: 1, position: 'relative', paddingTop: 10, paddingBottom: 10 },
  animalWrap: {
    position: 'absolute',
    width: 110,
    height: 150,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  animalSpot: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  animalCard: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalCardActive: {
    transform: [{ scale: 1.06 }],
  },
  animalCardDone: {
    opacity: 1,
  },
  animalLabel: {
    marginTop: 6,
    color: '#2F2F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  foodTile: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  foodImage: {
    marginTop: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  foodLabel: {
    marginTop: 2,
    color: '#2F2F2F',
    fontSize: 13,
    textAlign: 'center',
  },
  fedOverlay: {
    position: 'absolute',
  },
  animalFoodOverlay: {
    position: 'absolute',
    zIndex: 40,
    elevation: 40,
  },
  animalFoodImage: {
    width: '100%',
    height: '100%',
  },
  fedFoodImage: {
    width: '100%',
    height: '100%',
  },
  foodTileActive: {
    zIndex: 20,
    elevation: 20,
  },
  flyingFood: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 92,
    height: 92,
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
    bottom: 18,
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
    backgroundColor: '#0EA5E9',
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
