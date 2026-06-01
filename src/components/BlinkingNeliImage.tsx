import React, { useEffect, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { neliWorldAssets } from '../assets/neliWorldAssets';

type Props = {
  size: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  preview?: boolean;
  showBase?: boolean;
  forceVisible?: boolean;
  introVisibleMs?: number;
  repeatMs?: number;
  singleBlinkMs?: number;
  overlaySource?: any;
  overlayScale?: number;
  overlayOffsetX?: number;
  overlayOffsetY?: number;
  overlayOpacity?: number;
  blinkClosedMs?: number;
};

export default function BlinkingNeliImage({
  size,
  height,
  style,
  preview = false,
  showBase = true,
  forceVisible = false,
  introVisibleMs = 0,
  repeatMs = 3000,
  singleBlinkMs = 0,
  overlaySource,
  overlayScale = 1,
  overlayOffsetX = 0,
  overlayOffsetY = 0.5,
  overlayOpacity = 1,
  blinkClosedMs = 190,
}: Props) {
  const [blinkVisible, setBlinkVisible] = useState(forceVisible);
  const imageHeight = height ?? size * 1.18;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const later = (fn: () => void, delay: number) => {
      const timer = setTimeout(fn, delay);
      timers.push(timer);
      return timer;
    };

    if (forceVisible) {
      setBlinkVisible(true);
      return;
    }
    if (singleBlinkMs > 0) {
      setBlinkVisible(true);
      later(() => setBlinkVisible(false), singleBlinkMs);
      return () => timers.forEach(clearTimeout);
    }

    const blinkOnce = () => {
      if (cancelled) return;
      setBlinkVisible(true);
      later(() => {
        if (cancelled) return;
        setBlinkVisible(false);
        later(blinkOnce, repeatMs);
      }, blinkClosedMs);
    };

    if (introVisibleMs > 0) {
      setBlinkVisible(true);
      later(() => {
        if (cancelled) return;
        setBlinkVisible(false);
        later(blinkOnce, 180);
      }, introVisibleMs);
    } else {
      setBlinkVisible(false);
      later(blinkOnce, preview ? 180 : 1200);
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [preview, forceVisible, introVisibleMs, repeatMs, singleBlinkMs, blinkClosedMs]);

  const overlayWidth = size * 1.03 * overlayScale;
  const overlayHeight = imageHeight * 1.03 * overlayScale;

  return (
    <View style={[styles.wrap, style, { width: size, height: imageHeight }]}>
      {showBase ? (
        <Image
          source={neliWorldAssets.characters.neli}
          style={{ width: size, height: imageHeight }}
          resizeMode="contain"
        />
      ) : null}
      <Image
        source={overlaySource ?? neliWorldAssets.characters.neliBlinkOverlay}
        style={[
          styles.overlay,
          {
            width: overlayWidth,
            height: overlayHeight,
            left: -(overlayWidth - size) / 2 + overlayOffsetX,
            top: -(overlayHeight - imageHeight) / 2 + overlayOffsetY,
            opacity: blinkVisible ? overlayOpacity : 0,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  overlay: { position: 'absolute', zIndex: 2, elevation: 2 },
});
