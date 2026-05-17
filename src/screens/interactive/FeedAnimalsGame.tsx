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
  { id: 'panda', fa: 'پاندا', en: 'Panda', foodId: 'honey', foodFa: 'عسل', foodEn: 'Honey', color: '#111827' },
  { id: 'bear', fa: 'خرس', en: 'Bear', foodId: 'apple', foodFa: 'سیب', foodEn: 'Apple', color: '#8B5E3C' },
];

const FOODS: Food[] = [
  { id: 'carrot', fa: 'هویج', en: 'Carrot', source: neliWorldAssets.foods.carrot, color: '#F97316' },
  { id: 'fish', fa: 'ماهی', en: 'Fish', source: neliWorldAssets.foods.fish, color: '#38BDF8' },
  { id: 'banana', fa: 'موز', en: 'Banana', source: neliWorldAssets.foods.banana, color: '#FACC15' },
  { id: 'apple', fa: 'سیب', en: 'Apple', source: neliWorldAssets.foods.apple, color: '#EF4444' },
  { id: 'honey', fa: 'عسل', en: 'Honey', source: neliWorldAssets.foods.honey, color: '#EAB308' },
];

const FOOD_BY_ID = Object.fromEntries(FOODS.map(item => [item.id, item])) as Record<FoodId, Food>;

function hit(rect: Rect, x: number, y: number) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function animalSlots(width: number, height: number) {
  const isLandscape = width > height;
  const w = 110;
  const h = 150;
  if (isLandscape) {
    return [
      { x: Math.max(6, Math.round(width * 0.03)), y: Math.max(18, Math.round(height * 0.15)), w, h },
      { x: Math.max(6, Math.round(width * 0.22)), y: Math.max(10, Math.round(height * 0.09)), w, h },
      { x: Math.max(6, Math.round(width * 0.42)), y: Math.max(18, Math.round(height * 0.15)), w, h },
      { x: Math.max(6, Math.round(width * 0.62)), y: Math.max(10, Math.round(height * 0.09)), w, h },
      { x: Math.max(6, Math.round(width * 0.80)), y: Math.max(18, Math.round(height * 0.16)), w, h },
    ];
  }
  return [
    { x: Math.max(8, Math.round(width * 0.06)), y: Math.max(14, Math.round(height * 0.10)), w, h },
    { x: Math.max(8, Math.round(width - width * 0.06 - w)), y: Math.max(14, Math.round(height * 0.10)), w, h },
    { x: Math.max(8, Math.round(width * 0.08)), y: Math.max(14, Math.round(height * 0.38)), w, h },
    { x: Math.max(8, Math.round(width - width * 0.08 - w)), y: Math.max(14, Math.round(height * 0.38)), w, h },
    { x: Math.max(8, Math.round(width * 0.5 - w / 2)), y: Math.max(14, Math.round(height * 0.62)), w, h },
  ];
}

function foodSlots(width: number, height: number) {
  const isLandscape = width > height;
  const cardW = Math.min(isLandscape ? 126 : 96, Math.max(74, (width - 56) / 4));
  const cardH = isLandscape ? 108 : 94;
  const gapX = 12;
  const gapY = 12;
  const totalW = cardW * 4 + gapX * 3;
  const left = Math.max(18, Math.round((width - totalW) / 2));
  const top = Math.max(height - (cardH * 2 + gapY + 30), Math.round(height * (isLandscape ? 0.70 : 0.72)));

  return FOODS.map((_, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
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
  done,
  width,
}: {
  animal: Animal;
  active: boolean;
  done: boolean;
  width: number;
}) {
  const AnimalSvg = FEED_ANIMAL_SVG_MAP[animal.id] ?? FEED_ANIMAL_SVG_MAP.panda;

  return (
    <View style={styles.animalSpot}>
      <View style={[styles.animalAura, active && { backgroundColor: `${animal.color}22`, borderColor: `${animal.color}55` }, done && styles.animalDoneAura]} />
      <View style={[styles.animalCard, active && styles.animalCardActive, done && styles.animalCardDone]}>
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
      <View style={[styles.foodBubble, { borderColor: `${food.color}55` }, disabled && styles.foodBubbleDisabled]}>
        <Image source={food.source} style={{ width: size, height: size }} resizeMode="contain" />
      </View>
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
  const isFa = lang === 'fa' || lang === 'ar';
  const sceneSource = useMemo(() => {
    if (width > height) {
      return width / height > 1.45 ? neliWorldAssets.rooms.feedAnimalsJungle : neliWorldAssets.rooms.feedAnimalsJungleTabletLandscape;
    }
    return height / width > 1.4 ? neliWorldAssets.rooms.feedAnimalsJunglePortrait : neliWorldAssets.rooms.feedAnimalsJungleTabletPortrait;
  }, [height, width]);

  const [animalIndex, setAnimalIndex] = useState(0);
  const [fedIds, setFedIds] = useState<FoodId[]>([]);
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [animalRects, setAnimalRects] = useState<Record<AnimalId, Rect>>({
    rabbit: { x: 0, y: 0, w: 1, h: 1 },
    cat: { x: 0, y: 0, w: 1, h: 1 },
    elephant: { x: 0, y: 0, w: 1, h: 1 },
    panda: { x: 0, y: 0, w: 1, h: 1 },
    bear: { x: 0, y: 0, w: 1, h: 1 },
  });
  const [fly, setFly] = useState<{ food: Food; from: Point; to: Point } | null>(null);

  const currentAnimal = ANIMALS[animalIndex];
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
    say(`به ${currentAnimal.fa} غذا بده.`, `Feed the ${currentAnimal.en}.`);
  }, [animalIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAttempt = (food: Food, point: Point) => {
    if (done) return;
    const expectedFood = currentFood;
    const target = animalRects[currentAnimal.id];

    if (food.id !== expectedFood.id || !hit(target, point.x, point.y)) {
      setWrong(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => setWrong(false), 480);
      say('این غذا برای این حیوان نیست.', 'That is not the right food.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addStars(1);
    setFedIds(prev => [...prev, food.id]);
    setFly({
      food,
      from: {
        x: Math.max(0, point.x - foodSize / 2),
        y: Math.max(0, point.y - foodSize / 2),
      },
      to: {
        x: target.x + target.w * 0.5 - foodSize / 2,
        y: target.y + target.h * 0.44 - foodSize / 2,
      },
    });
    say(`${food.fa} برای ${currentAnimal.fa}.`, `${food.en} for the ${currentAnimal.en}.`);
  };

  const handleFlyDone = () => {
    setFly(null);
    const nextIndex = animalIndex + 1;
    if (nextIndex >= ANIMALS.length) {
      setDone(true);
      say('آفرین! همه حیوان‌ها سیر شدند.', 'Great job! All the animals are full.');
      return;
    }
    setAnimalIndex(nextIndex);
  };

  const resetGame = () => {
    setAnimalIndex(0);
    setFedIds([]);
    setDone(false);
    setWrong(false);
    setFly(null);
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
            {isFa ? 'غذای درست را روی حیوان بکش' : 'Drag the right food onto the animal'}
          </Text>
          <Text style={[styles.title, { fontFamily: ff(isFa ? 'fa' : lang, 'black') }, dir(lang)]}>
            {isFa ? `نوبت ${currentAnimal.fa} است` : `Now feed the ${currentAnimal.en}`}
          </Text>
          <Text style={[styles.subtitle, { fontFamily: ff(isFa ? 'fa' : lang, 'bold') }, dir(lang)]}>
            {done
              ? isFa
                ? 'همه حیوان‌ها غذا خوردند!'
                : 'All animals have been fed!'
              : isFa
                ? `غذای درست: ${currentFood.fa}`
                : `Correct food: ${currentFood.en}`}
          </Text>
        </View>

        <View style={styles.stage}>
          {animalLayout.map((slot, index) => {
            const animal = ANIMALS[index];
            const active = animal.id === currentAnimal.id;
            const fed = fedIds.includes(animal.foodId);
            return (
              <View
                key={animal.id}
                style={[styles.animalWrap, { left: slot.x, top: slot.y, width: slot.w, height: slot.h }]}
                onLayout={event => {
                  const { x, y, width: w, height: h } = event.nativeEvent.layout;
                  setAnimalRects(prev => ({ ...prev, [animal.id]: { x, y, w, h } }));
                }}
              >
                <AnimalSpot animal={animal} active={active} done={fed} width={width} />
              </View>
            );
          })}

          {foodLayout.map((slot, index) => {
            const food = FOODS[index];
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
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  kicker: { color: '#0F766E', fontSize: 12, textAlign: 'center', marginBottom: 4 },
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
  animalAura: {
    position: 'absolute',
    top: 14,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.18)',
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
    opacity: 0.62,
  },
  animalDoneAura: {
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderColor: 'rgba(255,255,255,0.28)',
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
  foodBubble: {
    width: '100%',
    height: '72%',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  foodBubbleDisabled: {
    backgroundColor: 'rgba(255,255,255,0.58)',
  },
  foodLabel: {
    marginTop: 4,
    color: '#4B5563',
    fontSize: 12,
    textAlign: 'center',
  },
  flyingFood: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 80,
    height: 80,
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
