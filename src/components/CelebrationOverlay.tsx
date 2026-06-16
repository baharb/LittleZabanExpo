import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';

const DEFAULT_DURATION_MS = 3600;

const STAR_PALETTE = [
  { primaryColor: '#FFE875', glowColor: '#FFF4B8' },
  { primaryColor: '#FF6B9D', glowColor: '#FFD0E1' },
  { primaryColor: '#4CC9F0', glowColor: '#B8EDFF' },
  { primaryColor: '#80ED99', glowColor: '#CDF7D6' },
  { primaryColor: '#FF9F1C', glowColor: '#FFDDA1' },
  { primaryColor: '#C77DFF', glowColor: '#E8C4FF' },
  { primaryColor: '#FF5D5D', glowColor: '#FFD3D3' },
  { primaryColor: '#58D0E8', glowColor: '#D4F6FF' },
];

type CelebrationParticle = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  sway: number;
  rotateStart: number;
  rotateEnd: number;
  scaleStart: number;
  scaleMid: number;
  scaleEnd: number;
  alphaStart: number;
  alphaPeak: number;
  primaryColor: string;
  glowColor: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function buildParticles(seed: number, width: number, height: number, count: number) {
  const random = mulberry32(seed || 1);

  return Array.from({ length: count }, (_, index) => {
    const size = Math.round(12 + random() * 9);
    const rowT = random();
    const spread = 0.78 + rowT * 0.56;
    const topBand = Math.max(18, height * 0.12);
    const xBand = 0.12 + random() * 0.76;
    const tone = STAR_PALETTE[index % STAR_PALETTE.length];
    return {
      id: seed * 1000 + index,
      left: clamp(
        Math.round(
          (xBand + (random() - 0.5) * 0.12) * width,
        ),
        0,
        Math.max(4, width),
      ),
      top: clamp(
        Math.round(
          random() * topBand,
        ),
        0,
        Math.max(4, height - 8),
      ),
      size,
      delay: Math.round(random() * 520),
      duration: Math.round(1500 + random() * 900 + rowT * 500),
      drift: Math.round((random() - 0.5) * width * spread),
      sway: Math.round((random() - 0.5) * width * 0.1),
      rotateStart: Math.round(-40 + random() * 80),
      rotateEnd: Math.round(180 + random() * 260),
      scaleStart: 0.82,
      scaleMid: 1.06,
      scaleEnd: 0.92,
      alphaStart: 1,
      alphaPeak: 1,
      ...tone,
    } satisfies CelebrationParticle;
  });
}

function StarBurst({
  primaryColor,
  glowColor,
}: {
  primaryColor: string;
  glowColor: string;
}) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="34" fill={glowColor} opacity="0.18" />
      <Polygon
        points="50,6 58,35 89,35 64,54 74,84 50,67 26,84 36,54 11,35 42,35"
        fill={primaryColor}
      />
      <Polygon
        points="50,16 56,37 79,37 61,51 68,73 50,61 32,73 39,51 21,37 44,37"
        fill="#FFFDF6"
        opacity="0.42"
      />
    </Svg>
  );
}

function Particle({
  particle,
  stageHeight,
  progress,
}: {
  particle: CelebrationParticle;
  stageHeight: number;
  progress: Animated.Value;
}) {
  const start = particle.delay / DEFAULT_DURATION_MS;
  const end = Math.min(1, particle.duration / DEFAULT_DURATION_MS);
  const mid = start + (end - start) * 0.42;
  const opacityLead = Math.min(mid - 0.001, start + 0.005);
  const scaleLead = Math.min(mid - 0.001, start + 0.015);

  const translateY = progress.interpolate({
    inputRange: [start, end],
    outputRange: [0, stageHeight + 70 - particle.top],
    extrapolate: 'clamp',
  });
  const translateX = progress.interpolate({
    inputRange: [start, end],
    outputRange: [0, particle.drift + particle.sway],
    extrapolate: 'clamp',
  });
  const opacity = progress.interpolate({
    inputRange: [start, opacityLead, mid, end],
    outputRange: ambientOpacityValues(particle),
    extrapolate: 'clamp',
  });
  const scale = progress.interpolate({
    inputRange: [start, scaleLead, mid, end],
    outputRange: [particle.scaleStart, particle.scaleMid, particle.scaleMid, particle.scaleEnd],
    extrapolate: 'clamp',
  });
  const rotate = progress.interpolate({
    inputRange: [start, end],
    outputRange: [`${particle.rotateStart}deg`, `${particle.rotateEnd}deg`],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      pointerEvents="none"
    style={[
        styles.particle,
        {
          left: particle.left,
          top: particle.top,
          width: particle.size,
          height: particle.size,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }, { rotate }],
        },
      ]}
    >
      <View style={styles.particleGlow}>
        <StarBurst
          primaryColor={particle.primaryColor}
          glowColor={particle.glowColor}
        />
      </View>
    </Animated.View>
  );
}

function ambientOpacityValues(particle: CelebrationParticle) {
  return [0, particle.alphaStart, particle.alphaPeak, 0];
}

type CelebrationOverlayProps = {
  active: boolean;
  width: number;
  height: number;
  seed: number;
  onComplete?: () => void;
  particleCount?: number;
};

export default function CelebrationOverlay({
  active,
  width,
  height,
  seed,
  onComplete,
  particleCount = 42,
}: CelebrationOverlayProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const onCompleteRef = useRef(onComplete);
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stableParticles = useMemo(() => {
    if (!active || !width || !height) return [];
    return buildParticles(seed, width, height, particleCount);
  }, [active, height, particleCount, seed, width]);

  useEffect(() => {
    if (!active || !width || !height) {
      progress.stopAnimation();
      progress.setValue(0);
      animationRef.current?.stop();
      animationRef.current = null;
      setParticles([]);
      return;
    }

    setParticles(stableParticles);

    progress.stopAnimation();
    progress.setValue(0);
    animationRef.current?.stop();
    animationRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: DEFAULT_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    animationRef.current.start(({ finished }) => {
      if (!finished) return;
      onCompleteRef.current?.();
    });

    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [active, height, progress, stableParticles, width]);

  if (!active || !width || !height) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map(particle => (
        <Particle key={particle.id} particle={particle} stageHeight={height} progress={progress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particleGlow: {
    width: '100%',
    height: '100%',
    shadowColor: 'rgba(255, 245, 170, 0.95)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
});
