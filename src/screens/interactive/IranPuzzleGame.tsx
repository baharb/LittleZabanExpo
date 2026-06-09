import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, PanResponder, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppContext } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { useLandscapeDimensions } from '../../hooks/useLandscapeDimensions';
import { ff } from '../../theme/fonts';
import { neliWorldAssets } from '../../assets/neliWorldAssets';
import {
  IRAN_PUZZLE_OUTLINE,
  IRAN_PUZZLE_PIECES,
  IRAN_PUZZLE_SOURCE_HEIGHT,
  IRAN_PUZZLE_SOURCE_WIDTH,
  IranPuzzlePiece,
} from '../../assets/iranPuzzlePieces';

type StageSize = { width: number; height: number };
type Rect = { x: number; y: number; w: number; h: number };
type LayoutPiece = IranPuzzlePiece & {
  target: Rect;
  startLeft: number;
  startTop: number;
  startWidth: number;
  startHeight: number;
  startScale: number;
  zIndex: number;
};

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SETTLE_MS = 430;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function safeImpact() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics can be unavailable on some targets. Ignore safely.
  }
}

async function safeNotify(type: Haptics.NotificationFeedbackType) {
  try {
    await Haptics.notificationAsync(type);
  } catch {
    // Haptics can be unavailable on some targets. Ignore safely.
  }
}

function buildStartLayout(pieces: IranPuzzlePiece[], stage: StageSize, mapRect: Rect): LayoutPiece[] {
  const leftPieces = pieces.filter(piece => piece.side === 'left').sort((a, b) => b.area - a.area);
  const rightPieces = pieces.filter(piece => piece.side === 'right').sort((a, b) => b.area - a.area);

  const mapGap = 4;
  const sidePadding = 8;
  const leftShelf = Math.max(190, mapRect.x + mapRect.w * 0.12);
  const rightShelf = Math.max(190, stage.width - mapRect.x - mapRect.w * 0.88);

  const targetFor = (piece: IranPuzzlePiece): Rect => {
    const [x0, y0, x1, y1] = piece.sourceBox;
    const scale = mapRect.w / IRAN_PUZZLE_SOURCE_WIDTH;
    return {
      x: mapRect.x + x0 * scale,
      y: mapRect.y + y0 * scale,
      w: Math.max(16, (x1 - x0) * scale),
      h: Math.max(16, (y1 - y0) * scale),
    };
  };

  const layoutSide = (list: IranPuzzlePiece[], side: 'left' | 'right'): LayoutPiece[] => {
    const cols = 3;
    const rows = Math.max(1, Math.ceil(list.length / cols));
    const shelf = side === 'left' ? leftShelf : rightShelf;
    const columnGap = 4;
    const columnWidth = (shelf - sidePadding * 2 - columnGap) / cols;
    const rowStep = (stage.height - 18) / rows;
    const topOffset = 7;

    return list.map((piece, index) => {
      const target = targetFor(piece);
      const col = index % cols;
      const row = Math.floor(index / cols);
      const cellW = columnWidth;
      const cellH = rowStep;
      const scale = Math.min((cellW * 1.59) / target.w, (cellH * 1.62) / target.h, 3.68);
      const visualW = clamp(target.w * scale, 51, Math.max(63, cellW * 1.62));
      const visualH = clamp(target.h * scale, 45, Math.max(57, cellH * 1.62));
      const columnCenter = side === 'left'
        ? sidePadding + col * (columnWidth + columnGap) + columnWidth / 2
        : stage.width - shelf + sidePadding + col * (columnWidth + columnGap) + columnWidth / 2;
      const left = clamp(columnCenter - visualW / 2, 8, Math.max(8, stage.width - visualW - 8));
      const top = clamp(topOffset + row * rowStep + (rowStep - visualH) / 2, 4, Math.max(4, stage.height - visualH - 4));

      return {
        ...piece,
        target,
        startLeft: left,
        startTop: top,
        startWidth: visualW,
        startHeight: visualH,
        startScale: 1,
        zIndex: 10 + index,
      };
    });
  };

  return [...layoutSide(leftPieces, 'left'), ...layoutSide(rightPieces, 'right')];
}

function ProvincePiece({
  piece,
  onPlaced,
  onActivate,
  isActive,
}: {
  piece: LayoutPiece;
  onPlaced: (id: string) => void;
  onActivate: (id: string | null) => void;
  isActive: boolean;
}) {
  const draggedRef = useRef(false);
  const xAnim = useRef(new Animated.Value(piece.startLeft)).current;
  const yAnim = useRef(new Animated.Value(piece.startTop)).current;
  const wAnim = useRef(new Animated.Value(piece.startWidth)).current;
  const hAnim = useRef(new Animated.Value(piece.startHeight)).current;
  const startRef = useRef({ x: piece.startLeft, y: piece.startTop });
  const [placed, setPlaced] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    xAnim.setValue(piece.startLeft);
    yAnim.setValue(piece.startTop);
    wAnim.setValue(piece.startWidth);
    hAnim.setValue(piece.startHeight);
    startRef.current = { x: piece.startLeft, y: piece.startTop };
    draggedRef.current = false;
    setPlaced(false);
    setPressed(false);
    setSettling(false);
  }, [hAnim, piece.id, piece.startHeight, piece.startLeft, piece.startTop, piece.startWidth, wAnim, xAnim, yAnim]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !placed && !settling,
        onMoveShouldSetPanResponder: () => !placed && !settling,
        onPanResponderGrant: () => {
          if (placed || settling) return;
          setPressed(true);
          draggedRef.current = false;
          onActivate(piece.id);
          xAnim.stopAnimation(value => {
            startRef.current.x = value;
          });
          yAnim.stopAnimation(value => {
            startRef.current.y = value;
          });
          void safeImpact();
        },
        onPanResponderMove: (_evt, gestureState) => {
          if (placed || settling) return;
          xAnim.setValue(startRef.current.x + gestureState.dx);
          yAnim.setValue(startRef.current.y + gestureState.dy);
          if (Math.abs(gestureState.dx) + Math.abs(gestureState.dy) > 8) {
            draggedRef.current = true;
          }
        },
        onPanResponderRelease: (_evt, gestureState) => {
          if (placed || settling) return;
          setPressed(false);
          const moved = draggedRef.current || Math.abs(gestureState.dx) + Math.abs(gestureState.dy) > 8;
          if (!moved) {
            Animated.parallel([
              Animated.timing(xAnim, { toValue: piece.startLeft, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
              Animated.timing(yAnim, { toValue: piece.startTop, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
            ]).start(() => {
              startRef.current = { x: piece.startLeft, y: piece.startTop };
            });
            onActivate(null);
            return;
          }

          void safeNotify(Haptics.NotificationFeedbackType.Success);
          setSettling(true);
          Animated.parallel([
            Animated.timing(xAnim, {
              toValue: piece.target.x,
              duration: SETTLE_MS,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false,
            }),
            Animated.timing(yAnim, {
              toValue: piece.target.y,
              duration: SETTLE_MS,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false,
            }),
            Animated.timing(wAnim, {
              toValue: piece.target.w,
              duration: SETTLE_MS,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false,
            }),
            Animated.timing(hAnim, {
              toValue: piece.target.h,
              duration: SETTLE_MS,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false,
            }),
          ]).start(() => {
            startRef.current = { x: piece.target.x, y: piece.target.y };
            setSettling(false);
            setPlaced(true);
          });
          onActivate(null);
          onPlaced(piece.id);
        },
        onPanResponderTerminate: () => {
          if (placed || settling) return;
          setPressed(false);
          Animated.parallel([
            Animated.timing(xAnim, { toValue: startRef.current.x, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
            Animated.timing(yAnim, { toValue: startRef.current.y, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          ]).start();
          onActivate(null);
        },
      }),
    [hAnim, onActivate, onPlaced, piece.id, piece.startLeft, piece.startTop, piece.target.h, piece.target.w, piece.target.x, piece.target.y, placed, settling, wAnim, xAnim, yAnim],
  );

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.piece,
        {
          left: 0,
          top: 0,
          width: wAnim,
          height: hAnim,
          zIndex: placed ? 1000 + piece.zIndex : isActive ? 900 + piece.zIndex : piece.zIndex,
          opacity: pressed || settling ? 0.995 : 1,
          transform: [{ translateX: xAnim }, { translateY: yAnim }],
        },
      ]}
    >
      <Image source={piece.source} style={styles.pieceImage} resizeMode="contain" />
    </Animated.View>
  );
}

export default function IranPuzzleGame() {
  const { lang, addStars } = useContext(AppContext);
  const { goBack, reset } = useNav();
  const { width, height } = useLandscapeDimensions();
  const [stageSize, setStageSize] = useState<StageSize>({ width: 0, height: 0 });
  const [placedCount, setPlacedCount] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const stageRef = useRef<View>(null);
  const isFa = lang === 'fa' || lang === 'ar';

  const mapRect = useMemo(() => {
    if (!stageSize.width || !stageSize.height) return null;
    const sideReserve = Math.round(Math.max(18, stageSize.width * 0.01));
    let mapH = Math.round(stageSize.height * 1.28);
    let mapW = Math.round((mapH * IRAN_PUZZLE_SOURCE_WIDTH) / IRAN_PUZZLE_SOURCE_HEIGHT);
    const maxW = Math.min(
      Math.round(stageSize.width - sideReserve * 2),
      Math.round(stageSize.height * 1.28 * (IRAN_PUZZLE_SOURCE_WIDTH / IRAN_PUZZLE_SOURCE_HEIGHT)),
    );
    if (mapW > maxW) {
      mapW = maxW;
      mapH = Math.round((mapW * IRAN_PUZZLE_SOURCE_HEIGHT) / IRAN_PUZZLE_SOURCE_WIDTH);
    }
    const x = Math.round((stageSize.width - mapW) / 2);
    const y = Math.round((stageSize.height - mapH) / 2);
    return { x, y, w: mapW, h: mapH };
  }, [stageSize.height, stageSize.width]);

  const pieces = useMemo(() => {
    if (!mapRect) return [];
    return buildStartLayout(IRAN_PUZZLE_PIECES, stageSize, mapRect);
  }, [mapRect, stageSize]);

  const allPlaced = placedCount >= IRAN_PUZZLE_PIECES.length;

  const handlePlaced = () => {
    setActiveId(null);
    setPlacedCount(prev => {
      const next = Math.min(IRAN_PUZZLE_PIECES.length, prev + 1);
      if (next === IRAN_PUZZLE_PIECES.length) {
        void safeNotify(Haptics.NotificationFeedbackType.Success);
      }
      return next;
    });
    addStars(1);
  };

  return (
    <View style={styles.root}>
      <View style={styles.stage} ref={stageRef} onLayout={event => setStageSize(event.nativeEvent.layout)}>
        <View style={styles.bgGlowTop} pointerEvents="none" />
        <View style={styles.bgGlowBottom} pointerEvents="none" />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={goBack}
          activeOpacity={0.75}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <Image source={neliWorldAssets.ui.close} style={styles.closeIcon} resizeMode="contain" />
        </TouchableOpacity>
        {mapRect ? (
          <>
            <View
              style={[
                styles.mapWrap,
                {
                  left: mapRect.x,
                  top: mapRect.y,
                  width: mapRect.w,
                  height: mapRect.h,
                },
              ]}
              pointerEvents="none"
            >
              <Image source={IRAN_PUZZLE_OUTLINE} style={styles.mapImage} resizeMode="contain" />
            </View>

            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
              {pieces.map(piece => (
                <ProvincePiece
                  key={piece.id}
                  piece={piece}
                  isActive={activeId === piece.id}
                  onActivate={setActiveId}
                  onPlaced={handlePlaced}
                />
              ))}
            </View>
          </>
        ) : null}

        {allPlaced ? (
          <TouchableOpacity style={styles.doneBtn} onPress={() => reset({ name: 'Main', tab: 'Games' })}>
            <Text style={[styles.doneText, { fontFamily: ff(isFa ? 'fa' : 'en', 'bold') }]}>{isFa ? 'بازی‌ها' : 'Games'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stage: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F7FBF3',
  },
  bgGlowTop: {
    position: 'absolute',
    top: -120,
    right: -70,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(125, 211, 252, 0.22)',
  },
  bgGlowBottom: {
    position: 'absolute',
    left: -90,
    bottom: -140,
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: 'rgba(253, 186, 116, 0.18)',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5000,
  },
  closeIcon: {
    width: 58,
    height: 58,
  },
  mapWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  piece: {
    position: 'absolute',
    shadowColor: '#111827',
    shadowOpacity: 0.11,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pieceImage: {
    width: '100%',
    height: '100%',
  },
  doneBtn: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    height: 52,
    minWidth: 112,
    paddingHorizontal: 18,
    borderRadius: 26,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
