// Farsi alphabet tracing data.
// All paths are in a 200×200 viewBox.
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
const SIN = TRACE.sin;
const SHIN = TRACE.shin;
const SAD = TRACE.sad;
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
  // ا
  { id:'alef',  letter:'ا', nameFa:'الف',  nameEn:'Alef',  exampleFa:'ابر',       exampleEn:'Cloud',     exampleIcon:'☁️',  viewBox:VB, outlinePath:OUTLINES['alef'], color:'#F15A7B', strokes:[s('main',ALEF,1,at([0.18,0.5,0.82]))] },
  // ب
  { id:'be',    letter:'ب', nameFa:'بِ',   nameEn:'Be',    exampleFa:'بره',       exampleEn:'Lamb',      exampleIcon:'🐑',  viewBox:VB, outlinePath:OUTLINES['be'], color:'#FF8B2B', strokes:[s('main',BE,1)], dots:[{x:100,y:146.4}] },
  // پ
  { id:'pe',    letter:'پ', nameFa:'پِ',   nameEn:'Pe',    exampleFa:'پروانه',    exampleEn:'Butterfly', exampleIcon:'🦋',  viewBox:VB, outlinePath:OUTLINES['pe'], color:'#9B5CFF', strokes:[s('main',PE,1)], dots:[{x:86.2,y:132.2},{x:99.6,y:151},{x:113,y:132.2}] },
  // ت
  { id:'te',    letter:'ت', nameFa:'تِ',   nameEn:'Te',    exampleFa:'توپ',       exampleEn:'Ball',      exampleIcon:'⚽',  viewBox:VB, outlinePath:OUTLINES['te'], color:'#4CC9F0', strokes:[s('main',TE,1)], dots:[{x:87,y:53.3},{x:111.1,y:53.3}] },
  // ث
  { id:'se',    letter:'ث', nameFa:'ثِ',   nameEn:'Se',    exampleFa:'ثعلب',      exampleEn:'Fox',       exampleIcon:'🦊',  viewBox:VB, outlinePath:OUTLINES['se'], color:'#FF6BB5', strokes:[s('main',SE,1)], dots:[{x:99.6,y:44.1},{x:86.2,y:63.2},{x:113,y:63.2}] },
  // ج
  { id:'jim',   letter:'ج', nameFa:'جیم',  nameEn:'Jim',   exampleFa:'جنگل',      exampleEn:'Jungle',    exampleIcon:'🌴',  viewBox:VB, outlinePath:OUTLINES['jim'], color:'#55D16F', strokes:[s('main',JIM,1)], dots:[{x:102.4,y:113}] },
  // چ
  { id:'che',   letter:'چ', nameFa:'چِ',   nameEn:'Che',   exampleFa:'چتر',       exampleEn:'Umbrella',  exampleIcon:'☂️',  viewBox:VB, outlinePath:OUTLINES['che'], color:'#7A67FF', strokes:[s('main',CHE,1)], dots:[{x:97.2,y:105.1},{x:111,y:124},{x:124.4,y:105.1}] },
  // ح
  { id:'haa',   letter:'ح', nameFa:'حِ',   nameEn:'Ha',    exampleFa:'حلوا',      exampleEn:'Halva',     exampleIcon:'🍬',  viewBox:VB, outlinePath:OUTLINES['haa'], color:'#20C7B3', strokes:[s('main',JIM,1,at([0.1,0.4,0.72]))] },
  // خ
  { id:'khe',   letter:'خ', nameFa:'خِ',   nameEn:'Khe',   exampleFa:'خرس',       exampleEn:'Bear',      exampleIcon:'🐻',  viewBox:VB, outlinePath:OUTLINES['khe'], color:'#F97316', strokes:[s('main',KHE,1,at([0.1,0.4,0.72]))], dots:[{x:117,y:29.5}] },
  // د
  { id:'dal',   letter:'د', nameFa:'دال',  nameEn:'Dal',   exampleFa:'دریا',      exampleEn:'Sea',       exampleIcon:'🌊',  viewBox:VB, outlinePath:OUTLINES['dal'], color:'#4DBFFF', strokes:[s('main',DAL,1,at([0.15,0.5,0.82]))] },
  // ذ
  { id:'zal',   letter:'ذ', nameFa:'ذال',  nameEn:'Zal',   exampleFa:'ذرت',       exampleEn:'Corn',      exampleIcon:'🌽',  viewBox:VB, outlinePath:OUTLINES['zal'], color:'#F6A62B', strokes:[s('main',ZAL,1,at([0.15,0.5,0.82]))], dots:[{x:79.4,y:34.4}] },
  // ر
  { id:'re',    letter:'ر', nameFa:'رِ',   nameEn:'Re',    exampleFa:'رنگ',       exampleEn:'Color',     exampleIcon:'🎨',  viewBox:VB, outlinePath:OUTLINES['re'], color:'#FF8C42', strokes:[s('main',RE,1,at([0.2,0.55,0.85]))] },
  // ز
  { id:'ze',    letter:'ز', nameFa:'زِ',   nameEn:'Ze',    exampleFa:'زرافه',     exampleEn:'Giraffe',   exampleIcon:'🦒',  viewBox:VB, outlinePath:OUTLINES['ze'], color:'#FFD93D', strokes:[s('main',ZE,1,at([0.2,0.55,0.85]))], dots:[{x:112.7,y:34.7}] },
  // ژ
  { id:'zhe',   letter:'ژ', nameFa:'ژِ',   nameEn:'Zhe',   exampleFa:'ژاله',      exampleEn:'Dew',       exampleIcon:'💧',  viewBox:VB, outlinePath:OUTLINES['zhe'], color:'#FF64B8', strokes:[s('main',ZHE,1,at([0.2,0.55,0.85]))], dots:[{x:97,y:50.2},{x:110,y:31.6},{x:122.7,y:50.2}] },
  // س
  { id:'sin',   letter:'س', nameFa:'سین',  nameEn:'Sin',   exampleFa:'سیب',       exampleEn:'Apple',     exampleIcon:'🍎',  viewBox:VB, outlinePath:OUTLINES['sin'], color:'#FF6B6B', strokes:[
    s('main-1', 'M 173.0 70.0 C 174.0 84.0 168.0 99.0 158.0 101.0', 1, at([0.45,0.8])),
    s('main-2', 'M 148.0 101.0 C 148.0 104.0 139.0 104.0 141.0 98.0', 2, at([0.45,0.8])),
    s('main-3', 'M 136.5 87.0 L 136.5 70.0', 3, at([0.45,0.8])),
    s('main-4', 'M 125.5 75.0 L 125.5 92.0', 4, at([0.45,0.8])),
    s('main-5', 'M 123.2 98.1 L 116.4 102.5', 5, at([0.45,0.8])),
    s('main-6', 'M 103.3 101.7 L 100.1 98.1', 6, at([0.45,0.8])),
    s('main-7', 'M 97.0 85.9 L 97.0 74.4', 7, at([0.45,0.8])),
    s('main-8', 'M 86.0 75.0 L 86.0 92.0', 8, at([0.45,0.8])),
    s('main-9', 'M 86.0 100.0 C 86.0 100.0 84.0 126.0 72.0 130.0 C 56.0 136.0 39.0 130.0 30.0 117.0 C 24.0 107.0 24.0 92.0 31.0 82.0', 9, at([0.45,0.8])),
  ] },
  // ش
  { id:'shin',  letter:'ش', nameFa:'شین',  nameEn:'Shin',  exampleFa:'شیر',       exampleEn:'Lion',      exampleIcon:'🦁',  viewBox:VB, outlinePath:OUTLINES['shin'], color:'#FF80C0', strokes:[s('main',SIN,1,at([0.18,0.46,0.76]))], dots:[{x:113.6,y:50},{x:104,y:63.3},{x:122.6,y:63.3}] },
  // ص
  { id:'sad',   letter:'ص', nameFa:'صاد',  nameEn:'Sad',   exampleFa:'صابون',     exampleEn:'Soap',      exampleIcon:'🧼',  viewBox:VB, outlinePath:OUTLINES['sad'], color:'#06B6D4', strokes:[s('main',SAD,1,at([0.18,0.46,0.76]))] },
  // ض
  { id:'zad',   letter:'ض', nameFa:'ضاد',  nameEn:'Zad',   exampleFa:'ضربان',     exampleEn:'Beat',      exampleIcon:'🥁',  viewBox:VB, outlinePath:OUTLINES['zad'], color:'#EC4899', strokes:[s('main',SAD,1,at([0.18,0.46,0.76]))], dots:[{x:113.6,y:50.9}] },
  // ط
  { id:'taa',   letter:'ط', nameFa:'طا',   nameEn:'Ta',    exampleFa:'طبل',       exampleEn:'Drum',      exampleIcon:'🥁',  viewBox:VB, outlinePath:OUTLINES['taa'], color:'#84CC16', strokes:[s('main',TA,1,at([0.3,0.7]))] },
  // ظ
  { id:'zaa',   letter:'ظ', nameFa:'ظا',   nameEn:'Za',    exampleFa:'ظرف',       exampleEn:'Dish',      exampleIcon:'🍽️', viewBox:VB, outlinePath:OUTLINES['zaa'], color:'#8B5CF6', strokes:[s('main',TA,1,at([0.3,0.7]))], dots:[{x:110.9,y:48.6}] },
  // ع
  { id:'eyn',   letter:'ع', nameFa:'عین',  nameEn:'Eyn',   exampleFa:'عروسک',     exampleEn:'Doll',      exampleIcon:'🪆',  viewBox:VB, outlinePath:OUTLINES['eyn'], color:'#F97316', strokes:[s('main',EYN,1,at([0.18,0.46,0.78]))] },
  // غ
  { id:'gheyn', letter:'غ', nameFa:'غین',  nameEn:'Gheyn', exampleFa:'غذا',       exampleEn:'Food',      exampleIcon:'🍲',  viewBox:VB, outlinePath:OUTLINES['gheyn'], color:'#06B6D4', strokes:[s('main',GHEYN,1,at([0.18,0.46,0.78]))], dots:[{x:97.4,y:27.6}] },
  // ف
  { id:'fe',    letter:'ف', nameFa:'فا',   nameEn:'Fe',    exampleFa:'فیل',       exampleEn:'Elephant',  exampleIcon:'🐘',  viewBox:VB, outlinePath:OUTLINES['fe'], color:'#22C55E', strokes:[s('main',FE,1,at([0.25,0.65]))], dots:[{x:127.4,y:36.5}] },
  // ق
  { id:'ghaf',  letter:'ق', nameFa:'قاف',  nameEn:'Qaf',   exampleFa:'قلب',       exampleEn:'Heart',     exampleIcon:'❤️',  viewBox:VB, outlinePath:OUTLINES['ghaf'], color:'#FF4D8C', strokes:[s('main',GHAF,1,at([0.25,0.65]))], dots:[{x:117.5,y:29.1},{x:139,y:29.1}] },
  // ک
  { id:'kaf',   letter:'ک', nameFa:'کاف',  nameEn:'Kaf',   exampleFa:'کتاب',      exampleEn:'Book',      exampleIcon:'📖',  viewBox:VB, outlinePath:OUTLINES['kaf'], color:'#5C6BFF', strokes:[s('main',KAF,1,at([0.3,0.7]))] },
  // گ
  { id:'gaf',   letter:'گ', nameFa:'گاف',  nameEn:'Gaf',   exampleFa:'گربه',      exampleEn:'Cat',       exampleIcon:'🐱',  viewBox:VB, outlinePath:OUTLINES['gaf'], color:'#FF8C42', strokes:[s('main',GAF,1,at([0.3,0.7]))], dots:[{x:150,y:36}] },
  // ل
  { id:'lam',   letter:'ل', nameFa:'لام',  nameEn:'Lam',   exampleFa:'لاک‌پشت',   exampleEn:'Turtle',    exampleIcon:'🐢',  viewBox:VB, outlinePath:OUTLINES['lam'], color:'#4ECDC4', strokes:[s('main',LAM,1,at([0.15,0.48,0.82]))] },
  // م
  { id:'mim',   letter:'م', nameFa:'میم',  nameEn:'Mim',   exampleFa:'ماه',       exampleEn:'Moon',      exampleIcon:'🌙',  viewBox:VB, outlinePath:OUTLINES['mim'], color:'#FFD93D', strokes:[s('main',MIM,1,at([0.22,0.52,0.82]))] },
  // ن
  { id:'nun',   letter:'ن', nameFa:'نون',  nameEn:'Nun',   exampleFa:'نخل',       exampleEn:'Palm',      exampleIcon:'🌴',  viewBox:VB, outlinePath:OUTLINES['nun'], color:'#5BDA7A', strokes:[s('main',NOON,1)], dots:[{x:99.1,y:70.9}] },
  // و
  { id:'vav',   letter:'و', nameFa:'واو',  nameEn:'Vav',   exampleFa:'ورزش',      exampleEn:'Sports',    exampleIcon:'⚽',  viewBox:VB, outlinePath:OUTLINES['vav'], color:'#4CC9F0', strokes:[s('main',VAV,1,at([0.18,0.5,0.8]))] },
  // ه
  { id:'heh',   letter:'ه', nameFa:'هِ',   nameEn:'He',    exampleFa:'هندوانه',   exampleEn:'Watermelon',exampleIcon:'🍉',  viewBox:VB, outlinePath:OUTLINES['heh'], color:'#FF6B6B', strokes:[s('main',HEH,1,at([0.12,0.38,0.65,0.88]))] },
  // ی
  { id:'ye',    letter:'ی', nameFa:'یِ',   nameEn:'Ye',    exampleFa:'یوزپلنگ',   exampleEn:'Cheetah',   exampleIcon:'🐆',  viewBox:VB, outlinePath:OUTLINES['ye'], color:'#C77DFF', strokes:[s('main',YE,1,at([0.18,0.48,0.78]))] },
];

export const FARSI_LETTER_BY_ID = Object.fromEntries(
  FARSI_LETTERS.map(item => [item.id, item])
) as Record<string, FarsiLetter>;
