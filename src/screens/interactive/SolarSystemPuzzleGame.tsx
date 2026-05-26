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
  pluto: 'Pluto',
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

function StarSparkle() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="36" fill="#FFF3B0" opacity="0.22" />
      <Circle cx="50" cy="50" r="28" fill="#FFF0A0" opacity="0.28" />
      <Polygon
        points="50,2 61,32 92,35 68,54 76,86 50,68 24,86 32,54 8,35 39,32"
        fill="#FFE875"
        opacity="0.95"
      />
      <Polygon
        points="50,10 58,34 86,37 64,53 71,78 50,64 29,78 36,53 14,37 42,34"
        fill="#FFF8D0"
      />
      <Polygon
        points="50,22 56,42 77,43 60,55 66,75 50,63 34,75 40,55 23,43 44,42"
        fill="#FFF6BE"
        opacity="0.98"
      />
      <Circle cx="50" cy="50" r="9" fill="#FFFDF2" />
    </Svg>
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
  const plutoBaseSize = 51.84;
  const labelH = 18;
  const traySize = 66;
  const pieceH = traySize + 6 + labelH;
  const trayOrder = [4, 5, 7, 0, 8, 2, 6, 3, 1];
  const trayIndexById = new Map(trayPlanets.map((planet, index) => [planet.id, index]));

  return SOLAR_SYSTEM_PLANETS.map((planet, index) => {
    const size = Math.round(plutoBaseSize * planet.sizeFactor);
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
  const [blinkStars, setBlinkStars] = useState<Array<{ id: number; left: number; top: number; size: number; boost: number }>>([]);
  const starOpacity = useRef(new Animated.Value(0)).current;
  const starScale = useRef(new Animated.Value(0.7)).current;
  const starTwinkle = useRef(new Animated.Value(0)).current;
  const starTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const starNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const starLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const blinkSeqRef = useRef(0);
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
    if (!allPlaced || !stageSize.width || !stageSize.height) {
      if (starTimeoutRef.current) {
        clearTimeout(starTimeoutRef.current);
        starTimeoutRef.current = null;
      }
      if (starNextTimeoutRef.current) {
        clearTimeout(starNextTimeoutRef.current);
        starNextTimeoutRef.current = null;
      }
      setBlinkStars([]);
      starOpacity.setValue(0);
      starScale.setValue(0.7);
      starTwinkle.setValue(0);
      starLoopRef.current?.stop();
      starLoopRef.current = null;
      return;
    }

    const spawnBlinkGroup = () => {
      if (starTimeoutRef.current) {
        clearTimeout(starTimeoutRef.current);
        starTimeoutRef.current = null;
      }
      blinkSeqRef.current += 1;
      const quadrants = [
        { leftMin: 12, leftMax: stageSize.width * 0.42, topMin: 28, topMax: stageSize.height * 0.28 },
        { leftMin: stageSize.width * 0.58, leftMax: Math.max(stageSize.width - 18, stageSize.width * 0.58), topMin: 28, topMax: stageSize.height * 0.30 },
        { leftMin: 12, leftMax: stageSize.width * 0.42, topMin: stageSize.height * 0.58, topMax: Math.max(stageSize.height - 110, stageSize.height * 0.58) },
        { leftMin: stageSize.width * 0.58, leftMax: Math.max(stageSize.width - 18, stageSize.width * 0.58), topMin: stageSize.height * 0.58, topMax: Math.max(stageSize.height - 110, stageSize.height * 0.58) },
      ].sort(() => Math.random() - 0.5);
      const next = quadrants.map((zone, index) => ({
        id: blinkSeqRef.current * 10 + index,
        left: clamp(
          Math.round(zone.leftMin + Math.random() * Math.max(8, zone.leftMax - zone.leftMin)),
          12,
          Math.max(12, stageSize.width - 18),
        ),
        top: clamp(
          Math.round(zone.topMin + Math.random() * Math.max(8, zone.topMax - zone.topMin)),
          24,
          Math.max(24, stageSize.height - 110),
        ),
        size: 10 + Math.round(Math.random() * 5),
        boost: index === 0 ? 1.5 : 1,
      }));
      setBlinkStars(next);
      starOpacity.setValue(0);
      starScale.setValue(0.7);
      starTwinkle.setValue(0);
      starLoopRef.current?.stop();
      starLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(starTwinkle, { toValue: 1, duration: 820, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
          Animated.timing(starTwinkle, { toValue: 0, duration: 820, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        ]),
      );
      starLoopRef.current.start();
      Animated.parallel([
        Animated.timing(starOpacity, { toValue: 1, duration: 760, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(starScale, { toValue: 1, duration: 760, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();

      starTimeoutRef.current = setTimeout(() => {
        starLoopRef.current?.stop();
        starLoopRef.current = null;
        Animated.parallel([
          Animated.timing(starOpacity, { toValue: 0, duration: STAR_FADE_MS, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
          Animated.timing(starScale, { toValue: 0.7, duration: STAR_FADE_MS, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        ]).start(() => {
          setBlinkStars([]);
          starNextTimeoutRef.current = setTimeout(() => {
            if (allPlaced && stageSize.width && stageSize.height) {
              spawnBlinkGroup();
            }
          }, 1500);
        });
      }, STAR_VISIBLE_MS);
    };

    spawnBlinkGroup();

    return () => {
      if (starTimeoutRef.current) {
        clearTimeout(starTimeoutRef.current);
        starTimeoutRef.current = null;
      }
      if (starNextTimeoutRef.current) {
        clearTimeout(starNextTimeoutRef.current);
        starNextTimeoutRef.current = null;
      }
      starLoopRef.current?.stop();
      starLoopRef.current = null;
    };
  }, [allPlaced, stageSize.height, stageSize.width, starOpacity, starScale, starTwinkle]);

  return (
    <View style={styles.root}>
      <ImageBackground source={SOLAR_SYSTEM_BACKGROUND} style={styles.bg} resizeMode="cover">
        <View style={styles.bgWash} />
      </ImageBackground>

      <TopBar title="Solar System" titleFa="منظومه خورشیدی" showBack dark />

      <View style={styles.stage} onLayout={event => setStageSize(event.nativeEvent.layout)}>
        {layout.length ? (
          <>
            {blinkStars.map(star => (
              <Animated.View
                key={star.id}
                pointerEvents="none"
                  style={[
                  styles.blinkStar,
                  {
                    left: star.left,
                    top: star.top,
                    width: star.size * star.boost * 1.18,
                    height: star.size * star.boost * 1.18,
                    opacity: starOpacity,
                    transform: [
                      {
                        scale: Animated.multiply(
                          starScale,
                          starTwinkle.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.96, 1.28],
                          }),
                        ),
                      },
                      { rotate: '10deg' },
                    ],
                  },
                ]}
              >
                <View style={styles.starGlow}>
                  <StarSparkle />
                </View>
              </Animated.View>
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
