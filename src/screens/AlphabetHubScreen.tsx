import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import TopBar from '../components/TopBar';
import CharacterAvatar from '../components/CharacterAvatar';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { dir, ff } from '../theme/fonts';
import { useResponsive } from '../theme/responsive';
import { FARSI_LETTERS } from '../data/farsiLetters';

export default function AlphabetHubScreen() {
  const { navigate } = useNav();
  const { lang, selectedCharacterId } = useContext(AppContext);
  const responsive = useResponsive();
  const ui = Math.min(responsive.contentWidth / 390, 1.3);
  const isFa = lang === 'fa' || lang === 'ar';
  const gap = Math.max(10, Math.round(12 * ui));
  const columns = 4;
  const usableWidth = responsive.contentWidth - responsive.horizontalPadding * 2 - gap * (columns - 1);
  const cardW = usableWidth / columns - Math.max(2, Math.round(4 * ui));
  const trainH = Math.max(130, Math.round(152 * ui));

  return (
    <View style={styles.root}>
      <TopBar title="Alphabet" titleFa="الفبا" dark showClose onBack={() => navigate({ name: 'Home' })} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: responsive.horizontalPadding }]} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.trainCard, { height: trainH, borderRadius: Math.max(24, Math.round(28 * ui)) }]}
          onPress={() => navigate({ name: 'AlphabetTrain' })}
          activeOpacity={0.88}
        >
          <View style={styles.trainArtWrap}>
            <View style={styles.trainScene}>
              <View style={styles.trainSmoke} />
              <View style={styles.trainEngine}>
                <CharacterAvatar characterId={selectedCharacterId} size={68} floating={false} />
              </View>
              <View style={styles.trainCar}>
                <Text style={styles.trainLetter}>ا</Text>
              </View>
              <View style={[styles.trainCar, styles.trainCarAlt]}>
                <Text style={styles.trainLetter}>ب</Text>
              </View>
            </View>
            <View style={styles.cardShade} />
            <View style={styles.cardTextBand}>
              <Text style={[styles.trainTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(15, Math.round(17 * ui)) }, dir(lang)]}>
                {isFa ? 'قطار الفبا' : 'Alphabet Train'}
              </Text>
              <Text style={[styles.trainSub, { fontFamily: ff(lang, 'regular'), fontSize: Math.max(11, Math.round(12 * ui)) }, dir(lang)]} numberOfLines={1}>
                {isFa ? 'سوار قطار حرف‌ها شو' : 'Ride the letters and words'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { fontFamily: ff(lang, 'black'), fontSize: Math.max(16, Math.round(18 * ui)), marginTop: Math.max(16, Math.round(18 * ui)), marginBottom: Math.max(8, Math.round(10 * ui)) }, dir(lang)]}>
          {isFa ? 'حرف‌ها را تمرین کن' : 'Practice letters'}
        </Text>

        <View style={[styles.grid, { columnGap: gap, rowGap: gap }]}>
          {FARSI_LETTERS.map(letter => (
            <TouchableOpacity
              key={letter.id}
              style={[styles.card, { width: cardW, height: Math.max(96, Math.round(104 * ui)), borderRadius: Math.max(18, Math.round(20 * ui)) }]}
              onPress={() => navigate({ name: 'InteractiveFarsiTrace', letterId: letter.id })}
              activeOpacity={0.88}
            >
              <View style={[styles.thumb, { borderRadius: Math.max(18, Math.round(20 * ui)), backgroundColor: letter.color ?? '#6C4EFF' }]}>
                <Text style={[styles.letterGlyph, { fontSize: Math.max(30, Math.round(36 * ui)) }]}>{letter.letter}</Text>
                <View style={styles.letterTextBand}>
                  <Text style={styles.letterName} numberOfLines={1}>{letter.nameFa}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#35217E' },
  scroll: { paddingBottom: 36 },
  trainCard: { borderRadius: 28, overflow: 'hidden', borderWidth: 6, borderColor: '#FFFFFF', backgroundColor: '#DFF7FF', shadowColor: '#170736', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 14, elevation: 8 },
  trainArtWrap: { flex: 1, overflow: 'hidden' },
  trainScene: { flex: 1, width: '100%', height: '100%', backgroundColor: '#DFF7FF', alignItems: 'center', justifyContent: 'center' },
  trainSmoke: { position: 'absolute', left: 18, top: 14, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.8)' },
  trainEngine: { position: 'absolute', left: 14, bottom: 10, width: 76, height: 92, borderRadius: 24, backgroundColor: '#06B6D4', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFFFFF' },
  trainCar: { position: 'absolute', right: 16, top: 16, width: 70, height: 86, borderRadius: 22, backgroundColor: '#8B5CF6', borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  trainCarAlt: { right: 96, top: 40, backgroundColor: '#F97316' },
  trainLetter: { fontFamily: ff('fa', 'black'), color: '#FFFFFF', fontSize: 26 },
  cardShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 52, backgroundColor: 'rgba(37,16,92,0.62)' },
  cardTextBand: { position: 'absolute', left: 14, right: 14, bottom: 10, minHeight: 32, justifyContent: 'center' },
  trainTitle: { color: '#FFFFFF', textAlign: 'left' },
  trainSub: { color: 'rgba(255,255,255,0.88)', textAlign: 'left', marginTop: 2 },
  sectionTitle: { color: '#FFFFFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { backgroundColor: '#AEEBFF', overflow: 'hidden', borderWidth: 4, borderColor: '#FFFFFF', shadowColor: '#170736', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 5 },
  thumb: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  letterGlyph: { fontFamily: ff('fa', 'black'), color: '#FFFFFF' },
  letterTextBand: { position: 'absolute', left: 4, right: 4, bottom: 6, alignItems: 'center' },
  letterName: { fontFamily: ff('fa', 'bold'), color: 'rgba(255,255,255,0.92)', fontSize: 11, textAlign: 'center' },
});
