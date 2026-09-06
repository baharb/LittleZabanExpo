import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lang } from '../store/AppContext';
import { dir, ff } from '../theme/fonts';

interface Props {
  lang: Lang;
  isPremium: boolean;
  onPress: () => void;
}

const TX = {
  titleActive: { fa: 'عضو ویژه ✨', en: 'Premium ✨', fr: 'Premium ✨', es: 'Premium ✨', ar: 'عضو مميز ✨', zh: 'Premium ✨', ko: 'Premium ✨' },
  title:       { fa: 'زبان کوچولو ویژه', en: 'Go Premium', fr: 'Passer à Premium', es: 'Hazte Premium', ar: 'الترقية إلى المميز', zh: 'Go Premium', ko: 'Go Premium' },
} as const;

function t(lang: Lang, key: keyof typeof TX): string {
  return TX[key]?.[lang] ?? TX[key]?.en ?? '';
}

// A small, bold, eye-catching pill — centered at the top of Settings —
// rather than a full-width row. Keeps the "go premium" nudge visible
// without it competing with the rest of the page for attention.
export default function PremiumCard({ lang, isPremium, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.86}>
      <LinearGradient
        colors={isPremium ? ['#34D399', '#0EA5E9'] : ['#FFE066', '#FF9D2E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pill}
      >
        <Text style={styles.crown}>👑</Text>
        <Text style={[styles.title, { fontFamily: ff(lang, 'black') }, dir(lang)]} numberOfLines={1}>
          {isPremium ? t(lang, 'titleActive') : t(lang, 'title')}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.75)',
    shadowColor: '#B8860B', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  crown: { fontSize: 17 },
  title: { color: '#2D1B69', fontSize: 14 },
});
