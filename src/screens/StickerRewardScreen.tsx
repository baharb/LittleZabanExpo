import React, { useContext, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { ff, dir } from '../theme/fonts';
import { C } from '../theme/colors';

export default function StickerRewardScreen({ sticker, message }: { sticker: string; message: string }) {
  const { lang } = useContext(AppContext);
  const { goBack } = useNav();
  const scale = useRef(new Animated.Value(0.5)).current;
  const float = useRef(new Animated.Value(0)).current;
  const badge = sticker === 'star' ? '★' : sticker;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.spring(scale, { toValue: 1, tension: 90, friction: 6, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -12, duration: 900, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.bubbleA} />
      <View style={styles.bubbleB} />
      <View style={styles.bubbleC} />

      <View style={styles.center}>
        <Animated.View style={[styles.badgeWrap, { transform: [{ scale }, { translateY: float }] }]}>
          <Text style={styles.badge}>{badge}</Text>
        </Animated.View>
        <Text style={[styles.title, { fontFamily: ff(lang, 'black') }, dir(lang)]}>
          {lang === 'fa' ? 'جایزه گرفتی!' : 'Reward collected!'}
        </Text>
        <Text style={[styles.message, { fontFamily: ff(lang, 'bold') }, dir(lang)]}>
          {message}
        </Text>
        <View style={styles.stickerShelf}>
          {[0, 1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.miniSticker, i === 2 && styles.miniStickerOn]}>
              <Text style={styles.miniStickerText}>{i === 2 ? badge : '•'}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.btn} onPress={goBack} activeOpacity={0.86}>
        <Text style={[styles.btnTxt, { fontFamily: ff(lang, 'black') }]}>
          {lang === 'fa' ? 'ادامه بده' : 'Keep learning'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#35217E' },
  bubbleA: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.17)', top: 90, left: -34 },
  bubbleB: { position: 'absolute', width: 92, height: 92, borderRadius: 46, backgroundColor: 'rgba(255,217,61,0.42)', top: 148, right: 28 },
  bubbleC: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.12)', bottom: 110, right: -60 },
  center: { width: '100%', alignItems: 'center' },
  badgeWrap: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: C.yellow,
    shadowColor: '#160735',
    shadowOpacity: 0.24,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  badge: { fontFamily: ff('fa', 'black'), color: C.purpleDeep, fontSize: 88, lineHeight: 112 },
  title: { color: '#FFFFFF', fontSize: 30, lineHeight: 38, marginTop: 28, textAlign: 'center' },
  message: { color: 'rgba(255,255,255,0.9)', fontSize: 16, lineHeight: 25, textAlign: 'center', marginTop: 10 },
  stickerShelf: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 26,
    padding: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  miniSticker: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  miniStickerOn: { backgroundColor: C.yellow },
  miniStickerText: { fontFamily: ff('fa', 'black'), color: C.purpleDeep, fontSize: 22, lineHeight: 28 },
  btn: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 34,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#160735',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  btnTxt: { color: C.textDark, fontSize: 18 },
});
