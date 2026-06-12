// Farsi alphabet tracing data.
// All paths are in a 200×200 viewBox.
// Start point = where the green dot is placed (where the child begins).
// Paths follow correct Farsi handwriting direction (generally right-to-left).

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
  strokes: FarsiStroke[];
  dots?: { x: number; y: number }[];
  color?: string;
};

const VB = '0 0 200 200';
const at = (ts: number[]) => ts.map(t => ({ t }));
const s = (id: string, path: string, n?: number, arrows = at([0.25, 0.55, 0.82])) =>
  ({ id, path, startLabel: n, arrows });

// ─── Corrected paths ──────────────────────────────────────────────────────────
// Each path starts at the correct handwriting start point (marked by green dot).

// ا Alef — single vertical stroke, top down
const ALEF = 'M 100 28 L 100 172';

// Bowl shape used by ب پ ت ث ن — traced from the Vazirmatn glyph centerline.
// Direction: start at the upper-right arm, travel down and across the bottom, then up the upper-left arm.
const BOWL = 'M 169 32 L 161 50 L 162 73 L 159 87 L 148 98 L 127 103 L 74 102 L 50 94 L 41 85 L 38 72 L 39 50 L 49 42';

// ج چ ح خ — the "jeem" cup shape, starts top-right, goes down-right, curves under left
const JIM_CUP = 'M 148 58 Q 164 58 164 80 Q 164 128 130 152 Q 98 172 64 154 Q 38 138 42 108';

// ح — open top variant (no hump inside), same cup
const HA_OPEN = 'M 155 55 Q 168 55 168 78 Q 168 130 132 155 Q 100 174 66 156 Q 40 140 44 110 Q 50 84 78 78 Q 108 70 122 82 Q 136 96 118 102 Q 100 108 86 100';

// د ذ — shelf shape, starts top-right curves down-left
const DAL = 'M 126 44 Q 150 44 153 70 Q 156 98 136 130 Q 116 158 80 158 L 46 158';

// ر ز ژ — simple hook, starts top curves down-right
const RE = 'M 113 42 Q 132 42 135 66 Q 138 92 120 160';

// س ش — three humps right to left
const SIN = 'M 172 98 Q 152 82 132 98 Q 116 110 116 98 Q 116 86 100 98 Q 84 110 84 98 Q 84 86 62 98 Q 40 112 36 134 Q 31 158 60 162 Q 92 168 124 156 Q 156 144 170 122 Q 180 108 172 98';

// ص ض — loop right side then long tail sweeping left
const SAD = 'M 165 90 Q 165 62 140 62 Q 115 62 115 90 Q 115 118 140 118 Q 163 118 165 100 Q 170 80 148 78 Q 108 74 78 96 Q 48 118 44 142 Q 40 164 70 168 Q 102 172 136 160 Q 164 148 172 124';

// ط ظ — vertical stroke + bowl underneath
const TA_VERT = 'M 158 44 L 158 162';
const TA_BOWL = 'M 158 100 Q 128 82 96 100 Q 68 116 66 148 Q 64 166 86 169';

// ع غ — eye shape
const EYN = 'M 144 68 Q 162 50 162 76 Q 162 104 134 104 Q 108 104 108 76 Q 108 58 126 58 Q 144 58 144 76 Q 152 102 140 126 Q 124 156 86 160 Q 58 162 48 140';

// ف ق — small circle top-right + long tail sweeping left
const FE_CIRCLE = 'M 160 88 Q 160 60 134 60 Q 108 60 108 88 Q 108 116 134 116 Q 157 116 160 100';
const FE_TAIL   = 'M 160 100 Q 170 108 100 106 Q 56 106 40 134 Q 30 156 56 164 Q 86 172 138 160';

// ک گ — vertical stroke + diagonal arm sweeping right-to-left
const KAF_VERT = 'M 160 44 L 160 162';
const KAF_ARM  = 'M 160 92 Q 130 84 98 102 Q 70 118 68 150 Q 66 168 86 171';

// ل — tall left-leaning arc
const LAM = 'M 134 26 Q 152 26 152 52 Q 152 104 124 146 Q 104 172 66 166 Q 40 160 40 136';

// م — closed pretzel loop
const MIM = 'M 160 78 Q 160 54 138 54 Q 116 54 116 78 Q 116 102 138 102 Q 156 102 160 86 Q 166 68 142 68 Q 108 68 86 92 Q 60 120 60 150 Q 60 170 84 170';

// و — open loop
const VAV = 'M 134 56 Q 165 56 165 88 Q 165 122 134 138 Q 102 152 72 138 Q 44 122 50 88';

// ه — figure-eight: two loops
const HEH = 'M 144 76 Q 144 54 122 54 Q 100 54 100 76 Q 100 98 122 98 Q 144 98 144 76 M 100 76 Q 78 76 62 100 Q 46 122 58 146 Q 70 165 102 165 Q 134 165 150 145 Q 166 124 154 100';

// ی — curved bowl, dots below
const YE = 'M 165 78 Q 142 60 110 68 Q 78 74 62 98 Q 46 122 58 146 Q 70 168 104 171 Q 140 174 160 152 Q 178 132 168 106';

export const FARSI_LETTERS: FarsiLetter[] = [
  // ا
  { id:'alef',  letter:'ا', nameFa:'الف',  nameEn:'Alef',  exampleFa:'ابر',       exampleEn:'Cloud',     exampleIcon:'☁️',  viewBox:VB, color:'#F15A7B', strokes:[s('main',ALEF,1,at([0.18,0.5,0.82]))] },
  // ب
  { id:'be',    letter:'ب', nameFa:'بِ',   nameEn:'Be',    exampleFa:'بره',       exampleEn:'Lamb',      exampleIcon:'🐑',  viewBox:VB, color:'#FF8B2B', strokes:[s('main',BOWL,1)], dots:[{x:102,y:150}] },
  // پ
  { id:'pe',    letter:'پ', nameFa:'پِ',   nameEn:'Pe',    exampleFa:'پروانه',    exampleEn:'Butterfly', exampleIcon:'🦋',  viewBox:VB, color:'#9B5CFF', strokes:[s('main',BOWL,1)], dots:[{x:86,y:164},{x:100,y:168},{x:114,y:164}] },
  // ت
  { id:'te',    letter:'ت', nameFa:'تِ',   nameEn:'Te',    exampleFa:'توپ',       exampleEn:'Ball',      exampleIcon:'⚽',  viewBox:VB, color:'#4CC9F0', strokes:[s('main',BOWL,1)], dots:[{x:88,y:68},{x:112,y:64}] },
  // ث
  { id:'se',    letter:'ث', nameFa:'ثِ',   nameEn:'Se',    exampleFa:'ثعلب',      exampleEn:'Fox',       exampleIcon:'🦊',  viewBox:VB, color:'#FF6BB5', strokes:[s('main',BOWL,1)], dots:[{x:84,y:64},{x:100,y:60},{x:116,y:64}] },
  // ج
  { id:'jim',   letter:'ج', nameFa:'جیم',  nameEn:'Jim',   exampleFa:'جنگل',      exampleEn:'Jungle',    exampleIcon:'🌴',  viewBox:VB, color:'#55D16F', strokes:[s('main',JIM_CUP,1)], dots:[{x:118,y:104}] },
  // چ
  { id:'che',   letter:'چ', nameFa:'چِ',   nameEn:'Che',   exampleFa:'چتر',       exampleEn:'Umbrella',  exampleIcon:'☂️',  viewBox:VB, color:'#7A67FF', strokes:[s('main',JIM_CUP,1)], dots:[{x:104,y:100},{x:118,y:96},{x:132,y:100}] },
  // ح
  { id:'haa',   letter:'ح', nameFa:'حِ',   nameEn:'Ha',    exampleFa:'حلوا',      exampleEn:'Halva',     exampleIcon:'🍬',  viewBox:VB, color:'#20C7B3', strokes:[s('main',HA_OPEN,1,at([0.1,0.4,0.72]))] },
  // خ
  { id:'khe',   letter:'خ', nameFa:'خِ',   nameEn:'Khe',   exampleFa:'خرس',       exampleEn:'Bear',      exampleIcon:'🐻',  viewBox:VB, color:'#F97316', strokes:[s('main',HA_OPEN,1,at([0.1,0.4,0.72]))], dots:[{x:130,y:44}] },
  // د
  { id:'dal',   letter:'د', nameFa:'دال',  nameEn:'Dal',   exampleFa:'دریا',      exampleEn:'Sea',       exampleIcon:'🌊',  viewBox:VB, color:'#4DBFFF', strokes:[s('main',DAL,1,at([0.15,0.5,0.82]))] },
  // ذ
  { id:'zal',   letter:'ذ', nameFa:'ذال',  nameEn:'Zal',   exampleFa:'ذرت',       exampleEn:'Corn',      exampleIcon:'🌽',  viewBox:VB, color:'#F6A62B', strokes:[s('main',DAL,1,at([0.15,0.5,0.82]))], dots:[{x:130,y:34}] },
  // ر
  { id:'re',    letter:'ر', nameFa:'رِ',   nameEn:'Re',    exampleFa:'رنگ',       exampleEn:'Color',     exampleIcon:'🎨',  viewBox:VB, color:'#FF8C42', strokes:[s('main',RE,1,at([0.2,0.55,0.85]))] },
  // ز
  { id:'ze',    letter:'ز', nameFa:'زِ',   nameEn:'Ze',    exampleFa:'زرافه',     exampleEn:'Giraffe',   exampleIcon:'🦒',  viewBox:VB, color:'#FFD93D', strokes:[s('main',RE,1,at([0.2,0.55,0.85]))], dots:[{x:128,y:68}] },
  // ژ
  { id:'zhe',   letter:'ژ', nameFa:'ژِ',   nameEn:'Zhe',   exampleFa:'ژاله',      exampleEn:'Dew',       exampleIcon:'💧',  viewBox:VB, color:'#FF64B8', strokes:[s('main',RE,1,at([0.2,0.55,0.85]))], dots:[{x:108,y:46},{x:122,y:42},{x:136,y:46}] },
  // س
  { id:'sin',   letter:'س', nameFa:'سین',  nameEn:'Sin',   exampleFa:'سیب',       exampleEn:'Apple',     exampleIcon:'🍎',  viewBox:VB, color:'#FF6B6B', strokes:[s('main',SIN,1,at([0.18,0.46,0.76]))] },
  // ش
  { id:'shin',  letter:'ش', nameFa:'شین',  nameEn:'Shin',  exampleFa:'شیر',       exampleEn:'Lion',      exampleIcon:'🦁',  viewBox:VB, color:'#FF80C0', strokes:[s('main',SIN,1,at([0.18,0.46,0.76]))], dots:[{x:104,y:66},{x:118,y:62},{x:132,y:66}] },
  // ص
  { id:'sad',   letter:'ص', nameFa:'صاد',  nameEn:'Sad',   exampleFa:'صابون',     exampleEn:'Soap',      exampleIcon:'🧼',  viewBox:VB, color:'#06B6D4', strokes:[s('main',SAD,1,at([0.18,0.46,0.76]))] },
  // ض
  { id:'zad',   letter:'ض', nameFa:'ضاد',  nameEn:'Zad',   exampleFa:'ضربان',     exampleEn:'Beat',      exampleIcon:'🥁',  viewBox:VB, color:'#EC4899', strokes:[s('main',SAD,1,at([0.18,0.46,0.76]))], dots:[{x:148,y:52}] },
  // ط
  { id:'taa',   letter:'ط', nameFa:'طا',   nameEn:'Ta',    exampleFa:'طبل',       exampleEn:'Drum',      exampleIcon:'🥁',  viewBox:VB, color:'#84CC16', strokes:[s('vert',TA_VERT,1,at([0.3,0.7])),s('bowl',TA_BOWL,2,at([0.3,0.7]))] },
  // ظ
  { id:'zaa',   letter:'ظ', nameFa:'ظا',   nameEn:'Za',    exampleFa:'ظرف',       exampleEn:'Dish',      exampleIcon:'🍽️', viewBox:VB, color:'#8B5CF6', strokes:[s('vert',TA_VERT,1,at([0.3,0.7])),s('bowl',TA_BOWL,2,at([0.3,0.7]))], dots:[{x:148,y:36}] },
  // ع
  { id:'eyn',   letter:'ع', nameFa:'عین',  nameEn:'Eyn',   exampleFa:'عروسک',     exampleEn:'Doll',      exampleIcon:'🪆',  viewBox:VB, color:'#F97316', strokes:[s('main',EYN,1,at([0.18,0.46,0.78]))] },
  // غ
  { id:'gheyn', letter:'غ', nameFa:'غین',  nameEn:'Gheyn', exampleFa:'غذا',       exampleEn:'Food',      exampleIcon:'🍲',  viewBox:VB, color:'#06B6D4', strokes:[s('main',EYN,1,at([0.18,0.46,0.78]))], dots:[{x:136,y:48}] },
  // ف
  { id:'fe',    letter:'ف', nameFa:'فا',   nameEn:'Fe',    exampleFa:'فیل',       exampleEn:'Elephant',  exampleIcon:'🐘',  viewBox:VB, color:'#22C55E', strokes:[s('circ',FE_CIRCLE,1,at([0.25,0.65])),s('tail',FE_TAIL,2,at([0.35,0.7]))], dots:[{x:134,y:46}] },
  // ق
  { id:'ghaf',  letter:'ق', nameFa:'قاف',  nameEn:'Qaf',   exampleFa:'قلب',       exampleEn:'Heart',     exampleIcon:'❤️',  viewBox:VB, color:'#FF4D8C', strokes:[s('circ',FE_CIRCLE,1,at([0.25,0.65])),s('tail',FE_TAIL,2,at([0.35,0.7]))], dots:[{x:120,y:46},{x:144,y:46}] },
  // ک
  { id:'kaf',   letter:'ک', nameFa:'کاف',  nameEn:'Kaf',   exampleFa:'کتاب',      exampleEn:'Book',      exampleIcon:'📖',  viewBox:VB, color:'#5C6BFF', strokes:[s('vert',KAF_VERT,1,at([0.3,0.7])),s('arm',KAF_ARM,2,at([0.3,0.7]))] },
  // گ
  { id:'gaf',   letter:'گ', nameFa:'گاف',  nameEn:'Gaf',   exampleFa:'گربه',      exampleEn:'Cat',       exampleIcon:'🐱',  viewBox:VB, color:'#FF8C42', strokes:[s('vert',KAF_VERT,1,at([0.3,0.7])),s('arm',KAF_ARM,2,at([0.3,0.7]))], dots:[{x:150,y:36}] },
  // ل
  { id:'lam',   letter:'ل', nameFa:'لام',  nameEn:'Lam',   exampleFa:'لاک‌پشت',   exampleEn:'Turtle',    exampleIcon:'🐢',  viewBox:VB, color:'#4ECDC4', strokes:[s('main',LAM,1,at([0.15,0.48,0.82]))] },
  // م
  { id:'mim',   letter:'م', nameFa:'میم',  nameEn:'Mim',   exampleFa:'ماه',       exampleEn:'Moon',      exampleIcon:'🌙',  viewBox:VB, color:'#FFD93D', strokes:[s('main',MIM,1,at([0.22,0.52,0.82]))] },
  // ن
  { id:'nun',   letter:'ن', nameFa:'نون',  nameEn:'Nun',   exampleFa:'نخل',       exampleEn:'Palm',      exampleIcon:'🌴',  viewBox:VB, color:'#5BDA7A', strokes:[s('main',BOWL,1)], dots:[{x:105,y:66}] },
  // و
  { id:'vav',   letter:'و', nameFa:'واو',  nameEn:'Vav',   exampleFa:'ورزش',      exampleEn:'Sports',    exampleIcon:'⚽',  viewBox:VB, color:'#4CC9F0', strokes:[s('main',VAV,1,at([0.18,0.5,0.8]))] },
  // ه
  { id:'heh',   letter:'ه', nameFa:'هِ',   nameEn:'He',    exampleFa:'هندوانه',   exampleEn:'Watermelon',exampleIcon:'🍉',  viewBox:VB, color:'#FF6B6B', strokes:[s('main',HEH,1,at([0.12,0.38,0.65,0.88]))] },
  // ی
  { id:'ye',    letter:'ی', nameFa:'یِ',   nameEn:'Ye',    exampleFa:'یوزپلنگ',   exampleEn:'Cheetah',   exampleIcon:'🐆',  viewBox:VB, color:'#C77DFF', strokes:[s('main',YE,1,at([0.18,0.48,0.78]))], dots:[{x:98,y:178},{x:122,y:182}] },
];

export const FARSI_LETTER_BY_ID = Object.fromEntries(
  FARSI_LETTERS.map(item => [item.id, item])
) as Record<string, FarsiLetter>;
