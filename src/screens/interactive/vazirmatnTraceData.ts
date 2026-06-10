export type TracePoint = [number, number];
export type TraceStroke = TracePoint[];

export type VazirTraceItem = {
  id: string;
  image: any;
  strokes: TraceStroke[];
  dots: Array<{ x: number; y: number }>;
};

const IMAGE_BY_ID = {
  alef: require('../../../assets/neli-world/trace-letters/alef.png'),
  be: require('../../../assets/neli-world/trace-letters/be.png'),
  pe: require('../../../assets/neli-world/trace-letters/pe.png'),
  te: require('../../../assets/neli-world/trace-letters/te.png'),
  se: require('../../../assets/neli-world/trace-letters/se.png'),
  jim: require('../../../assets/neli-world/trace-letters/jim.png'),
  che: require('../../../assets/neli-world/trace-letters/che.png'),
  'he-jimi': require('../../../assets/neli-world/trace-letters/he-jimi.png'),
  khe: require('../../../assets/neli-world/trace-letters/khe.png'),
  dal: require('../../../assets/neli-world/trace-letters/dal.png'),
  zal: require('../../../assets/neli-world/trace-letters/zal.png'),
  re: require('../../../assets/neli-world/trace-letters/re.png'),
  ze: require('../../../assets/neli-world/trace-letters/ze.png'),
  zhe: require('../../../assets/neli-world/trace-letters/zhe.png'),
  sin: require('../../../assets/neli-world/trace-letters/sin.png'),
  shin: require('../../../assets/neli-world/trace-letters/shin.png'),
  sad: require('../../../assets/neli-world/trace-letters/sad.png'),
  zad: require('../../../assets/neli-world/trace-letters/zad.png'),
  ta: require('../../../assets/neli-world/trace-letters/ta.png'),
  za: require('../../../assets/neli-world/trace-letters/za.png'),
  eyn: require('../../../assets/neli-world/trace-letters/eyn.png'),
  gheyn: require('../../../assets/neli-world/trace-letters/gheyn.png'),
  fe: require('../../../assets/neli-world/trace-letters/fe.png'),
  ghaf: require('../../../assets/neli-world/trace-letters/ghaf.png'),
  kaf: require('../../../assets/neli-world/trace-letters/kaf.png'),
  gaf: require('../../../assets/neli-world/trace-letters/gaf.png'),
  lam: require('../../../assets/neli-world/trace-letters/lam.png'),
  mim: require('../../../assets/neli-world/trace-letters/mim.png'),
  noon: require('../../../assets/neli-world/trace-letters/noon.png'),
  vav: require('../../../assets/neli-world/trace-letters/vav.png'),
  he: require('../../../assets/neli-world/trace-letters/he.png'),
  ye: require('../../../assets/neli-world/trace-letters/ye.png'),
} as const;

const VERTICAL: TraceStroke = [
  [0.5, 0.12],
  [0.5, 0.22],
  [0.5, 0.32],
  [0.5, 0.42],
  [0.5, 0.52],
  [0.5, 0.62],
  [0.5, 0.72],
  [0.5, 0.82],
  [0.5, 0.9],
];

const BOWL: TraceStroke = [
  [0.78, 0.2],
  [0.71, 0.27],
  [0.63, 0.34],
  [0.55, 0.39],
  [0.46, 0.43],
  [0.36, 0.45],
  [0.27, 0.43],
  [0.2, 0.38],
  [0.17, 0.31],
  [0.18, 0.23],
  [0.24, 0.17],
  [0.32, 0.14],
  [0.42, 0.15],
  [0.53, 0.18],
  [0.64, 0.23],
  [0.73, 0.3],
  [0.79, 0.39],
  [0.82, 0.49],
  [0.81, 0.61],
  [0.77, 0.71],
];

const JIM: TraceStroke = [
  [0.69, 0.24],
  [0.62, 0.3],
  [0.55, 0.37],
  [0.48, 0.46],
  [0.42, 0.56],
  [0.39, 0.65],
  [0.4, 0.74],
  [0.46, 0.8],
  [0.54, 0.82],
  [0.63, 0.79],
  [0.71, 0.72],
  [0.77, 0.63],
];

const HA: TraceStroke = [
  [0.79, 0.22],
  [0.72, 0.29],
  [0.64, 0.37],
  [0.56, 0.46],
  [0.5, 0.56],
  [0.45, 0.67],
  [0.42, 0.78],
  [0.43, 0.87],
  [0.49, 0.9],
  [0.58, 0.88],
  [0.66, 0.82],
  [0.73, 0.74],
];

const DAL: TraceStroke = [
  [0.77, 0.23],
  [0.71, 0.28],
  [0.64, 0.33],
  [0.56, 0.38],
  [0.48, 0.43],
  [0.39, 0.47],
  [0.3, 0.49],
  [0.22, 0.49],
  [0.16, 0.46],
];

const SIN: TraceStroke = [
  [0.18, 0.6],
  [0.25, 0.54],
  [0.33, 0.59],
  [0.41, 0.52],
  [0.49, 0.6],
  [0.58, 0.52],
  [0.66, 0.59],
  [0.74, 0.52],
  [0.82, 0.56],
];

const SAD: TraceStroke = [
  [0.18, 0.64],
  [0.25, 0.56],
  [0.33, 0.62],
  [0.41, 0.54],
  [0.49, 0.62],
  [0.57, 0.55],
  [0.66, 0.62],
  [0.74, 0.56],
  [0.82, 0.62],
  [0.84, 0.73],
  [0.78, 0.8],
];

const EYN: TraceStroke = [
  [0.72, 0.25],
  [0.64, 0.33],
  [0.57, 0.42],
  [0.52, 0.52],
  [0.49, 0.63],
  [0.51, 0.73],
  [0.57, 0.8],
  [0.66, 0.84],
  [0.75, 0.82],
  [0.8, 0.75],
  [0.79, 0.66],
  [0.74, 0.57],
];

const FE: TraceStroke = [
  [0.35, 0.24],
  [0.44, 0.2],
  [0.54, 0.22],
  [0.63, 0.28],
  [0.68, 0.37],
  [0.69, 0.48],
  [0.66, 0.58],
  [0.59, 0.66],
  [0.5, 0.71],
  [0.4, 0.72],
  [0.33, 0.67],
  [0.31, 0.6],
];

const KAF_TOP: TraceStroke = [
  [0.38, 0.22],
  [0.45, 0.2],
  [0.53, 0.22],
  [0.6, 0.26],
];

const KAF_BODY: TraceStroke = [
  [0.63, 0.28],
  [0.57, 0.37],
  [0.52, 0.47],
  [0.49, 0.58],
  [0.5, 0.69],
  [0.56, 0.79],
  [0.65, 0.84],
];

const LAM: TraceStroke = [
  [0.5, 0.1],
  [0.5, 0.2],
  [0.5, 0.31],
  [0.5, 0.42],
  [0.5, 0.54],
  [0.5, 0.66],
  [0.5, 0.79],
  [0.52, 0.91],
];

const MIM: TraceStroke = [
  [0.4, 0.51],
  [0.46, 0.41],
  [0.56, 0.37],
  [0.66, 0.41],
  [0.71, 0.51],
  [0.69, 0.63],
  [0.61, 0.71],
  [0.5, 0.73],
  [0.42, 0.69],
  [0.38, 0.6],
];

const NOON: TraceStroke = [
  [0.33, 0.37],
  [0.42, 0.31],
  [0.54, 0.29],
  [0.65, 0.33],
  [0.73, 0.41],
  [0.77, 0.52],
  [0.76, 0.63],
  [0.7, 0.71],
  [0.6, 0.76],
  [0.49, 0.76],
  [0.39, 0.73],
  [0.32, 0.66],
];

const VAV: TraceStroke = [
  [0.72, 0.25],
  [0.66, 0.34],
  [0.58, 0.42],
  [0.49, 0.5],
  [0.41, 0.57],
  [0.34, 0.6],
  [0.28, 0.58],
  [0.25, 0.52],
];

const HE: TraceStroke = [
  [0.4, 0.26],
  [0.49, 0.22],
  [0.59, 0.25],
  [0.67, 0.32],
  [0.7, 0.42],
  [0.69, 0.53],
  [0.63, 0.62],
  [0.54, 0.67],
  [0.44, 0.66],
  [0.36, 0.59],
  [0.33, 0.5],
  [0.34, 0.4],
];

const YE: TraceStroke = [
  [0.68, 0.24],
  [0.61, 0.33],
  [0.53, 0.42],
  [0.45, 0.5],
  [0.37, 0.57],
  [0.3, 0.6],
  [0.24, 0.58],
  [0.21, 0.52],
];

export const VAZIR_TRACE_LETTERS: VazirTraceItem[] = [
  { id: 'alef', image: IMAGE_BY_ID.alef, strokes: [VERTICAL], dots: [] },
  { id: 'be', image: IMAGE_BY_ID.be, strokes: [BOWL], dots: [{ x: 0.52, y: 0.86 }] },
  { id: 'pe', image: IMAGE_BY_ID.pe, strokes: [BOWL], dots: [{ x: 0.42, y: 0.87 }, { x: 0.52, y: 0.91 }, { x: 0.62, y: 0.87 }] },
  { id: 'te', image: IMAGE_BY_ID.te, strokes: [BOWL], dots: [{ x: 0.41, y: 0.12 }, { x: 0.59, y: 0.12 }] },
  { id: 'se', image: IMAGE_BY_ID.se, strokes: [BOWL], dots: [{ x: 0.38, y: 0.11 }, { x: 0.5, y: 0.1 }, { x: 0.62, y: 0.11 }] },
  { id: 'jim', image: IMAGE_BY_ID.jim, strokes: [JIM], dots: [{ x: 0.53, y: 0.84 }] },
  { id: 'che', image: IMAGE_BY_ID.che, strokes: [JIM], dots: [{ x: 0.42, y: 0.86 }, { x: 0.53, y: 0.9 }, { x: 0.64, y: 0.86 }] },
  { id: 'he-jimi', image: IMAGE_BY_ID['he-jimi'], strokes: [HA], dots: [] },
  { id: 'khe', image: IMAGE_BY_ID.khe, strokes: [HA], dots: [{ x: 0.62, y: 0.16 }] },
  { id: 'dal', image: IMAGE_BY_ID.dal, strokes: [DAL], dots: [] },
  { id: 'zal', image: IMAGE_BY_ID.zal, strokes: [DAL], dots: [{ x: 0.52, y: 0.12 }] },
  { id: 're', image: IMAGE_BY_ID.re, strokes: [DAL], dots: [] },
  { id: 'ze', image: IMAGE_BY_ID.ze, strokes: [DAL], dots: [{ x: 0.52, y: 0.12 }] },
  { id: 'zhe', image: IMAGE_BY_ID.zhe, strokes: [DAL], dots: [{ x: 0.4, y: 0.11 }, { x: 0.52, y: 0.1 }, { x: 0.64, y: 0.11 }] },
  { id: 'sin', image: IMAGE_BY_ID.sin, strokes: [SIN], dots: [] },
  { id: 'shin', image: IMAGE_BY_ID.shin, strokes: [SIN], dots: [{ x: 0.38, y: 0.12 }, { x: 0.5, y: 0.11 }, { x: 0.62, y: 0.12 }] },
  { id: 'sad', image: IMAGE_BY_ID.sad, strokes: [SAD], dots: [] },
  { id: 'zad', image: IMAGE_BY_ID.zad, strokes: [SAD], dots: [{ x: 0.52, y: 0.12 }] },
  { id: 'ta', image: IMAGE_BY_ID.ta, strokes: [SAD], dots: [] },
  { id: 'za', image: IMAGE_BY_ID.za, strokes: [SAD], dots: [{ x: 0.52, y: 0.12 }] },
  { id: 'eyn', image: IMAGE_BY_ID.eyn, strokes: [EYN], dots: [] },
  { id: 'gheyn', image: IMAGE_BY_ID.gheyn, strokes: [EYN], dots: [{ x: 0.56, y: 0.12 }] },
  { id: 'fe', image: IMAGE_BY_ID.fe, strokes: [FE], dots: [{ x: 0.53, y: 0.16 }] },
  { id: 'ghaf', image: IMAGE_BY_ID.ghaf, strokes: [FE], dots: [{ x: 0.46, y: 0.15 }, { x: 0.6, y: 0.15 }] },
  { id: 'kaf', image: IMAGE_BY_ID.kaf, strokes: [KAF_TOP, KAF_BODY], dots: [] },
  { id: 'gaf', image: IMAGE_BY_ID.gaf, strokes: [KAF_TOP, KAF_BODY], dots: [] },
  { id: 'lam', image: IMAGE_BY_ID.lam, strokes: [LAM], dots: [] },
  { id: 'mim', image: IMAGE_BY_ID.mim, strokes: [MIM], dots: [] },
  { id: 'noon', image: IMAGE_BY_ID.noon, strokes: [NOON], dots: [] },
  { id: 'vav', image: IMAGE_BY_ID.vav, strokes: [VAV], dots: [] },
  { id: 'he', image: IMAGE_BY_ID.he, strokes: [HE], dots: [] },
  { id: 'ye', image: IMAGE_BY_ID.ye, strokes: [YE], dots: [{ x: 0.4, y: 0.9 }, { x: 0.6, y: 0.9 }] },
] as const;
