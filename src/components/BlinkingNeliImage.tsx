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
  overlayOffsetY = 0.5,
  overlayOpacity = 1,
  blinkClosedMs = 190,
}: Props) {
  const [blinkVisible, setBlinkVisible] = useState(forceVisible);
  const imageHeight = height ?? size * 1.18;

  useEffect(() => {
    if (forceVisible) {
      setBlinkVisible(true);
      return;
    }
    if (singleBlinkMs > 0) {
      setBlinkVisible(true);
      const timer = setTimeout(() => setBlinkVisible(false), singleBlinkMs);
      return () => clearTimeout(timer);
    }
    if (introVisibleMs > 0) {
      setBlinkVisible(true);
      const introTimer = setTimeout(() => setBlinkVisible(false), introVisibleMs);
      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const schedule = (delay: number) => {
        timer = setTimeout(() => {
          if (cancelled) return;
          setBlinkVisible(true);
          timer = setTimeout(() => {
            if (cancelled) return;
            setBlinkVisible(false);
            schedule(repeatMs);
          }, blinkClosedMs);
        }, delay);
      };

      timer = setTimeout(() => {
        if (cancelled) return;
        setBlinkVisible(false);
        schedule(180);
      }, introVisibleMs);

      return () => {
        cancelled = true;
        clearTimeout(introTimer);
        if (timer) clearTimeout(timer);
      };
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = (delay: number) => {
      timer = setTimeout(() => {
        if (cancelled) return;
        setBlinkVisible(true);
        timer = setTimeout(() => {
          if (cancelled) return;
          setBlinkVisible(false);
          schedule(repeatMs);
        }, blinkClosedMs);
      }, delay);
    };

    schedule(preview ? 180 : 1200);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [preview, forceVisible, introVisibleMs, repeatMs, singleBlinkMs, overlaySource, overlayScale, overlayOffsetY, overlayOpacity, blinkClosedMs]);

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
      {blinkVisible ? (
        <Image
          source={overlaySource ?? neliWorldAssets.characters.neliBlinkOverlay}
          style={[
            styles.overlay,
            {
              width: overlayWidth,
              height: overlayHeight,
              left: -(overlayWidth - size) / 2,
              top: -(overlayHeight - imageHeight) / 2 + overlayOffsetY,
              opacity: overlayOpacity,
            },
          ]}
          resizeMode="contain"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  overlay: { position: 'absolute', zIndex: 2, elevation: 2 },
});
