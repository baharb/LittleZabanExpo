import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { FarsiLetter } from '../../data/farsiLetters';
import {
  angleBetween,
  clamp,
  distance,
  nearestIndex,
  pathSegmentPath,
  pointAtProgress,
  polylineLength,
  sampleSvgPath,
  Point,
} from '../../utils/tracingUtils';

type Props = {
  letter: FarsiLetter;
  boardSize: number;
  guideReplayToken: number;
  onComplete?: () => void;
  onTryAgain?: () => void;
  playLetterSound?: (letterId: string) => void;
  playSuccessSound?: () => void;
  playTryAgainSound?: () => void;
  tolerance?: number;
  autoAdvanceDelayMs?: number;
};

type TracePhase = 'guide' | 'trace' | 'dots' | 'done';

type Particle = {
  id: number;
  left: number;
  top: number;
  delay: number;
  size: number;
  duration: number;
  color: string;
  kind: 'star' | 'confetti';
  rotate: number;
};

const DEFAULT_TOLERANCE = 30;

export default function FarsiLetterTracer({
  letter,
  boardSize,
  guideReplayToken,
  onComplete,
  onTryAgain,
  playLetterSound,
  playSuccessSound,
  playTryAgainSound,
  tolerance = DEFAULT_TOLERANCE,
  autoAdvanceDelayMs = 1500,
}: Props) {
  const viewBox = parseViewBox(letter.viewBox);
  const scaleX = boardSize / viewBox.width;
  const scaleY = boardSize / viewBox.height;

  const strokes = useMemo(
    () =>
      letter.strokes.map(stroke => ({
        ...stroke,
        points: sampleSvgPath(stroke.path, 160),
      })),
    [letter],
  );

  const [phase, setPhase] = useState<TracePhase>('guide');
  const [activeStrokeIndex, setActiveStrokeIndex] = useState(0);
  const [strokeProgress, setStrokeProgress] = useState<number[]>(
    () => strokes.map(() => 0),
  );
  const [dotIndex, setDotIndex] = useState(0);
  const [hint, setHint] = useState('مسیر را دنبال کن');
  const [success, setSuccess] = useState(false);
  const [guideTick, setGuideTick] = useState({ strokeIndex: 0, progress: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  const pointerActive = useRef(false);
  const strokeStartArmed = useRef(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guideCancel = useRef(false);
  const pulse = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const dotTargets = letter.dots ?? [];
  const activeDot = dotTargets[dotIndex];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 850, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 850, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    playLetterSound?.(letter.id);
    restartGuide();
    return () => {
      guideCancel.current = true;
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter.id, guideReplayToken]);

  useEffect(() => {
    if (success) {
      successAnim.setValue(0);
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      setParticles(buildStars(boardSize));
      playSuccessSound?.();
      if (onComplete) {
        autoAdvanceTimer.current = setTimeout(() => onComplete(), autoAdvanceDelayMs);
      }
    }
  }, [autoAdvanceDelayMs, boardSize, onComplete, playSuccessSound, success, successAnim]);

  function restartGuide() {
    guideCancel.current = true;
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setPhase('guide');
    setActiveStrokeIndex(0);
    setStrokeProgress(strokes.map(() => 0));
    setDotIndex(0);
    setHint('مسیر را دنبال کن');
    setSuccess(false);
    setGuideTick({ strokeIndex: 0, progress: 0 });
    strokeStartArmed.current = false;
    pointerActive.current = false;

    guideCancel.current = false;
    const durations = strokes.map(stroke => clamp(polylineLength(stroke.points) * 6, 700, 1300));
    let strokeIndex = 0;
    let strokeStarted = Date.now();

    const tick = () => {
      if (guideCancel.current) return;
      const stroke = strokes[strokeIndex];
      if (!stroke) {
        guideCancel.current = true;
        setPhase('trace');
        setGuideTick({ strokeIndex: 0, progress: 0 });
        setStrokeProgress(strokes.map(() => 0));
        setActiveStrokeIndex(0);
        setHint('از نقطه سبز شروع کن');
        strokeStartArmed.current = false;
        return;
      }
      const duration = durations[strokeIndex] ?? 900;
      const progress = clamp((Date.now() - strokeStarted) / duration, 0, 1);
      setGuideTick({ strokeIndex, progress });
      if (progress >= 1) {
        strokeIndex += 1;
        strokeStarted = Date.now();
        setGuideTick({ strokeIndex: Math.min(strokeIndex, strokes.length - 1), progress: 0 });
        setTimeout(tick, 120);
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  function resetAttempt() {
    setPhase('trace');
    setActiveStrokeIndex(0);
    setStrokeProgress(strokes.map(() => 0));
    setDotIndex(0);
    setHint('از نقطه سبز شروع کن');
    setSuccess(false);
    strokeStartArmed.current = false;
    pointerActive.current = false;
    onTryAgain?.();
    playTryAgainSound?.();
    restartGuide();
  }

  function finishLetter() {
    if (success) return;
    setSuccess(true);
    setPhase('done');
  }

  function currentStrokePoints() {
    return strokes[activeStrokeIndex]?.points ?? [];
  }

  function updateTrace(point: Point) {
    if (phase !== 'trace' && phase !== 'dots') return;
    if (phase === 'dots') {
      if (!activeDot) return;
      if (distance(point, activeDot) <= tolerance) {
        const next = dotIndex + 1;
        setDotIndex(next);
        setHint(next >= dotTargets.length ? 'آفرین!' : 'نقطه بعدی را بزن');
        if (next >= dotTargets.length) finishLetter();
      } else {
        setHint('روی دایره سبز بزن');
      }
      return;
    }

    const stroke = strokes[activeStrokeIndex];
    if (!stroke) return;
    const points = stroke.points;
    if (!points.length) return;
    const currentProgress = strokeProgress[activeStrokeIndex] ?? 0;
    const startPoint = points[0]!;
    const startGate = Math.max(16, tolerance * 0.75);
    if (!strokeStartArmed.current) {
      if (distance(point, startPoint) <= startGate) {
        strokeStartArmed.current = true;
      } else {
        setHint('از نقطه سبز شروع کن');
        return;
      }
    }

    const currentIndex = Math.max(0, Math.floor(currentProgress * (points.length - 1)));
    const { index, distance: nearestDistance } = nearestIndex(points, point, currentIndex, 14);
    if (index >= 0 && nearestDistance <= tolerance) {
      const nextIndex = Math.max(currentIndex, index);
      const progress = nextIndex / Math.max(1, points.length - 1);
      const nextProgress = strokeProgress.slice();
      nextProgress[activeStrokeIndex] = progress;
      setStrokeProgress(nextProgress);
      setHint('');
      if (progress >= 0.985) {
        const nextStroke = activeStrokeIndex + 1;
        pointerActive.current = false;
        strokeStartArmed.current = false;
        if (nextStroke < strokes.length) {
          setActiveStrokeIndex(nextStroke);
          setHint('مسیر بعدی');
          setPhase('trace');
        } else if (dotTargets.length > 0) {
          setPhase('dots');
          setHint('حالا نقطه‌ها را بزن');
        } else {
          finishLetter();
        }
      }
    } else {
      setHint(currentProgress <= 0.03 ? 'از نقطه سبز شروع کن' : 'مسیر را دنبال کن');
    }
  }

  function handlePointerDown(event: any) {
    if (phase === 'guide' || success) return;
    pointerActive.current = true;
    const point = extractPoint(event, scaleX, scaleY);
    if (phase === 'trace') {
      const startPoint = strokes[activeStrokeIndex]?.points?.[0];
      const startGate = Math.max(16, tolerance * 0.75);
      if (!startPoint || distance(point, startPoint) > startGate) {
        pointerActive.current = false;
        strokeStartArmed.current = false;
        setHint('از نقطه سبز شروع کن');
        return;
      }
      strokeStartArmed.current = true;
    }
    updateTrace(point);
  }

  function handlePointerMove(event: any) {
    if (!pointerActive.current || phase === 'guide' || success) return;
    updateTrace(extractPoint(event, scaleX, scaleY));
  }

  function handlePointerUp() {
    pointerActive.current = false;
  }

  const progressForStroke = (strokeIndex: number) => {
    if (phase === 'guide') {
      if (strokeIndex < guideTick.strokeIndex) return 1;
      if (strokeIndex > guideTick.strokeIndex) return 0;
      return guideTick.progress;
    }
    return strokeProgress[strokeIndex] ?? 0;
  };

  const guidePoint = useMemo(() => {
    const stroke = strokes[guideTick.strokeIndex];
    if (!stroke) return { x: 0, y: 0 };
    return pointAtProgress(stroke.points, guideTick.progress);
  }, [guideTick, strokes]);

  const guideRotation = useMemo(() => {
    const stroke = strokes[guideTick.strokeIndex];
    if (!stroke) return 0;
    const pts = stroke.points;
    const index = Math.max(1, Math.floor(guideTick.progress * (pts.length - 1)));
    return angleBetween(pts[index - 1] ?? pts[0]!, pts[index] ?? pts[pts.length - 1]!);
  }, [guideTick, strokes]);

  return (
    <View
      style={[styles.board, { width: boardSize, height: boardSize }]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      onTouchCancel={handlePointerUp}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
    >
      <Svg width={boardSize} height={boardSize} viewBox={letter.viewBox}>
        {strokes.map((strokeDef, strokeIndex) => {
          const points = strokeDef.points;
          const progress = progressForStroke(strokeIndex);
          const completedPath = pathSegmentPath(points, progress);
          const baseColor = '#E7DDEE';
          const guideBaseColor = '#F5DAE4';
          const baseWidth = 24;
  const activeColor = letter.color ?? '#FF7AA7';
          return (
            <G key={strokeDef.id}>
              <Path
                d={strokeDef.path}
                stroke={phase === 'guide' ? guideBaseColor : baseColor}
                strokeWidth={baseWidth + 16}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.22}
              />
              <Path
                d={strokeDef.path}
                stroke={phase === 'guide' ? activeColor : `${activeColor}`}
                strokeWidth={baseWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={phase === 'guide' ? 0.34 : 0.88}
                strokeDasharray={phase === 'guide' ? '10 10' : undefined}
                strokeDashoffset={phase === 'guide' ? 0 : undefined}
              />
              {completedPath ? (
                <Path
                  d={completedPath}
                  stroke={activeColor}
                  strokeWidth={baseWidth + 4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={phase === 'guide' ? 0 : 1}
                />
              ) : null}
            </G>
          );
        })}

        {success ? (
          <G>
            <Circle cx={viewBox.width / 2} cy={viewBox.height / 2} r={36} fill="#24C878" opacity={0.18} />
            <Path
              d={`M ${viewBox.width / 2 - 12} ${viewBox.height / 2} L ${viewBox.width / 2 - 1} ${viewBox.height / 2 + 12} L ${viewBox.width / 2 + 18} ${viewBox.height / 2 - 12}`}
              stroke="#24C878"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </G>
        ) : null}
      </Svg>

      <View style={styles.overlay} pointerEvents="none">
        {phase === 'guide' ? (
          <Animated.View
            style={[
              styles.pointer,
              {
                left: guidePoint.x * scaleX - 22,
                top: guidePoint.y * scaleY - 22,
                transform: [
                  { rotate: `${guideRotation}deg` },
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.08],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.pencilBody} />
            <View style={styles.pencilTip} />
            <View style={styles.pencilLead} />
          </Animated.View>
        ) : null}

        {phase === 'trace' && (strokeProgress[activeStrokeIndex] ?? 0) < 0.06 ? (
          <Animated.View
            style={[
              styles.startDotHalo,
              {
                left: pointAtProgress(strokes[activeStrokeIndex]?.points ?? [], 0).x * scaleX - 18,
                top: pointAtProgress(strokes[activeStrokeIndex]?.points ?? [], 0).y * scaleY - 18,
                transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] }) }],
              },
            ]}
          />
        ) : null}

        {phase === 'dots' && !success
          ? dotTargets.map((dot, idx) => (
              <Animated.View
                key={`${dot.x}-${dot.y}-${idx}`}
                style={[
                  styles.dotTarget,
                  {
                    left: dot.x * scaleX - 16,
                    top: dot.y * scaleY - 16,
                    opacity: idx === dotIndex ? 1 : 0.95,
                    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }],
                  },
                ]}
              />
            ))
          : null}

        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>

      {success ? <SuccessBurst particles={particles} anim={successAnim} /> : null}
    </View>
  );
}

function extractPoint(event: any, scaleX: number, scaleY: number): Point {
  const native = event?.nativeEvent ?? {};
  const locationX = typeof native.locationX === 'number' ? native.locationX : typeof native.pageX === 'number' ? native.pageX : 0;
  const locationY = typeof native.locationY === 'number' ? native.locationY : typeof native.pageY === 'number' ? native.pageY : 0;
  return { x: locationX / scaleX, y: locationY / scaleY };
}

function SuccessBurst({ particles, anim }: { particles: Particle[]; anim: Animated.Value }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map(particle => {
        const fade = anim.interpolate({
          inputRange: [0, 0.1, 0.85, 1],
          outputRange: [0, 1, 1, 0],
        });
        const travel = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 150 + particle.delay],
        });
        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [`${particle.rotate}deg`, `${particle.rotate + 240 + particle.delay}deg`],
        });
        if (particle.kind === 'confetti') {
          return (
            <Animated.View
              key={particle.id}
              style={[
                styles.confetti,
                {
                  left: particle.left,
                  top: particle.top,
                  backgroundColor: particle.color,
                  opacity: fade,
                  transform: [{ translateY: travel }, { rotate }, { scale: anim.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0.5, 1, 1] }) }],
                  width: particle.size * 0.55,
                  height: particle.size * 1.7,
                },
              ]}
            />
          );
        }
        return (
          <Animated.Text
            key={particle.id}
            style={[
              styles.star,
              {
                left: particle.left,
                top: particle.top,
                color: particle.color,
                fontSize: particle.size,
                opacity: fade,
                transform: [
                  { translateY: travel },
                  {
                    rotate,
                  },
                ],
              },
            ]}
          >
            ✦
          </Animated.Text>
        );
      })}
      <Animated.View
        style={[
          styles.successBadge,
          {
            opacity: anim.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0, 1, 0.95] }),
            transform: [
              { scale: anim.interpolate({ inputRange: [0, 0.22, 1], outputRange: [0.4, 1.08, 1] }) },
            ],
          },
        ]}
      >
        <View style={styles.successFace}>
          <Text style={styles.successFaceText}>☺</Text>
        </View>
        <View style={styles.successCheck}>
          <Text style={styles.successCheckText}>✓</Text>
        </View>
      </Animated.View>
    </View>
  );
}

function buildStars(size: number): Particle[] {
  const colors = ['#F6D32D', '#FF66A6', '#45C8F4', '#7CFF84', '#FF9E2E', '#9A6BFF'];
  return Array.from({ length: 42 }).map((_, index) => ({
    id: index,
    left: Math.random() * size * 0.92,
    top: Math.random() * size * 0.18,
    delay: Math.random() * 55,
    size: 12 + Math.random() * 9,
    duration: 900 + Math.random() * 500,
    color: colors[index % colors.length]!,
    kind: index % 3 === 0 ? 'confetti' : 'star',
    rotate: Math.random() * 360,
  }));
}

function parseViewBox(viewBox: string) {
  const [x = 0, y = 0, width = 200, height = 200] = viewBox.split(/\s+/).map(Number);
  return { x, y, width, height };
}

const styles = StyleSheet.create({
  board: {
    borderRadius: 28,
    backgroundColor: '#FFFDF8',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#F4C6D5',
    shadowColor: '#7B68EE',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pointer: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#59A8FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#59A8FF',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  pencilBody: {
    width: 28,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFE36E',
    transform: [{ rotate: '-18deg' }],
    marginTop: 2,
    marginLeft: 6,
  },
  pencilTip: {
    position: 'absolute',
    right: 11,
    width: 10,
    height: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#F08A5D',
    transform: [{ rotate: '-18deg' }],
  },
  pencilLead: {
    position: 'absolute',
    right: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2F2340',
    transform: [{ rotate: '-18deg' }],
  },
  startDotHalo: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2ECC71',
    opacity: 0.5,
  },
  dotTarget: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#49A6FF',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#49A6FF',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  strokeNumber: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#49A6FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#49A6FF',
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 2,
  },
  strokeNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  hint: {
    position: 'absolute',
    left: 16,
    bottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.82)',
    color: '#705C93',
    fontSize: 14,
    fontWeight: '700',
  },
  star: {
    position: 'absolute',
    fontWeight: '900',
  },
  confetti: {
    position: 'absolute',
    borderRadius: 4,
  },
  successBadge: {
    position: 'absolute',
    left: '50%',
    top: '35%',
    width: 120,
    height: 120,
    marginLeft: -60,
    marginTop: -60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successFace: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(36, 200, 120, 0.18)',
    borderWidth: 4,
    borderColor: '#24C878',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successFaceText: {
    color: '#24C878',
    fontSize: 42,
    lineHeight: 44,
    marginTop: -6,
  },
  successCheck: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#24C878',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  successCheckText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 26,
  },
});
