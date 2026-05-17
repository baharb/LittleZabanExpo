import React, { useEffect, useState } from 'react';
import { Image, ImageResizeMode, ImageStyle, StyleProp } from 'react-native';

type FrameAnimationProps = {
  frames: readonly any[];
  fps?: number;
  paused?: boolean;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
};

export default function FrameAnimation({
  frames,
  fps = 6,
  paused = false,
  style,
  resizeMode = 'contain',
}: FrameAnimationProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (paused || frames.length <= 1) return;
    const delay = Math.max(80, Math.round(1000 / fps));
    const id = setInterval(() => {
      setFrame(prev => (prev + 1) % frames.length);
    }, delay);
    return () => clearInterval(id);
  }, [fps, frames, paused]);

  if (!frames.length) return null;
  return <Image source={frames[frame % frames.length]} style={style} resizeMode={resizeMode} />;
}
