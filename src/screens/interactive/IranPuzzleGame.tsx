import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import TopBar from '../../components/TopBar';
import { AppContext } from '../../store/AppContext';
import { useNav } from '../../store/NavContext';
import { useLandscapeDimensions } from '../../hooks/useLandscapeDimensions';
import { dir, ff } from '../../theme/fonts';
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

  const mapGap = 20;
  const sidePadding = 14;
  const leftShelf = Math.max(120, mapRect.x - mapGap);
  const rightShelf = Math.max(120, stage.width - (mapRect.x + mapRect.w) - mapGap);

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
    const cols = 2;
    const rows = Math.max(1, Math.ceil(list.length / cols));
    const shelf = side === 'left' ? leftShelf : rightShelf;
    const columnGap = 8;
    const columnWidth = (shelf - sidePadding * 2 - columnGap) / cols;
    const rowStep = (stage.height - 28) / rows;
    const topOffset = 14;
    const verticalGap = clamp(rowStep * 0.12, 6, 14);

    return list.map((piece, index) => {
      const target = targetFor(piece);
      const col = index % cols;
      const row = Math.floor(index / cols);
      const cellW = columnWidth;
      const cellH = rowStep - verticalGap;
      const slotSize = clamp(Math.min(cellW, cellH) * 0.92, 56, 96);
      const visualW = slotSize;
      const visualH = slotSize;
      const columnCenter = side === 'left'
        ? sidePadding + col * (columnWidth + columnGap) + columnWidth / 2
        : mapRect.x + mapRect.w + mapGap + sidePadding + col * (columnWidth + columnGap) + columnWidth / 2;
      const left = clamp(columnCenter - visualW / 2, 8, Math.max(8, stage.width - visualW - 8));
      const top = clamp(topOffset + row * rowStep + (rowStep - visualH) / 2, 10, Math.max(10, stage.height - visualH - 10));

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
  mapRect,
  isActive,
}: {
  piece: LayoutPiece;
  onPlaced: (id: string) => void;
  onActivate: (id: string | null) => void;
  mapRect: Rect;
  isActive: boolean;
}) {
  const draggedRef = useRef(false);
  const [position, setPosition] = useState({ x: piece.startLeft, y: piece.startTop });
  const [size, setSize] = useState({ w: piece.startWidth, h: piece.startHeight });
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [placed, setPlaced] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    setPosition({ x: piece.startLeft, y: piece.startTop });
    setSize({ w: piece.startWidth, h: piece.startHeight });
    setDrag({ x: 0, y: 0 });
    draggedRef.current = false;
    setPlaced(false);
    setPressed(false);
  }, [piece.id, piece.startHeight, piece.startLeft, piece.startTop, piece.startWidth]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !placed,
        onMoveShouldSetPanResponder: () => !placed,
        onPanResponderGrant: () => {
          if (placed) return;
          setPressed(true);
          draggedRef.current = false;
          onActivate(piece.id);
          void safeImpact();
        },
        onPanResponderMove: (_evt, gestureState) => {
          if (placed) return;
          setDrag({ x: gestureState.dx, y: gestureState.dy });
          if (Math.abs(gestureState.dx) + Math.abs(gestureState.dy) > 8) {
            draggedRef.current = true;
          }
        },
        onPanResponderRelease: (_evt, gestureState) => {
          if (placed) return;
          setPressed(false);
          const moved = draggedRef.current || Math.abs(gestureState.dx) + Math.abs(gestureState.dy) > 8;
          if (!moved) {
            setDrag({ x: 0, y: 0 });
            onActivate(null);
            return;
          }

          const currentX = position.x + gestureState.dx;
          const currentY = position.y + gestureState.dy;
          const currentW = size.w;
          const currentH = size.h;
          const centerX = currentX + currentW / 2;
          const centerY = currentY + currentH / 2;
          const margin = Math.max(18, Math.min(piece.target.w, piece.target.h) * 0.25);
          const inside =
            centerX >= mapRect.x - margin &&
            centerX <= mapRect.x + mapRect.w + margin &&
            centerY >= mapRect.y - margin &&
            centerY <= mapRect.y + mapRect.h + margin;

          if (!inside) {
            setDrag({ x: 0, y: 0 });
            onActivate(null);
            return;
          }

          void safeNotify(Haptics.NotificationFeedbackType.Success);
          setPosition({ x: piece.target.x, y: piece.target.y });
          setSize({ w: piece.target.w, h: piece.target.h });
          setDrag({ x: 0, y: 0 });
          setPlaced(true);
          onActivate(null);
          onPlaced(piece.id);
        },
        onPanResponderTerminate: () => {
          if (placed) return;
          setPressed(false);
          setDrag({ x: 0, y: 0 });
          onActivate(null);
        },
      }),
    [mapRect.h, mapRect.w, mapRect.x, mapRect.y, onActivate, onPlaced, piece.id, piece.target.h, piece.target.w, piece.target.x, piece.target.y, placed, position.x, position.y, size.h, size.w],
  );

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.piece,
        {
          left: position.x + drag.x,
          top: position.y + drag.y,
          width: size.w,
          height: size.h,
          zIndex: placed ? 1000 + piece.zIndex : isActive ? 900 + piece.zIndex : piece.zIndex,
          opacity: pressed ? 0.995 : 1,
        },
      ]}
    >
      <Image source={piece.source} style={styles.pieceImage} resizeMode="contain" />
    </View>
  );
}

export default function IranPuzzleGame() {
  const { lang, addStars } = useContext(AppContext);
  const { reset } = useNav();
  const { width, height } = useLandscapeDimensions();
  const [stageSize, setStageSize] = useState<StageSize>({ width: 0, height: 0 });
  const [placedCount, setPlacedCount] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const stageRef = useRef<View>(null);
  const isFa = lang === 'fa' || lang === 'ar';

  const mapRect = useMemo(() => {
    if (!stageSize.width || !stageSize.height) return null;
    const sideReserve = Math.round(Math.max(28, stageSize.width * 0.04));
    const marginY = 10;
    let mapH = Math.round(stageSize.height - marginY * 2);
    let mapW = Math.round((mapH * IRAN_PUZZLE_SOURCE_WIDTH) / IRAN_PUZZLE_SOURCE_HEIGHT);
    const maxW = Math.min(
      Math.round(stageSize.width - sideReserve * 2),
      Math.round((stageSize.height - marginY * 2) * (IRAN_PUZZLE_SOURCE_WIDTH / IRAN_PUZZLE_SOURCE_HEIGHT)),
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
      <TopBar title="Iran Puzzle" titleFa="پازل ایران" showBack dark={false} />

      <View style={styles.stage} ref={stageRef} onLayout={event => setStageSize(event.nativeEvent.layout)}>
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
                  mapRect={mapRect}
                  isActive={activeId === piece.id}
                  onActivate={setActiveId}
                  onPlaced={handlePlaced}
                />
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.footerRow} pointerEvents="box-none">
          <View style={styles.progressPill}>
            <Text style={[styles.progressText, { fontFamily: ff(isFa ? 'fa' : 'en', 'bold') }, dir(lang)]}>
              {placedCount}/{IRAN_PUZZLE_PIECES.length}
            </Text>
          </View>
          {allPlaced ? (
            <TouchableOpacity style={styles.doneBtn} onPress={() => reset({ name: 'Main', tab: 'Games' })}>
              <Text style={[styles.doneText, { fontFamily: ff(isFa ? 'fa' : 'en', 'bold') }]}>{isFa ? 'بازی‌ها' : 'Games'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: 'transparent',
    borderRadius: 12,
    shadowColor: '#111827',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  pieceImage: {
    width: '100%',
    height: '100%',
  },
  footerRow: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressPill: {
    minWidth: 76,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressText: {
    color: '#0F766E',
    fontSize: 14,
    textAlign: 'center',
  },
  doneBtn: {
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
