import React, { useContext, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import TopBar from '../components/TopBar';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { FARSI_LETTERS } from '../data/farsiLetters';
import { FA_AUDIO_KEYS, makeAlphabetAudioKey, playFaAudio, playFaAudioSequence, stopFaAudio } from '../utils/faAudio';
import FarsiLetterTracer from '../components/farsi/FarsiLetterTracer';
import LetterSelectorModal from '../components/farsi/LetterSelectorModal';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { ff } from '../theme/fonts';
import { C } from '../theme/colors';

export default function FarsiTracingPage() {
  const { width, height } = useWindowDimensions();
  const { lang } = useContext(AppContext);
  const { goBack } = useNav();
  const [index, setIndex] = useState(0);
  const [gridOpen, setGridOpen] = useState(false);
  const [guideToken, setGuideToken] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [letterComplete, setLetterComplete] = useState(false);

  const letter = FARSI_LETTERS[index] ?? FARSI_LETTERS[0]!;
  const isFa = lang === 'fa' || lang === 'ar';
  const compact = width < 900;
  const boardSize = useMemo(() => {
    const sidePad = compact ? 120 : 160;
    if (compact) return Math.min(width - sidePad, height * 0.5);
    return Math.min(width - sidePad, height * 0.68, 520);
  }, [compact, height, width]);

  const goToLetter = (nextIndex: number) => {
    void stopFaAudio();
    setIndex(nextIndex);
    setLetterComplete(false);
    setGuideToken(token => token + 1);
  };

  const playLetterSound = async (letterId: string) => {
    if (!soundOn) return;
    try {
      const played = await playFaAudioSequence([
        FA_AUDIO_KEYS.guidance.startHere,
        makeAlphabetAudioKey('name', letterId),
      ], 180);
      if (!played) {
        const item = FARSI_LETTERS.find(entry => entry.id === letterId);
        if (item) {
          // Fallback: keep the page usable even when a file is missing.
          void playFaAudio(makeAlphabetAudioKey('name', letterId));
        }
      }
    } catch {
      const item = FARSI_LETTERS.find(entry => entry.id === letterId);
      if (!item) return;
    }
  };

  const playSuccessSound = async () => {
    if (!soundOn) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await playFaAudioSequence([
        FA_AUDIO_KEYS.feedback.afarin,
        makeAlphabetAudioKey('example', letter.id),
      ], 220);
    } catch {
      // Fallback to a light haptic-only success if audio is unavailable.
    }
  };

  const playTryAgainSound = async () => {
    if (!soundOn) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await playFaAudioSequence([
        FA_AUDIO_KEYS.feedback.tryAgain,
        FA_AUDIO_KEYS.guidance.followPath,
      ], 180);
    } catch {
      // Fallback to a light haptic-only retry if audio is unavailable.
    }
  };

  const next = () => {
    if (!letterComplete || index >= FARSI_LETTERS.length - 1) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    goToLetter(index + 1);
  };
  const prev = () => {
    if (index <= 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    goToLetter(index - 1);
  };
  const reset = () => {
    void stopFaAudio();
    setLetterComplete(false);
    setGuideToken(token => token + 1);
    void playTryAgainSound();
  };

  return (
    <View style={styles.root}>
      <TopBar
        title="Farsi Tracing"
        titleFa="تمرین نوشتن"
        showClose
        dark={false}
        topInset={6}
        onBack={goBack}
        rightContent={
          <View style={styles.rightTopRow}>
            <TouchableOpacity style={styles.topGridBtn} onPress={() => setGridOpen(true)} activeOpacity={0.8}>
              <View style={styles.topGridIcon}>
                {Array.from({ length: 9 }).map((_, i) => <View key={i} style={styles.topGridDot} />)}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.soundBtn}
              onPress={() => setSoundOn(v => !v)}
              activeOpacity={0.8}
            >
              <View style={[styles.soundDot, { backgroundColor: soundOn ? '#24C878' : '#D1C5E8' }]} />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.body}>
        <Text style={[styles.progressLine, { fontFamily: ff(lang, 'bold') }]}>
          {isFa ? `حرف ${index + 1} از ${FARSI_LETTERS.length}` : `Letter ${index + 1} of ${FARSI_LETTERS.length}`}
        </Text>
        <Text style={[styles.subtitle, { fontFamily: ff(lang, 'black') }]}>
          {letter.nameFa} • {letter.nameEn}
        </Text>

        <View style={styles.stage}>
          <NavFlash side="left" onPress={prev} disabled={index === 0} />

          <View style={[styles.boardShell, { width: boardSize }]}>
            <FarsiLetterTracer
              key={`${letter.id}-${guideToken}`}
              letter={letter}
              boardSize={boardSize}
              guideReplayToken={guideToken}
              onComplete={() => setLetterComplete(true)}
              onTryAgain={playTryAgainSound}
              playLetterSound={playLetterSound}
              playSuccessSound={playSuccessSound}
              playTryAgainSound={playTryAgainSound}
            />
          </View>

          <NavFlash side="right" onPress={next} disabled={!letterComplete || index >= FARSI_LETTERS.length - 1} />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.clearBtn} onPress={reset} activeOpacity={0.86}>
            <Image source={neliWorldAssets.ui.restart} style={styles.clearIcon} resizeMode="contain" />
            <Text style={[styles.clearText, { fontFamily: ff(lang, 'black') }]}>
              {isFa ? 'پاک کن' : 'Clear'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridBtn} onPress={() => setGridOpen(true)} activeOpacity={0.86}>
            <View style={styles.gridIcon}>
              {Array.from({ length: 9 }).map((_, i) => <View key={i} style={styles.gridDot} />)}
            </View>
            <Text style={[styles.gridText, { fontFamily: ff(lang, 'bold') }]}>
              {isFa ? 'همه حروف' : 'All letters'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <LetterSelectorModal
        visible={gridOpen}
        letters={FARSI_LETTERS}
        selectedId={letter.id}
        onClose={() => setGridOpen(false)}
        onSelect={nextIndex => {
          goToLetter(nextIndex);
          setGridOpen(false);
        }}
      />
    </View>
  );
}

function NavFlash({ side, onPress, disabled }: { side: 'left' | 'right'; onPress: () => void; disabled?: boolean }) {
  const icon = side === 'left' ? neliWorldAssets.ui.back : neliWorldAssets.ui.next;
  return (
    <TouchableOpacity
      style={[styles.navFlash, disabled && styles.navFlashDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.82}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      accessibilityLabel={side === 'left' ? 'Previous letter' : 'Next letter'}
    >
      <Image source={icon} style={styles.navFlashIcon} resizeMode="contain" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  rightTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topGridBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1EBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topGridIcon: {
    width: 18,
    height: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  topGridDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6C4EFF',
  },
  soundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  progressLine: {
    color: C.textMid,
    fontSize: 14,
    lineHeight: 18,
  },
  subtitle: {
    color: C.textDark,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  stage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  navFlash: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navFlashDisabled: {
    opacity: 0.32,
  },
  navFlashIcon: {
    width: 56,
    height: 56,
  },
  boardShell: {
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 6,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 130,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.border,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  clearIcon: {
    width: 22,
    height: 22,
    tintColor: C.purple,
  },
  clearText: {
    color: C.purple,
    fontSize: 16,
  },
  gridBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 130,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.purpleLight,
    borderWidth: 2,
    borderColor: C.border,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  gridIcon: {
    width: 16,
    height: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.purple,
  },
  gridText: {
    color: C.purple,
    fontSize: 14,
  },
});
