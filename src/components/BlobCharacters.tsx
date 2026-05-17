/**
 * BLOB CHARACTERS — Duolingo-style
 * Flat colored shapes, no outlines, huge googly eyes, very simple & expressive
 */
import React, { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import Svg, {
  Circle, Ellipse, Path, Line, Polygon, Rect, G, Text as SvgText
} from 'react-native-svg';

// Animated SVG wrapper components for Neli
const AnimatedG        = Animated.createAnimatedComponent(G);
const AnimatedEllipse  = Animated.createAnimatedComponent(Ellipse);
const AnimatedSvgText  = Animated.createAnimatedComponent(SvgText);

// ─── DARA — Orange Lion ───────────────────────────────────────────────────────
export function DaraSVG({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 210">
      {/* Ears */}
      <Ellipse cx="52" cy="54" rx="24" ry="28" fill="#E07A00"/>
      <Ellipse cx="148" cy="54" rx="24" ry="28" fill="#E07A00"/>
      <Ellipse cx="52" cy="56" rx="13" ry="17" fill="#FFBB6A"/>
      <Ellipse cx="148" cy="56" rx="13" ry="17" fill="#FFBB6A"/>
      {/* Mane blobs */}
      <Ellipse cx="100" cy="118" rx="72" ry="70" fill="#D06800"/>
      <Ellipse cx="60" cy="76" rx="30" ry="30" fill="#C05800"/>
      <Ellipse cx="140" cy="76" rx="30" ry="30" fill="#C05800"/>
      <Ellipse cx="44" cy="108" rx="24" ry="26" fill="#B04800"/>
      <Ellipse cx="156" cy="108" rx="24" ry="26" fill="#B04800"/>
      {/* Head */}
      <Ellipse cx="100" cy="114" rx="60" ry="58" fill="#FFCC70"/>
      {/* Muzzle */}
      <Ellipse cx="100" cy="138" rx="32" ry="24" fill="#FFE9A0"/>
      {/* Eyes — big googly */}
      <Circle cx="78" cy="102" r="21" fill="white"/>
      <Circle cx="122" cy="102" r="21" fill="white"/>
      <Circle cx="82" cy="106" r="13" fill="#1A0800"/>
      <Circle cx="126" cy="106" r="13" fill="#1A0800"/>
      <Circle cx="87" cy="101" r="5" fill="white"/>
      <Circle cx="131" cy="101" r="5" fill="white"/>
      {/* Nose */}
      <Ellipse cx="100" cy="128" rx="8" ry="6" fill="#B05000"/>
      {/* Big smile */}
      <Path d="M74 142 Q100 162 126 142" stroke="#904000" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <Ellipse cx="62" cy="130" rx="14" ry="10" fill="#FF9060" opacity="0.55"/>
      <Ellipse cx="138" cy="130" rx="14" ry="10" fill="#FF9060" opacity="0.55"/>
      {/* Body paws */}
      <Ellipse cx="56" cy="192" rx="28" ry="18" fill="#E07A00"/>
      <Ellipse cx="144" cy="192" rx="28" ry="18" fill="#E07A00"/>
      <Ellipse cx="56" cy="192" rx="18" ry="11" fill="#FFCC70"/>
      <Ellipse cx="144" cy="192" rx="18" ry="11" fill="#FFCC70"/>
      <Circle cx="46" cy="188" r="5" fill="#FFBB6A"/>
      <Circle cx="56" cy="185" r="5" fill="#FFBB6A"/>
      <Circle cx="66" cy="188" r="5" fill="#FFBB6A"/>
      <Circle cx="134" cy="188" r="5" fill="#FFBB6A"/>
      <Circle cx="144" cy="185" r="5" fill="#FFBB6A"/>
      <Circle cx="154" cy="188" r="5" fill="#FFBB6A"/>
    </Svg>
  );
}

// ─── SHIRIN — Pink Butterfly ──────────────────────────────────────────────────
export function ShinrinSVG({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 210">
      {/* Wings */}
      <Ellipse cx="28" cy="110" rx="30" ry="50" fill="#FF70CC" opacity="0.85" rotation="-15" originX="28" originY="110"/>
      <Ellipse cx="172" cy="110" rx="30" ry="50" fill="#FF70CC" opacity="0.85" rotation="15" originX="172" originY="110"/>
      <Ellipse cx="34" cy="108" rx="17" ry="31" fill="#FFC0E8" opacity="0.7" rotation="-15" originX="34" originY="108"/>
      <Ellipse cx="166" cy="108" rx="17" ry="31" fill="#FFC0E8" opacity="0.7" rotation="15" originX="166" originY="108"/>
      {/* Antennae */}
      <Line x1="86" y1="44" x2="68" y2="14" stroke="#CC3388" strokeWidth="4" strokeLinecap="round"/>
      <Circle cx="66" cy="12" r="9" fill="#FF1493"/>
      <Line x1="114" y1="44" x2="132" y2="14" stroke="#CC3388" strokeWidth="4" strokeLinecap="round"/>
      <Circle cx="134" cy="12" r="9" fill="#FF40A8"/>
      {/* Body */}
      <Ellipse cx="100" cy="164" rx="38" ry="44" fill="#CC40AA"/>
      {/* Hair */}
      <Ellipse cx="46" cy="88" rx="16" ry="34" fill="#5A2000"/>
      <Ellipse cx="154" cy="88" rx="16" ry="34" fill="#5A2000"/>
      <Ellipse cx="100" cy="62" rx="62" ry="30" fill="#5A2000"/>
      {/* Flower */}
      <Circle cx="56" cy="52" r="13" fill="#FF1493"/>
      <Circle cx="56" cy="52" r="7" fill="#FFD700"/>
      {/* Head */}
      <Ellipse cx="100" cy="100" rx="62" ry="60" fill="#FFE8CC"/>
      {/* Googly eyes */}
      <Circle cx="76" cy="96" r="22" fill="white"/>
      <Circle cx="124" cy="96" r="22" fill="white"/>
      <Circle cx="80" cy="101" r="14" fill="#1A0800"/>
      <Circle cx="128" cy="101" r="14" fill="#1A0800"/>
      <Circle cx="80" cy="101" r="7" fill="#8B1A6B"/>
      <Circle cx="128" cy="101" r="7" fill="#8B1A6B"/>
      <Circle cx="86" cy="96" r="5.5" fill="white"/>
      <Circle cx="134" cy="96" r="5.5" fill="white"/>
      {/* Lashes */}
      <Line x1="60" y1="79" x2="56" y2="70" stroke="#1A0800" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="69" y1="76" x2="68" y2="67" stroke="#1A0800" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="78" y1="75" x2="79" y2="66" stroke="#1A0800" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Nose */}
      <Circle cx="100" cy="114" r="5" fill="#CC7090"/>
      {/* Smile */}
      <Path d="M76 124 Q100 142 124 124" stroke="#CC2280" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <Ellipse cx="58" cy="116" rx="15" ry="10" fill="#FFB0CC" opacity="0.6"/>
      <Ellipse cx="142" cy="116" rx="15" ry="10" fill="#FFB0CC" opacity="0.6"/>
    </Svg>
  );
}

// ─── ARASH — Teal Eagle ───────────────────────────────────────────────────────
export function ArashSVG({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 210">
      {/* Cape */}
      <Path d="M34 142 Q38 100 100 96 Q162 100 166 142 Q158 206 100 208 Q42 206 34 142" fill="#0A7A6A"/>
      {/* Star on cape */}
      <Polygon points="100,114 106,130 124,130 110,140 116,156 100,146 84,156 90,140 76,130 94,130" fill="#FFD700" opacity="0.6"/>
      {/* Hair feathers */}
      <Path d="M70 48 Q68 24 80 18 Q82 36 76 50" fill="#4ECDC4"/>
      <Path d="M84 44 Q85 20 96 16 Q97 34 90 47" fill="#2EADA4"/>
      <Path d="M114 44 Q115 20 104 16 Q103 34 110 47" fill="#4ECDC4"/>
      {/* Head */}
      <Ellipse cx="100" cy="96" rx="60" ry="60" fill="#FFE0B0"/>
      {/* Hair mass */}
      <Path d="M42 80 Q44 42 100 38 Q156 42 158 80 Q148 50 100 48 Q52 50 42 80" fill="#1A0800"/>
      {/* Eyes — confident/determined narrowed */}
      <Circle cx="76" cy="90" r="20" fill="white"/>
      <Circle cx="124" cy="90" r="20" fill="white"/>
      {/* Squint lid — half covers top */}
      <Path d="M56 80 Q76 72 96 80" fill="#FFE0B0"/>
      <Path d="M104 80 Q124 72 144 80" fill="#FFE0B0"/>
      <Circle cx="80" cy="94" r="13" fill="#1A2A2A"/>
      <Circle cx="128" cy="94" r="13" fill="#1A2A2A"/>
      <Circle cx="80" cy="94" r="6" fill="#4ECDC4"/>
      <Circle cx="128" cy="94" r="6" fill="#4ECDC4"/>
      <Circle cx="85" cy="89" r="4.5" fill="white"/>
      <Circle cx="133" cy="89" r="4.5" fill="white"/>
      {/* Strong brows */}
      <Path d="M58 74 Q76 66 96 74" stroke="#1A0800" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
      <Path d="M104 74 Q124 66 142 74" stroke="#1A0800" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <Path d="M95 106 Q100 116 105 106" stroke="#B07040" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Smile */}
      <Path d="M74 118 Q100 138 126 118" stroke="#905030" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Cheeks faint */}
      <Ellipse cx="58" cy="108" rx="13" ry="9" fill="#FFAA80" opacity="0.4"/>
      <Ellipse cx="142" cy="108" rx="13" ry="9" fill="#FFAA80" opacity="0.4"/>
      {/* Wristbands */}
      <Ellipse cx="32" cy="168" rx="20" ry="16" fill="#FFE0B0"/>
      <Ellipse cx="168" cy="168" rx="20" ry="16" fill="#FFE0B0"/>
      <Ellipse cx="32" cy="160" rx="20" ry="9" fill="#4ECDC4"/>
      <Ellipse cx="168" cy="160" rx="20" ry="9" fill="#4ECDC4"/>
    </Svg>
  );
}

// ─── GOLNAZ — Red Garden Girl ─────────────────────────────────────────────────
export function GolnazSVG({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 210">
      {/* Dress */}
      <Path d="M38 150 Q42 110 100 106 Q158 110 162 150 Q158 208 100 212 Q42 208 38 150" fill="#E74C3C"/>
      <Circle cx="82" cy="152" r="7" fill="white" opacity="0.22"/>
      <Circle cx="100" cy="164" r="6" fill="white" opacity="0.18"/>
      <Circle cx="118" cy="152" r="7" fill="white" opacity="0.22"/>
      {/* Hair */}
      <Path d="M40 90 Q42 44 100 40 Q158 44 160 90 Q150 58 100 56 Q50 58 40 90" fill="#2E0A00"/>
      <Ellipse cx="42" cy="106" rx="14" ry="30" fill="#2E0A00"/>
      <Ellipse cx="158" cy="106" rx="14" ry="30" fill="#2E0A00"/>
      {/* Head */}
      <Ellipse cx="100" cy="98" rx="62" ry="62" fill="#FFDAB8"/>
      {/* Flower crown */}
      <Circle cx="52" cy="52" r="14" fill="#FF3300"/><Circle cx="52" cy="52" r="8" fill="#FFD700"/>
      <Circle cx="74" cy="38" r="14" fill="#FF69B4"/><Circle cx="74" cy="38" r="8" fill="#FFD700"/>
      <Circle cx="100" cy="34" r="14" fill="#FF1493"/><Circle cx="100" cy="34" r="8" fill="#FFD700"/>
      <Circle cx="126" cy="38" r="14" fill="#FF3300"/><Circle cx="126" cy="38" r="8" fill="#FFD700"/>
      <Circle cx="148" cy="52" r="14" fill="#FF69B4"/><Circle cx="148" cy="52" r="8" fill="#FFD700"/>
      {/* Eyes — HUGE warm */}
      <Circle cx="74" cy="92" r="24" fill="white"/>
      <Circle cx="126" cy="92" r="24" fill="white"/>
      <Circle cx="78" cy="97" r="15" fill="#1A0800"/>
      <Circle cx="130" cy="97" r="15" fill="#1A0800"/>
      <Circle cx="78" cy="97" r="7" fill="#6B2A00"/>
      <Circle cx="130" cy="97" r="7" fill="#6B2A00"/>
      <Circle cx="85" cy="91" r="6" fill="white"/>
      <Circle cx="137" cy="91" r="6" fill="white"/>
      {/* Lashes */}
      <Line x1="56" y1="74" x2="52" y2="64" stroke="#1A0800" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="65" y1="70" x2="64" y2="61" stroke="#1A0800" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="74" y1="69" x2="75" y2="60" stroke="#1A0800" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Nose */}
      <Circle cx="100" cy="111" r="5.5" fill="#C07050"/>
      {/* Big smile */}
      <Path d="M70 124 Q100 150 130 124" stroke="#B02020" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      {/* Rosy cheeks */}
      <Ellipse cx="52" cy="112" rx="17" ry="13" fill="#FF7080" opacity="0.58"/>
      <Ellipse cx="148" cy="112" rx="17" ry="13" fill="#FF7080" opacity="0.58"/>
    </Svg>
  );
}

// ─── SABA — Yellow Owl ────────────────────────────────────────────────────────
export function SabaSVG({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 210">
      {/* Wings */}
      <Ellipse cx="38" cy="158" rx="28" ry="42" fill="#B07A00" rotation="-12" originX="38" originY="158"/>
      <Ellipse cx="162" cy="158" rx="28" ry="42" fill="#B07A00" rotation="12" originX="162" originY="158"/>
      {/* Body */}
      <Ellipse cx="100" cy="168" rx="54" ry="50" fill="#D4920A"/>
      {/* Belly */}
      <Ellipse cx="100" cy="176" rx="36" ry="38" fill="#FFF8CC"/>
      {/* Head */}
      <Ellipse cx="100" cy="98" rx="64" ry="64" fill="#F0C030"/>
      {/* Ear tufts */}
      <Path d="M56 50 L46 22 L72 44" fill="#B07A00"/>
      <Path d="M144 50 L154 22 L128 44" fill="#B07A00"/>
      {/* Grad cap */}
      <Rect x="50" y="28" width="100" height="15" rx="5" fill="#1A2A3A"/>
      <Rect x="76" y="14" width="48" height="18" rx="4" fill="#1A2A3A"/>
      <Line x1="150" y1="28" x2="162" y2="52" stroke="#FFD700" strokeWidth="3.5" strokeLinecap="round"/>
      <Circle cx="163" cy="56" r="8" fill="#FFD700"/>
      {/* Face disc */}
      <Ellipse cx="100" cy="108" rx="52" ry="46" fill="#FFE880"/>
      {/* GLASSES + googly eyes */}
      <Circle cx="74" cy="102" r="23" fill="white"/>
      <Circle cx="126" cy="102" r="23" fill="white"/>
      <Circle cx="74" cy="102" r="23" fill="none" stroke="#6B4A1A" strokeWidth="4.5"/>
      <Circle cx="126" cy="102" r="23" fill="none" stroke="#6B4A1A" strokeWidth="4.5"/>
      <Line x1="97" y1="102" x2="103" y2="102" stroke="#6B4A1A" strokeWidth="4.5"/>
      <Circle cx="78" cy="106" r="14" fill="#1A1200"/>
      <Circle cx="130" cy="106" r="14" fill="#1A1200"/>
      <Circle cx="83" cy="101" r="5.5" fill="white"/>
      <Circle cx="135" cy="101" r="5.5" fill="white"/>
      {/* Beak */}
      <Path d="M88 122 L100 140 L112 122 Q100 132 88 122" fill="#E07800"/>
      {/* Feet */}
      <Path d="M72 210 L64 222 M72 210 L72 222 M72 210 L80 222" stroke="#B07A00" strokeWidth="5" strokeLinecap="round"/>
      <Path d="M128 210 L120 222 M128 210 L128 222 M128 210 L136 222" stroke="#B07A00" strokeWidth="5" strokeLinecap="round"/>
    </Svg>
  );
}

// ─── NASIM — Cyan Dolphin ─────────────────────────────────────────────────────
export function NasimSVG({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 210">
      {/* Tail fluke */}
      <Path d="M28 164 Q10 184 16 202 Q36 184 54 196 Q46 174 28 164" fill="#0070AA"/>
      {/* Body blob */}
      <Ellipse cx="114" cy="152" rx="70" ry="54" fill="#22BBFF"/>
      {/* Belly */}
      <Ellipse cx="118" cy="160" rx="48" ry="34" fill="#C0EEFF"/>
      {/* Dorsal fin */}
      <Path d="M118 96 Q138 72 146 98 Q136 94 118 96" fill="#0090CC"/>
      {/* Pectoral fin */}
      <Path d="M52 152 Q28 132 36 110 Q48 134 52 152" fill="#0090CC"/>
      {/* Head */}
      <Ellipse cx="140" cy="112" rx="58" ry="58" fill="#22BBFF"/>
      {/* Snout */}
      <Ellipse cx="184" cy="118" rx="24" ry="18" fill="#22BBFF"/>
      {/* Smile */}
      <Path d="M166 126 Q182 136 196 126" stroke="#0090CC" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Blowhole */}
      <Ellipse cx="128" cy="62" rx="10" ry="7" fill="#0090CC"/>
      {/* Water spray */}
      <Path d="M126 58 Q120 42 124 30" stroke="#B0E8FF" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <Path d="M132 56 Q132 40 130 28" stroke="#B0E8FF" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <Path d="M138 60 Q144 46 140 34" stroke="#B0E8FF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* ONE big googly eye */}
      <Circle cx="152" cy="96" r="26" fill="white"/>
      <Circle cx="156" cy="101" r="16" fill="#002A80"/>
      <Circle cx="156" cy="101" r="8" fill="#0044CC"/>
      <Circle cx="163" cy="94" r="6.5" fill="white"/>
      <Circle cx="152" cy="112" r="3" fill="white"/>
      {/* Cheek blush */}
      <Ellipse cx="176" cy="118" rx="13" ry="9" fill="#7DD8FF" opacity="0.5"/>
      {/* Musical notes */}
      <SvgText x="18" y="78" fontSize="28" fill="#0090CC" opacity="0.65">♪</SvgText>
      <SvgText x="40" y="50" fontSize="20" fill="#22BBFF" opacity="0.5">♫</SvgText>
    </Svg>
  );
}

// ─── ROSTAMI — Red Tiger ──────────────────────────────────────────────────────
export function RostamiSVG({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 210">
      {/* Body */}
      <Path d="M32 150 Q36 108 100 104 Q164 108 168 150 Q164 208 100 212 Q36 208 32 150" fill="#E74C3C"/>
      {/* Stripes on body */}
      <Path d="M70 116 Q66 150 68 184" stroke="#C0392B" strokeWidth="5.5" fill="none" opacity="0.55" strokeLinecap="round"/>
      <Path d="M100 112 L100 190" stroke="#C0392B" strokeWidth="5.5" fill="none" opacity="0.55" strokeLinecap="round"/>
      <Path d="M130 116 Q134 150 132 184" stroke="#C0392B" strokeWidth="5.5" fill="none" opacity="0.55" strokeLinecap="round"/>
      {/* Head */}
      <Ellipse cx="100" cy="98" rx="62" ry="62" fill="#FF9840"/>
      {/* Face stripes */}
      <Path d="M40 80 Q46 98 38 116" stroke="#D06800" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
      <Path d="M160 80 Q154 98 162 116" stroke="#D06800" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
      <Path d="M55 56 Q57 70 52 84" stroke="#D06800" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <Path d="M145 56 Q143 70 148 84" stroke="#D06800" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      {/* Ears */}
      <Path d="M50 52 L36 24 L68 46" fill="#FF9840"/>
      <Path d="M150 52 L164 24 L132 46" fill="#FF9840"/>
      <Path d="M52 50 L42 28 L66 46" fill="#FF7070"/>
      <Path d="M148 50 L158 28 L134 46" fill="#FF7070"/>
      {/* Headband */}
      <Path d="M40 72 Q100 57 160 72" stroke="#C0392B" strokeWidth="13" fill="none" strokeLinecap="round"/>
      <Path d="M40 72 Q100 57 160 72" stroke="#FF7070" strokeWidth="7" fill="none" strokeLinecap="round"/>
      {/* Googly eyes */}
      <Circle cx="74" cy="96" r="22" fill="white"/>
      <Circle cx="126" cy="96" r="22" fill="white"/>
      <Circle cx="78" cy="101" r="14" fill="#1A0800"/>
      <Circle cx="130" cy="101" r="14" fill="#1A0800"/>
      <Circle cx="83" cy="96" r="5.5" fill="white"/>
      <Circle cx="135" cy="96" r="5.5" fill="white"/>
      {/* Power brows */}
      <Path d="M56 78 Q74 68 94 78" stroke="#1A0800" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <Path d="M106 78 Q126 68 144 78" stroke="#1A0800" strokeWidth="6" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <Ellipse cx="100" cy="114" rx="9" ry="7" fill="#B05000"/>
      {/* Grin */}
      <Path d="M70 128 Q100 150 130 128" stroke="#1A0800" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <Ellipse cx="54" cy="116" rx="15" ry="11" fill="#FFAA80" opacity="0.5"/>
      <Ellipse cx="146" cy="116" rx="15" ry="11" fill="#FFAA80" opacity="0.5"/>
      {/* Fists */}
      <Ellipse cx="24" cy="156" rx="22" ry="18" fill="#FF9840"/>
      <Ellipse cx="176" cy="156" rx="22" ry="18" fill="#FF9840"/>
      <Rect x="12" y="144" width="28" height="10" rx="5" fill="#E74C3C"/>
      <Rect x="160" y="144" width="28" height="10" rx="5" fill="#E74C3C"/>
    </Svg>
  );
}

// ─── LUNA — Purple Bunny ──────────────────────────────────────────────────────
export function LunaSVG({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 210">
      {/* Tall ears */}
      <Ellipse cx="64" cy="32" rx="22" ry="42" fill="#B8A0FF"/>
      <Ellipse cx="136" cy="32" rx="22" ry="42" fill="#B8A0FF"/>
      <Ellipse cx="64" cy="32" rx="12" ry="30" fill="#FFB6DA"/>
      <Ellipse cx="136" cy="32" rx="12" ry="30" fill="#FFB6DA"/>
      {/* Moon crescent on ear */}
      <Path d="M126 14 Q146 22 142 40 Q130 26 126 14" fill="#FFD700" opacity="0.95"/>
      {/* Body */}
      <Ellipse cx="100" cy="170" rx="54" ry="52" fill="#7C6BD6"/>
      {/* Stars on body */}
      <Circle cx="82" cy="164" r="4.5" fill="#FFD700" opacity="0.85"/>
      <Circle cx="100" cy="178" r="3.5" fill="#FFD700" opacity="0.75"/>
      <Circle cx="118" cy="160" r="4" fill="#FFD700" opacity="0.8"/>
      {/* Head */}
      <Ellipse cx="100" cy="106" rx="66" ry="66" fill="#EDE0FF"/>
      {/* HUGE dreamy eyes */}
      <Circle cx="72" cy="100" r="26" fill="white"/>
      <Circle cx="128" cy="100" r="26" fill="white"/>
      <Circle cx="76" cy="106" r="17" fill="#3A2090"/>
      <Circle cx="132" cy="106" r="17" fill="#3A2090"/>
      <Circle cx="76" cy="106" r="9" fill="#1A0A3A"/>
      <Circle cx="132" cy="106" r="9" fill="#1A0A3A"/>
      <Circle cx="85" cy="98" r="6.5" fill="white"/>
      <Circle cx="141" cy="98" r="6.5" fill="white"/>
      <Circle cx="70" cy="114" r="3" fill="white"/>
      <Circle cx="126" cy="114" r="3" fill="white"/>
      {/* Long lashes */}
      <Line x1="50" y1="82" x2="46" y2="73" stroke="#3A2090" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="59" y1="78" x2="57" y2="69" stroke="#3A2090" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="70" y1="75" x2="70" y2="66" stroke="#3A2090" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="80" y1="75" x2="83" y2="66" stroke="#3A2090" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="108" y1="75" x2="106" y2="66" stroke="#3A2090" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="118" y1="75" x2="120" y2="66" stroke="#3A2090" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="129" y1="78" x2="132" y2="69" stroke="#3A2090" strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="140" y1="82" x2="144" y2="73" stroke="#3A2090" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Nose */}
      <Ellipse cx="100" cy="122" rx="6.5" ry="5" fill="#B090D8"/>
      {/* Gentle smile */}
      <Path d="M76 134 Q100 154 124 134" stroke="#8060C0" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Big rosy cheeks */}
      <Ellipse cx="50" cy="118" rx="18" ry="13" fill="#FFB6DA" opacity="0.6"/>
      <Ellipse cx="150" cy="118" rx="18" ry="13" fill="#FFB6DA" opacity="0.6"/>
      {/* Moon necklace */}
      <Path d="M72 140 Q100 135 128 140" stroke="#FFD700" strokeWidth="2.5" fill="none"/>
      <Path d="M95 142 Q100 150 105 142 Q100 136 95 142" fill="#FFD700"/>
      {/* Paw hands */}
      <Ellipse cx="24" cy="162" rx="20" ry="16" fill="#EDE0FF"/>
      <Ellipse cx="176" cy="162" rx="20" ry="16" fill="#EDE0FF"/>
      <Circle cx="18" cy="156" r="8" fill="#B8A0FF"/>
      <Circle cx="24" cy="153" r="8" fill="#B8A0FF"/>
      <Circle cx="30" cy="156" r="8" fill="#B8A0FF"/>
      <Circle cx="170" cy="156" r="8" fill="#B8A0FF"/>
      <Circle cx="176" cy="153" r="8" fill="#B8A0FF"/>
      <Circle cx="182" cy="156" r="8" fill="#B8A0FF"/>
    </Svg>
  );
}


// ─── NELI — Pixel-perfect rainbow curly-hair cat (matches reference image) ────
// Purple lavender skin, yellow dress, rainbow swirl curls, waving paw
const neliImage = require('../../assets/neli.png');

function NeliReferenceImageSVG({ size = 120, animate = true }: { size?: number; animate?: boolean }) {
  const bounce      = useRef(new Animated.Value(0)).current;
  const sway        = useRef(new Animated.Value(0)).current;
  const heartPop    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;

    // Gentle float up/down
    Animated.loop(Animated.sequence([
      Animated.timing(bounce,      { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(bounce,      { toValue: 0, duration: 1200, useNativeDriver: true }),
    ])).start();

    // Subtle left/right sway
    Animated.loop(Animated.sequence([
      Animated.timing(sway,        { toValue: 1, duration: 1600, useNativeDriver: true }),
      Animated.timing(sway,        { toValue: 0, duration: 1600, useNativeDriver: true }),
    ])).start();

    // Heart pops up every few seconds
    Animated.loop(Animated.sequence([
      Animated.delay(2200),
      Animated.timing(heartPop,    { toValue: 1, duration: 800,  useNativeDriver: true }),
      Animated.timing(heartPop,    { toValue: 0, duration: 500,  useNativeDriver: true }),
      Animated.delay(1000),
    ])).start();
  }, [animate]);

  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
  const rotate     = sway.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] });
  const heartY     = heartPop.interpolate({ inputRange: [0, 1], outputRange: [0, -50] });
  const heartO     = heartPop.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 0.4, 0] });

  const imgW = size;
  const imgH = size * (539 / 397); // preserve original aspect ratio

  return (
    <View style={{ width: imgW, height: imgH + 20, alignItems: 'center', justifyContent: 'flex-end' }}>

      {/* Neli image — floats + sways */}
      <Animated.Image
        source={neliImage}
        style={{
          width: imgW,
          height: imgH,
          position: 'absolute',
          bottom: 14,
          transform: [{ translateY }, { rotate }],
        }}
        resizeMode="contain"
      />

      {/* Floating heart */}
      <Animated.Text style={{
        position: 'absolute',
        right: imgW * 0.05,
        bottom: imgH * 0.55,
        fontSize: size * 0.14,
        transform: [{ translateY: heartY }],
        opacity: heartO,
      }}>💜</Animated.Text>

    </View>
  );
}

export const NeliSVG = NeliReferenceImageSVG;

function NeliCleanSvgDraft({ size = 120, animate = true }: { size?: number; animate?: boolean }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    Animated.loop(Animated.sequence([
      Animated.timing(bounce, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 0, duration: 1200, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1600, useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1600, useNativeDriver: true }),
    ])).start();
  }, [animate]);

  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const rotate = sway.interpolate({ inputRange: [0, 1], outputRange: ['-2.5deg', '2.5deg'] });
  const h = size * 1.28;

  return (
    <View style={{ width: size, height: h + 10, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Animated.View style={{ position: 'absolute', bottom: 8, transform: [{ translateY }, { rotate }] }}>
        <Svg width={size} height={h} viewBox="0 0 220 280">
          <Path d="M158 167 C199 158 216 189 188 209 C176 218 165 210 173 199 C185 184 173 174 157 181 Z" fill="#A875E7"/>
          <Path d="M75 148 C70 177 57 220 53 263 C79 276 140 276 166 263 C162 220 149 177 145 148 Z" fill="#FFD136"/>
          <Path d="M83 155 C78 184 69 220 68 258" stroke="#F2B914" strokeWidth="5" strokeLinecap="round" opacity="0.45"/>
          <Path d="M74 176 C48 188 40 216 56 226 C72 236 82 213 92 192 Z" fill="#A875E7"/>
          <Path d="M146 177 C175 181 197 161 202 141 C207 121 190 113 180 130 C172 146 159 156 143 157 Z" fill="#A875E7"/>
          <Ellipse cx="195" cy="136" rx="15" ry="13" fill="#B98AF0"/>
          <Ellipse cx="197" cy="135" rx="6" ry="5" fill="#FFC4DF"/>
          <Circle cx="187" cy="128" r="4" fill="#FFC4DF"/>
          <Circle cx="203" cy="126" r="4" fill="#FFC4DF"/>

          <Circle cx="55" cy="72" r="28" fill="#9EE6CE"/>
          <Circle cx="91" cy="50" r="31" fill="#FFD665"/>
          <Circle cx="131" cy="50" r="31" fill="#A979E6"/>
          <Circle cx="165" cy="73" r="27" fill="#FFD665"/>
          <Circle cx="36" cy="105" r="24" fill="#FF92A7"/>
          <Circle cx="184" cy="107" r="25" fill="#8BE1C4"/>
          <Circle cx="83" cy="91" r="25" fill="#8AC5F4"/>
          <Circle cx="116" cy="84" r="26" fill="#89CAF6"/>
          <Circle cx="137" cy="95" r="23" fill="#FFE45C"/>
          <Path d="M48 70 C58 55 76 62 69 78 C65 87 54 83 58 75" stroke="#56BDA9" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <Path d="M88 45 C105 38 115 54 104 66 C97 73 88 66 95 58" stroke="#F4A629" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <Path d="M128 46 C146 39 157 55 146 68 C138 77 128 68 137 60" stroke="#8555D1" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <Path d="M169 73 C184 66 194 82 184 93 C177 101 168 92 176 85" stroke="#F4A629" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <Path d="M40 104 C52 95 64 108 55 119 C48 126 40 117 47 111" stroke="#D75F78" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <Path d="M187 107 C200 98 212 112 202 124 C194 131 187 121 195 116" stroke="#46B79F" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <Path d="M118 84 C132 76 144 91 133 103 C126 110 117 101 125 95" stroke="#57A9DD" strokeWidth="7" fill="none" strokeLinecap="round"/>

          <Path d="M53 112 L71 73 L92 113 Z" fill="#A875E7"/>
          <Path d="M128 113 L150 73 L168 112 Z" fill="#A875E7"/>
          <Path d="M64 106 L73 87 L84 106 Z" fill="#8B4FC8"/>
          <Path d="M138 106 L149 87 L158 106 Z" fill="#8B4FC8"/>

          <Ellipse cx="110" cy="126" rx="75" ry="67" fill="#A875E7"/>
          <Ellipse cx="67" cy="137" rx="14" ry="10" fill="#C392F0" opacity="0.6"/>
          <Ellipse cx="153" cy="137" rx="14" ry="10" fill="#C392F0" opacity="0.6"/>

          <Circle cx="82" cy="121" r="26" fill="#FFF8FF"/>
          <Circle cx="139" cy="121" r="26" fill="#FFF8FF"/>
          <Circle cx="86" cy="124" r="15" fill="#1E1730"/>
          <Circle cx="142" cy="124" r="15" fill="#1E1730"/>
          <Circle cx="92" cy="116" r="5" fill="#FFFFFF"/>
          <Circle cx="148" cy="116" r="5" fill="#FFFFFF"/>
          <Path d="M55 112 C48 110 44 106 41 101" stroke="#1E1730" strokeWidth="4" strokeLinecap="round"/>
          <Path d="M165 112 C173 110 177 106 180 101" stroke="#1E1730" strokeWidth="4" strokeLinecap="round"/>

          <Ellipse cx="111" cy="140" rx="9" ry="6" fill="#FF9F2E"/>
          <Path d="M111 147 L111 156" stroke="#4C2D66" strokeWidth="4" strokeLinecap="round"/>
          <Path d="M92 157 C99 174 122 174 129 157 Z" fill="#342240"/>
          <Path d="M102 169 C110 176 121 175 126 167 C118 165 110 166 102 169 Z" fill="#F06472"/>

          <Path d="M83 258 C81 273 95 276 105 269 L105 237 L87 237 Z" fill="#A875E7"/>
          <Path d="M133 258 C135 273 121 276 111 269 L111 237 L129 237 Z" fill="#A875E7"/>
          <Path d="M80 267 C88 273 97 273 105 268" stroke="#7B47B8" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
          <Path d="M136 267 C128 273 119 273 111 268" stroke="#7B47B8" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
        </Svg>
      </Animated.View>
    </View>
  );
}

// ─── EXPORT MAP ──────────────────────────────────────────────────────────────
export const CHARACTER_SVGS: Record<string, React.ComponentType<{ size?: number }>> = {
  dara: DaraSVG,
  shirin: ShinrinSVG,
  arash: ArashSVG,
  golnaz: GolnazSVG,
  saba: SabaSVG,
  nasim: NasimSVG,
  rostami: RostamiSVG,
  luna: LunaSVG,
  neli: NeliSVG,
};
