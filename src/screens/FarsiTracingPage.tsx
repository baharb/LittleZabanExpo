import React, { useContext, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import TopBar from '../components/TopBar';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';
import { FARSI_LETTERS } from '../data/farsiLetters';
import FarsiLetterTracer from '../components/farsi/FarsiLetterTracer';
import LetterInfoPanel from '../components/farsi/LetterInfoPanel';
import LetterSelectorModal from '../components/farsi/LetterSelectorModal';
import { neliWorldAssets } from '../assets/neliWorldAssets';

export default function FarsiTracingPage() {
  const { width, height } = useWindowDimensions();
  const { lang } = useContext(AppContext);
  const { goBack } = useNav();
  const [index, setIndex] = useState(0);
  const [gridOpen, setGridOpen] = useState(false);
  const [guideToken, setGuideToken] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  const letter = FARSI_LETTERS[index] ?? FARSI_LETTERS[0]!;
  const compact = width < 980;
  const boardSize = useMemo(() => {
    if (compact) return Math.min(width - 24, height * 0.54);
    return Math.min(width * 0.58, height * 0.74, 760);
  }, [compact, height, width]);

  const playLetterSound = (letterId: string) => {
    if (!soundOn) return;
    const item = FARSI_LETTERS.find(entry => entry.id === letterId);
    if (!item) return;
    try {
      Speech.stop();
      Speech.speak(`${item.nameFa}. ${item.exampleFa ?? ''}`, { language: 'fa-IR', rate: 0.7 });
      if (lang !== 'fa' && lang !== 'ar') {
        setTimeout(() => {
          Speech.speak(`${item.nameEn}. ${item.exampleEn ?? ''}`, { language: 'en-US', rate: 0.8 });
        }, 200);
      }
    } catch {
      // Placeholder hook: safe to swap for a real letter audio player later.
    }
  };

  const playSuccessSound = () => {
    if (!soundOn) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Placeholder hook for a future success sound.
    }
  };

  const playTryAgainSound = () => {
    if (!soundOn) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Placeholder hook for a future gentle retry sound.
    }
  };

  const next = () => setIndex(prev => Math.min(prev + 1, FARSI_LETTERS.length - 1));
  const prev = () => setIndex(prev => Math.max(prev - 1, 0));
  const replayGuide = () => setGuideToken(token => token + 1);
  const reset = () => {
    setGuideToken(token => token + 1);
    playTryAgainSound();
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
              <View style={styles.gridIcon}>
                {Array.from({ length: 9 }).map((_, i) => <View key={i} style={styles.gridDot} />)}
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

      <View style={[styles.body, compact ? styles.bodyCompact : styles.bodyWide]}>
        <View style={[styles.boardShell, { width: boardSize }]}>
          <FarsiLetterTracer
            key={`${letter.id}-${guideToken}`}
            letter={letter}
            boardSize={boardSize}
            guideReplayToken={guideToken}
            onComplete={() => {
              if (index < FARSI_LETTERS.length - 1) {
                setTimeout(() => next(), 1200);
              }
            }}
            onTryAgain={playTryAgainSound}
            playLetterSound={playLetterSound}
            playSuccessSound={playSuccessSound}
            playTryAgainSound={playTryAgainSound}
          />
          <View style={styles.boardCaption}>
            <View style={styles.captionLine} />
            <View style={styles.captionLineShort} />
          </View>
        </View>

          <LetterInfoPanel
            letter={letter}
            index={index}
            total={FARSI_LETTERS.length}
            onPrev={prev}
            onNext={next}
            onReset={reset}
            onReplayGuide={replayGuide}
            onOpenGrid={() => setGridOpen(true)}
            compact={compact}
          />
      </View>

      <LetterSelectorModal
        visible={gridOpen}
        letters={FARSI_LETTERS}
        selectedId={letter.id}
        onClose={() => setGridOpen(false)}
        onSelect={nextIndex => {
          setIndex(nextIndex);
          setGridOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F1FA',
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
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 14,
  },
  bodyWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyCompact: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  boardShell: {
    alignSelf: 'center',
    gap: 10,
  },
  boardCaption: {
    alignItems: 'center',
    gap: 4,
  },
  captionLine: {
    width: '42%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBBDEB',
  },
  captionLineShort: {
    width: '20%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2D9F7',
  },
});
