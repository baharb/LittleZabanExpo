import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FarsiLetter } from '../../data/farsiLetters';
import { neliWorldAssets } from '../../assets/neliWorldAssets';
import { ff } from '../../theme/fonts';

type Props = {
  letter: FarsiLetter;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onReplayGuide: () => void;
  onOpenGrid: () => void;
  compact?: boolean;
};

export default function LetterInfoPanel({
  letter,
  index,
  total,
  onPrev,
  onNext,
  onReset,
  onReplayGuide,
  onOpenGrid,
  compact = false,
}: Props) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={[styles.card, { borderColor: letter.color ?? '#F4C6D5' }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTag}>Lesson</Text>
          <Text style={styles.cardProgress}>{index + 1} / {total}</Text>
        </View>
        <View style={[styles.bigLetterBubble, { backgroundColor: `${letter.color ?? '#F15A7B'}18` }]}>
          <Text style={[styles.bigLetter, { color: letter.color ?? '#F15A7B' }]}>{letter.letter}</Text>
        </View>
        <Text style={styles.nameFa}>{letter.nameFa}</Text>
        <View style={[styles.namePill, { borderColor: `${letter.color ?? '#F15A7B'}35` }]}>
          <Text style={styles.nameEn}>{letter.nameEn}</Text>
        </View>
      </View>

      <View style={[styles.exampleCard, { borderColor: `${letter.color ?? '#F15A7B'}55` }]}>
        <View style={[styles.exampleIconBubble, { backgroundColor: `${letter.color ?? '#F15A7B'}18` }]}>
          <Text style={styles.exampleIcon}>{letter.exampleIcon ?? '✨'}</Text>
        </View>
        <View style={styles.exampleCopy}>
          <Text style={styles.exampleLabel}>Example</Text>
          <Text style={styles.exampleFa}>{letter.exampleFa}</Text>
          <Text style={styles.exampleEn}>{letter.exampleEn}</Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <TouchableOpacity style={styles.circleBtn} onPress={onPrev} activeOpacity={0.85}>
          <Image source={neliWorldAssets.ui.next} style={[styles.btnIcon, styles.flip]} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridBtn} onPress={onOpenGrid} activeOpacity={0.85}>
          <View style={styles.gridIcon}>
            {Array.from({ length: 9 }).map((_, i) => <View key={i} style={styles.gridDot} />)}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleBtn} onPress={onNext} activeOpacity={0.85}>
          <Image source={neliWorldAssets.ui.next} style={styles.btnIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.replayBtn, { borderColor: letter.color ?? '#F15A7B' }]} onPress={onReplayGuide} activeOpacity={0.85}>
          <Text style={styles.replayText}>Replay Guide</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={onReset} activeOpacity={0.85}>
        <Image source={neliWorldAssets.ui.restart} style={styles.resetIcon} resizeMode="contain" />
        <Text style={styles.resetText}>پاک کن</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 274,
    gap: 12,
  },
  wrapCompact: {
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 3,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#7B68EE',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
    gap: 6,
  },
  cardHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTag: {
    fontSize: 11,
    fontWeight: '900',
    color: '#7B68EE',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  cardProgress: {
    fontSize: 12,
    fontWeight: '900',
    color: '#8A7A9B',
  },
  bigLetterBubble: {
    width: 92,
    height: 92,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bigLetter: {
    fontSize: 62,
    fontWeight: '900',
    fontFamily: ff('fa', 'black'),
  },
  nameFa: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2F2340',
    fontFamily: ff('fa', 'black'),
  },
  namePill: {
    minWidth: 84,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
  },
  nameEn: {
    fontSize: 12,
    color: '#8A7A9B',
    fontWeight: '700',
    fontFamily: ff('en', 'regular'),
  },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 2,
    padding: 12,
  },
  exampleIconBubble: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleIcon: {
    fontSize: 28,
  },
  exampleCopy: {
    flex: 1,
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8A7A9B',
    textTransform: 'uppercase',
    marginBottom: 2,
    fontFamily: ff('en', 'bold'),
  },
  exampleFa: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2F2340',
    fontFamily: ff('fa', 'bold'),
  },
  exampleEn: {
    fontSize: 11,
    color: '#7A7190',
    marginTop: 2,
    fontFamily: ff('en', 'regular'),
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  gridBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F2ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIcon: {
    width: 18,
    height: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7B68EE',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C4EFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  flip: {
    transform: [{ scaleX: -1 }],
  },
  replayBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4C3B69',
    fontFamily: ff('en', 'bold'),
  },
  resetBtn: {
    height: 48,
    borderRadius: 18,
    backgroundColor: '#FFF6FA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F2B8CF',
  },
  resetIcon: {
    width: 20,
    height: 20,
    tintColor: '#E05088',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#C93E77',
    fontFamily: ff('fa', 'bold'),
  },
});
