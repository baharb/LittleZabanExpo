import React, { useContext, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { neliWorldAssets, roomBackgroundPickers } from '../../assets/neliWorldAssets';
import CharacterAvatar from '../../components/CharacterAvatar';
import BlinkingNeliImage from '../../components/BlinkingNeliImage';
import TopBar from '../../components/TopBar';
import { AppContext } from '../../store/AppContext';
import { useLandscapeDimensions } from '../../hooks/useLandscapeDimensions';
import { dir, ff } from '../../theme/fonts';

const BODY_MAP = {
  hat: { cx: 0.5, cy: 0.08, fw: 0.54, fh: 0.26 },
  hatBlue: { cx: 0.5, cy: 0.08, fw: 0.54, fh: 0.26 },
  hatPink: { cx: 0.5, cy: 0.08, fw: 0.54, fh: 0.26 },
  crown: { cx: 0.5, cy: 0.13, fw: 0.4, fh: 0.15 },
  sunglasses: { cx: 0.5, cy: 0.34, fw: 0.5, fh: 0.16 },
  sunglassesBlack: { cx: 0.5, cy: 0.34, fw: 0.5, fh: 0.16 },
  sunglassesGold: { cx: 0.5, cy: 0.34, fw: 0.5, fh: 0.16 },
  sunglassesPink: { cx: 0.5, cy: 0.34, fw: 0.5, fh: 0.16 },
  scarf: { cx: 0.52, cy: 0.7, fw: 0.34, fh: 0.72 },
  dress: { cx: 0.505, cy: 0.72, fw: 0.46, fh: 0.32 },
  dressPink: { cx: 0.505, cy: 0.73, fw: 0.5, fh: 0.34 },
  dressBlue: { cx: 0.505, cy: 0.73, fw: 0.5, fh: 0.34 },
  dressGreen: { cx: 0.505, cy: 0.73, fw: 0.5, fh: 0.34 },
  dressOrange: { cx: 0.505, cy: 0.73, fw: 0.5, fh: 0.34 },
  dressRed: { cx: 0.505, cy: 0.72, fw: 0.46, fh: 0.32 },
  dressLong: { cx: 0.505, cy: 0.79, fw: 0.56, fh: 0.44 },
  shirt: { cx: 0.506, cy: 0.801, fw: 0.36, fh: 0.37 },
  skirt: { cx: 0.505, cy: 0.755, fw: 0.38, fh: 0.18 },
  pants: { cx: 0.51, cy: 0.95, fw: 0.30, fh: 0.35 },
  swimsuit: { cx: 0.505, cy: 0.7, fw: 0.38, fh: 0.28 },
  apron: { cx: 0.505, cy: 0.68, fw: 0.42, fh: 0.26 },
  shoes: { cx: 0.5, cy: 0.955, fw: 0.48, fh: 0.1 },
  shoesGold: {  cx: 0.5, cy: 1.06, fw: 0.64, fh: 0.98 },
  shoesPink: {cx: 0.5, cy: 1.06, fw: 0.44, fh: 0.38  },
  shoesWhite: { cx: 0.5, cy: 1.06, fw: 0.44, fh: 0.38 },
  boots: { cx: 0.51, cy: 1, fw: 0.54, fh: 0.44 },
  sneakers: { cx: 0.51, cy: 1.06, fw: 0.44, fh: 0.38 },
  bag: { cx: 0.70, cy: 0.91, fw: 0.18, fh: 0.18 },
  gloves: { cx: 0.54, cy: 0.69, fw: 0.56, fh: 0.2 },
  necklace: { cx: 0.52, cy: 0.56, fw: 0.25, fh: 0.08 },
  sunhatCream: { cx: 0.5, cy: 0.1, fw: 0.64, fh: 0.3 },
};

type Slot = keyof typeof BODY_MAP;
type OutfitItem = { slot: Slot; fa: string; en: string };
type OutfitIcon = keyof typeof neliWorldAssets.ui | 'water';
type Outfit = { name: string; nameFa: string; accent: string; icon: OutfitIcon; items: OutfitItem[] };
type DropTarget = { x: number; y: number; w: number; h: number } | null;
type ClosetPlacement = {
  left: number;
  top: number;
  showHanger?: boolean;
  artX?: number;
  artY?: number;
  height?: number;
  zIndex?: number;
};
type FlightPath = {
  item: OutfitItem;
  fromX: number;
  fromY: number;
  fromW: number;
  fromH: number;
  toX: number;
  toY: number;
  targetScale: number;
};
type SelectedExclusiveSlots = {
  hat: Slot | null;
  dress: Slot | null;
  sunglasses: Slot | null;
  shoes: Slot | null;
};

const HAT_SLOTS: Slot[] = ['hat', 'hatBlue', 'hatPink', 'sunhatCream'];
const isHatSlot = (slot: Slot) => HAT_SLOTS.includes(slot);
const DRESS_SLOTS: Slot[] = ['dress', 'dressPink', 'dressBlue', 'dressGreen', 'dressOrange', 'dressRed', 'dressLong'];
const isDressSlot = (slot: Slot) => DRESS_SLOTS.includes(slot);
const SUNGLASSES_SLOTS: Slot[] = ['sunglasses', 'sunglassesBlack', 'sunglassesGold', 'sunglassesPink'];
const isSunglassesSlot = (slot: Slot) => SUNGLASSES_SLOTS.includes(slot);
const SHOES_SLOTS: Slot[] = ['shoes', 'shoesGold', 'shoesPink', 'shoesWhite', 'boots', 'sneakers'];
const isShoesSlot = (slot: Slot) => SHOES_SLOTS.includes(slot);
const BODY_PAIR_SLOTS: Slot[] = ['shirt', 'pants'];
const isBodyPairSlot = (slot: Slot) => BODY_PAIR_SLOTS.includes(slot);
const getOverlayLayer = (slot: Slot) => {
  if (isHatSlot(slot)) return 100;
  if (slot === 'scarf') return 90;
  if (isSunglassesSlot(slot)) return 80;
  if (slot === 'bag') return 70;
  if (slot === 'shirt') return 60;
  if (slot === 'pants') return 40;
  if (slot === 'boots') return 45;
  if (isShoesSlot(slot)) return 46;
  if (isDressSlot(slot)) return 50;
  return 10;
};

const OUTFITS: Outfit[] = [
  {
    name: 'Sunny',
    nameFa: 'آفتابی',
    accent: '#FFD166',
    icon: 'sparkle',
    items: [
      { slot: 'sunhatCream', fa: 'کلاه', en: 'Hat' },
      { slot: 'hat', fa: 'کلاه', en: 'Hat' },
      { slot: 'sunglassesBlack', fa: 'عینک', en: 'Glasses' },
      { slot: 'sunglassesPink', fa: 'عینک', en: 'Glasses' },
      { slot: 'dressRed', fa: 'پیراهن', en: 'Dress' },
      { slot: 'dressBlue', fa: 'پیراهن', en: 'Dress' },
      { slot: 'shirt', fa: 'پیراهن', en: 'Shirt' },
      { slot: 'pants', fa: 'شلوارک', en: 'Pants' },
      { slot: 'bag', fa: 'کیف', en: 'Bag' },
      { slot: 'shoesWhite', fa: 'کفش', en: 'Shoes' },
      { slot: 'shoesPink', fa: 'کفش', en: 'Shoes' },
    ],
  },
  {
    name: 'Party',
    nameFa: 'جشن',
    accent: '#FF8AC3',
    icon: 'star',
    items: [
      { slot: 'hatPink', fa: 'کلاه', en: 'Hat' },
      { slot: 'hat', fa: 'کلاه', en: 'Hat' },
      { slot: 'sunglassesPink', fa: 'عینک', en: 'Glasses' },
      { slot: 'sunglassesBlack', fa: 'عینک', en: 'Glasses' },
      { slot: 'dressOrange', fa: 'لباس', en: 'Dress' },
      { slot: 'dressBlue', fa: 'لباس', en: 'Dress' },
      { slot: 'dressRed', fa: 'لباس', en: 'Dress' },
      { slot: 'bag', fa: 'کیف', en: 'Bag' },
      { slot: 'shoesPink', fa: 'کفش', en: 'Shoes' },
      { slot: 'shoesWhite', fa: 'کفش', en: 'Shoes' },
    ],
  },
  {
    name: 'Winter',
    nameFa: 'زمستان',
    accent: '#8FD3FF',
    icon: 'heart',
    items: [
      { slot: 'hatBlue', fa: 'کلاه', en: 'Beanie' },
      { slot: 'hatPink', fa: 'کلاه', en: 'Hat' },
      { slot: 'sunglassesGold', fa: 'عینک', en: 'Glasses' },
      { slot: 'sunglassesBlack', fa: 'عینک', en: 'Glasses' },
      { slot: 'scarf', fa: 'شال', en: 'Scarf' },
      { slot: 'dressLong', fa: 'کت', en: 'Coat' },
      { slot: 'shirt', fa: 'پیراهن', en: 'Shirt' },
      { slot: 'pants', fa: 'شلوارک', en: 'Pants' },
      { slot: 'boots', fa: 'چکمه', en: 'Boots' },
      { slot: 'bag', fa: 'کوله', en: 'Backpack' },
    ],
  },
  {
    name: 'Sport',
    nameFa: 'ورزشی',
    accent: '#7EF0C1',
    icon: 'rainbow',
    items: [
      { slot: 'hat', fa: 'کلاه', en: 'Cap' },
      { slot: 'hatBlue', fa: 'کلاه', en: 'Beanie' },
      { slot: 'sunglasses', fa: 'عینک', en: 'Goggles' },
      { slot: 'sunglassesBlack', fa: 'عینک', en: 'Glasses' },
      { slot: 'shirt', fa: 'تی شرت', en: 'T-shirt' },
      { slot: 'pants', fa: 'شلوارک', en: 'Shorts' },
      { slot: 'sneakers', fa: 'کفش', en: 'Trainers' },
      { slot: 'bag', fa: 'کیف', en: 'Bag' },
    ],
  },
];

const CLOTHING_IMAGES: Partial<Record<Slot, any>> = {
  bag: neliWorldAssets.clothes.bag,
  boots: neliWorldAssets.clothes.boots,
  crown: neliWorldAssets.clothes.crown,
  dress: neliWorldAssets.clothes.dress,
  dressBlue: neliWorldAssets.clothes.dressBlue,
  dressGreen: neliWorldAssets.clothes.dressGreen,
  dressLong: neliWorldAssets.clothes.dressLong,
  dressOrange: neliWorldAssets.clothes.dressOrange,
  dressPink: neliWorldAssets.clothes.dressPink,
  dressRed: neliWorldAssets.clothes.dressRed,
  gloves: neliWorldAssets.clothes.gloves,
  hat: neliWorldAssets.clothes.sunhat,
  hatBlue: neliWorldAssets.clothes.hatBlue,
  hatPink: neliWorldAssets.clothes.hatPink,
  pants: neliWorldAssets.clothes.pants,
  scarf: neliWorldAssets.clothes.scarf,
  shirt: neliWorldAssets.clothes.shirt,
  shoes: neliWorldAssets.clothes.shoes,
  shoesGold: neliWorldAssets.clothes.shoesGold,
  shoesPink: neliWorldAssets.clothes.shoesPink,
  shoesWhite: neliWorldAssets.clothes.shoesWhite,
  skirt: neliWorldAssets.clothes.skirt,
  sneakers: neliWorldAssets.clothes.shoes,
  sunglasses: neliWorldAssets.clothes.sunglasses,
  sunglassesBlack: neliWorldAssets.clothes.sunglassesBlack,
  sunglassesGold: neliWorldAssets.clothes.sunglassesGold,
  sunglassesPink: neliWorldAssets.clothes.sunglassesPink,
  apron: neliWorldAssets.clothes.apron,
  sunhatCream: neliWorldAssets.clothes.sunhatCream,
};

const SUNGLASSES_ART_FIX: Partial<Record<Slot, { scale: number; translateY: number }>> = {
  sunglasses: { scale: 1.06, translateY: 0.024 },
  sunglassesPink: { scale: 1.06, translateY: 0.024 },
};

function ClothingArt({ slot, size, tintColor }: { slot: Slot; size: number; tintColor?: string }) {
  const source = CLOTHING_IMAGES[slot];
  const hasValidSource = !!source && !Array.isArray(source);
  if (hasValidSource) {
    const sunglassesFix = SUNGLASSES_ART_FIX[slot];
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            tintColor,
            backgroundColor: 'transparent',
            transform: sunglassesFix
              ? [{ translateY: size * sunglassesFix.translateY }, { scale: sunglassesFix.scale }]
              : undefined,
          }}
          resizeMode="contain"
        />
      </View>
    );
  }
  if (slot === 'apron') return <ApronShape size={size} bodyColor="#8FD3FF" trimColor="#4E2F9C" />;
  if (slot === 'swimsuit') return <SwimSuitShape size={size} bodyColor="#62D5FF" trimColor="#FFFFFF" />;
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#FFD166' }} />;
}

function getLandingPoint(slot: Slot, imgSize: number) {
  if (slot === 'shirt' || slot === 'pants') {
    const shirt = BODY_MAP.shirt;
    const pants = BODY_MAP.pants;
    const shirtW = shirt.fw * imgSize;
    const shirtH = shirt.fh * imgSize;
    const pantsW = pants.fw * imgSize;
    const pantsH = pants.fh * imgSize;
    const left = Math.min(shirt.cx * imgSize - shirtW / 2, pants.cx * imgSize - pantsW / 2);
    const top = Math.min(shirt.cy * imgSize - shirtH / 2, pants.cy * imgSize - pantsH / 2);
    const width = Math.max(shirt.cx * imgSize + shirtW / 2, pants.cx * imgSize + pantsW / 2) - left;
    const height = Math.max(shirt.cy * imgSize + shirtH / 2, pants.cy * imgSize + pantsH / 2) - top;
    return { x: left + width / 2, y: top + height / 2 };
  }

  const map = BODY_MAP[slot];
  const itemW = map.fw * imgSize;
  const itemH = map.fh * imgSize;
  const isHat = isHatSlot(slot);
  const isSunglasses = isSunglassesSlot(slot);
  const isDress = isDressSlot(slot);
  const isBoots = slot === 'boots';
  const artSize = Math.round(Math.min(itemW, itemH) * (isSunglasses ? 3.96 : isHat ? 1.8 : isBoots ? 1.08 : isDress ? 1.18 : 1.2));
  const overlayW = isDress ? Math.max(itemW, artSize) : itemW;
  const overlayH = isDress ? Math.max(itemH, artSize * 1.08) : itemH;
  const xOffset = isDress ? imgSize * 0.008 : isSunglasses ? itemW * 0.03 : 0;
  const yOffset = isDress ? imgSize * 0.106 : isSunglasses ? itemH * 0.75 : 0;
  if (isBoots) return { x: map.cx * imgSize - overlayW / 2 + overlayW * 0.105 + overlayW / 2, y: map.cy * imgSize - overlayH / 2 + overlayH / 2 };
  return { x: map.cx * imgSize + xOffset, y: map.cy * imgSize + yOffset };
}

function getFlightScale(slot: Slot, imgSize: number, closetSize: number) {
  const map = BODY_MAP[slot];
  const itemW = map.fw * imgSize;
  const itemH = map.fh * imgSize;
  const isHat = isHatSlot(slot);
  const isSunglasses = isSunglassesSlot(slot);
  const isDress = isDressSlot(slot);
  const isBoots = slot === 'boots';

  if (slot === 'shirt' || slot === 'pants') {
    const shirt = BODY_MAP.shirt;
    const pants = BODY_MAP.pants;
    const shirtSize = Math.round(Math.min(shirt.fw * imgSize, shirt.fh * imgSize) * 1.02 * 1.21);
    const pantsSize = Math.round(Math.min(pants.fw * imgSize, pants.fh * imgSize) * 1.02 * 1.21);
    return Math.max(shirtSize, pantsSize) / closetSize;
  }

  const targetSize = Math.round(Math.min(itemW, itemH) * (isSunglasses ? 3.96 : isHat ? 1.8 : isBoots ? 1.08 : isDress ? 1.18 : 1.2));
  return Math.max(1, targetSize / closetSize);
}

function BodyPairOverlay({ imgSize, anim }: { imgSize: number; anim: Animated.Value }) {
  const shirt = BODY_MAP.shirt;
  const pants = BODY_MAP.pants;
  const shirtW = shirt.fw * imgSize;
  const shirtH = shirt.fh * imgSize;
  const pantsW = pants.fw * imgSize;
  const pantsH = pants.fh * imgSize;
  const sizeBoost = 1.21;
  const left = Math.min(shirt.cx * imgSize - shirtW / 2, pants.cx * imgSize - pantsW / 2);
  const top = Math.min(shirt.cy * imgSize - shirtH / 2, pants.cy * imgSize - pantsH / 2);
  const width = Math.max(shirt.cx * imgSize + shirtW / 2, pants.cx * imgSize + pantsW / 2) - left;
  const height = Math.max(shirt.cy * imgSize + shirtH / 2, pants.cy * imgSize + pantsH / 2) - top;
  const shiftX = width * 0.1;
  const shiftY = height * 0.05;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: left - shiftX,
        top: top - shiftY,
        width,
        height,
        zIndex: 60,
        elevation: 60,
        overflow: 'visible',
        transform: [
          { scale: anim.interpolate({ inputRange: [0, 0.65, 1], outputRange: [0, 1.12, 1] }) },
          { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '0deg'] }) },
        ],
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: pants.cx * imgSize - left - pantsW / 2,
          top: pants.cy * imgSize - top - pantsH / 2,
        }}
      >
        <ClothingArt slot="pants" size={Math.round(Math.min(pantsW, pantsH) * 1.02 * sizeBoost)} />
      </View>
      <View
        style={{
          position: 'absolute',
          left: shirt.cx * imgSize - left - shirtW / 2,
          top: shirt.cy * imgSize - top - shirtH / 2,
        }}
      >
        <ClothingArt slot="shirt" size={Math.round(Math.min(shirtW, shirtH) * 1.02 * sizeBoost)} />
      </View>
    </Animated.View>
  );
}

function BootsOverlay({ imgSize, anim }: { imgSize: number; anim: Animated.Value }) {
  const boots = BODY_MAP.boots;
  const bootsW = boots.fw * imgSize;
  const bootsH = boots.fh * imgSize;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: boots.cx * imgSize - bootsW / 2 + bootsW * 0.105,
        top: boots.cy * imgSize - bootsH / 2 + bootsH * 0.05,
        width: bootsW,
        height: bootsH,
        zIndex: 45,
        elevation: 45,
        overflow: 'visible',
        transform: [
          { scale: anim.interpolate({ inputRange: [0, 0.65, 1], outputRange: [0, 1.12, 1] }) },
          { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '0deg'] }) },
        ],
      }}
    >
      <ClothingArt slot="boots" size={Math.round(Math.min(bootsW, bootsH))} />
    </Animated.View>
  );
}

function BodyPairClosetArt({ size }: { size: number }) {
  const shirt = BODY_MAP.shirt;
  const pants = BODY_MAP.pants;
  const shirtSize = Math.round(size * 1.04);
  const pantsSize = Math.round(size * 0.92);

  return (
    <View style={{ width: size * 1.18, height: size * 1.92, alignItems: 'center', justifyContent: 'flex-start', overflow: 'visible' }}>
      <View style={{ transform: [{ translateY: 0 }] }}>
        <ClothingArt slot="shirt" size={shirtSize} />
      </View>
      <View
        style={{
          marginTop: -size * 0.22,
          transform: [{ translateX: size * 0.005 }],
        }}
      >
        <ClothingArt slot="pants" size={pantsSize} />
      </View>
    </View>
  );
}

function DressShape({ size, bodyColor, skirtColor, long = false }: { size: number; bodyColor: string; skirtColor: string; long?: boolean }) {
  return (
    <View style={{ width: size, height: size * (long ? 1.18 : 1.02), alignItems: 'center', justifyContent: 'flex-start' }}>
      <View style={{ width: size * 0.34, height: size * 0.16, borderRadius: size * 0.08, backgroundColor: bodyColor }} />
      <View
        style={{
          width: size * (long ? 0.56 : 0.66),
          height: size * (long ? 0.78 : 0.56),
          marginTop: -size * 0.02,
          borderTopLeftRadius: size * 0.12,
          borderTopRightRadius: size * 0.12,
          borderBottomLeftRadius: size * (long ? 0.18 : 0.14),
          borderBottomRightRadius: size * (long ? 0.18 : 0.14),
          backgroundColor: skirtColor,
        }}
      />
      <View style={{ position: 'absolute', top: size * 0.08, width: size * 0.18, height: size * 0.035, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.8)' }} />
      <View style={{ position: 'absolute', top: size * 0.02, left: size * 0.22, width: size * 0.12, height: size * 0.03, borderRadius: 999, backgroundColor: bodyColor, transform: [{ rotate: '-28deg' }] }} />
      <View style={{ position: 'absolute', top: size * 0.02, right: size * 0.22, width: size * 0.12, height: size * 0.03, borderRadius: 999, backgroundColor: bodyColor, transform: [{ rotate: '28deg' }] }} />
    </View>
  );
}

function ApronShape({ size, bodyColor, trimColor }: { size: number; bodyColor: string; trimColor: string }) {
  return (
    <View style={{ width: size, height: size * 1.02, alignItems: 'center', justifyContent: 'flex-start' }}>
      <View style={{ width: size * 0.34, height: size * 0.16, borderRadius: size * 0.08, backgroundColor: trimColor }} />
      <View style={{ width: size * 0.62, height: size * 0.56, marginTop: -size * 0.02, borderRadius: size * 0.12, backgroundColor: bodyColor }} />
      <View style={{ position: 'absolute', top: size * 0.05, left: size * 0.2, width: size * 0.12, height: size * 0.03, borderRadius: 999, backgroundColor: trimColor, transform: [{ rotate: '-26deg' }] }} />
      <View style={{ position: 'absolute', top: size * 0.05, right: size * 0.2, width: size * 0.12, height: size * 0.03, borderRadius: 999, backgroundColor: trimColor, transform: [{ rotate: '26deg' }] }} />
      <View style={{ position: 'absolute', top: size * 0.24, width: size * 0.24, height: size * 0.22, borderRadius: size * 0.12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)' }} />
    </View>
  );
}

function SwimSuitShape({ size, bodyColor, trimColor }: { size: number; bodyColor: string; trimColor: string }) {
  return (
    <View style={{ width: size, height: size * 0.94, alignItems: 'center', justifyContent: 'flex-start' }}>
      <View style={{ width: size * 0.42, height: size * 0.2, borderRadius: size * 0.12, backgroundColor: trimColor }} />
      <View style={{ width: size * 0.38, height: size * 0.44, marginTop: -size * 0.02, borderRadius: size * 0.16, backgroundColor: bodyColor }} />
      <View style={{ position: 'absolute', top: size * 0.12, width: size * 0.18, height: size * 0.04, borderRadius: 999, backgroundColor: trimColor }} />
      <View style={{ position: 'absolute', bottom: size * 0.06, width: size * 0.26, height: size * 0.1, borderRadius: size * 0.06, backgroundColor: trimColor, opacity: 0.95 }} />
    </View>
  );
}

function RackHeader() {
  return null;
}

function HangerGlyph() {
  return (
    <View style={styles.hangerGlyph}>
      <Image source={neliWorldAssets.clothes.hanger} style={styles.hangerImage} resizeMode="contain" />
    </View>
  );
}

function getClosetPlacement(items: OutfitItem[], item: OutfitItem): ClosetPlacement {
  const leftShelfTop = [-0.28, 0.62, 1.52, 2.42];
  const hangerLeft = [1.55, 2.84, 4.12];
  const bottomShelfLeft = [0.40, 2.08, 3.80];

  const hatIndex = items.filter(piece => isHatSlot(piece.slot)).findIndex(piece => piece.slot === item.slot);
  if (hatIndex >= 0) {
    return { left: 0.06, top: leftShelfTop[Math.min(hatIndex, 1)] ?? leftShelfTop[1], height: 1.04, zIndex: 70 };
  }

  const sunglassesIndex = items.filter(piece => isSunglassesSlot(piece.slot)).findIndex(piece => piece.slot === item.slot);
  if (sunglassesIndex >= 0) {
    return { left: 0.04, top: leftShelfTop[Math.min(sunglassesIndex + 2, 3)] ?? leftShelfTop[3], height: 1.02, zIndex: 60 };
  }

  const bottomItems = items.filter(piece => piece.slot === 'bag' || isShoesSlot(piece.slot));
  const bottomIndex = bottomItems.findIndex(piece => piece.slot === item.slot);
  if (bottomIndex >= 0) {
    return { left: bottomShelfLeft[Math.min(bottomIndex, 2)] ?? bottomShelfLeft[2], top: 3.2, height: 1.08, zIndex: 45 };
  }

  if (item.slot === 'shirt') {
    return { left: hangerLeft[2], top: 0.02, showHanger: true, height: 2.12, zIndex: 36 };
  }

  if (item.slot === 'pants' && items.some(piece => piece.slot === 'shirt')) {
    return { left: hangerLeft[2], top: 0.99, height: 1.18, zIndex: 37 };
  }

  const hangerItems = items.filter(piece => !isHatSlot(piece.slot) && !isSunglassesSlot(piece.slot) && piece.slot !== 'bag' && !isShoesSlot(piece.slot) && piece.slot !== 'shirt' && piece.slot !== 'pants');
  const hangerIndex = hangerItems.findIndex(piece => piece.slot === item.slot);
  return { left: hangerLeft[Math.min(Math.max(hangerIndex, 0), 2)] ?? hangerLeft[2], top: 0.02, showHanger: true, height: 2.18, zIndex: 35 };
}

  function ClothingOverlay({ item, imgSize, anim }: { item: OutfitItem; imgSize: number; anim: Animated.Value }) {
    const map = BODY_MAP[item.slot];
    const itemW = map.fw * imgSize;
    const itemH = map.fh * imgSize;
  const isHat = isHatSlot(item.slot);
  const isSunglasses = isSunglassesSlot(item.slot);
  const isDress = isDressSlot(item.slot);
  const isScarf = item.slot === 'scarf';
  const isBag = item.slot === 'bag';
  const isShirt = item.slot === 'shirt';
  const isPants = item.slot === 'pants';
  const isBoots = item.slot === 'boots';
  const isShoes = isShoesSlot(item.slot);
  const artSize = Math.round(Math.min(itemW, itemH) * (isSunglasses ? 3.96 : isHat ? 1.8 : isBoots ? 1.08 : isDress ? 1.180 : 1.2));
  const overlayW = isDress ? Math.max(itemW, artSize) : itemW;
  const overlayH = isDress ? Math.max(itemH, artSize * 1.08) : itemH;
  const xOffset = isDress ? imgSize * 0.008 : isSunglasses ? itemW * 0.03 : 0;
  const yOffset = isDress ? imgSize * 0.1060 : isSunglasses ? itemH * 0.75 : isShoes ? imgSize * 0.02 : 0;
  const wornClipHeight = isHat ? artSize * 0.72 : artSize;
  const wornLift = isHat ? -artSize * 0.12 : 0;
  const overlayDepth = isShoesSlot(item.slot) ? 75 : getOverlayLayer(item.slot);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
          position: 'absolute',
          left: map.cx * imgSize - overlayW / 2 + xOffset,
          top: map.cy * imgSize - overlayH / 2 + yOffset,
        width: overlayW,
        height: overlayH,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: overlayDepth,
          elevation: overlayDepth,
          overflow: isDress ? 'visible' : 'hidden',
          transform: [
            { scale: anim.interpolate({ inputRange: [0, 0.65, 1], outputRange: [0, 1.12, 1] }) },
            { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '0deg'] }) },
          ],
        }}
    >
      <View style={{ width: artSize, height: wornClipHeight, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-start' }}>
        <View style={{ transform: [{ translateY: wornLift }] }}>
          <ClothingArt slot={item.slot} size={artSize} />
        </View>
      </View>
    </Animated.View>
  );
}

function DraggableClothing({
  item,
  isWorn,
  isFa,
  lang,
  targetRef,
  landingPoint,
  onLaunch,
  onDraggingChange,
  size,
  placement,
}: {
  item: OutfitItem;
  isWorn: boolean;
  isFa: boolean;
  lang: string;
  targetRef: React.MutableRefObject<DropTarget>;
  landingPoint: { x: number; y: number };
  onLaunch: (path: FlightPath) => void;
  onDraggingChange: (dragging: boolean) => void;
  size: number;
  placement: ClosetPlacement;
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const itemRef = useRef<View>(null);
  const isWornRef = useRef(isWorn);
  const transitionLockRef = useRef(false);
  const transitionLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragging, setDragging] = useState(false);
  const [flying, setFlying] = useState(false);
    const isHat = isHatSlot(item.slot);
  const closetArtSize = size * (isDressSlot(item.slot) ? 1.104 : 0.92);
  const showBodyPair = item.slot === 'shirt';
    isWornRef.current = isWorn;

  React.useEffect(() => {
    if (!isWorn) return;
    setFlying(false);
    pan.setValue({ x: 0, y: 0 });
  }, [isWorn, pan]);

  const animateToBody = (gesture?: { dx: number; dy: number }) => {
    if (isWornRef.current || flying || transitionLockRef.current) return;
    transitionLockRef.current = true;
    if (transitionLockTimerRef.current) {
      clearTimeout(transitionLockTimerRef.current);
      transitionLockTimerRef.current = null;
    }
    setDragging(true);
    onDraggingChange(true);
    Haptics.selectionAsync();
    const current = gesture ?? { dx: 0, dy: 0 };
    requestAnimationFrame(() => {
      itemRef.current?.measureInWindow((x, y, w, h) => {
        const itemCenterX = x + w * 0.5;
        const itemCenterY = y + h * 0.5;
        const target = targetRef.current;
        const targetX = target ? target.x + landingPoint.x : itemCenterX;
        const targetY = target ? target.y + landingPoint.y : itemCenterY;
        setFlying(true);
        setDragging(false);
        onDraggingChange(false);
        pan.setValue({ x: 0, y: 0 });
        onLaunch({
          item,
          fromX: itemCenterX,
          fromY: itemCenterY,
          fromW: w,
          fromH: h,
          toX: targetX,
          toY: targetY,
          targetScale: getFlightScale(item.slot, targetRef.current ? targetRef.current.w : size, size * (isDressSlot(item.slot) ? 1.104 : 0.92)),
        });
        transitionLockTimerRef.current = setTimeout(() => {
          transitionLockRef.current = false;
          transitionLockTimerRef.current = null;
        }, 250);
      });
    });
  };

  React.useEffect(() => {
    return () => {
      if (transitionLockTimerRef.current) {
        clearTimeout(transitionLockTimerRef.current);
        transitionLockTimerRef.current = null;
      }
    };
  }, []);

  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !isWornRef.current && !transitionLockRef.current,
    onMoveShouldSetPanResponder: (_e, gesture) => !isWornRef.current && !transitionLockRef.current && Math.abs(gesture.dx) + Math.abs(gesture.dy) > 4,
    onPanResponderGrant: () => {
      if (isWornRef.current || transitionLockRef.current) return;
      setDragging(true);
      onDraggingChange(true);
      pan.setValue({ x: 0, y: 0 });
      Haptics.selectionAsync();
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_e, gesture) => {
      animateToBody({ dx: gesture.dx, dy: gesture.dy });
    },
    onPanResponderTerminate: () => {
      pan.stopAnimation(value => animateToBody({ dx: value.x, dy: value.y }));
    },
  })).current;

  return (
    <Animated.View
      ref={itemRef}
      {...responder.panHandlers}
      pointerEvents={isWorn || flying ? 'none' : 'auto'}
      style={[
        styles.hangingItem,
        isHat && styles.hatFront,
        isWorn ? styles.hangingItemWornBack : null,
        {
          position: 'absolute',
          left: size * placement.left,
          top: size * placement.top,
          zIndex: isWorn ? 0 : (placement.zIndex ?? 30),
          elevation: isWorn ? 0 : (placement.zIndex ?? 30),
        },
        { width: size, height: size * (placement.height ?? 1.6) },
        (isWorn || flying) && styles.hangingItemWorn,
        dragging && styles.hangingItemDragging,
        { overflow: 'visible' },
        {
          transform: [
            ...pan.getTranslateTransform(),
          ],
        },
      ]}
      >
          {!dragging && placement.showHanger ? <HangerGlyph /> : null}
            <View
            style={[
              {
                transform: [
                  { translateX: size * (placement.artX ?? 0) },
                  { translateY: size * (placement.artY ?? 0) },
                ],
              },
            ]}
          >
            {showBodyPair ? <BodyPairClosetArt size={closetArtSize} /> : <ClothingArt slot={item.slot} size={closetArtSize} />}
          </View>
      </Animated.View>
  );
}

function renderFlyingCopy(item: OutfitItem, size: number) {
  if (item.slot === 'shirt' || item.slot === 'pants') {
    return <BodyPairClosetArt size={size} />;
  }
  return <ClothingArt slot={item.slot} size={size} />;
}

export default function DressUpGame() {
  const { lang, addStars } = useContext(AppContext);
  const { width, height } = useLandscapeDimensions();
  const isFa = lang === 'fa' || lang === 'ar';
  const isLandscape = width > height;

  const [outfitIdx, setOutfitIdx] = useState(0);
  const [worn, setWorn] = useState<Record<string, boolean>>({});
  const [selectedExclusiveSlots, setSelectedExclusiveSlots] = useState<SelectedExclusiveSlots>({
    hat: null,
    dress: null,
    sunglasses: null,
    shoes: null,
  });
  const [done, setDone] = useState(false);
  const [draggingSlot, setDraggingSlot] = useState<Slot | null>(null);
  const doneSlide = useRef(new Animated.Value(420)).current;
  const neliScale = useRef(new Animated.Value(1)).current;
  const flightAnim = useRef(new Animated.Value(0)).current;
  const anims = useRef<Record<string, Animated.Value>>({});
  const neliTargetRef = useRef<DropTarget>(null);
  const neliStageRef = useRef<View>(null);
  const [flight, setFlight] = useState<FlightPath | null>(null);

  const outfit = OUTFITS[outfitIdx];
  const imgSize = Math.min(Math.max(width * 0.26, 250), isLandscape ? 360 : 320);
  const imgHeight = imgSize * 1.18;
  const clothingSize = Math.max(76, Math.min(isLandscape ? width * 0.078 : width * 0.15, 96));
  const outfitHatItems = outfit.items.filter(item => isHatSlot(item.slot));
  const outfitDressItems = outfit.items.filter(item => isDressSlot(item.slot));
  const outfitSunglassesItems = outfit.items.filter(item => isSunglassesSlot(item.slot));
  const outfitShoesItems = outfit.items.filter(item => isShoesSlot(item.slot));
  const outfitBodyPairItems = outfit.items.filter(item => isBodyPairSlot(item.slot));
  const selectedHatSlot = selectedExclusiveSlots.hat;
  const selectedDressSlot = selectedExclusiveSlots.dress;
  const selectedSunglassesSlot = selectedExclusiveSlots.sunglasses;
  const selectedShoesSlot = selectedExclusiveSlots.shoes;
  const wornCount =
    outfit.items.filter(item => !isHatSlot(item.slot) && !isDressSlot(item.slot) && !isSunglassesSlot(item.slot) && !isShoesSlot(item.slot) && !isBodyPairSlot(item.slot) && worn[item.slot]).length +
    (selectedHatSlot ? 1 : 0) +
    (selectedDressSlot ? 1 : 0) +
    (selectedSunglassesSlot ? 1 : 0) +
    (selectedShoesSlot ? 1 : 0) +
    (outfitBodyPairItems.length > 0 && (worn.shirt || worn.pants) ? 1 : 0);
  const neededCount =
    outfit.items.length -
    Math.max(0, outfitHatItems.length - 1) -
    Math.max(0, outfitDressItems.length - 1) -
    Math.max(0, outfitSunglassesItems.length - 1) -
    Math.max(0, outfitShoesItems.length - 1) -
    Math.max(0, outfitBodyPairItems.length - 1);

  const getAnim = (slot: string) => {
    if (!anims.current[slot]) anims.current[slot] = new Animated.Value(0);
    return anims.current[slot];
  };

  const reset = () => {
    setWorn({});
    setSelectedExclusiveSlots({
      hat: null,
      dress: null,
      sunglasses: null,
      shoes: null,
    });
    setDone(false);
    doneSlide.setValue(420);
    setFlight(null);
    flightAnim.setValue(0);
    anims.current = {};
  };

  const syncNeliTarget = () => {
    requestAnimationFrame(() => {
      neliStageRef.current?.measureInWindow((x, y, w, h) => {
        const next = { x, y, w, h };
        neliTargetRef.current = next;
      });
    });
  };

  const wearItem = (item: OutfitItem, immediate = false) => {
    if (worn[item.slot]) return;

    Speech.stop();
    Speech.speak(item.fa, {
      language: 'fa-IR',
      rate: 0.65,
      pitch: 1.16,
      onDone: () => {
        setTimeout(() => Speech.speak(item.en, { language: 'en-US', rate: 0.82, pitch: 1.08 }), 220);
      },
      onError: () => Speech.speak(item.en, { language: 'en-US', rate: 0.82, pitch: 1.08 }),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.timing(neliScale, { toValue: 1.04, duration: 120, useNativeDriver: true }),
      Animated.spring(neliScale, { toValue: 1, tension: 220, friction: 6, useNativeDriver: true }),
    ]).start();

    const animationSlots: Slot[] = isBodyPairSlot(item.slot) ? ['shirt'] : [item.slot];
    if (immediate) {
      animationSlots.forEach(slot => getAnim(slot).setValue(1));
    } else {
      animationSlots.forEach(slot => getAnim(slot).setValue(0));
    }
    setWorn(prev => {
      const next = { ...prev };
      if (isHatSlot(item.slot)) {
        setSelectedExclusiveSlots(current => ({ ...current, hat: item.slot }));
        outfit.items.forEach(piece => {
          if (piece.slot !== item.slot && isHatSlot(piece.slot)) {
            next[piece.slot] = false;
            anims.current[piece.slot]?.setValue(0);
          }
        });
      }
      if (isDressSlot(item.slot)) {
        setSelectedExclusiveSlots(current => ({ ...current, dress: item.slot }));
        ['shirt', 'pants'].forEach(slot => {
          next[slot] = false;
          anims.current[slot]?.setValue(0);
        });
        outfit.items.forEach(piece => {
          if (piece.slot !== item.slot && isDressSlot(piece.slot)) {
            next[piece.slot] = false;
            anims.current[piece.slot]?.setValue(0);
          }
        });
      }
      if (isSunglassesSlot(item.slot)) {
        setSelectedExclusiveSlots(current => ({ ...current, sunglasses: item.slot }));
        outfit.items.forEach(piece => {
          if (piece.slot !== item.slot && isSunglassesSlot(piece.slot)) {
            next[piece.slot] = false;
            anims.current[piece.slot]?.setValue(0);
          }
        });
      }
      if (isShoesSlot(item.slot)) {
        setSelectedExclusiveSlots(current => ({ ...current, shoes: item.slot }));
        outfit.items.forEach(piece => {
          if (piece.slot !== item.slot && isShoesSlot(piece.slot)) {
            next[piece.slot] = false;
            anims.current[piece.slot]?.setValue(0);
          }
        });
      }
      if (isBodyPairSlot(item.slot)) {
        setSelectedExclusiveSlots(current => ({ ...current, dress: null }));
        outfit.items.forEach(piece => {
          if (isDressSlot(piece.slot)) {
            next[piece.slot] = false;
            anims.current[piece.slot]?.setValue(0);
          }
        });
        next.shirt = true;
        next.pants = true;
      }
      next[item.slot] = true;
      const hasRequiredHat = outfitHatItems.length === 0 || outfitHatItems.some(piece => next[piece.slot]);
      const hasRequiredDress = outfitDressItems.length === 0 || outfitDressItems.some(piece => next[piece.slot]);
      const hasRequiredSunglasses = outfitSunglassesItems.length === 0 || outfitSunglassesItems.some(piece => next[piece.slot]);
      const hasRequiredShoes = outfitShoesItems.length === 0 || outfitShoesItems.some(piece => next[piece.slot]);
      const hasAllOtherItems = outfit.items.every(piece => isHatSlot(piece.slot) || isDressSlot(piece.slot) || isSunglassesSlot(piece.slot) || isShoesSlot(piece.slot) || next[piece.slot]);
      if (hasRequiredHat && hasRequiredDress && hasRequiredSunglasses && hasRequiredShoes && hasAllOtherItems) {
        setTimeout(() => {
          setDone(true);
          addStars(5);
          Animated.spring(doneSlide, { toValue: 0, tension: 48, friction: 7, useNativeDriver: true }).start();
        }, 500);
      }
      return next;
    });
    if (!immediate) {
      animationSlots.forEach(slot => {
        Animated.spring(getAnim(slot), { toValue: 1, tension: 120, friction: 6, useNativeDriver: true }).start();
      });
    }
    addStars(1);
  };

  const launchFlight = (path: FlightPath) => {
    setFlight(path);
    flightAnim.setValue(0);
    Animated.timing(flightAnim, {
      toValue: 1,
      duration: 460,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      wearItem(path.item, true);
      setFlight(null);
      flightAnim.setValue(0);
    });
  };

  return (
    <View style={styles.root}>
      <TopBar title="Dress Up" titleFa="لباس پوشیدن" showClose dark topInset={10} />

      <ImageBackground source={roomBackgroundPickers.bedroom(width, height)} style={styles.main} imageStyle={styles.roomImage} resizeMode="cover">
          <View style={styles.tabShell}>
          <View style={styles.tabRow}>
            {OUTFITS.map((set, index) => {
              const active = index === outfitIdx;
              return (
                <TouchableOpacity
                  key={set.name}
                  style={[
                    styles.tab,
                    active && { backgroundColor: set.accent, borderColor: '#FFFFFF', shadowOpacity: 0.18 },
                  ]}
                  onPress={() => {
                    setOutfitIdx(index);
                    reset();
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.tabTxt, { fontFamily: ff(lang, 'black'), color: active ? '#25105C' : '#FFFFFF' }, dir(lang)]}>
                    {isFa ? set.nameFa : set.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sceneRow}>
          <View
            style={[
              styles.closet,
              draggingSlot ? styles.closetDragging : null,
              { maxWidth: isLandscape ? width * 0.48 : width * 0.46, marginLeft: width * 0.05 },
            ]}
          >
            <RackHeader />
            <View style={[styles.closetItems, { width: clothingSize * 5.8, height: clothingSize * 5.25, marginTop: height * 0.01 }]}>
              {outfit.items.map(item => {
                const isSelectedHat = isHatSlot(item.slot) && selectedHatSlot === item.slot;
                const isSelectedDress = isDressSlot(item.slot) && selectedDressSlot === item.slot;
                const isSelectedSunglasses = isSunglassesSlot(item.slot) && selectedSunglassesSlot === item.slot;
                const isSelectedShoes = isShoesSlot(item.slot) && selectedShoesSlot === item.slot;
                if (item.slot === 'pants' && outfitBodyPairItems.some(pair => pair.slot === 'shirt')) {
                  return null;
                }
                const isInactive = isHatSlot(item.slot)
                  ? isSelectedHat
                  : isDressSlot(item.slot)
                    ? isSelectedDress
                    : isSunglassesSlot(item.slot)
                      ? isSelectedSunglasses
                      : isShoesSlot(item.slot)
                        ? isSelectedShoes
                        : !!worn[item.slot];

                return (
                  <DraggableClothing
                    key={item.slot}
                    item={item}
                    isWorn={isInactive}
                    isFa={isFa}
                    lang={lang}
                    targetRef={neliTargetRef}
                    landingPoint={getLandingPoint(item.slot, imgSize)}
                    onLaunch={launchFlight}
                    onDraggingChange={(dragging) => setDraggingSlot(dragging ? item.slot : null)}
                    size={clothingSize}
                    placement={getClosetPlacement(outfit.items, item)}
                  />
                );
              })}
            </View>
          </View>

              <View
                ref={neliStageRef}
                style={[styles.neliStage, { width: imgSize, height: imgHeight }]}
                onLayout={syncNeliTarget}
              >
                <Animated.View style={{ width: imgSize, height: imgHeight, transform: [{ scale: neliScale }] }}>
                  <CharacterAvatar characterId="neli" size={imgSize} floating={false} blink={false} />
                  <View pointerEvents="none" style={styles.neliBlinkOverlay}>
                    <BlinkingNeliImage
                      size={imgSize}
                      height={imgHeight}
                      showBase={false}
                      introVisibleMs={800}
                      repeatMs={3000}
                      blinkClosedMs={700}
                      overlayOffsetX={-imgSize * 0.003}
                      overlayOffsetY={imgSize * 0.01}
                    />
                  </View>
                  {[...outfit.items].sort((a, b) => getOverlayLayer(a.slot) - getOverlayLayer(b.slot)).map(item => {
                    if (isHatSlot(item.slot)) {
                      if (selectedHatSlot !== item.slot) return null;
                    } else if (isDressSlot(item.slot)) {
                      if (selectedDressSlot !== item.slot) return null;
                    } else if (isSunglassesSlot(item.slot)) {
                      if (selectedSunglassesSlot !== item.slot) return null;
                    } else if (item.slot === 'boots') {
                      if (!worn.boots) return null;
                      return <BootsOverlay key="boots" imgSize={imgSize} anim={getAnim('boots')} />;
                    } else if (isShoesSlot(item.slot)) {
                      if (selectedShoesSlot !== item.slot) return null;
                    } else if (item.slot === 'pants' && outfitBodyPairItems.some(pair => pair.slot === 'shirt')) {
                      return null;
                    } else if (item.slot === 'shirt') {
                      if (!worn.shirt && !worn.pants) return null;
                      return <BodyPairOverlay key="shirt-pants" imgSize={imgSize} anim={getAnim('shirt')} />;
                    } else if (!worn[item.slot]) {
                      return null;
                    }
                    return <ClothingOverlay key={item.slot} item={item} imgSize={imgSize} anim={getAnim(item.slot)} />;
                  })}
                </Animated.View>
              </View>
        </View>

        <View style={styles.progressBubble}>
          <Text style={[styles.progressText, { fontFamily: ff(lang, 'bold') }]}>{wornCount}/{neededCount}</Text>
        </View>
      </ImageBackground>

      {flight ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: flight.fromX - flight.fromW / 2,
            top: flight.fromY - flight.fromH / 2,
            width: flight.fromW,
            height: flight.fromH,
            zIndex: 220,
            elevation: 220,
            overflow: 'visible',
            transform: [
              { translateX: flightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, flight.toX - flight.fromX] }) },
              { translateY: flightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, flight.toY - flight.fromY] }) },
              { scale: flightAnim.interpolate({ inputRange: [0, 1], outputRange: [1, flight.targetScale] }) },
            ],
          }}
        >
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            {renderFlyingCopy(flight.item, Math.max(72, Math.min(flight.fromW, flight.fromH)))}
          </View>
        </Animated.View>
      ) : null}

      <Animated.View style={[styles.doneCard, { transform: [{ translateY: doneSlide }] }]}>
        <Text style={[styles.doneTitle, { fontFamily: ff(lang, 'black') }, dir(lang)]}>
          {isFa ? 'نلی آماده است!' : 'Neli is dressed!'}
        </Text>
        <TouchableOpacity style={styles.doneBtn} onPress={reset}>
          <Text style={[styles.doneBtnTxt, { fontFamily: ff(lang, 'bold') }]}>{isFa ? 'دوباره' : 'Again'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#25105C' },
  main: { flex: 1, overflow: 'visible' },
  roomImage: { width: '100%', height: '100%' },
  tabShell: {
    position: 'absolute',
    top: 10,
    left: 14,
    right: 14,
    zIndex: 20,
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'nowrap',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.76)',
    shadowColor: '#1E103B',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  tab: {
    minWidth: 94,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(37,16,92,0.66)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  tabTxt: { fontSize: 11 },
  sceneRow: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 14, paddingTop: 70, gap: 10 },
  closet: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 24,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingTop: 18,
    paddingBottom: 8,
    overflow: 'visible',
  },
  closetItems: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 3,
    paddingBottom: 28,
    overflow: 'visible',
  },
  hangingItem: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 8,
      zIndex: 20,
      elevation: 20,
      backgroundColor: 'transparent',
  },
  hangingItemWornBack: {
    zIndex: 0,
    elevation: 0,
  },
  hangingItemDragging: { zIndex: 999, elevation: 999 },
  hatFront: { zIndex: 60, elevation: 60, position: 'relative' },
  hangingItemWorn: { opacity: 0.52 },
  hangerGlyph: { width: 56, height: 44, alignItems: 'center', justifyContent: 'flex-start' },
  hangerImage: { width: 56, height: 44 },
  closetDragging: { zIndex: 200, elevation: 0 },
  neliStage: { alignItems: 'center', justifyContent: 'flex-end', overflow: 'visible', zIndex: 3, elevation: 3 },
  dressBlinkImage: { position: 'absolute', zIndex: 41, elevation: 41 },
  progressBubble: {
    position: 'absolute',
    right: 14,
    bottom: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  progressText: { color: '#25105C', fontSize: 12, fontWeight: '900' },
  doneCard: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 16,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    gap: 10,
    zIndex: 100,
  },
  doneTitle: { color: '#25105C', fontSize: 20, fontWeight: '900', textAlign: 'center' },
  doneBtn: { minWidth: 150, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18, backgroundColor: '#7C3AED', alignItems: 'center' },
  doneBtnTxt: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  neliBlinkOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    elevation: 5,
  },
  waterGlyph: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  waterDrop: {
    width: 10,
    height: 13,
    borderWidth: 2,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
  },
  waterRipple: { width: 10, height: 3, borderRadius: 999, marginTop: 1 },
});
