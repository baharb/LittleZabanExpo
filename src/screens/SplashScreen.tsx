import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import FrameAnimation from '../components/FrameAnimation';
import { characterAssets } from '../assets/characterAssets';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';
import { clamp } from '../theme/responsive';

const RUNNING_FRAMES = [
  characterAssets.neli.poses.walking,
  characterAssets.neli.poses.running,
  characterAssets.neli.poses.walking,
  characterAssets.neli.poses.running,
];

export default function SplashScreen() {
  const { navigate } = useNav();
  const { lang } = useContext(AppContext);
  const { width, height } = useWindowDimensions();
  const isFa = lang === 'fa' || lang === 'ar';
  const landscape = width > height;
  const tablet = Math.min(width, height) >= 720;
  const neliSize = clamp(
    Math.min(width, height) * (landscape ? 0.46 : 0.54),
    tablet ? 300 : 220,
    landscape ? (tablet ? 470 : 380) : (tablet ? 520 : 390)
  );
  const splashSource = landscape ? neliWorldAssets.rooms.splashLandscape : neliWorldAssets.rooms.splashPortrait;
  const [arrived, setArrived] = useState(false);
  const neliRunX = useRef(new Animated.Value(-900)).current;
  const neliFloat = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(18)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    setArrived(false);
    neliRunX.setValue(-(width * 0.9 + neliSize));
    neliFloat.setValue(0);
    titleY.setValue(18);
    titleOpacity.setValue(0);

    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(neliFloat, { toValue: -8, duration: 850, useNativeDriver: true }),
        Animated.timing(neliFloat, { toValue: 0, duration: 850, useNativeDriver: true }),
      ])
    );

    Animated.parallel([
      Animated.timing(titleY, { toValue: 0, duration: 450, useNativeDriver: true }),
      Animated.timing(titleOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(neliRunX, { toValue: 0, duration: 1120, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (!finished) return;
      setArrived(true);
      waveLoop.start();
    });

    const timer = setTimeout(() => {
      navigate({ name: 'Main', tab: 'Games' });
    }, 3100);
    return () => {
      clearTimeout(timer);
      waveLoop.stop();
    };
  }, [navigate, neliFloat, neliRunX, neliSize, titleOpacity, titleY, width]);

  return (
    <ImageBackground source={splashSource} style={styles.root} resizeMode="cover">
      <View style={styles.overlay} />
        <View style={[styles.content, landscape && styles.contentLandscape, tablet && styles.contentTablet]}>
          <Animated.View style={[styles.neliStage, { width: neliSize, height: neliSize * 1.18, transform: [{ translateX: neliRunX }, { translateY: neliFloat }] }]}>
            {arrived ? (
              <Image source={characterAssets.neli.poses.waving} resizeMode="contain" style={{ width: neliSize, height: neliSize * 1.18 }} />
            ) : (
              <FrameAnimation frames={RUNNING_FRAMES} fps={7} resizeMode="contain" style={{ width: neliSize, height: neliSize * 1.18 }} />
            )}
        </Animated.View>

        <Animated.View style={[styles.copy, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
          <Text style={[styles.appName, { fontSize: clamp(Math.min(width, height) * (tablet ? 0.082 : 0.1), 38, tablet ? 76 : landscape ? 48 : 58) }]}>Little Zaban</Text>
          <Text style={[styles.appNameFa, { fontFamily: ff(lang, 'black'), fontSize: tablet ? 27 : 21 }, dir(lang)]}>
            {isFa ? 'لیتل زبان' : 'Persian for kids'}
          </Text>
          <View style={styles.badge}>
            <Image source={neliWorldAssets.ui.play} style={styles.badgeIcon} resizeMode="contain" />
            <Text style={[styles.badgeTxt, { fontFamily: ff(lang, 'bold') }, dir(lang)]}>
              {isFa ? 'بازی، داستان، گفتگو' : 'Play, stories, speaking'}
            </Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.loading}>
        {[0, 1, 2].map(i => <View key={i} style={styles.dot} />)}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#41D778' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37,16,92,0.14)' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26, paddingBottom: 34 },
    contentLandscape: { flexDirection: 'row-reverse', gap: 34 },
    contentTablet: { paddingHorizontal: 54, paddingBottom: 54 },
    neliStage: { alignItems: 'center', justifyContent: 'flex-end' },
    copy: { alignItems: 'center' },
  appName: { color: '#FFFFFF', fontFamily: 'Nunito_800ExtraBold', textAlign: 'center' },
  appNameFa: { color: 'rgba(255,255,255,0.96)', fontSize: 21, fontWeight: '900', marginTop: 4, textAlign: 'center' },
  badge: { marginTop: 18, backgroundColor: '#FFFFFF', borderRadius: 28, paddingLeft: 8, paddingRight: 18, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 3, borderColor: '#FFFFFF' },
  badgeIcon: { width: 42, height: 42 },
  badgeTxt: { color: '#32116F', fontSize: 14, fontWeight: '900', textAlign: 'center' },
  loading: { position: 'absolute', bottom: 44, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF', opacity: 0.9 },
});
