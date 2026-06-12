import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import { FarsiLetter } from '../../data/farsiLetters';
import { ff } from '../../theme/fonts';
import {
  angleBetween,
  clamp,
  distance,
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
  autoAdvanceDelayMs?: number;
};

type TracePhase = 'guide' | 'trace' | 'done';

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

const START_RADIUS = 44;
const MIN_TRACE_LENGTH = 140;

export default function FarsiLetterTracer({
  letter,
  boardSize,
  guideReplayToken,
  onComplete,
  onTryAgain,
  playLetterSound,
  playSuccessSound,
  playTryAgainSound,
  autoAdvanceDelayMs = 1500,
}: Props) {
  const viewBox = parseViewBox(letter.viewBox);
  const scaleX = boardSize / viewBox.width;
  const scaleY = boardSize / viewBox.height;

  const guideStroke = useMemo(() => {
    const stroke = letter.strokes[0];
    return stroke ?? null;
  }, [letter.strokes]);

  const guidePoints = useMemo(
    () => (guideStroke ? sampleSvgPath(guideStroke.path, 220) : []),
    [guideStroke],
  );
  const guideLength = useMemo(() => polylineLength(guidePoints), [guidePoints]);
  const dotTargets = letter.dots ?? [];

  const [phase, setPhase] = useState<TracePhase>('guide');
  const [guideProgress, setGuideProgress] = useState(0);
  const [userPoints, setUserPoints] = useState<Point[]>([]);
  const [hint, setHint] = useState('از نقطه سبز شروع کن');
  const [completed, setCompleted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [successText, setSuccessText] = useState('');

  const [pulseValue] = useState(() => new Animated.Value(0));
  const [successAnim] = useState(() => new Animated.Value(0));

  const drawingRef = useRef(false);
  const startedNearGuideRef = useRef(false);
  const guideRafRef = useRef<number | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPoint = guidePoints[0] ?? { x: 0, y: 0 };
  const guideMarkerPoints = useMemo(() => {
    if (guidePoints.length < 2) return [];
    return [0.18, 0.5, 0.78].map(t => {
      const index = Math.max(1, Math.min(guidePoints.length - 1, Math.round(t * (guidePoints.length - 1))));
      const point = guidePoints[index]!;
      const prev = guidePoints[index - 1] ?? point;
      const next = guidePoints[Math.min(guidePoints.length - 1, index + 1)] ?? point;
      return {
        id: `${t}`,
        point,
        rotation: angleBetween(prev, next),
      };
    });
  }, [guidePoints]);

  const guidePoint = useMemo(() => pointAtProgress(guidePoints, guideProgress), [guidePoints, guideProgress]);
  const guideRotation = useMemo(() => {
    if (guidePoints.length < 2) return 0;
    const index = Math.max(1, Math.floor(guideProgress * (guidePoints.length - 1)));
    return angleBetween(guidePoints[index - 1] ?? guidePoints[0]!, guidePoints[index] ?? guidePoints[guidePoints.length - 1]!);
  }, [guidePoints, guideProgress]);

  const startPulseScale = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.22],
  });
  const startPulseOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 0.15],
  });

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 800,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseValue]);

  useEffect(() => {
    playLetterSound?.(letter.id);
    restartGuide();
    return () => {
      cancelGuide();
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter.id, guideReplayToken]);

  useEffect(() => {
    if (!completed) return;
    successAnim.setValue(0);
    Animated.timing(successAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    setParticles(buildStars(boardSize));
    setSuccessText('آفرین!');
    playSuccessSound?.();
    if (onComplete) {
      successTimerRef.current = setTimeout(() => onComplete(), autoAdvanceDelayMs);
    }
  }, [autoAdvanceDelayMs, boardSize, completed, onComplete, playSuccessSound, successAnim]);

  function cancelGuide() {
    if (guideRafRef.current != null) {
      cancelAnimationFrame(guideRafRef.current);
      guideRafRef.current = null;
    }
  }

  function restartGuide() {
    cancelGuide();
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    setPhase('guide');
    setGuideProgress(0);
    setUserPoints([]);
    setHint('از نقطه سبز شروع کن');
    setCompleted(false);
    setSuccessText('');
    drawingRef.current = false;
    startedNearGuideRef.current = false;

    if (!guidePoints.length) {
      setPhase('trace');
      return;
    }

    const duration = clamp(guideLength * 7, 900, 1800);
    const startTime = Date.now();
    const tick = () => {
      const progress = clamp((Date.now() - startTime) / duration, 0, 1);
      setGuideProgress(progress);
      if (progress >= 1) {
        setPhase('trace');
        setGuideProgress(0);
        guideRafRef.current = null;
        return;
      }
      guideRafRef.current = requestAnimationFrame(tick);
    };

    guideRafRef.current = requestAnimationFrame(tick);
  }

  function resetTrace() {
    onTryAgain?.();
    playTryAgainSound?.();
    restartGuide();
  }

  function finishLetter() {
    if (completed) return;
    setCompleted(true);
    setPhase('done');
  }

  function updateTrace(point: Point) {
    if (phase === 'guide' || completed) return;

    if (!startedNearGuideRef.current) {
      if (distance(point, startPoint) <= START_RADIUS) {
        startedNearGuideRef.current = true;
        setHint('');
      } else {
        setHint('از نقطه سبز شروع کن');
      }
    }

    setUserPoints(prev => {
      const next = [...prev, point];
      const total = polylineLength(next);
      if (startedNearGuideRef.current && total >= Math.max(MIN_TRACE_LENGTH, guideLength * 0.45)) {
        finishLetter();
      }
      return next;
    });
  }

  function handlePointerDown(event: any) {
    if (phase === 'guide' || completed) return;
    drawingRef.current = true;
    const point = extractPoint(event, scaleX, scaleY);
    setUserPoints([point]);
    startedNearGuideRef.current = distance(point, startPoint) <= START_RADIUS;
    setHint(startedNearGuideRef.current ? '' : 'از نقطه سبز شروع کن');
    if (startedNearGuideRef.current && guidePoints.length <= 1) {
      finishLetter();
    }
  }

  function handlePointerMove(event: any) {
    if (!drawingRef.current || phase === 'guide' || completed) return;
    updateTrace(extractPoint(event, scaleX, scaleY));
  }

  function handlePointerUp() {
    drawingRef.current = false;
  }

  const startPointScreen = {
    x: startPoint.x * scaleX,
    y: startPoint.y * scaleY,
  };
  const guidePointScreen = {
    x: guidePoint.x * scaleX,
    y: guidePoint.y * scaleY,
  };

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
      accessible
      accessibilityLabel={`Trace the Farsi letter ${letter.letter}`}
    >
      <Svg width={boardSize} height={boardSize} viewBox={letter.viewBox}>
        <SvgText
          x="50%"
          y="56%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={Math.min(viewBox.width, viewBox.height) * 0.84}
          fontFamily={ff('fa', 'black')}
          fill="#D9DEE7"
          opacity={0.78}
        >
          {letter.letter}
        </SvgText>

        {guideStroke ? (
          <Path
            d={guideStroke.path}
            stroke="#BCC4D1"
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="12 10"
            fill="none"
            opacity={0.85}
          />
        ) : null}

        {guideMarkerPoints.map(marker => (
          <G key={marker.id} transform={`translate(${marker.point.x} ${marker.point.y}) rotate(${marker.rotation})`}>
            <Path d="M -7 -4 L 6 0 L -7 4 Z" fill="#97A0B1" opacity={0.95} />
          </G>
        ))}

        {dotTargets.map((dot, index) => (
          <Circle
            key={`${dot.x}-${dot.y}-${index}`}
            cx={dot.x}
            cy={dot.y}
            r={5.4}
            fill={letter.color ?? '#6C4EFF'}
            stroke="#fff"
            strokeWidth={2}
          />
        ))}

        {userPoints.length > 1 ? (
          <Path
            d={pointsToPath(userPoints)}
            stroke={letter.color ?? '#22C55E'}
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : null}
      </Svg>

      {phase !== 'done' ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.startPulse,
            {
              left: startPointScreen.x - 23,
              top: startPointScreen.y - 23,
              opacity: startedNearGuideRef.current && phase === 'trace' ? 0.45 : startPulseOpacity,
              transform: [{ scale: startPulseScale }],
              backgroundColor: '#5BDA7A',
            },
          ]}
        >
          <Text style={styles.startPulseText}>1</Text>
        </Animated.View>
      ) : null}

      {phase === 'guide' ? (
        <View
          pointerEvents="none"
          style={[
            styles.guidePointer,
            {
              left: guidePointScreen.x - 24,
              top: guidePointScreen.y - 24,
            },
          ]}
        >
          <View style={styles.guidePointerInner} />
        </View>
      ) : null}

      {hint ? <Text style={styles.hint}>{completed ? successText : hint}</Text> : null}

      {completed ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.successBadge,
            {
              opacity: successAnim.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0, 1, 0.96] }),
              transform: [{ scale: successAnim.interpolate({ inputRange: [0, 0.22, 1], outputRange: [0.4, 1.08, 1] }) }],
            },
          ]}
        >
          <View style={styles.successFace}>
            <Text style={styles.successFaceText}>آفرین!</Text>
          </View>
        </Animated.View>
      ) : null}

      <SuccessBurst particles={particles} anim={successAnim} />
    </View>
  );
}

function extractPoint(event: any, scaleX: number, scaleY: number): Point {
  const native = event?.nativeEvent ?? {};
  const locationX = typeof native.locationX === 'number' ? native.locationX : typeof native.pageX === 'number' ? native.pageX : 0;
  const locationY = typeof native.locationY === 'number' ? native.locationY : typeof native.pageY === 'number' ? native.pageY : 0;
  return { x: locationX / scaleX, y: locationY / scaleY };
}

function pointsToPath(points: Point[]) {
  if (!points.length) return '';
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
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
          outputRange: [0, 170 + particle.delay],
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
                transform: [{ translateY: travel }, { rotate }],
              },
            ]}
          >
            ✦
          </Animated.Text>
        );
      })}
    </View>
  );
}

function buildStars(size: number): Particle[] {
  const colors = ['#F6D32D', '#FF66A6', '#45C8F4', '#7CFF84', '#FF9E2E', '#9A6BFF'];
  return Array.from({ length: 28 }).map((_, index) => ({
    id: index,
    left: Math.random() * size * 0.92,
    top: Math.random() * size * 0.18,
    delay: Math.random() * 55,
    size: 11 + Math.random() * 8,
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
    backgroundColor: '#FFF',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#7A8DA3',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  startPulse: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startPulseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
  guidePointer: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4AB0F5',
    shadowColor: '#4AB0F5',
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 3,
  },
  guidePointerInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    opacity: 0.92,
  },
  hint: {
    position: 'absolute',
    left: 14,
    bottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.84)',
    color: '#5E6880',
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
    width: 190,
    height: 96,
    marginLeft: -95,
    marginTop: -48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successFace: {
    width: 190,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(36, 200, 120, 0.18)',
    borderWidth: 4,
    borderColor: '#24C878',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successFaceText: {
    color: '#24C878',
    fontSize: 28,
    fontWeight: '900',
  },
});
