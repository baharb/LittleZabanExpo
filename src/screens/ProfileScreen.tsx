import React, { useContext } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import TopBar from '../components/TopBar';
import CharacterAvatar from '../components/CharacterAvatar';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { AppContext, Lang } from '../store/AppContext';
import { dir, ff } from '../theme/fonts';

const LANGS: { code: Lang; label: string; labelEn: string; color: string }[] = [
  { code: 'fa', label: 'فارسی', labelEn: 'Persian', color: '#7C3AED' },
  { code: 'en', label: 'English', labelEn: 'English', color: '#078BFF' },
  { code: 'fr', label: 'Français', labelEn: 'French', color: '#16A36A' },
  { code: 'es', label: 'Español', labelEn: 'Spanish', color: '#F97316' },
  { code: 'zh', label: '中文', labelEn: 'Chinese', color: '#D946A6' },
  { code: 'ko', label: '한국어', labelEn: 'Korean', color: '#D89400' },
  { code: 'ar', label: 'عربي', labelEn: 'Arabic', color: '#12A59B' },
];

export default function ProfileScreen() {
  const { lang, setLang, stars, streak, badges, completedSections, age, selectedCharacterId } = useContext(AppContext);
  const { width, height } = useWindowDimensions();
  const ui = Math.min(width / 390, height / 844);
  const isFa = lang === 'fa' || lang === 'ar';

  return (
    <View style={styles.root}>
      <TopBar title="Me" titleFa="من" dark />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: Math.max(12, Math.round(14 * ui)), paddingBottom: Math.max(28, Math.round(34 * ui)), gap: Math.max(12, Math.round(14 * ui)) }]} showsVerticalScrollIndicator={false}>
        <ImageBackground source={neliWorldAssets.rooms.bedroom} style={[styles.hero, { height: Math.max(200, Math.round(220 * ui)), borderRadius: Math.max(26, Math.round(30 * ui)), padding: Math.max(12, Math.round(16 * ui)) }]} imageStyle={styles.heroImage}>
          <View style={styles.heroShade} />
          <CharacterAvatar characterId={selectedCharacterId} size={Math.max(138, Math.round(156 * ui))} />
          <View style={styles.heroText}>
            <Text style={[styles.kicker, { fontFamily: ff(lang, 'bold'), fontSize: Math.max(11, Math.round(12 * ui)) }, dir(lang)]}>
              {isFa ? 'پروفایل کودک' : 'Child profile'}
            </Text>
            <Text style={[styles.title, { fontFamily: ff(lang, 'black'), fontSize: Math.max(24, Math.round(27 * ui)) }, dir(lang)]}>
              {isFa ? `${age || 4} ساله` : `Age ${age || 4}`}
            </Text>
            <Text style={[styles.sub, { fontFamily: ff(lang, 'regular'), fontSize: Math.max(12, Math.round(13 * ui)), lineHeight: Math.max(18, Math.round(19 * ui)) }, dir(lang)]}>
              {isFa ? 'فارسی، بازی، داستان و جایزه' : 'Persian play, stories, and rewards'}
            </Text>
          </View>
        </ImageBackground>

        <View style={[styles.statsRow, { gap: Math.max(8, Math.round(10 * ui)) }]}>
          <View style={[styles.statCard, { backgroundColor: '#FFE57A' }]}>
            <Image source={neliWorldAssets.ui.star} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNum, { fontFamily: ff(lang, 'black') }]}>{stars}</Text>
            <Text style={[styles.statLbl, { fontFamily: ff(lang, 'bold') }]}>{isFa ? 'ستاره' : 'Stars'}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFB2CE' }]}>
            <Image source={neliWorldAssets.ui.heart} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNum, { fontFamily: ff(lang, 'black') }]}>{streak}</Text>
            <Text style={[styles.statLbl, { fontFamily: ff(lang, 'bold') }]}>{isFa ? 'روز' : 'Days'}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#8EF2DD' }]}>
            <Image source={neliWorldAssets.ui.ok} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNum, { fontFamily: ff(lang, 'black') }]}>{completedSections?.length ?? 0}</Text>
            <Text style={[styles.statLbl, { fontFamily: ff(lang, 'bold') }]}>{isFa ? 'درس' : 'Done'}</Text>
          </View>
        </View>

        <View style={[styles.panel, { borderRadius: Math.max(22, Math.round(26 * ui)), padding: Math.max(14, Math.round(16 * ui)) }]}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)), marginBottom: Math.max(10, Math.round(12 * ui)) }, dir(lang)]}>
            {isFa ? 'زبان برنامه' : 'App Language'}
          </Text>
          <View style={[styles.langGrid, { gap: Math.max(7, Math.round(9 * ui)) }]}>
            {LANGS.map(item => {
              const active = lang === item.code;
              return (
                <TouchableOpacity key={item.code} style={[styles.langBtn, active && { backgroundColor: item.color }]} onPress={() => setLang(item.code)} activeOpacity={0.82}>
                  <View style={[styles.langDot, { backgroundColor: active ? '#FFFFFF' : item.color, width: Math.max(12, Math.round(14 * ui)), height: Math.max(12, Math.round(14 * ui)), borderRadius: Math.max(6, Math.round(7 * ui)) }]} />
                  <View>
                    <Text style={[styles.langLbl, { fontFamily: ff(item.code, 'bold'), color: active ? '#FFFFFF' : '#25105C' }]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.langSub, { color: active ? 'rgba(255,255,255,0.78)' : '#746684' }]}>
                      {item.labelEn}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.panel, { borderRadius: Math.max(22, Math.round(26 * ui)), padding: Math.max(14, Math.round(16 * ui)) }]}>
          <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)), marginBottom: Math.max(10, Math.round(12 * ui)) }, dir(lang)]}>
            {isFa ? 'جایزه ها' : 'Rewards'}
          </Text>
          <View style={styles.rewardRow}>
            {(badges?.length ? badges : ['star', 'ok', 'heart', 'trophy']).map((badge, index) => {
              const source = badge === 'ok' ? neliWorldAssets.ui.ok : badge === 'heart' ? neliWorldAssets.ui.heart : badge === 'trophy' ? neliWorldAssets.ui.trophy : neliWorldAssets.ui.star;
              return (
                <View key={`${badge}-${index}`} style={styles.reward}>
                  <Image source={source} style={styles.rewardIcon} resizeMode="contain" />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1E135E' },
  scroll: { gap: 14 },
  hero: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, overflow: 'hidden', borderWidth: 6, borderColor: '#FFFFFF' },
  heroImage: { width: '100%', height: '100%' },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30,19,94,0.18)' },
  avatar: { width: 138, height: 180, marginBottom: -8 },
  heroText: { flex: 1, marginBottom: 8 },
  kicker: { color: '#FFFFFF', fontWeight: '900', marginBottom: 3 },
  title: { color: '#FFFFFF', fontWeight: '900' },
  sub: { color: 'rgba(255,255,255,0.92)', marginTop: 3 },
  statsRow: { flexDirection: 'row' },
  statCard: { flex: 1, borderRadius: 24, padding: 12, alignItems: 'center', borderWidth: 4.5, borderColor: '#FFFFFF' },
  statIcon: { width: 48, height: 48 },
  statNum: { color: '#25105C', fontSize: 24, fontWeight: '900', marginTop: 2 },
  statLbl: { color: '#493C63', fontSize: 11, fontWeight: '900' },
  panel: { backgroundColor: 'rgba(255,255,255,0.95)' },
  sectionTitle: { color: '#221044', fontWeight: '900', marginBottom: 12 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  langBtn: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#F1ECFF', borderRadius: 18, paddingHorizontal: 11, paddingVertical: 10 },
  langDot: { width: 14, height: 14, borderRadius: 7 },
  langLbl: { fontSize: 13, fontWeight: '900' },
  langSub: { fontFamily: ff('fa', 'regular'), fontSize: 10, marginTop: 1 },
  rewardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reward: { width: 62, height: 62, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF2C7', borderWidth: 4.5, borderColor: '#FFFFFF' },
  rewardIcon: { width: 52, height: 52 },
});
