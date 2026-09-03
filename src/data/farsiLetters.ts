// Farsi alphabet tracing data.
// All paths are in a 200\u00c3\u2014200 viewBox.
// Start point = where the green dot is placed (where the child begins).
// Paths follow correct Farsi handwriting direction (generally right-to-left).

import { VAZIRMATN_TRACE_PATHS as TRACE } from './vazirmatnTracePaths.generated';
import { PERSIAN_LETTER_OUTLINES as OUTLINES } from './persianLetterOutlines.generated';

export type FarsiStroke = {
  id: string;
  path: string;
  startLabel?: number;
  arrows?: { t: number; rotation?: number }[];
};

export type FarsiLetter = {
  id: string;
  letter: string;
  nameFa: string;
  nameEn: string;
  exampleFa?: string;
  exampleEn?: string;
  exampleIcon?: string;
  viewBox: string;
  outlinePath: string;
  strokes: FarsiStroke[];
  dots?: { x: number; y: number }[];
  dashStops?: Array<[number, number]>;
  extraDashSegments?: Array<{ id?: string; x1: number; y1: number; x2: number; y2: number; rotation?: number }>;
  segmentLabels?: Array<{ x: number; y: number; label: number }>;
  color?: string;
};

const VB = '0 0 200 200';
const at = (ts: number[]) => ts.map(t => ({ t }));
const s = (id: string, path: string, n?: number, arrows = at([0.25, 0.55, 0.82])) =>
  ({ id, path, startLabel: n, arrows });

// Generated centerline paths from the Vazirmatn trace PNGs.
// These are the best available centerline approximations; the dots remain separate.
const ALEF = TRACE.alef;
const BE = TRACE.be;
const PE = TRACE.pe;
const TE = TRACE.te;
const SE = TRACE.se;
const JIM = TRACE.jim;
const CHE = TRACE.che;
const HE_JIMI = TRACE['he-jimi'];
const KHE = TRACE.khe;
const DAL = TRACE.dal;
const ZAL = TRACE.zal;
const RE = TRACE.re;
const ZE = TRACE.ze;
const ZHE = TRACE.zhe;

// One continuous stroke through the three teeth into the tail loop — joined
// so the child never has to lift and re-find a tiny next start point. Teeth
// keep the ink's real flat-topped shape (straight walls + flat top, gently
// rounded corners) and each valley is one smooth dip, not a hook.
const SIN_MAIN = (
  'M 174.0 75.0 C 174.0 91.6 164.2 105.0 152.0 105.0 C 139.8 105.0 130.0 91.6 130.0 75.0 C 130.0 91.6 119.9 105.0 107.5 105.0 C 97.8 105.0 90.0 91.6 90.0 75.0 C 92.2 88.3 89.9 102.4 83.6 113.1 C 77.2 123.8 67.6 130.0 57.5 130.0 C 39.5 130.0 25.0 109.8 25.0 85.0'
);
const SHIN_MAIN = (
  'M 174.0 88.8 C 174.0 105.4 164.2 118.8 152.0 118.8 C 139.8 118.8 130.0 105.4 130.0 88.8 C 130.0 105.4 119.9 118.8 107.5 118.8 C 97.8 118.8 90.0 105.4 90.0 88.8 C 92.2 102.2 89.9 116.2 83.6 126.9 C 77.2 137.6 67.6 143.8 57.5 143.8 C 39.5 143.8 25.0 123.7 25.0 98.8'
);
// Sad is traced in two parts: first the small teardrop loop, then the open half-circle body.
// Loop (drop) traced first, then the tail sweep — both derived from a skeleton
// trace of the real glyph so the loop sits exactly over the letter's ink.
const SAD_MAIN = 'M 109.2 106.8 C 111.3 106.4 110.8 106.3 111.8 103.7 C 112.9 101.1 113.6 92.5 116.0 88.5 C 118.4 84.4 125.3 78.2 128.6 75.3 C 132.0 72.5 135.8 69.8 139.6 68.5 C 143.4 67.2 152.1 66.0 155.4 65.9 C 158.7 65.7 160.6 66.4 162.7 67.5 C 164.8 68.5 168.7 70.9 170.1 73.2 C 171.5 75.5 172.5 81.2 172.7 83.7 C 172.9 86.3 172.1 89.4 171.7 91.1 C 171.2 92.7 170.7 93.9 169.6 95.3 C 168.4 96.6 165.4 99.3 163.3 100.5 C 161.1 101.8 157.1 103.4 154.3 104.2 C 151.6 105.0 147.3 105.9 143.8 106.3 C 140.3 106.7 134.6 107.3 129.7 107.3 C 124.8 107.4 112.1 106.9 109.2 106.8 L 92.0 105.0 C 92.0 100.1 92.0 95.1 92.0 90.0 C 93.0 94.9 91.5 100.1 90.0 105.0 C 89.0 109.4 88.1 113.8 87.1 118.4 C 86.2 120.1 84.9 122.0 82.9 123.6 C 81.0 125.3 76.4 128.7 73.5 129.9 C 70.6 131.2 65.3 132.2 62.5 132.5 C 59.6 132.9 56.5 133.0 53.5 132.5 C 50.6 132.1 43.8 130.2 41.5 129.4 C 39.1 128.6 38.2 127.9 36.7 126.8 C 35.3 125.7 32.6 122.9 31.5 121.5 C 30.4 120.2 29.5 119.1 28.9 117.3 C 28.2 115.5 27.1 111.2 26.8 108.9 C 26.4 106.6 26.1 104.0 26.2 101.0 C 26.4 98.1 26.4 90.7 27.8 87.9';
const ZAD_MAIN = 'M 109.2 115.7 C 111.3 115.3 110.8 115.2 111.8 112.6 C 112.9 110.0 113.6 101.4 116.0 97.4 C 118.4 93.3 125.3 87.1 128.6 84.2 C 132.0 81.4 135.8 78.7 139.6 77.4 C 143.4 76.1 152.1 74.9 155.4 74.8 C 158.7 74.6 160.6 75.3 162.7 76.4 C 164.8 77.4 168.7 79.8 170.1 82.1 C 171.5 84.4 172.5 90.1 172.7 92.6 C 172.9 95.2 172.1 98.3 171.7 100.0 C 171.2 101.6 170.7 102.8 169.6 104.2 C 168.4 105.5 165.4 108.2 163.3 109.4 C 161.1 110.7 157.1 112.3 154.3 113.1 C 151.6 113.9 147.3 114.8 143.8 115.2 C 140.3 115.6 134.6 116.2 129.7 116.2 C 124.8 116.3 112.1 115.8 109.2 115.7 L 92.0 113.9 C 92.0 109.0 92.0 104.0 92.0 98.9 C 93.0 103.8 91.5 109.0 90.0 113.9 C 89.0 118.3 88.1 122.7 87.1 127.3 C 86.2 129.0 84.9 130.9 82.9 132.5 C 81.0 134.2 76.4 137.6 73.5 138.8 C 70.6 140.1 65.3 141.1 62.5 141.4 C 59.6 141.8 56.5 141.9 53.5 141.4 C 50.6 141.0 43.8 139.1 41.5 138.3 C 39.1 137.5 38.2 136.8 36.7 135.7 C 35.3 134.6 32.6 131.8 31.5 130.4 C 30.4 129.1 29.5 128.0 28.9 126.2 C 28.2 124.4 27.1 120.1 26.8 117.8 C 26.4 115.5 26.1 112.9 26.2 109.9 C 26.4 107.0 26.4 99.6 27.8 96.8';
// Vertical stem + foot, then the oval bowl — taa and zaa share the same glyph
// shape (zaa only adds a dot), so both reuse these two strokes.
const TA_LOOP = 'M 66.9 154.1 C 71.2 144.5 75.5 134.9 80.0 125.0 C 83.1 120.7 86.3 116.5 89.5 112.1 C 96.6 108.3 106.2 99.0 113.6 95.7 C 121.0 92.5 128.0 92.5 133.9 92.6 C 139.7 92.7 144.9 94.6 148.6 96.5 C 152.4 98.4 154.6 99.6 156.4 104.3 C 158.2 108.9 160.4 118.4 159.5 124.5 C 158.6 130.6 155.4 136.7 151.0 140.9 C 146.6 145.0 140.6 147.2 133.1 149.4 C 125.6 151.6 116.9 153.3 105.8 154.1 C 94.8 154.9 73.4 154.1 66.9 154.1 C 62.8 159.4 45.7 154.6 41.2 154.9';
const TA_STEM = 'M 68.5 40.5 L 66.9 154.1';
const GHEYN = 'M 110.7 64.3 C 108.1 62.9 104.6 63.3 101.0 63.6 C 97.4 64.0 88.2 66.1 85.4 66.9 C 82.5 67.7 82.2 68.3 80.8 69.5 C 79.5 70.7 76.8 73.0 75.6 75.3 C 74.5 77.6 72.8 81.6 73.1 85.7 C 73.3 89.9 76.6 96.8 77.6 100.0 C 81.7 100.2 85.8 104.8 90.0 105.0 C 95.0 105.0 99.9 105.0 105.0 105.0 C 110.0 103.3 114.9 101.7 120.0 100.0 C 115.0 101.7 110.1 103.3 105.0 105.0 C 98.4 106.7 91.8 108.3 85.0 110.0 C 81.7 111.7 78.4 113.3 75.0 115.0 C 73.1 118.2 71.2 121.4 69.2 124.7 C 67.4 127.9 67.9 128.7 67.9 131.2 C 67.8 133.7 67.9 139.4 68.5 142.2 C 69.2 145.0 70.7 148.5 72.4 150.6 C 74.1 152.8 78.0 155.8 80.2 157.1 C 82.4 158.5 83.9 159.5 88.0 160.4 C 92.0 161.3 102.7 163.6 108.8 163.6 C 114.8 163.6 126.2 163.0 130.8 160.4 C 132.2 161.9 133.6 156.4 135.0 158.0';
const EYN = GHEYN;
const FE = 'M 162.8 115.4 C 157.3 112.2 137.7 115.9 131.2 115.4 C 124.8 115.0 125.5 113.8 123.5 112.6 C 121.5 111.5 120.5 110.9 119.3 108.4 C 118.1 106.0 116.7 101.3 116.5 97.9 C 116.3 94.5 116.3 91.3 117.9 88.1 C 119.5 84.8 123.6 80.2 126.3 78.2 C 129.0 76.3 130.8 76.1 134.0 76.1 C 137.3 76.1 142.3 76.5 146.0 78.2 C 149.6 80.0 153.5 84.0 155.8 86.7 C 158.1 89.4 158.8 89.6 160.0 94.4 C 161.2 99.2 162.3 111.9 162.8 115.4 C 166.9 118.7 161.9 130.4 160.0 135.1 C 158.1 139.8 155.7 140.9 150.9 143.5 C 146.1 146.1 138.4 148.9 131.2 150.5 C 124.1 152.2 117.9 153.1 108.1 153.3 C 98.2 153.6 82.0 153.3 72.3 151.9 C 62.6 150.5 55.7 148.3 49.8 144.9 C 44.0 141.5 39.5 137.7 37.2 131.6 C 34.9 125.5 34.0 114.2 35.8 108.4';
const GHAF = 'M 157.9 106.2 C 151.7 105.3 132.6 106.7 125.7 105.5 C 118.7 104.2 117.4 102.5 115.4 98.6 C 113.5 94.7 113.8 86.2 114.0 82.2 C 114.3 78.2 115.6 76.6 116.8 74.7 C 117.9 72.7 118.3 71.7 120.9 70.5 C 123.5 69.4 128.4 67.6 132.5 67.8 C 136.6 68.0 141.7 68.8 145.5 71.9 C 149.4 75.0 153.8 80.6 155.8 86.3 C 157.9 92.0 157.5 102.9 157.9 106.2 C 162.7 107.1 158.9 106.7 158.6 111.0 C 158.2 115.2 157.3 125.9 155.1 131.5 C 153.0 137.1 150.5 140.4 145.5 144.5 C 140.6 148.6 131.2 153.7 125.7 156.2 C 120.2 158.7 119.3 158.8 112.7 159.6 C 106.1 160.4 95.0 161.6 86.0 161.0 C 76.9 160.3 64.7 157.3 58.6 155.5 C 52.4 153.7 51.6 152.1 49.0 150.0 C 46.3 147.9 44.3 146.0 42.8 143.2 C 41.3 140.3 40.4 137.6 40.1 132.9 C 39.7 128.2 38.8 119.5 40.8 115.1';
const KAF_MAIN = 'M 105.0 77.0 C 105.3 79.6 110.1 86.6 115.2 91.0 C 120.3 95.4 140.0 107.1 145.5 111.0 C 151.0 114.9 152.2 115.9 153.8 118.6 C 155.4 121.4 156.3 127.7 156.6 130.3 C 156.8 133.0 156.3 135.7 155.9 137.2 C 155.5 138.8 154.8 140.3 153.8 141.4 C 152.8 142.5 152.2 143.8 149.0 144.8 C 145.7 145.9 138.2 148.3 131.0 149.0 C 123.9 149.6 107.3 149.9 98.6 149.7 C 89.9 149.5 76.0 148.5 69.7 147.6 C 63.3 146.7 57.3 144.7 53.8 143.4 C 50.3 142.2 46.9 140.1 44.8 138.6 C 42.8 137.2 40.6 135.0 39.3 133.1 C 38.0 131.2 36.4 129.7 35.9 125.5 C 35.4 121.3 34.4 104.3 35.9 100.0';
const KAF_TAIL = 'M 166.2 51.7 L 105.0 77.0';
const GAF_MAIN = 'M 109.7 87.2 C 109.6 89.2 110.9 92.5 111.7 94.1 C 112.5 95.8 110.8 95.7 115.2 99.0 C 119.6 102.2 137.3 113.0 142.8 116.9 C 148.2 120.8 151.8 123.5 153.8 126.6 C 155.7 129.6 156.3 135.7 156.6 138.3 C 156.8 140.8 156.1 143.2 155.9 144.5 C 155.7 145.8 156.1 146.1 155.2 147.2 C 154.2 148.4 152.4 151.4 149.0 152.8 C 145.5 154.1 137.7 156.2 131.0 156.9 C 124.4 157.6 110.7 157.8 102.1 157.6 C 93.5 157.4 77.2 156.4 70.3 155.5 C 63.5 154.6 58.1 153.3 53.8 151.4 C 49.5 149.4 42.4 144.0 40.0 141.7 C 37.6 139.5 37.2 137.4 36.6 135.5 C 35.9 133.7 35.3 132.0 35.2 128.6 C 35.1 125.2 34.2 115.1 35.9 111.4';
const GAF_TAIL = 'M 166.2 59.7 L 109.7 87.2';
const GAF_EXTRA = 'M 170 35 L 120 55';
const LAM = TRACE.lam;
const MIM = 'M 75 80 L 83 64.4 L 95 42.4 L 117 30.4 L 140 42.4 L 148 64.4 L 145 85.4 L 125 95 L 100 90 L 75 80 L 55 85 L 53 110 L 53 130.4 L 52 155.4 L 53 180.4';
const NOON = TRACE.noon;
const VAV = 'M 131.3 100.4 C 125.5 96.1 101.0 97.9 93.6 97.0 C 86.1 96.1 89.1 96.7 86.7 95.3 C 84.3 93.8 80.8 91.6 79.0 88.4 C 77.1 85.3 76.0 80.0 75.5 76.4 C 75.1 72.8 75.7 70.1 76.4 67.0 C 77.1 63.8 78.3 60.1 79.8 57.5 C 81.4 54.9 82.0 53.2 85.8 51.5 C 89.7 49.8 98.0 47.4 103.0 47.2 C 108.0 47.1 112.7 49.2 115.9 50.6 C 119.0 52.1 119.6 52.4 121.9 55.8 C 124.2 59.2 128.0 63.8 129.6 71.2 C 131.2 78.7 131.0 95.6 131.3 100.4 C 137.2 104.7 131.5 116.5 128.8 122.7 C 126.0 129.0 120.7 134.2 115.0 138.2 C 109.3 142.2 102.4 144.5 94.4 146.8 C 86.4 149.1 72.8 149.5 67.0 151.9';
const HEH = 'M 87.7 42.1 L 100 50 L 111.3 59.5 L 115.4 62.6 L 132.8 82.1 L 139.0 103.6 L 136.9 122.1 L 130.8 130.3 L 121.5 136.4 L 104.1 140.5 L 93.8 140.5 L 72.3 133.3 L 65.1 126.2 L 61.0 115.9 L 60.0 107.7 L 64.1 87.2 L 68.2 79.0 L 93.8 55.4 L 100 50';
const YE = 'M 161.3 59.5 L 131.4 57.3 L 119.7 60.2 L 109.5 68.2 L 108.0 76.3 L 114.6 88.7 L 152.6 101.8 L 158.4 106.9 L 160.6 119.3 L 156.9 127.4 L 132.8 136.9 L 102.9 140.5 L 76.6 140.5 L 48.2 133.9 L 40.1 126.6 L 36.5 110.6 L 38.0 93.8';

export const FARSI_LETTERS: FarsiLetter[] = [
  { id: 'alef',  letter: 'ا', nameFa: 'الف', nameEn: 'Alef',  exampleFa: 'آب',         exampleEn: 'Water',     exampleIcon: '💧', viewBox: VB, outlinePath: OUTLINES['alef'], color: '#F15A7B', strokes: [s('main', ALEF, 1, at([0.18, 0.5, 0.82]))] },
  { id: 'be',    letter: 'ب', nameFa: 'ب',             nameEn: 'Be',    exampleFa: 'برگ',     exampleEn: 'Leaf',    exampleIcon: '🍂', viewBox: VB, outlinePath: OUTLINES['be'],   color: '#FF8B2B', strokes: [s('main', BE, 1)], dots: [{ x: 100, y: 146.4 }] },
  { id: 'pe',    letter: 'پ', nameFa: 'پ',             nameEn: 'Pe',    exampleFa: 'پرتقال', exampleEn: 'Orange',    exampleIcon: '🍊', viewBox: VB, outlinePath: OUTLINES['pe'],   color: '#9B5CFF', strokes: [s('main', PE, 1)], dots: [{ x: 86.2, y: 132.2 }, { x: 99.6, y: 151 }, { x: 113, y: 132.2 }] },
  { id: 'te',    letter: 'ت', nameFa: 'ت',             nameEn: 'Te',    exampleFa: 'توت فرنگی', exampleEn: 'Strawberry', exampleIcon: '🍓', viewBox: VB, outlinePath: OUTLINES['te'],   color: '#4CC9F0', strokes: [s('main', TE, 1)], dots: [{ x: 87, y: 53.3 }, { x: 111.1, y: 53.3 }] },
  { id: 'se',    letter: 'ث', nameFa: 'ث',             nameEn: 'Se',    exampleFa: 'ثانیه', exampleEn: 'Second',    exampleIcon: '⏱️', viewBox: VB, outlinePath: OUTLINES['se'],   color: '#FF6BB5', strokes: [s('main', SE, 1)], dots: [{ x: 99.6, y: 44.1 }, { x: 86.2, y: 63.2 }, { x: 113, y: 63.2 }] },
  { id: 'jim',   letter: 'ج', nameFa: 'ج',             nameEn: 'Jim',   exampleFa: 'جوجه', exampleEn: 'Chick',     exampleIcon: '🐥', viewBox: VB, outlinePath: OUTLINES['jim'],  color: '#55D16F', strokes: [s('main', JIM, 1)], dots: [{ x: 102.4, y: 113 }] },
  { id: 'che',   letter: 'چ', nameFa: 'چ',             nameEn: 'Che',   exampleFa: 'چتر',    exampleEn: 'Umbrella',  exampleIcon: '☂️', viewBox: VB, outlinePath: OUTLINES['che'],  color: '#7A67FF', strokes: [s('main', CHE, 1)], dots: [{ x: 97.2, y: 105.1 }, { x: 111, y: 124 }, { x: 124.4, y: 105.1 }] },
  { id: 'haa',   letter: 'ح', nameFa: 'ح',             nameEn: 'Ha',    exampleFa: 'حوله', exampleEn: 'Towel',     exampleIcon: '🛁', viewBox: VB, outlinePath: OUTLINES['haa'],  color: '#20C7B3', strokes: [s('main', JIM, 1, at([0.1, 0.4, 0.72]))] },
  { id: 'khe',   letter: 'خ', nameFa: 'خ',             nameEn: 'Khe',   exampleFa: 'خرس',    exampleEn: 'Bear',      exampleIcon: '🐻', viewBox: VB, outlinePath: OUTLINES['khe'],  color: '#F97316', strokes: [s('main', KHE, 1, at([0.1, 0.4, 0.72]))], dots: [{ x: 117, y: 29.5 }] },
  { id: 'dal',   letter: 'د', nameFa: 'د',             nameEn: 'Dal',   exampleFa: 'درخت', exampleEn: 'Tree',      exampleIcon: '🌳', viewBox: VB, outlinePath: OUTLINES['dal'],  color: '#4DBFFF', strokes: [s('main', DAL, 1, at([0.15, 0.5, 0.82]))] },
  { id: 'zal',   letter: 'ذ', nameFa: 'ذ',             nameEn: 'Zal',   exampleFa: 'ذرت',    exampleEn: 'Corn',      exampleIcon: '🌽', viewBox: VB, outlinePath: OUTLINES['zal'],  color: '#F6A62B', strokes: [s('main', ZAL, 1, at([0.15, 0.5, 0.82]))], dots: [{ x: 79.4, y: 34.4 }] },
  { id: 're',    letter: 'ر', nameFa: 'ر',             nameEn: 'Re',    exampleFa: 'رنگ',    exampleEn: 'Color',     exampleIcon: '🎨', viewBox: VB, outlinePath: OUTLINES['re'],   color: '#FF8C42', strokes: [s('main', RE, 1, at([0.2, 0.55, 0.85]))] },
  { id: 'ze',    letter: 'ز', nameFa: 'ز',             nameEn: 'Ze',    exampleFa: 'زنبور', exampleEn: 'Bee',       exampleIcon: '🐝', viewBox: VB, outlinePath: OUTLINES['ze'],   color: '#FF64B8', strokes: [s('main', ZE, 1, at([0.2, 0.55, 0.85]))], dots: [{ x: 112.7, y: 34.7 }] },
  { id: 'zhe',   letter: 'ژ', nameFa: 'ژ',             nameEn: 'Zhe',   exampleFa: 'ژله',    exampleEn: 'Jelly',     exampleIcon: '🍮', viewBox: VB, outlinePath: OUTLINES['zhe'],  color: '#FFD93D', strokes: [s('main', ZHE, 1, at([0.2, 0.55, 0.85]))], dots: [{ x: 97, y: 50.2 }, { x: 110, y: 31.6 }, { x: 122.7, y: 50.2 }] },
  { id: 'sin',   letter: 'س', nameFa: 'س',             nameEn: 'Sin',   exampleFa: 'سیب',    exampleEn: 'Apple',     exampleIcon: '🍎', viewBox: VB, outlinePath: OUTLINES['sin'],   color: '#FF6B6B', strokes: [
    s('main', SIN_MAIN, 1, at([0.1, 0.25, 0.4, 0.55, 0.7, 0.85])),
  ] },
  { id: 'shin',  letter: 'ش', nameFa: 'ش',             nameEn: 'Shin',  exampleFa: 'شیر',    exampleEn: 'Milk',      exampleIcon: '🥛', viewBox: VB, outlinePath: OUTLINES['shin'],  color: '#FF80C0', strokes: [
    s('main', SHIN_MAIN, 1, at([0.1, 0.25, 0.4, 0.55, 0.7, 0.85])),
  ], dots: [{ x: 122.6, y: 63.3 }, { x: 113.3, y: 50 }, { x: 104.3, y: 63.3 }] },
  { id: 'sad',   letter: '\u0635', nameFa: '\u0635',             nameEn: 'Sad',   exampleFa: '\u0635\u0627\u0628\u0648\u0646', exampleEn: 'Soap',      exampleIcon: '🧼', viewBox: VB, outlinePath: OUTLINES['sad'],   color: '#06B6D4', strokes: [
    s('main', SAD_MAIN, 1, at([0.1, 0.25, 0.4, 0.55, 0.7, 0.85])),
  ] },
  { id: 'zad',   letter: 'ض', nameFa: 'ض',             nameEn: 'Zad',   exampleFa: 'ضربدر', exampleEn: 'Cross',     exampleIcon: '✖️', viewBox: VB, outlinePath: OUTLINES['zad'],   color: '#EC4899', strokes: [
    s('main', ZAD_MAIN, 1, at([0.1, 0.25, 0.4, 0.55, 0.7, 0.85])),
  ], dots: [{ x: 113.9, y: 50.9 }] },
  { id: 'taa',   letter: 'ط', nameFa: 'ط',             nameEn: 'Ta',    exampleFa: 'طوطی',   exampleEn: 'Parrot',    exampleIcon: '🦜', viewBox: VB, outlinePath: OUTLINES['taa'],   color: '#84CC16', strokes: [
    s('loop', TA_LOOP, 1, at([0.1, 0.25, 0.4, 0.55, 0.7, 0.85])),
    s('stem', TA_STEM, 2, at([0.3, 0.7])),
  ] },
  { id: 'zaa',   letter: 'ظ', nameFa: 'ظ',             nameEn: 'Za',    exampleFa: 'ظرف',    exampleEn: 'Dish',      exampleIcon: '🍽️', viewBox: VB, outlinePath: OUTLINES['zaa'],   color: '#8B5CF6', strokes: [
    s('loop', TA_LOOP, 1, at([0.1, 0.25, 0.4, 0.55, 0.7, 0.85])),
    s('stem', TA_STEM, 2, at([0.3, 0.7])),
  ], dots: [{ x: 110.9, y: 48.6 }] },
  { id: 'eyn',   letter: 'ع', nameFa: 'ع',             nameEn: 'Eyn',   exampleFa: 'عینک', exampleEn: 'Glasses',   exampleIcon: '👓', viewBox: VB, outlinePath: OUTLINES['eyn'],   color: '#F97316', strokes: [s('main', EYN, 1, at([0.18, 0.46, 0.78]))], dots: [] },
  { id: 'gheyn', letter: 'غ', nameFa: 'غ',             nameEn: 'Gheyn', exampleFa: 'غذا',    exampleEn: 'Food',      exampleIcon: '🍱', viewBox: VB, outlinePath: OUTLINES['gheyn'], color: '#06B6D4', strokes: [s('main', GHEYN, 1, at([0.18, 0.46, 0.78]))], dots: [{ x: 97.4, y: 27.6 }] },
  { id: 'fe',    letter: 'ف', nameFa: 'ف',             nameEn: 'Fe',    exampleFa: 'فیل',    exampleEn: 'Elephant',  exampleIcon: '🐘', viewBox: VB, outlinePath: OUTLINES['fe'],    color: '#22C55E', strokes: [s('main', FE, 1, at([0.25, 0.65]))], dots: [{ x: 127.4, y: 36.5 }] },
  { id: 'ghaf',  letter: 'ق', nameFa: 'ق',             nameEn: 'Qaf',   exampleFa: 'قلب',    exampleEn: 'Heart',     exampleIcon: '❤️', viewBox: VB, outlinePath: OUTLINES['ghaf'],  color: '#FF4D8C', strokes: [s('main', GHAF, 1, at([0.25, 0.65]))], dots: [{ x: 117.5, y: 29.1 }, { x: 139, y: 29.1 }] },
  { id: 'kaf',   letter: 'ک', nameFa: 'ک',             nameEn: 'Kaf',   exampleFa: 'کتاب', exampleEn: 'Book',      exampleIcon: '📚', viewBox: VB, outlinePath: OUTLINES['kaf'],   color: '#5C6BFF', strokes: [s('main', KAF_MAIN, 1, at([0.1, 0.25, 0.4, 0.55, 0.7, 0.85])), s('tail', KAF_TAIL, 2, at([0.3, 0.7]))] },
  { id: 'gaf',   letter: 'گ', nameFa: 'گ',             nameEn: 'Gaf',   exampleFa: 'گل',        exampleEn: 'Flower',    exampleIcon: '🌸', viewBox: VB, outlinePath: OUTLINES['gaf'],   color: '#FF8C42', strokes: [s('main', GAF_MAIN, 1, at([0.1, 0.25, 0.4, 0.55, 0.7, 0.85])), s('tail', GAF_TAIL, 2, at([0.3, 0.7])), s('extra', GAF_EXTRA, 3, at([0.3, 0.7]))] },
  { id: 'lam',   letter: 'ل', nameFa: 'ل',             nameEn: 'Lam',   exampleFa: 'لیمو', exampleEn: 'Lemon',     exampleIcon: '🍋', viewBox: VB, outlinePath: OUTLINES['lam'],   color: '#4ECDC4', strokes: [s('main', LAM, 1, at([0.15, 0.48, 0.82]))] },
  { id: 'mim',   letter: 'م', nameFa: 'م',             nameEn: 'Mim',   exampleFa: 'ماهی', exampleEn: 'Fish',      exampleIcon: '🐟', viewBox: VB, outlinePath: OUTLINES['mim'],   color: '#FFD93D', strokes: [s('main', MIM, 1, at([0.22, 0.52, 0.82]))] },
  { id: 'nun',   letter: 'ن', nameFa: 'ن',             nameEn: 'Nun',   exampleFa: 'نان',    exampleEn: 'Bread',     exampleIcon: '🍞', viewBox: VB, outlinePath: OUTLINES['nun'],   color: '#5BDA7A', strokes: [s('main', NOON, 1)], dots: [{ x: 99.1, y: 70.9 }] },
  { id: 'vav',   letter: 'و', nameFa: 'و',             nameEn: 'Vav',   exampleFa: 'ورزش', exampleEn: 'Exercise',  exampleIcon: '🏃', viewBox: VB, outlinePath: OUTLINES['vav'],   color: '#4CC9F0', strokes: [s('main', VAV, 1, at([0.18, 0.5, 0.8]))] },
  { id: 'heh',   letter: 'ه', nameFa: 'ه',             nameEn: 'He',    exampleFa: 'هویج', exampleEn: 'Carrot',    exampleIcon: '🥕', viewBox: VB, outlinePath: OUTLINES['heh'],   color: '#FF6B6B', strokes: [s('main', HEH, 1, at([0.12, 0.38, 0.65, 0.88]))] },
  { id: 'ye',    letter: 'ی', nameFa: 'ی',             nameEn: 'Ye',    exampleFa: 'یخ',        exampleEn: 'Ice',       exampleIcon: '🧊', viewBox: VB, outlinePath: OUTLINES['ye'],    color: '#C77DFF', strokes: [s('main', YE, 1, at([0.18, 0.48, 0.78]))] },
];
export const FARSI_LETTER_BY_ID = Object.fromEntries(
  FARSI_LETTERS.map(item => [item.id, item])
) as Record<string, FarsiLetter>;

































