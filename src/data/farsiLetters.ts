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

const SIN_CUSTOM_SEGMENTS = [
  'M 173.0 70.0 C 174.0 84.0 168.0 99.0 158.0 101.0', // 1
  'M 148.0 101.0 C 148.0 104.0 139.0 104.0 141.0 98.0', // 2
  'M 135.0 84.0 L 135.0 65.5', // 3
  'M 125.5 72.5 L 125.5 96.0', // 4
  'M 125.5 95.0 C 125.5 97.2 123.0 100.0 120.5 101.5', // 5
  'M 108.0 101.0 C 108.0 104.0 99.0 104.0 101.0 98.0', // 6
  'M 96.5 87.0 L 96.5 70.0', // 7
  'M 85.5 75.0 L 85.5 92.0', // 8
  'M 86.0 100.0 C 86.0 100.0 84.0 126.0 72.0 130.0 C 56.0 136.0 39.0 130.0 30.0 117.0 C 24.0 107.0 24.0 92.0 31.0 82.0', // 9
];
const SHIN = TRACE.shin;
// Sad is traced in two parts: first the small teardrop loop, then the open half-circle body.
const SAD_DROP = 'M 90.3 89.0 C 97.2 82.6 107.8 84.1 112.5 93.0 C 117.4 102.3 114.2 115.2 104.5 119.3 C 96.0 122.9 84.8 119.8 79.2 110.4 C 74.0 101.4 75.4 90.6 81.6 84.4 C 85.2 80.8 88.7 80.2 90.3 89.0';
const SAD_BODY = 'M 90.3 89.0 L 93.4 106.3 L 84.5 122.0 L 70.9 131.0 L 52.0 132.0 L 36.2 126.2 L 27.8 114.7 L 27.3 88.5 L 35.7 82.2';
const ZAD = TRACE.zad;
const TA = TRACE.ta;
const ZA = TRACE.za;
const EYN = TRACE.eyn;
const GHEYN = TRACE.gheyn;
const FE = TRACE.fe;
const GHAF = TRACE.ghaf;
const KAF = TRACE.kaf;
const GAF = TRACE.gaf;
const LAM = TRACE.lam;
const MIM = TRACE.mim;
const NOON = TRACE.noon;
const VAV = TRACE.vav;
const HEH = TRACE.he;
const YE = TRACE.ye;

export const FARSI_LETTERS: FarsiLetter[] = [
  { id: 'alef',  letter: 'ا', nameFa: 'الف', nameEn: 'Alef',  exampleFa: 'آب',         exampleEn: 'Cloud',     exampleIcon: '💧', viewBox: VB, outlinePath: OUTLINES['alef'], color: '#F15A7B', strokes: [s('main', ALEF, 1, at([0.18, 0.5, 0.82]))] },
  { id: 'be',    letter: 'ب', nameFa: 'ب',             nameEn: 'Be',    exampleFa: 'برگ',   exampleEn: 'Lamb',      exampleIcon: '🐑', viewBox: VB, outlinePath: OUTLINES['be'],   color: '#FF8B2B', strokes: [s('main', BE, 1)], dots: [{ x: 100, y: 146.4 }] },
  { id: 'pe',    letter: 'پ', nameFa: 'پ',             nameEn: 'Pe',    exampleFa: 'پرتقال', exampleEn: 'Butterfly', exampleIcon: '🦋', viewBox: VB, outlinePath: OUTLINES['pe'],   color: '#9B5CFF', strokes: [s('main', PE, 1)], dots: [{ x: 86.2, y: 132.2 }, { x: 99.6, y: 151 }, { x: 113, y: 132.2 }] },
  { id: 'te',    letter: 'ت', nameFa: 'ت',             nameEn: 'Te',    exampleFa: 'توت فرنگی', exampleEn: 'Ball',      exampleIcon: '🍊', viewBox: VB, outlinePath: OUTLINES['te'],   color: '#4CC9F0', strokes: [s('main', TE, 1)], dots: [{ x: 87, y: 53.3 }, { x: 111.1, y: 53.3 }] },
  { id: 'se',    letter: 'ث', nameFa: 'ث',             nameEn: 'Se',    exampleFa: 'ثانیه', exampleEn: 'Fox',       exampleIcon: '⏱️', viewBox: VB, outlinePath: OUTLINES['se'],   color: '#FF6BB5', strokes: [s('main', SE, 1)], dots: [{ x: 99.6, y: 44.1 }, { x: 86.2, y: 63.2 }, { x: 113, y: 63.2 }] },
  { id: 'jim',   letter: 'ج', nameFa: 'ج',             nameEn: 'Jim',   exampleFa: 'جوجه', exampleEn: 'Jungle',    exampleIcon: '🐥', viewBox: VB, outlinePath: OUTLINES['jim'],  color: '#55D16F', strokes: [s('main', JIM, 1)], dots: [{ x: 102.4, y: 113 }] },
  { id: 'che',   letter: 'چ', nameFa: 'چ',             nameEn: 'Che',   exampleFa: 'چتر',    exampleEn: 'Umbrella',  exampleIcon: '☂️', viewBox: VB, outlinePath: OUTLINES['che'],  color: '#7A67FF', strokes: [s('main', CHE, 1)], dots: [{ x: 97.2, y: 105.1 }, { x: 111, y: 124 }, { x: 124.4, y: 105.1 }] },
  { id: 'haa',   letter: 'ح', nameFa: 'ح',             nameEn: 'Ha',    exampleFa: 'حلوا', exampleEn: 'Halva',     exampleIcon: '🍮', viewBox: VB, outlinePath: OUTLINES['haa'],  color: '#20C7B3', strokes: [s('main', JIM, 1, at([0.1, 0.4, 0.72]))] },
  { id: 'khe',   letter: 'خ', nameFa: 'خ',             nameEn: 'Khe',   exampleFa: 'خرس',    exampleEn: 'Bear',      exampleIcon: '🐻', viewBox: VB, outlinePath: OUTLINES['khe'],  color: '#F97316', strokes: [s('main', KHE, 1, at([0.1, 0.4, 0.72]))], dots: [{ x: 117, y: 29.5 }] },
  { id: 'dal',   letter: 'د', nameFa: 'د',             nameEn: 'Dal',   exampleFa: 'درخت', exampleEn: 'Sea',       exampleIcon: '🌳', viewBox: VB, outlinePath: OUTLINES['dal'],  color: '#4DBFFF', strokes: [s('main', DAL, 1, at([0.15, 0.5, 0.82]))] },
  { id: 'zal',   letter: 'ذ', nameFa: 'ذ',             nameEn: 'Zal',   exampleFa: 'ذرت',    exampleEn: 'Corn',      exampleIcon: '🌽', viewBox: VB, outlinePath: OUTLINES['zal'],  color: '#F6A62B', strokes: [s('main', ZAL, 1, at([0.15, 0.5, 0.82]))], dots: [{ x: 79.4, y: 34.4 }] },
  { id: 're',    letter: 'ر', nameFa: 'ر',             nameEn: 'Re',    exampleFa: 'رنگ',    exampleEn: 'Color',     exampleIcon: '🎨', viewBox: VB, outlinePath: OUTLINES['re'],   color: '#FF8C42', strokes: [s('main', RE, 1, at([0.2, 0.55, 0.85]))] },
  { id: 'ze',    letter: 'ز', nameFa: 'ز',             nameEn: 'Ze',    exampleFa: 'زنبور', exampleEn: 'Giraffe',   exampleIcon: '🐝', viewBox: VB, outlinePath: OUTLINES['ze'],   color: '#FFD93D', strokes: [s('main', ZE, 1, at([0.2, 0.55, 0.85]))], dots: [{ x: 112.7, y: 34.7 }] },
  { id: 'zhe',   letter: 'ژ', nameFa: 'ژ',             nameEn: 'Zhe',   exampleFa: 'ژله',    exampleEn: 'Dew',       exampleIcon: '🍮', viewBox: VB, outlinePath: OUTLINES['zhe'],  color: '#FF64B8', strokes: [s('main', ZHE, 1, at([0.2, 0.55, 0.85]))], dots: [{ x: 97, y: 50.2 }, { x: 110, y: 31.6 }, { x: 122.7, y: 50.2 }] },
  { id: 'sin',   letter: 'س', nameFa: 'س',             nameEn: 'Sin',   exampleFa: 'سیب',    exampleEn: 'Apple',     exampleIcon: '🍎', viewBox: VB, outlinePath: OUTLINES['sin'],   color: '#FF6B6B', strokes: [
    s('main-1', SIN_CUSTOM_SEGMENTS[0]!, 1, at([0.45, 0.8])),
    s('main-2', SIN_CUSTOM_SEGMENTS[1]!, 2, at([0.45, 0.8])),
    s('main-3', SIN_CUSTOM_SEGMENTS[2]!, 3, at([0.45, 0.8])),
    s('main-4', SIN_CUSTOM_SEGMENTS[3]!, 4, at([0.45, 0.8])),
    s('main-5', SIN_CUSTOM_SEGMENTS[4]!, 5, at([0.45, 0.8])),
    s('main-6', SIN_CUSTOM_SEGMENTS[5]!, 6, at([0.45, 0.8])),
    s('main-7', SIN_CUSTOM_SEGMENTS[6]!, 7, at([0.45, 0.8])),
    s('main-8', SIN_CUSTOM_SEGMENTS[7]!, 8, at([0.45, 0.8])),
    s('main-9', SIN_CUSTOM_SEGMENTS[8]!, 9, at([0.45, 0.8])),
  ], segmentLabels: [{ x: 135, y: 65, label: 3 }, { x: 126, y: 65, label: 4 }, { x: 120, y: 99, label: 5 }] },
  { id: 'shin',  letter: 'ش', nameFa: 'ش',             nameEn: 'Shin',  exampleFa: 'شیر',    exampleEn: 'Lion',      exampleIcon: '🦁', viewBox: VB, outlinePath: OUTLINES['shin'],  color: '#FF80C0', strokes: [
    s('main-1', 'M 173.0 82.0 C 174.0 96.0 168.0 111.0 158.0 113.0', 1, at([0.18, 0.46, 0.76])),
    s('main-2', 'M 148.0 113.0 C 148.0 116.0 139.0 116.0 141.0 110.0', 2, at([0.18, 0.46, 0.76])),
    s('main-3', 'M 135.0 96.0 L 135.0 77.5', 3, at([0.18, 0.46, 0.76])),
    s('main-4', 'M 125.5 84.5 L 125.5 108.0', 4, at([0.18, 0.46, 0.76])),
    s('main-5', 'M 125.5 107.0 C 125.5 109.2 123.0 112.0 120.5 113.5', 5, at([0.18, 0.46, 0.76])),
    s('main-6', 'M 108.0 113.0 C 108.0 116.0 99.0 116.0 101.0 110.0', 6, at([0.18, 0.46, 0.76])),
    s('main-7', 'M 96.5 99.0 L 96.5 82.0', 7, at([0.18, 0.46, 0.76])),
    s('main-8', 'M 85.5 87.0 L 85.5 104.0', 8, at([0.18, 0.46, 0.76])),
    s('main-9', 'M 86.0 112.0 C 86.0 112.0 84.0 138.0 72.0 142.0 C 56.0 148.0 39.0 142.0 30.0 129.0 C 24.0 119.0 24.0 104.0 31.0 94.0', 9, at([0.18, 0.46, 0.76])),
  ], dots: [{ x: 113.6, y: 50 }, { x: 104, y: 63.3 }, { x: 122.6, y: 63.3 }] },
  { id: 'sad',   letter: '\u0635', nameFa: '\u0635',             nameEn: 'Sad',   exampleFa: '\u0635\u0627\u0628\u0648\u0646', exampleEn: 'Soap',      exampleIcon: '🧼', viewBox: VB, outlinePath: OUTLINES['sad'],   color: '#06B6D4', strokes: [
    s('drop', SAD_DROP, 1, at([0.2, 0.5, 0.82])),
    s('body', SAD_BODY, 2, at([0.2, 0.5, 0.82])),
  ] },
  { id: 'zad',   letter: 'ض', nameFa: 'ض',             nameEn: 'Zad',   exampleFa: 'ضربدر', exampleEn: 'Beat',      exampleIcon: '✖️', viewBox: VB, outlinePath: OUTLINES['zad'],   color: '#EC4899', strokes: [s('main', ZAD, 1, at([0.18, 0.46, 0.76]))], dots: [{ x: 113.6, y: 50.9 }] },
  { id: 'taa',   letter: 'ط', nameFa: 'ط',             nameEn: 'Ta',    exampleFa: 'طبل',    exampleEn: 'Drum',      exampleIcon: '🥁', viewBox: VB, outlinePath: OUTLINES['taa'],   color: '#84CC16', strokes: [s('main', TA, 1, at([0.3, 0.7]))] },
  { id: 'zaa',   letter: 'ظ', nameFa: 'ظ',             nameEn: 'Za',    exampleFa: 'ظرف',    exampleEn: 'Dish',      exampleIcon: '🍽️', viewBox: VB, outlinePath: OUTLINES['zaa'],   color: '#8B5CF6', strokes: [s('main', TA, 1, at([0.3, 0.7]))], dots: [{ x: 110.9, y: 48.6 }] },
  { id: 'eyn',   letter: 'ع', nameFa: 'ع',             nameEn: 'Eyn',   exampleFa: 'عینک', exampleEn: 'Doll',      exampleIcon: '👓', viewBox: VB, outlinePath: OUTLINES['eyn'],   color: '#F97316', strokes: [s('main', EYN, 1, at([0.18, 0.46, 0.78]))] },
  { id: 'gheyn', letter: 'غ', nameFa: 'غ',             nameEn: 'Gheyn', exampleFa: 'غذا',    exampleEn: 'Food',      exampleIcon: '🍱', viewBox: VB, outlinePath: OUTLINES['gheyn'], color: '#06B6D4', strokes: [s('main', GHEYN, 1, at([0.18, 0.46, 0.78]))], dots: [{ x: 97.4, y: 27.6 }] },
  { id: 'fe',    letter: 'ف', nameFa: 'ف',             nameEn: 'Fe',    exampleFa: 'فیل',    exampleEn: 'Elephant',  exampleIcon: '🐘', viewBox: VB, outlinePath: OUTLINES['fe'],    color: '#22C55E', strokes: [s('main', FE, 1, at([0.25, 0.65]))], dots: [{ x: 127.4, y: 36.5 }] },
  { id: 'ghaf',  letter: 'ق', nameFa: 'ق',             nameEn: 'Qaf',   exampleFa: 'قلب',    exampleEn: 'Heart',     exampleIcon: '❤️', viewBox: VB, outlinePath: OUTLINES['ghaf'],  color: '#FF4D8C', strokes: [s('main', GHAF, 1, at([0.25, 0.65]))], dots: [{ x: 117.5, y: 29.1 }, { x: 139, y: 29.1 }] },
  { id: 'kaf',   letter: 'ک', nameFa: 'ک',             nameEn: 'Kaf',   exampleFa: 'کتاب', exampleEn: 'Book',      exampleIcon: '📚', viewBox: VB, outlinePath: OUTLINES['kaf'],   color: '#5C6BFF', strokes: [s('main', KAF, 1, at([0.3, 0.7]))] },
  { id: 'gaf',   letter: 'گ', nameFa: 'گ',             nameEn: 'Gaf',   exampleFa: 'گل',        exampleEn: 'Cat',       exampleIcon: '🌸', viewBox: VB, outlinePath: OUTLINES['gaf'],   color: '#FF8C42', strokes: [s('main', GAF, 1, at([0.3, 0.7]))], dots: [{ x: 150, y: 36 }] },
  { id: 'lam',   letter: 'ل', nameFa: 'ل',             nameEn: 'Lam',   exampleFa: 'لیمو', exampleEn: 'Turtle',    exampleIcon: '🍋', viewBox: VB, outlinePath: OUTLINES['lam'],   color: '#4ECDC4', strokes: [s('main', LAM, 1, at([0.15, 0.48, 0.82]))] },
  { id: 'mim',   letter: 'م', nameFa: 'م',             nameEn: 'Mim',   exampleFa: 'ماهی', exampleEn: 'Moon',      exampleIcon: '🐟', viewBox: VB, outlinePath: OUTLINES['mim'],   color: '#FFD93D', strokes: [s('main', MIM, 1, at([0.22, 0.52, 0.82]))] },
  { id: 'nun',   letter: 'ن', nameFa: 'ن',             nameEn: 'Nun',   exampleFa: 'نان',    exampleEn: 'Palm',      exampleIcon: '🍞', viewBox: VB, outlinePath: OUTLINES['nun'],   color: '#5BDA7A', strokes: [s('main', NOON, 1)], dots: [{ x: 99.1, y: 70.9 }] },
  { id: 'vav',   letter: 'و', nameFa: 'و',             nameEn: 'Vav',   exampleFa: 'ورزش', exampleEn: 'Sports',    exampleIcon: '⚽', viewBox: VB, outlinePath: OUTLINES['vav'],   color: '#4CC9F0', strokes: [s('main', VAV, 1, at([0.18, 0.5, 0.8]))] },
  { id: 'heh',   letter: 'ه', nameFa: 'ه',             nameEn: 'He',    exampleFa: 'هویج', exampleEn: 'Watermelon',exampleIcon: '🥕', viewBox: VB, outlinePath: OUTLINES['heh'],   color: '#FF6B6B', strokes: [s('main', HEH, 1, at([0.12, 0.38, 0.65, 0.88]))] },
  { id: 'ye',    letter: 'ی', nameFa: 'ی',             nameEn: 'Ye',    exampleFa: 'یخ',        exampleEn: 'Cheetah',   exampleIcon: '🧊', viewBox: VB, outlinePath: OUTLINES['ye'],    color: '#C77DFF', strokes: [s('main', YE, 1, at([0.18, 0.48, 0.78]))] },
];
export const FARSI_LETTER_BY_ID = Object.fromEntries(
  FARSI_LETTERS.map(item => [item.id, item])
) as Record<string, FarsiLetter>;

































