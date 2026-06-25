import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageBackground, LayoutAnimation, PanResponder, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import TopBar from '../../components/TopBar';
import { AppContext } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { useLandscapeDimensions } from '../../hooks/useLandscapeDimensions';
import { dir, ff } from '../../theme/fonts';
import { SOLAR_SYSTEM_BACKGROUND, SOLAR_SYSTEM_PLANETS, SolarSystemPlanet } from '../../assets/solarSystemPuzzle';

type StageSize = { width: number; height: number };
type Rect = { x: number; y: number; w: number; h: number };

// ─── Inline celebration ───────────────────────────────────────────────────────

const CELEB_EMOJIS = ['⭐','🌟','💫','✨'];

type CelebStar = {
  id: number; emoji: string;
  startX: number; startY: number;
  endX: number;   endY: number;
  size: number;   spin: number;
  delay: number; // 0..1 normalised
  fadeIn: number; fadeOut: number;
};

function buildCelebStars(W: number, H: number): CelebStar[] {
  const stars: CelebStar[] = [];
  let id = 0;
  function rnd(a: number, b: number) { return a + Math.random() * (b - a); }

  const cannons = [
    { x: W * 0.15, count: 48 },
    { x: W * 0.50, count: 54 },
    { x: W * 0.85, count: 48 },
  ];

  cannons.forEach(c => {
    for (let i = 0; i < c.count; i++) {
      const fan   = rnd(-0.72, 0.72);
      const angle = -Math.PI / 2 + fan;
      const g     = rnd(1400, 2000);
      const spd   = (Math.sqrt(2 * g * H) * rnd(0.90, 1.20)) / Math.abs(Math.sin(angle));
      const TOTAL_S = 2.8;
      const delay   = rnd(0, 0.12); // normalised 0..1
      const tSec    = (1 - delay) * TOTAL_S;
      const vx = Math.cos(angle) * spd;
      const vy = Math.sin(angle) * spd;
      stars.push({
        id: id++,
        emoji: CELEB_EMOJIS[id % CELEB_EMOJIS.length]!,
        startX: c.x + rnd(-W * 0.05, W * 0.05),
        startY: H,
        endX: vx * tSec,
        endY: vy * tSec + 0.5 * g * tSec * tSec,
        size: rnd(20, 38),
        spin: rnd(0.5, 2) * (Math.random() > 0.5 ? 1 : -1),
        delay,
        fadeIn:  delay + (1 - delay) * 0.04,
        fadeOut: delay + (1 - delay) * 0.80,
      });
    }
  });

  // Extra spread particles
  for (let i = 0; i < 70; i++) {
    const g     = rnd(1200, 1800);
    const angle = rnd(-Math.PI * 0.9, -Math.PI * 0.1);
    const spd   = Math.abs((Math.sqrt(2 * g * H) * rnd(0.6, 1.0)) / Math.sin(angle)) * rnd(0.5, 0.85);
    const TOTAL_S = 2.8;
    const delay   = rnd(0, 0.35);
    const tSec    = (1 - delay) * TOTAL_S;
    const vx = Math.cos(angle) * spd;
    const vy = Math.sin(angle) * spd;
    stars.push({
      id: id++,
      emoji: CELEB_EMOJIS[id % CELEB_EMOJIS.length]!,
      startX: rnd(W * 0.05, W * 0.95),
      startY: H,
      endX: vx * tSec,
      endY: vy * tSec + 0.5 * g * tSec * tSec,
      size: rnd(16, 30),
      spin: rnd(0.5, 2) * (Math.random() > 0.5 ? 1 : -1),
      delay,
      fadeIn:  delay + (1 - delay) * 0.04,
      fadeOut: delay + (1 - delay) * 0.80,
    });
  }
  return stars;
}

function CelebStarView({ star, anim }: { star: CelebStar; anim: Animated.Value }) {
  return (
    <Animated.Text
      style={{
        position: 'absolute',
        left: star.startX - star.size / 2,
        top:  star.startY - star.size / 2,
        fontSize: star.size,
        opacity: anim.interpolate({
          inputRange:  [star.delay, star.fadeIn, star.fadeOut, 1],
          outputRange: [0, 1, 1, 0],
          extrapolate: 'clamp',
        }),
        transform: [
          { translateX: anim.interpolate({ inputRange: [star.delay, 1], outputRange: [0, star.endX], extrapolate: 'clamp' }) },
          { translateY: anim.interpolate({ inputRange: [star.delay, 1], outputRange: [0, star.endY], extrapolate: 'clamp' }) },
          { rotate:     anim.interpolate({ inputRange: [star.delay, 1], outputRange: ['0deg', `${star.spin * 360}deg`], extrapolate: 'clamp' }) },
        ],
      }}
    >
      {star.emoji}
    </Animated.Text>
  );
}
const TTS = (l: string) => ({ fa: 'fa-IR', ar: 'fa-IR', zh: 'zh-CN', ko: 'ko-KR', fr: 'fr-FR', es: 'es-ES' } as any)[l] ?? 'en-US';
const RATE = (l: string) => (l === 'fa' || l === 'ar' ? 0.65 : 0.8);
const SETTLE_MS = 600;
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
              onPlaced(planet.id);
            });
          };
          if (!moved) {
            animatePlanetSettle();
            setSettling(true);
            setPlaced(true);
            setShowPressedLabel(false);
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
  const [celebStars, setCelebStars] = useState<CelebStar[]>([]);
  const celebAnim = useRef(new Animated.Value(0)).current;
  const celebPlayedRef = useRef(false);
  const placedIdsRef = useRef<string[]>([]);
  const placedCountRef = useRef(0);
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

  const startCelebration = () => {
    if (celebPlayedRef.current || !stageSize.width || !stageSize.height) return;
    celebPlayedRef.current = true;
    const stars = buildCelebStars(stageSize.width, stageSize.height);
    setCelebStars(stars);
    celebAnim.setValue(0);
    Animated.timing(celebAnim, {
      toValue: 1,
      duration: 2800,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setCelebStars([]);
      celebAnim.setValue(0);
    });
  };

  const handlePlaced = () => {
    setActiveId(null);
    const nextCount = Math.min(draggableLayout.length, placedCountRef.current + 1);
    placedCountRef.current = nextCount;
    setPlacedCount(nextCount);
    void addStars(1);
    if (nextCount >= draggableLayout.length) {
      startCelebration();
    }
  };

  const handlePlanetPlaced = (id: string) => {
    if (placedIdsRef.current.includes(id)) return;
    placedIdsRef.current = [...placedIdsRef.current, id];
    setPlacedIds(placedIdsRef.current);
    handlePlaced();
  };

  useEffect(() => {
    if (allPlaced) return;
    celebPlayedRef.current = false;
  }, [allPlaced]);

  return (
    <View style={styles.root}>
      <ImageBackground source={SOLAR_SYSTEM_BACKGROUND} style={styles.bg} resizeMode="cover">
        <View style={styles.bgWash} />
      </ImageBackground>

      <TopBar title="Solar System" titleFa="منظومه خورشیدی" showClose dark />

      <View style={styles.stage} onLayout={event => setStageSize(event.nativeEvent.layout)}>
        {layout.length ? (
          <>
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

            {/* Inline celebration — stars shoot up from bottom, arc across full screen */}
        {celebStars.map(star => (
          <CelebStarView key={star.id} star={star} anim={celebAnim} />
        ))}
        {celebStars.length > 0 && (
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.celebBadgeWrap, {
            opacity: celebAnim.interpolate({ inputRange: [0, 0.08, 0.70, 0.90, 1], outputRange: [0, 1, 1, 0, 0], extrapolate: 'clamp' }),
            transform: [{ scale: celebAnim.interpolate({ inputRange: [0, 0.10, 0.70, 1], outputRange: [0.3, 1.1, 1.0, 0.85], extrapolate: 'clamp' }) }],
          }]}>
            <View style={styles.celebBadge}>
              <Text style={styles.celebText}>آفرین! 🌟</Text>
              <Text style={styles.celebSub}>Well done!</Text>
            </View>
          </Animated.View>
        )}

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
  celebBadgeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  celebBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 4,
    borderColor: '#FFE034',
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#FFE034',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  celebText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFE034',
  },
  celebSub: {
    fontSize: 15,
    color: '#8A7A9B',
    fontWeight: '700',
    marginTop: 5,
  },
});