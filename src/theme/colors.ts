/**
 * Lingokids-inspired flat color palette.
 * Rule: NO gradients. Solid fills only. Purple = primary brand.
 */
export const C = {
  // Brand
  purple:     '#6C4EFF',
  purpleDark: '#4A2FD0',
  purpleDeep: '#2D1B8C',
  purpleLight:'#EDE8FF',

  // Page backgrounds
  bg:         '#F0EEFF',   // very light purple for page bg
  white:      '#FFFFFF',
  offWhite:   '#FAFAFA',

  // Text
  textDark:   '#1A0050',
  textMid:    '#555577',
  textLight:  '#9999BB',

  // Activity card colors — flat, bold, Lingokids palette
  blue:   '#4DBFFF',
  yellow: '#FFD93D',
  orange: '#FF8C42',
  red:    '#FF6B6B',
  teal:   '#4ECDC4',
  pink:   '#FF80C0',
  green:  '#5BDA7A',
  violet: '#A29BFE',
  coral:  '#FF7F7F',
  mint:   '#62D4C2',
  lemon:  '#FFE566',
  sky:    '#62C8FF',
  indigo: '#5C6BFF',
  rose:   '#FF4D8C',

  // Compatibility aliases used by older screens
  primary: '#6C4EFF',
  border: '#E3DDF7',
  textMuted: '#8A7BA8',
};

// Alias used by older code
export const COLORS = C;

/**
 * Darken (or lighten) a hex color by shifting its HSL lightness.
 * amount: 0..1, how much to darken (0.35 = 35% darker). Negative lightens.
 * Used to derive a contrasting background shade from a per-letter/activity
 * accent color (e.g. the Farsi tracing screen's background vs. its ghost).
 */
export function shadeColor(hex: string, amount: number): string {
  const m = hex.replace('#', '');
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
  const r = parseInt(full.substring(0, 2), 16) / 255;
  const g = parseInt(full.substring(2, 4), 16) / 255;
  const b = parseInt(full.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const newL = Math.min(1, Math.max(0, l * (1 - amount)));
  const c = (1 - Math.abs(2 * newL - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = newL - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (h < 60) { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else { r1 = c; g1 = 0; b1 = x; }

  const toHex = (v: number) => Math.round((v + mm) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}
