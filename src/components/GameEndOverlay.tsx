/**
 * GameEndOverlay — shown after a game completes.
 * Semi-transparent white overlay with a 5-second circular countdown.
 * Calls onGo when the timer runs out OR the user taps the button.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ff } from '../theme/fonts';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const COUNTDOWN_S = 5;
const RING_R      = 30;
const RING_C      = 2 * Math.PI * RING_R;

type Props = { onGo: () => void };

export default function GameEndOverlay({ onGo }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue:  1,
      duration: COUNTDOWN_S * 1000,
      easing:   Easing.linear,
      useNativeDriver: false,   // SVG strokeDashoffset requires JS driver
    }).start(({ finished }) => {
      if (finished) onGo();
    });
    return () => progress.stopAnimation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dashoffset = progress.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, RING_C],
  });

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Svg width={80} height={80} style={{ marginBottom: 20 }}>
          <Circle cx={40} cy={40} r={RING_R} stroke="#E0D8FF" strokeWidth={7} fill="none" />
          <AnimatedCircle
            cx={40} cy={40} r={RING_R}
            stroke="#6C4EFF" strokeWidth={7} fill="none"
            strokeDasharray={RING_C}
            strokeDashoffset={dashoffset as any}
            strokeLinecap="round"
            rotation={-90} origin="40,40"
          />
        </Svg>
        <TouchableOpacity style={styles.btn} onPress={onGo} activeOpacity={0.82}>
          <Text style={styles.btnText}>بریم بازی دیگه! 🎮</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 28,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6C4EFF',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  btn: {
    backgroundColor: '#6C4EFF',
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: ff('fa', 'black'),
  },
});
