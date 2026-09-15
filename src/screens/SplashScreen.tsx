import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { Audio } from 'expo-av';
import PopperCelebration from '../components/PopperCelebration';
import { characterAssets } from '../assets/characterAssets';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';

// The real recorded clip of kids shouting "yay" and cheering — plays the
// instant Neli (the last character) arrives. ~2.116s long, mixed quiet.
const YAY_KIDS_SOUND = require('../../assets/audio/yay-kids.mp3');
const YAY_DURATION_MS = 2116;
const LOGO_WHITE = require('../../assets/logo-white.webp');
const LOGO_WHITE_ASPECT = 961 / 501;

type CastMember = {
  key: string;
  source: ImageSourcePropType;
  aspectRatio: number;
  leftPct: number;
  bottomPct: number;
  heightPct: number;
  tilt: string;
  zIndex: number;
};

// Same huddle arrangement reviewed in the splash concept: everyone gathers
// in front of the yard, arriving left-to-right, with Neli (the hero) biggest
// and front-and-center as the last arrival.
const CAST: CastMember[] = [
  { key: 'robo', source: characterAssets.roboBoombo.poses.base, aspectRatio: 1, leftPct: 33, bottomPct: 34.5, heightPct: 24.5, tilt: '-6deg', zIndex: 1 },
  { key: 'dara', source: require('../../assets/neli-world/characters/Dara/happy_baby_giraffe_in_cheerful_pose.webp'), aspectRatio: 1, leftPct: 66.5, bottomPct: 34.5, heightPct: 24.5, tilt: '6deg', zIndex: 1 },
  { key: 'lila', source: characterAssets.lila.poses.base, aspectRatio: 1086 / 1448, leftPct: 50, bottomPct: 30.5, heightPct: 26.5, tilt: '0deg', zIndex: 2 },
  { key: 'aidin', source: characterAssets.aidin.poses.base, aspectRatio: 1472 / 2048, leftPct: 38.5, bottomPct: 16.5, heightPct: 30, tilt: '3deg', zIndex: 3 },
  { key: 'mila', source: require('../../assets/neli-world/characters/Mila/mila_teeth.webp'), aspectRatio: 1087 / 1446, leftPct: 62.5, bottomPct: 14.5, heightPct: 30.5, tilt: '-3deg', zIndex: 3 },
  { key: 'neli', source: characterAssets.neli.poses.base, aspectRatio: 1, leftPct: 50.5, bottomPct: 1, heightPct: 41, tilt: '0deg', zIndex: 4 },
];

const ENTRANCE_GAP_MS = 340;
const FIRST_ENTRANCE_DELAY_MS = 260;
const ENTRANCE_DURATION_MS = 420;

export default function SplashScreen() {
  const { reset } = useNav();
  const { lang, authReady, hasAccount, timeExpired } = useContext(AppContext);
  const { width, height } = useWindowDimensions();
  const isFa = lang === 'fa' || lang === 'ar';
  const landscape = width > height;
  const splashSource = landscape ? neliWorldAssets.rooms.splashLandscape : neliWorldAssets.rooms.splashPortrait;

  const [finaleVisible, setFinaleVisible] = useState(false);
  const [celebrationOn, setCelebrationOn] = useState(false);
  const finaleOpacity = useRef(new Animated.Value(0)).current;
  const castAnims = useRef(CAST.map(() => new Animated.Value(0))).current;
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Reset in case this effect re-fires (e.g. authReady flips).
    setFinaleVisible(false);
    setCelebrationOn(false);
    finaleOpacity.setValue(0);
    castAnims.forEach(a => a.setValue(0));

    castAnims.forEach((anim, i) => {
      timers.push(setTimeout(() => {
        Animated.timing(anim, {
          toValue: 1,
          duration: ENTRANCE_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }, FIRST_ENTRANCE_DELAY_MS + i * ENTRANCE_GAP_MS));
    });

    const lastIndex = CAST.length - 1;
    const lastCharAt = FIRST_ENTRANCE_DELAY_MS + lastIndex * ENTRANCE_GAP_MS;

    // Neli (the last arrival) triggers the real "yay" cheer clip, played quiet.
    timers.push(setTimeout(async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(YAY_KIDS_SOUND, { shouldPlay: true, volume: 0.4 });
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate(async status => {
          if (status.isLoaded && status.didJustFinish) {
            try { await sound.unloadAsync(); } catch { /* ignore */ }
            if (soundRef.current === sound) soundRef.current = null;
          }
        });
      } catch {
        // sound is a nice-to-have, never block the splash on it
      }
    }, lastCharAt));

    // Stay on the yard through the cheer, then move on ~70% of the way through it.
    const finaleAt = lastCharAt + YAY_DURATION_MS * 0.7;
    timers.push(setTimeout(() => {
      if (cancelled) return;
      setFinaleVisible(true);
      setCelebrationOn(true);
      Animated.timing(finaleOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, finaleAt));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady]);

  const goNext = () => {
    if (!authReady) return;
    if (timeExpired) { reset({ name: 'TimeUp' }); return; }
    reset(hasAccount ? { name: 'Home' } : { name: 'AccountSetup' });
  };

  return (
    <ImageBackground source={splashSource} style={styles.root} resizeMode="cover">
      {CAST.map((member, i) => {
        const heightPx = (member.heightPct / 100) * height;
        const widthPx = heightPx * member.aspectRatio;
        const leftPx = (member.leftPct / 100) * width - widthPx / 2;
        const bottomPx = (member.bottomPct / 100) * height;
        const anim = castAnims[i];
        return (
          <View
            key={member.key}
            pointerEvents="none"
            style={{ position: 'absolute', left: leftPx, bottom: bottomPx, width: widthPx, height: heightPx, zIndex: member.zIndex }}
          >
            <Animated.View
              style={{
                width: '100%',
                height: '100%',
                opacity: anim,
                transform: [
                  { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }) },
                  { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] }) },
                  { rotate: member.tilt },
                ],
              }}
            >
              <Image source={member.source} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
            </Animated.View>
          </View>
        );
      })}

      <Animated.View pointerEvents={finaleVisible ? 'auto' : 'none'} style={[styles.finale, { opacity: finaleOpacity }]}>
        <PopperCelebration visible={celebrationOn} onComplete={() => { setCelebrationOn(false); goNext(); }} />
        <Image source={LOGO_WHITE} resizeMode="contain" style={[styles.finaleLogo, { aspectRatio: LOGO_WHITE_ASPECT }]} />
        <Text style={[styles.finaleName, { fontFamily: ff(lang, 'black') }, dir(lang)]}>
          {isFa ? 'زال' : 'Persian for kids'}
        </Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#6B21A8' },
  finale: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6B21A8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  finaleLogo: { width: '38%' },
  finaleName: { color: '#FFFFFF', fontSize: 30, marginTop: 14 },
});
