import React from 'react';
import Svg, { Circle, G, Line, Path, Polygon, Rect } from 'react-native-svg';

export type KidIconName =
  | 'talk' | 'tooth' | 'letters' | 'animal' | 'room' | 'dress' | 'cooking'
  | 'write' | 'colors' | 'video' | 'story' | 'baby' | 'move'
  | 'memory' | 'quiz' | 'counting' | 'culture' | 'routine' | 'feed' | 'play'
  | 'home' | 'games' | 'profile' | 'learn';

type Props = {
  name: KidIconName;
  size?: number;
  color?: string;
  softColor?: string;
};

export default function KidIcon({ name, size = 44, color = '#5C6BFF', softColor = '#FFFFFF' }: Props) {
  const stroke = color;
  const fill = softColor;
  const strokeProps = { stroke, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  const icon = (() => {
    switch (name) {
      case 'talk':
        return (
          <G>
            <Path d="M18 18h60a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14H46L27 82V68h-9A14 14 0 0 1 4 54V32a14 14 0 0 1 14-14z" fill={fill} {...strokeProps} />
            <Circle cx="32" cy="43" r="4" fill={stroke} />
            <Circle cx="48" cy="43" r="4" fill={stroke} />
            <Circle cx="64" cy="43" r="4" fill={stroke} />
          </G>
        );
      case 'tooth':
        return <Path d="M28 13c8 0 12 6 20 6s12-6 20-6c13 0 21 11 17 27L74 81c-2 8-12 8-14 0l-5-20c-2-7-12-7-14 0l-5 20c-2 8-12 8-14 0L11 40C7 24 15 13 28 13z" fill={fill} {...strokeProps} />;
      case 'letters':
        return (
          <G>
            <Rect x="12" y="16" width="72" height="64" rx="14" fill={fill} {...strokeProps} />
            <Path d="M30 63l11-30 11 30M35 52h12M61 34h10a8 8 0 0 1 0 16H61zM61 50h12a7 7 0 0 1 0 14H61z" fill="none" {...strokeProps} />
          </G>
        );
      case 'animal':
        return (
          <G>
            <Circle cx="48" cy="52" r="28" fill={fill} {...strokeProps} />
            <Circle cx="28" cy="24" r="11" fill={fill} {...strokeProps} />
            <Circle cx="68" cy="24" r="11" fill={fill} {...strokeProps} />
            <Circle cx="38" cy="49" r="4" fill={stroke} />
            <Circle cx="58" cy="49" r="4" fill={stroke} />
            <Path d="M43 61c3 3 7 3 10 0" fill="none" {...strokeProps} />
          </G>
        );
      case 'room':
      case 'home':
        return (
          <G>
            <Path d="M12 45L48 16l36 29" fill="none" {...strokeProps} />
            <Path d="M21 42v39h54V42" fill={fill} {...strokeProps} />
            <Rect x="40" y="56" width="16" height="25" rx="5" fill="#fff" stroke={stroke} strokeWidth="5" />
          </G>
        );
      case 'dress':
        return (
          <G>
            <Path d="M36 15h24l8 12-8 11v42H36V38L28 27z" fill={fill} {...strokeProps} />
            <Path d="M36 38h24M41 16c1 8 13 8 14 0" fill="none" {...strokeProps} />
          </G>
        );
      case 'cooking':
        return (
          <G>
            <Path d="M27 39h42v17a21 21 0 0 1-42 0z" fill={fill} {...strokeProps} />
            <Path d="M24 39h48M34 25c0-8 10-8 10-16M51 25c0-8 10-8 10-16" fill="none" {...strokeProps} />
          </G>
        );
      case 'write':
        return (
          <G>
            <Path d="M23 69l6-21 36-36 15 15-36 36z" fill={fill} {...strokeProps} />
            <Path d="M58 19l15 15M20 81h54" fill="none" {...strokeProps} />
          </G>
        );
      case 'colors':
        return (
          <G>
            <Circle cx="48" cy="48" r="34" fill={fill} {...strokeProps} />
            <Circle cx="35" cy="37" r="5" fill={stroke} />
            <Circle cx="54" cy="31" r="5" fill={stroke} />
            <Circle cx="64" cy="49" r="5" fill={stroke} />
            <Path d="M41 65c11 4 22-2 19-10-2-5-10-3-14 1-5 4-10 6-5 9z" fill="#fff" stroke={stroke} strokeWidth="4" />
          </G>
        );
      case 'video':
        return (
          <G>
            <Rect x="13" y="23" width="70" height="50" rx="14" fill={fill} {...strokeProps} />
            <Polygon points="43,38 62,48 43,58" fill={stroke} />
          </G>
        );
      case 'story':
      case 'learn':
        return (
          <G>
            <Path d="M16 22h27c8 0 12 4 12 12v46H28c-7 0-12-5-12-12z" fill={fill} {...strokeProps} />
            <Path d="M55 34c0-8 4-12 12-12h13v58H55zM29 39h14M29 52h14" fill="none" {...strokeProps} />
          </G>
        );
      case 'baby':
        return (
          <G>
            <Circle cx="48" cy="48" r="31" fill={fill} {...strokeProps} />
            <Path d="M38 24c5-7 15-7 20 0M37 57c6 7 16 7 22 0" fill="none" {...strokeProps} />
            <Circle cx="37" cy="45" r="4" fill={stroke} />
            <Circle cx="59" cy="45" r="4" fill={stroke} />
          </G>
        );
      case 'move':
        return (
          <G>
            <Circle cx="48" cy="20" r="9" fill={fill} {...strokeProps} />
            <Path d="M48 31l-8 21 16 9M40 52l-16 6M52 39l18 2M56 61l15 17M39 52L29 78" fill="none" {...strokeProps} />
          </G>
        );
      case 'memory':
        return (
          <G>
            <Rect x="18" y="18" width="25" height="25" rx="8" fill={fill} {...strokeProps} />
            <Rect x="53" y="18" width="25" height="25" rx="8" fill={fill} {...strokeProps} />
            <Rect x="18" y="53" width="25" height="25" rx="8" fill={fill} {...strokeProps} />
            <Rect x="53" y="53" width="25" height="25" rx="8" fill={fill} {...strokeProps} />
          </G>
        );
      case 'quiz':
        return (
          <G>
            <Circle cx="48" cy="48" r="34" fill={fill} {...strokeProps} />
            <Path d="M39 38c1-9 17-11 22-3 6 10-8 14-10 21" fill="none" {...strokeProps} />
            <Circle cx="49" cy="70" r="4" fill={stroke} />
          </G>
        );
      case 'counting':
        return (
          <G>
            <Rect x="16" y="18" width="64" height="60" rx="16" fill={fill} {...strokeProps} />
            <Path d="M34 36h8v25M56 36h10c8 0 8 10 0 15l-10 10h16" fill="none" {...strokeProps} />
          </G>
        );
      case 'culture':
        return (
          <G>
            <Path d="M18 76h60M25 67h46M30 34h36M34 34v33M62 34v33M24 34l24-18 24 18z" fill={fill} {...strokeProps} />
          </G>
        );
      case 'routine':
        return (
          <G>
            <Circle cx="48" cy="48" r="33" fill={fill} {...strokeProps} />
            <Path d="M48 28v22l14 9" fill="none" {...strokeProps} />
          </G>
        );
      case 'feed':
        return (
          <G>
            <Path d="M22 51c0 18 12 29 26 29s26-11 26-29z" fill={fill} {...strokeProps} />
            <Path d="M30 38c9-10 27-10 36 0" fill="none" {...strokeProps} />
            <Circle cx="36" cy="54" r="3" fill={stroke} />
            <Circle cx="48" cy="59" r="3" fill={stroke} />
            <Circle cx="60" cy="54" r="3" fill={stroke} />
          </G>
        );
      case 'games':
      case 'play':
      default:
        return (
          <G>
            <Path d="M22 38h52a12 12 0 0 1 11 10l5 20c2 8-7 14-13 8L66 66H30L19 76c-6 6-15 0-13-8l5-20a12 12 0 0 1 11-10z" fill={fill} {...strokeProps} />
            <Path d="M31 51v12M25 57h12" fill="none" {...strokeProps} />
            <Circle cx="64" cy="55" r="4" fill={stroke} />
            <Circle cx="75" cy="61" r="4" fill={stroke} />
          </G>
        );
    }
  })();

  return (
    <Svg width={size} height={size} viewBox="0 0 96 96">
      {icon}
    </Svg>
  );
}
