import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageBackground, LayoutAnimation, PanResponder, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import Svg, { Circle, Polygon } from 'react-native-svg';
import TopBar from '../../components/TopBar';
import { AppContext } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { useLandscapeDimensions } from '../../hooks/useLandscapeDimensions';
import { dir, ff } from '../../theme/fonts';
import { SOLAR_SYSTEM_BACKGROUND, SOLAR_SYSTEM_PLANETS, SolarSystemPlanet } from '../../assets/solarSystemPuzzle';

type StageSize = { width: number; height: number };
type Rect = { x: number; y: number; w: number; h: number };
const TTS = (l: string) => ({ fa: 'fa-IR', ar: 'fa-IR', zh: 'zh-CN', ko: 'ko-KR', fr: 'fr-FR', es: 'es-ES' } as any)[l] ?? 'en-US';
const RATE = (l: string) => (l === 'fa' || l === 'ar' ? 0.65 : 0.8);
const CELEBRATION_STAR_GROUP_COUNT = 220;
const CELEBRATION_BURST_MS = 5600;
const STAR_VISIBLE_MS = 1300;
const STAR_FADE_MS = 860;
const SETTLE_MS = 980;
const PLANET_NAME_EN: Record<string, string> = {
  mercury: 'Mercury',
  venus: 'Venus',
  earth: 'Earth',
  moon: 'Moon',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
};
type PlanetLayout = SolarSystemPlanet & {
  start: Rect;
  target: Rect;
  centerY: number;
  slotDiameter: number;
  imageH: number;
  labelH: number;
  zIndex: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function animatePlanetSettle() {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

function StarSparkle({
  primaryColor,
  innerColor,
  coreColor,
}: {
  primaryColor: string;
  innerColor: string;
  coreColor: string;
}) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="36" fill={primaryColor} opacity="0.22" />
      <Circle cx="50" cy="50" r="28" fill={innerColor} opacity="0.3" />
      <Polygon
        points="50,2 61,32 92,35 68,54 76,86 50,68 24,86 32,54 8,35 39,32"
        fill={primaryColor}
        opacity="0.95"
      />
      <Polygon
        points="50,10 58,34 86,37 64,53 71,78 50,64 29,78 36,53 14,37 42,34"
        fill={innerColor}
      />
      <Polygon
        points="50,22 56,42 77,43 60,55 66,75 50,63 34,75 40,55 23,43 44,42"
        fill={coreColor}
        opacity="0.98"
      />
      <Circle cx="50" cy="50" r="9" fill={coreColor} />
    </Svg>
  );
}

type CelebrationStarSpec = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  glowColor: string;
  primaryColor: string;
  innerColor: string;
  coreColor: string;
  spinStart: number;
  spinEnd: number;
  twinLeft: number;
  twinTop: number;
  twinSize: number;
};

function FallingCelebrationStar({
  star,
  stageHeight,
}: {
  star: CelebrationStarSpec;
  stageHeight: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(star.delay),
      Animated.timing(progress, {
        toValue: 1,
        duration: star.duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]);
    animation.start();

    return () => {
      animation.stop();
      progress.stopAnimation();
    };
  }, [progress, star.delay, star.duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-stageHeight * 0.24, stageHeight + 280],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, star.drift],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.1, 0.46, 0.64, 1],
    outputRange: [0, 1, 1, 0, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.12, 0.72, 1],
    outputRange: [0.65, 1.08, 1.18, 0.78],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [`${star.spinStart}deg`, `${star.spinEnd}deg`],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.blinkStar,
        {
          left: star.left,
          top: 0,
          width: star.size * 1.45,
          height: star.size * 1.45,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }, { rotate }],
        },
      ]}
    >
      <View style={[styles.starGlow, { shadowColor: star.glowColor }]}>
        <StarSparkle primaryColor={star.primaryColor} innerColor={star.innerColor} coreColor={star.coreColor} />
      </View>
      <View
        style={[
          styles.celebrationTwinStar,
          {
            left: star.twinLeft,
            top: star.twinTop,
            width: star.twinSize,
            height: star.twinSize,
          },
        ]}
      >
        <View style={[styles.starGlow, { shadowColor: star.glowColor }]}>
          <StarSparkle primaryColor={star.primaryColor} innerColor={star.innerColor} coreColor={star.coreColor} />
        </View>
      </View>
    </Animated.View>
  );
}

async function safeImpact() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

async function safeSuccess() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
}

function buildLayout(stage: StageSize): PlanetLayout[] {
  const trayPlanets = SOLAR_SYSTEM_PLANETS.filter(planet => planet.id !== 'moon');
  const cols = trayPlanets.length;
  const trayTop = Math.round(stage.height * 0.84);
  const trayHeight = Math.max(84, stage.height - trayTop - 10);
  const cellW = stage.width / cols;
  const cellH = trayHeight;
  const planetBaseSize = 51.84;
  const labelH = 18;
  const traySize = 66;
  const pieceH = traySize + 6 + labelH;
  const trayOrder = [3, 4, 6, 0, 7, 1, 5, 2];
  const trayIndexById = new Map(trayPlanets.map((planet, index) => [planet.id, index]));

  return SOLAR_SYSTEM_PLANETS.map((planet, index) => {
    const size = Math.round(planetBaseSize * planet.sizeFactor);
    const trayIndex = trayOrder[trayIndexById.get(planet.id) ?? index] ?? (trayIndexById.get(planet.id) ?? index);
    const col = trayIndex % cols;
    const startLeft = Math.round(col * cellW + (cellW - traySize) / 2);
    const startTop = Math.round(trayTop + (cellH - pieceH) / 2);
    const targetLeft = Math.round(stage.width * planet.slotX - size / 2);
    const centerY = Math.round(stage.height * planet.slotY);
    const targetTop = Math.round(centerY - size / 2);
    return {
      ...planet,
      start: { x: startLeft, y: startTop, w: traySize, h: pieceH },
      target: { x: targetLeft, y: targetTop, w: size, h: size },
      centerY,
      slotDiameter: traySize,
      imageH: traySize,
      labelH,
      zIndex: 10 + index,
    };
  });
}

function PlanetPiece({
  planet,
  onPlaced,
  onActivate,
  isActive,
  lang,
}: {
  planet: PlanetLayout;
  onPlaced: (id: string) => void;
  onActivate: (id: string | null) => void;
  isActive: boolean;
  lang: string;
}) {
  const draggedRef = useRef(false);
  const [size, setSize] = useState({ w: planet.start.w, h: planet.start.h });
  const [imageH, setImageH] = useState(planet.imageH);
  const [placed, setPlaced] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [settling, setSettling] = useState(false);
  const [showPressedLabel, setShowPressedLabel] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const xAnim = useRef(new Animated.Value(planet.start.x)).current;
  const yAnim = useRef(new Animated.Value(planet.start.y)).current;

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => !placed,
        onMoveShouldSetPanResponderCapture: () => !placed,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: () => {
          setShowPressedLabel(true);
          draggedRef.current = false;
          setPressed(true);
          setSettling(false);
          onActivate(planet.id);
          const isFa = lang === 'fa' || lang === 'ar';
          const spokenName = isFa ? planet.labelFa : (PLANET_NAME_EN[planet.id] ?? planet.labelFa);
          Speech.stop();
          Speech.speak(spokenName, {
            language: TTS(lang),
            rate: RATE(lang),
            pitch: 1.16,
          });
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 180,
            useNativeDriver: true,
          }).start();
          void safeImpact();
        },
        onPanResponderMove: (_evt, gestureState) => {
          if (placed) return;
          xAnim.setValue(planet.start.x + gestureState.dx);
          yAnim.setValue(planet.start.y + gestureState.dy);
          if (Math.abs(gestureState.dx) + Math.abs(gestureState.dy) > 8) {
            draggedRef.current = true;
          }
        },
        onPanResponderRelease: (_evt, gestureState) => {
          setShowPressedLabel(false);
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }).start();
          if (placed) {
            setPressed(false);
            onActivate(null);
            return;
          }
          setPressed(false);
          const moved = draggedRef.current || Math.abs(gestureState.dx) + Math.abs(gestureState.dy) > 8;
          const settleToTarget = () => {
            Animated.parallel([
              Animated.timing(xAnim, {
                toValue: planet.target.x,
                duration: SETTLE_MS,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.timing(yAnim, {
                toValue: planet.target.y,
                duration: SETTLE_MS,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
            ]).start(() => {
              setSettling(false);
            });
          };
          if (!moved) {
            animatePlanetSettle();
            setSettling(true);
            setPlaced(true);
            setShowPressedLabel(false);
            onPlaced(planet.id);
            setSize({ w: planet.target.w, h: planet.target.w });
            setImageH(planet.target.w);
            settleToTarget();
            onActivate(null);
            return;
          }

          animatePlanetSettle();
          setSettling(true);
          void safeSuccess();
          setPlaced(true);
          setShowPressedLabel(false);
          onPlaced(planet.id);
          setSize({ w: planet.target.w, h: planet.target.w });
          setImageH(planet.target.w);
          settleToTarget();
          onActivate(null);
        },
        onPanResponderTerminate: () => {
          setShowPressedLabel(false);
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }).start();
          if (placed) {
            setPressed(false);
            onActivate(null);
            return;
          }
          setPressed(false);
          animatePlanetSettle();
          setSettling(true);
          setSize({ w: planet.target.w, h: planet.target.w });
          setImageH(planet.target.w);
          Animated.parallel([
            Animated.timing(xAnim, {
              toValue: planet.target.x,
              duration: SETTLE_MS,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(yAnim, {
              toValue: planet.target.y,
              duration: SETTLE_MS,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start(() => {
            setSettling(false);
          });
          onActivate(null);
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [lang, onActivate, onPlaced, planet.id, planet.labelFa, planet.start.x, planet.start.y, planet.target.h, planet.target.w, planet.target.x, planet.target.y, placed, size.h, size.w, xAnim, yAnim],
  );

  useEffect(() => {
    if (!placed) return;
    setSettling(false);
  }, [placed]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.piece,
        {
          left: 0,
          top: 0,
          width: size.w,
          height: size.h,
          zIndex: placed ? 1000 + planet.zIndex : isActive ? 900 + planet.zIndex : planet.zIndex,
          opacity: pressed || settling ? 0.99 : 1,
          transform: [
            { translateX: xAnim },
            { translateY: yAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
      >
      <Image source={planet.source} style={[styles.pieceImage, { height: imageH }]} resizeMode="contain" />
      {planet.id !== 'moon' && (!placed || showPressedLabel) ? (
        <View
          style={[
            styles.labelPill,
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.labelText, { fontFamily: ff('fa', 'bold') }]} numberOfLines={1}>
            {planet.labelFa}
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

export default function SolarSystemPuzzleGame() {
  const { lang, addStars } = useContext(AppContext);
  const { reset } = useNav();
  const { width, height } = useLandscapeDimensions();
  const [stageSize, setStageSize] = useState<StageSize>({ width: 0, height: 0 });
  const [placedCount, setPlacedCount] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [celebrationStars, setCelebrationStars] = useState<CelebrationStarSpec[]>([]);
  const [backgroundSparkles, setBackgroundSparkles] = useState<Array<{ id: number; left: number; top: number; size: number; boost: number }>>([]);
  const [showBackgroundSparkles, setShowBackgroundSparkles] = useState(false);
  const celebrationPlayedRef = useRef(false);
  const celebrationClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebrationTransitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebrationSeqRef = useRef(0);
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const bgScale = useRef(new Animated.Value(0.72)).current;
  const bgTwinkle = useRef(new Animated.Value(0)).current;
  const bgTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bgNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bgLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const bgSeqRef = useRef(0);
  const isFa = lang === 'fa' || lang === 'ar';

  const layout = useMemo(() => {
    if (!stageSize.width || !stageSize.height) return [];
    return buildLayout(stageSize);
  }, [stageSize]);

  const draggableLayout = useMemo(() => layout.filter(planet => planet.id !== 'moon'), [layout]);
  const moonLayout = useMemo(() => layout.find(planet => planet.id === 'moon') ?? null, [layout]);
  const allPlaced = placedCount >= draggableLayout.length;
  const bottomTrayHeight = useMemo(() => {
    if (!draggableLayout.length) return 84;
    return Math.max(84, Math.max(...draggableLayout.map(item => item.start.h)) + 10);
  }, [draggableLayout]);

  const handlePlaced = () => {
    setActiveId(null);
    setPlacedCount(prev => Math.min(draggableLayout.length, prev + 1));
    void addStars(1);
  };

  const handlePlanetPlaced = (id: string) => {
    setPlacedIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    handlePlaced();
  };

  useEffect(() => {
    if (celebrationClearRef.current) {
      clearTimeout(celebrationClearRef.current);
      celebrationClearRef.current = null;
    }
    if (celebrationTransitionRef.current) {
      clearTimeout(celebrationTransitionRef.current);
      celebrationTransitionRef.current = null;
    }
    if (bgTimeoutRef.current) {
      clearTimeout(bgTimeoutRef.current);
      bgTimeoutRef.current = null;
    }
    if (bgNextTimeoutRef.current) {
      clearTimeout(bgNextTimeoutRef.current);
      bgNextTimeoutRef.current = null;
    }
    bgLoopRef.current?.stop();
    bgLoopRef.current = null;

    if (!allPlaced || !stageSize.width || !stageSize.height) {
      setCelebrationStars([]);
      setBackgroundSparkles([]);
      setShowBackgroundSparkles(false);
      celebrationPlayedRef.current = false;
      return;
    }

    if (celebrationPlayedRef.current) return;
    celebrationPlayedRef.current = true;

    const palette = [
      { primaryColor: '#FFE875', innerColor: '#FFF8D0', coreColor: '#FFFDF2', glowColor: '#FFEFB0' },
      { primaryColor: '#7DD3FC', innerColor: '#DDF5FF', coreColor: '#FFFFFF', glowColor: '#BFEAFF' },
      { primaryColor: '#F9A8D4', innerColor: '#FCE2F0', coreColor: '#FFF9FC', glowColor: '#F7C2E0' },
      { primaryColor: '#86EFAC', innerColor: '#DDFBE6', coreColor: '#F7FFF9', glowColor: '#C9F7D7' },
      { primaryColor: '#FDBA74', innerColor: '#FFE8C9', coreColor: '#FFF8F0', glowColor: '#FFD7A3' },
      { primaryColor: '#C4B5FD', innerColor: '#E7E0FF', coreColor: '#FAF7FF', glowColor: '#DCCFFC' },
    ];

    const next: CelebrationStarSpec[] = Array.from({ length: CELEBRATION_STAR_GROUP_COUNT }, (_, index) => {
      const tone = palette[index % palette.length];
      const size = 10 + Math.round(Math.random() * 6);
      return {
        id: celebrationSeqRef.current * 100 + index,
        left: clamp(
          Math.round(Math.random() * (stageSize.width - 18)),
          4,
          Math.max(4, stageSize.width - 18),
        ),
        size,
        delay: Math.round(Math.random() * 360),
        duration: 1800 + Math.round(Math.random() * 900),
        drift: Math.round((Math.random() - 0.5) * 160),
        glowColor: tone.glowColor,
        primaryColor: tone.primaryColor,
        innerColor: tone.innerColor,
        coreColor: tone.coreColor,
        spinStart: -20 + Math.round(Math.random() * 40),
        spinEnd: 120 + Math.round(Math.random() * 120),
        twinLeft: Math.round((Math.random() - 0.5) * 42),
        twinTop: Math.round(24 + Math.random() * 42),
        twinSize: Math.round(size * (0.74 + Math.random() * 0.34)),
      };
    });

    celebrationSeqRef.current += 1;
    setCelebrationStars(next);

    celebrationTransitionRef.current = setTimeout(() => {
      setCelebrationStars([]);
      setShowBackgroundSparkles(true);
    }, CELEBRATION_BURST_MS);

    return () => {
      if (celebrationClearRef.current) {
        clearTimeout(celebrationClearRef.current);
        celebrationClearRef.current = null;
      }
      if (celebrationTransitionRef.current) {
        clearTimeout(celebrationTransitionRef.current);
        celebrationTransitionRef.current = null;
      }
    };
  }, [allPlaced, stageSize.height, stageSize.width]);

  useEffect(() => {
    if (!showBackgroundSparkles || !stageSize.width || !stageSize.height) {
      setBackgroundSparkles([]);
      bgOpacity.setValue(0);
      bgScale.setValue(0.72);
      bgTwinkle.setValue(0);
      bgLoopRef.current?.stop();
      bgLoopRef.current = null;
      return;
    }

    const spawnCluster = () => {
      if (bgTimeoutRef.current) {
        clearTimeout(bgTimeoutRef.current);
        bgTimeoutRef.current = null;
      }
      bgSeqRef.current += 1;
      const quadrants = [
        { leftMin: 12, leftMax: stageSize.width * 0.42, topMin: 24, topMax: stageSize.height * 0.30 },
        { leftMin: stageSize.width * 0.58, leftMax: Math.max(stageSize.width - 18, stageSize.width * 0.58), topMin: 24, topMax: stageSize.height * 0.30 },
        { leftMin: 12, leftMax: stageSize.width * 0.42, topMin: stageSize.height * 0.56, topMax: Math.max(stageSize.height - 110, stageSize.height * 0.56) },
        { leftMin: stageSize.width * 0.58, leftMax: Math.max(stageSize.width - 18, stageSize.width * 0.58), topMin: stageSize.height * 0.56, topMax: Math.max(stageSize.height - 110, stageSize.height * 0.56) },
      ].sort(() => Math.random() - 0.5);

      const next = quadrants.map((zone, index) => ({
        id: bgSeqRef.current * 10 + index,
        left: clamp(
          Math.round(zone.leftMin + Math.random() * Math.max(10, zone.leftMax - zone.leftMin)),
          10,
          Math.max(10, stageSize.width - 16),
        ),
        top: clamp(
          Math.round(zone.topMin + Math.random() * Math.max(10, zone.topMax - zone.topMin)),
          18,
          Math.max(18, stageSize.height - 120),
        ),
        size: 9 + Math.round(Math.random() * 5),
        boost: index === 0 ? 1.45 : 1,
      }));

      setBackgroundSparkles(next);
      bgOpacity.setValue(0);
      bgScale.setValue(0.72);
      bgTwinkle.setValue(0);
      bgLoopRef.current?.stop();
      bgLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(bgTwinkle, { toValue: 1, duration: 760, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
          Animated.timing(bgTwinkle, { toValue: 0, duration: 760, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        ]),
      );
      bgLoopRef.current.start();
      Animated.parallel([
        Animated.timing(bgOpacity, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(bgScale, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();

      bgTimeoutRef.current = setTimeout(() => {
        bgLoopRef.current?.stop();
        bgLoopRef.current = null;
        Animated.parallel([
          Animated.timing(bgOpacity, { toValue: 0, duration: 820, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
          Animated.timing(bgScale, { toValue: 0.74, duration: 820, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        ]).start(() => {
          setBackgroundSparkles([]);
          bgNextTimeoutRef.current = setTimeout(() => {
            if (showBackgroundSparkles && stageSize.width && stageSize.height) {
              spawnCluster();
            }
          }, 1500);
        });
      }, 1200);
    };

    spawnCluster();

    return () => {
      if (bgTimeoutRef.current) {
        clearTimeout(bgTimeoutRef.current);
        bgTimeoutRef.current = null;
      }
      if (bgNextTimeoutRef.current) {
        clearTimeout(bgNextTimeoutRef.current);
        bgNextTimeoutRef.current = null;
      }
      bgLoopRef.current?.stop();
      bgLoopRef.current = null;
    };
  }, [bgOpacity, bgScale, bgTwinkle, showBackgroundSparkles, stageSize.height, stageSize.width]);

  return (
    <View style={styles.root}>
      <ImageBackground source={SOLAR_SYSTEM_BACKGROUND} style={styles.bg} resizeMode="cover">
        <View style={styles.bgWash} />
      </ImageBackground>

      <TopBar title="Solar System" titleFa="منظومه خورشیدی" showBack dark />

      <View style={styles.stage} onLayout={event => setStageSize(event.nativeEvent.layout)}>
        {layout.length ? (
          <>
            {backgroundSparkles.map(star => (
              <Animated.View
                key={star.id}
                pointerEvents="none"
                style={[
                  styles.blinkStar,
                  {
                    left: star.left,
                    top: star.top,
                    width: star.size * star.boost * 1.16,
                    height: star.size * star.boost * 1.16,
                    opacity: bgOpacity,
                    transform: [
                      {
                        scale: Animated.multiply(
                          bgScale,
                          bgTwinkle.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.96, 1.16],
                          }),
                        ),
                      },
                      { rotate: '10deg' },
                    ],
                  },
                ]}
              >
                <View style={styles.bgStarGlow}>
                  <StarSparkle
                    primaryColor="#FFE875"
                    innerColor="#FFF8D0"
                    coreColor="#FFFDF2"
                  />
                </View>
              </Animated.View>
            ))}
            {celebrationStars.map(star => (
              <FallingCelebrationStar
                key={star.id}
                star={star}
                stageHeight={stageSize.height}
              />
            ))}
            <View style={styles.trackLayer} pointerEvents="none">
              {moonLayout ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.staticMoon,
                    {
                      left: moonLayout.target.x,
                      top: moonLayout.target.y,
                      width: moonLayout.target.w,
                      height: moonLayout.target.w,
                    },
                  ]}
                >
                  <Image
                    source={moonLayout.source}
                    style={styles.staticMoonImage}
                    resizeMode="contain"
                  />
                </View>
              ) : null}
              {!allPlaced ? draggableLayout.map(planet => (
                <View
                  key={planet.id}
                  pointerEvents="none"
                  style={[
                    styles.slot,
                    {
                      left: Math.round(planet.target.x + planet.target.w / 2 - planet.slotDiameter / 2),
                      top: Math.round(planet.centerY - planet.slotDiameter / 2),
                      width: planet.slotDiameter,
                      height: planet.slotDiameter,
                      borderRadius: planet.slotDiameter / 2,
                      opacity: placedIds.includes(planet.id) ? 0 : 1,
                    },
                  ]}
                />
              )) : null}
            </View>

            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
              {draggableLayout.map(planet => (
                <PlanetPiece
                  key={planet.id}
                  planet={planet}
                  isActive={activeId === planet.id}
                  onActivate={setActiveId}
                  onPlaced={handlePlanetPlaced}
                  lang={lang}
                />
              ))}
            </View>
          </>
        ) : null}

        {!allPlaced ? (
          <View
            style={[
              styles.bottomTray,
              {
                height: bottomTrayHeight,
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.bottomTrayGlow} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#07112D',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  bgWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 10, 32, 0.10)',
  },
  stage: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  blinkStar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starGlow: {
    width: '100%',
    height: '100%',
    shadowColor: 'rgba(255, 244, 170, 1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 18,
  },
  celebrationTwinStar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgStarGlow: {
    width: '100%',
    height: '100%',
    shadowColor: 'rgba(255, 245, 180, 1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 12,
  },
  trackLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  slot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.32)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  piece: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pieceImage: {
    width: '100%',
    height: '78%',
  },
  staticMoon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staticMoonImage: {
    width: '100%',
    height: '100%',
  },
  labelPill: {
    width: '100%',
    marginTop: 0,
    paddingVertical: 3,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(3, 10, 32, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomTray: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '31%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(4, 10, 28, 0.26)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  bottomTrayGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  progressPill: {
    position: 'absolute',
    left: 16,
    bottom: 14,
    minWidth: 76,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressText: {
    color: '#0B1B4E',
    fontSize: 14,
    textAlign: 'center',
  },
  doneBtn: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    height: 50,
    minWidth: 112,
    paddingHorizontal: 18,
    borderRadius: 26,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
