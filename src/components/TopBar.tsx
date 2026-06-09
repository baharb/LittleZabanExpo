import React, { useContext } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, PixelRatio, useWindowDimensions } from 'react-native';
import { AppContext, Lang } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import LangBar from './LangBar';
import { ff } from '../theme/fonts';
import { neliWorldAssets } from '../assets/neliWorldAssets';

const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

interface Props {
  title?: string;
  titleFa?: string; titleFr?: string; titleEs?: string;
  titleZh?: string; titleKo?: string; titleAr?: string;
  showBack?: boolean; showClose?: boolean;
  dark?: boolean;
  compactTitle?: boolean;
  topInset?: number;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  displayLang?: Lang;
}

export default function TopBar({
  title = '', titleFa, titleFr, titleEs, titleZh, titleKo, titleAr,
  showBack = false, showClose = false, dark = true, compactTitle = false, topInset = 0, onBack, rightContent,
  displayLang,
}: Props) {
  const { lang: appLang } = useContext(AppContext);
  const lang = displayLang ?? appLang;
  const { goBack } = useNav();
  const { width } = useWindowDimensions();

  const bg       = dark ? '#2D1B69' : '#fff';
  const txtColor = dark ? '#fff' : '#1A0050';
  const buttonSize = PixelRatio.roundToNearestPixel(Math.max(56, Math.min(width * 0.08, 72)));
  const iconSize = PixelRatio.roundToNearestPixel(Math.max(44, Math.min(width * 0.064, 62)));
  const localTitle = (() => {
    if (lang === 'fa' && titleFa) return titleFa;
    if (lang === 'fr' && titleFr) return titleFr;
    if (lang === 'es' && titleEs) return titleEs;
    if (lang === 'zh' && titleZh) return titleZh;
    if (lang === 'ko' && titleKo) return titleKo;
    if (lang === 'ar' && titleAr) return titleAr;
    return title;
  })();

  return (
    <View style={[styles.bar, { backgroundColor: bg, paddingTop: (Platform.OS === 'ios' ? 6 : 0) + topInset, paddingHorizontal: Math.max(12, Math.min(width * 0.022, 18)) }]}>
      {/* Back button — Lingokids style: large, bold, pill-shaped */}
      <View style={styles.side}>
        {showClose ? (
          <TouchableOpacity
            onPress={onBack ?? goBack}
            style={[styles.backBtn, { width: buttonSize, height: buttonSize, marginLeft: -4 }]}
            activeOpacity={0.7}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <Image
              source={neliWorldAssets.ui.close}
              style={[styles.navIcon, { width: iconSize, height: iconSize }]}
              resizeMode="contain"
              resizeMethod="resize"
              fadeDuration={0}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Title */}
      <View style={styles.titleWrap}>
        {compactTitle ? (
          <Text style={[styles.titleOnly, { color: txtColor, fontFamily: ff(lang, 'black') }]} numberOfLines={1}>
            {localTitle}
          </Text>
        ) : titleFa ? (
          <>
            <Text style={[styles.titleFa, { color: txtColor, fontFamily: ff(lang, 'black') }]} numberOfLines={1}>
              {localTitle}
            </Text>
            {title && localTitle !== title ? (
              <Text style={[styles.titleEnSub, { color: txtColor, fontFamily: ff('en', 'regular') }]} numberOfLines={1}>
                {title}
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={[styles.titleOnly, { color: txtColor, fontFamily: ff(lang, 'black') }]} numberOfLines={1}>
            {localTitle}
          </Text>
        )}
      </View>

      <View style={[styles.side, { alignItems: 'flex-end' }]}>
        <View style={styles.rightRow}>
          {rightContent}
          <LangBar dark={dark} buttonSize={buttonSize} iconSize={iconSize} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center',
    paddingBottom: 8, gap: 6,
  },
  side:      { width: 84, justifyContent: 'center' },
  rightRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  titleWrap: { flex: 1, alignItems: 'center' },
  titleFa:   { fontSize: 18, textAlign: 'center' },
  titleEnSub:{ fontSize: 11, textAlign: 'center', opacity: 0.55 },
  titleOnly: { fontSize: 18, textAlign: 'center' },

  /* Lingokids-style back: large pill, bold chevron */
  backBtn: {
    alignItems: 'center', justifyContent: 'center',
    zIndex: 5,
  },
  navIcon: { },
});
