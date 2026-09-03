import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Lang } from '../store/AppContext';
import { dir, ff } from '../theme/fonts';

interface Props {
  lang: Lang;
  isPremium: boolean;
  onPress: () => void;
}

const TX = {
  titleActive: { fa: 'عضو ویژه', en: 'Premium member', fr: 'Membre Premium', es: 'Miembro Premium', ar: 'عضو مميز', zh: 'Premium member', ko: 'Premium member' },
  subActive:   { fa: 'از نسخه ویژه لذت ببرید ✨', en: 'Enjoying full access ✨', fr: 'Accès complet actif ✨', es: 'Acceso completo activo ✨', ar: 'الوصول الكامل مفعّل ✨', zh: 'Enjoying full access ✨', ko: 'Enjoying full access ✨' },
  title:       { fa: 'زبان کوچولو ویژه', en: 'Go Premium', fr: 'Passer à Premium', es: 'Hazte Premium', ar: 'الترقية إلى المميز', zh: 'Go Premium', ko: 'Go Premium' },
  sub:         { fa: 'باز کردن همه‌ی درس‌ها، بازی‌ها و داستان‌ها', en: 'Unlock every lesson, game & story', fr: 'Débloquez toutes les leçons et jeux', es: 'Desbloquea todas las lecciones y juegos', ar: 'افتح كل الدروس والألعاب والقصص', zh: 'Unlock every lesson, game & story', ko: 'Unlock every lesson, game & story' },
} as const;

function t(lang: Lang, key: keyof typeof TX): string {
  return TX[key]?.[lang] ?? TX[key]?.en ?? '';
}

// The single "premium" surface today is this card at the top of Settings.
// It's pulled out as its own component (rather than inlined in
// ProfileScreen) so the same look can be dropped onto any other screen
// later — a locked lesson, the home screen, etc. — without copy/pasting
// styles. `onPress` is expected to come from usePremiumGate().
export default function PremiumCard({ lang, isPremium, onPress }: Props) {
  const isFa = lang === 'fa';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.badge}>
        <Text style={styles.crown}>👑</Text>
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.title, { fontFamily: ff(lang, 'black') }, dir(lang)]} numberOfLines={1}>
          {isPremium ? t(lang, 'titleActive') : t(lang, 'title')}
        </Text>
        <Text style={[styles.sub, { fontFamily: ff(lang, 'regular') }, dir(lang)]} numberOfLines={1}>
          {isPremium ? t(lang, 'subActive') : t(lang, 'sub')}
        </Text>
      </View>
      <Text style={[styles.chevron, isFa && styles.chevronFlip]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#2D1B69', borderRadius: 26, padding: 16,
    borderWidth: 3, borderColor: '#FFD93D',
  },
  badge: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#FFD93D', alignItems: 'center', justifyContent: 'center' },
  crown: { fontSize: 26 },
  textWrap: { flex: 1 },
  title: { color: '#fff', fontSize: 17 },
  sub: { color: 'rgba(255,255,255,0.72)', fontSize: 12, marginTop: 2 },
  chevron: { color: '#FFD93D', fontSize: 26, fontWeight: '900' },
  chevronFlip: { transform: [{ scaleX: -1 }] },
});
