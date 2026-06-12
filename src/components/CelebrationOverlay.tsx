import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';

const DEFAULT_DURATION_MS = 3800;

const STAR_PALETTE = [
  { primaryColor: '#FFE875', innerColor: '#FFF8D0', coreColor: '#FFFDF2' },
  { primaryColor: '#FF6B9D', innerColor: '#FFD0E1', coreColor: '#FFF1F7' },
  { primaryColor: '#4CC9F0', innerColor: '#B8EDFF', coreColor: '#E6FBFF' },
  { primaryColor: '#80ED99', innerColor: '#CDF7D6', coreColor: '#F0FDF4' },
  { primaryColor: '#FF9F1C', innerColor: '#FFDDA1', coreColor: '#FFF3DC' },
  { primaryColor: '#C77DFF', innerColor: '#E8C4FF', coreColor: '#F6E8FF' },
];

type CelebrationParticle = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rotateStart: number;
  rotateEnd: number;
  scaleStart: number;
  scaleMid: number;
  scaleEnd: number;
  alphaStart: number;
  alphaPeak: number;
  primaryColor: string;
  innerColor: string;
  coreColor: string;
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
  const topClusterCount = Math.max(1, Math.round(count * 0.9));

  return Array.from({ length: count }, (_, index) => {
    const isTopCluster = index < topClusterCount;
    const size = Math.round(14 + random() * 10);
    const rowT = random();
    const spread = 0.92 + rowT * 0.76;
    const topBand = isTopCluster ? Math.max(24, height * 0.1) : Math.max(18, height * 0.05);
    const tone = STAR_PALETTE[index % STAR_PALETTE.length];
    return {
      id: seed * 1000 + index,
      left: clamp(
        Math.round(
          ((isTopCluster ? 0.58 : 0.42) + (random() - 0.5) * (isTopCluster ? 0.22 : 0.32) + (random() - 0.5) * 0.22) * width,
        ),
        0,
        Math.max(4, width),
      ),
      top: clamp(
        Math.round(
          isTopCluster
            ? random() * height * 0.1
            : Math.pow(rowT, 0.88) * height * 0.84 + random() * topBand,
        ),
        0,
        Math.max(4, height - 8),
      ),
      size,
      delay: 0,
      duration: Math.round(1100 + random() * 650 + rowT * 500),
      drift: Math.round((random() - 0.5) * width * spread),
      rotateStart: Math.round(-40 + random() * 80),
      rotateEnd: Math.round(120 + random() * 220),
      scaleStart: 0.82,
      scaleMid: 1.1,
      scaleEnd: 0.96,
      alphaStart: 1,
      alphaPeak: 1,
      ...tone,
    } satisfies CelebrationParticle;
  });
}

function StarBurst({
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
      <Polygon
        points="50,5 60,36 92,36 66,56 76,88 50,69 24,88 34,56 8,36 40,36"
        fill={primaryColor}
        opacity="0.95"
      />
      <Circle cx="50" cy="50" r="11" fill={innerColor} opacity="0.9" />
      <Circle cx="50" cy="50" r="4" fill={coreColor} />
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
  const end = Math.min(1, (particle.delay + particle.duration) / DEFAULT_DURATION_MS);
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
    outputRange: [0, particle.drift],
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
          innerColor={particle.innerColor}
          coreColor={particle.coreColor}
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
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);

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
      onComplete?.();
    });

    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [active, height, onComplete, progress, stableParticles, width]);

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
