// Original, editable tracing data for the Persian/Farsi alphabet.
// Final designer-approved stroke paths can replace these approximations later
// without changing the component structure.

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

const viewBox = '0 0 200 200';

const arrows = (t: number[] = [0.25, 0.55, 0.82]) => t.map(value => ({ t: value }));
const stroke = (id: string, path: string, startLabel?: number, arrowsList: { t: number; rotation?: number }[] = arrows()) => ({ id, path, startLabel, arrows: arrowsList });

const ALEF = 'M 100 28 C 100 68 100 104 100 170';
const BOWL = 'M 160 90 Q 100 80 60 90 Q 30 100 40 120 Q 50 145 100 140 Q 150 135 160 120 Q 170 105 160 90';
const JIM = 'M 150 60 Q 160 60 160 80 Q 160 120 130 145 Q 100 165 70 150 Q 45 135 50 110';
const HA = 'M 140 80 Q 140 60 120 60 Q 100 60 100 80 Q 100 100 120 100 Q 140 100 140 80 M 100 80 Q 80 80 65 100 Q 50 120 60 140 Q 70 158 100 158 Q 130 158 145 140 Q 160 122 150 100';
const DAL = 'M 120 50 Q 140 50 145 75 Q 148 100 130 130 Q 110 155 80 155 L 50 155';
const RE = 'M 110 50 Q 125 50 128 70 Q 130 90 115 155';
const SIN = 'M 170 100 Q 150 85 130 100 Q 115 112 115 100 Q 115 88 100 100 Q 85 112 85 100 Q 85 88 65 100 Q 45 112 40 130 Q 35 150 60 155 Q 90 160 120 150 Q 150 140 165 120 Q 175 108 170 100';
const SAD = 'M 18 128 Q 22 84 55 88 Q 80 92 92 116 Q 102 135 116 142 Q 130 150 150 142 Q 170 134 184 114 Q 196 98 184 80';
const EYN = 'M 140 70 Q 155 55 155 80 Q 155 100 130 100 Q 105 100 105 80 Q 105 65 120 65 Q 135 65 140 80 Q 148 100 140 120 Q 125 150 90 155 Q 65 158 55 140';
const FE = 'M 155 90 Q 155 65 130 65 Q 105 65 105 90 Q 105 115 130 115 Q 150 115 155 100 Q 160 74 140 74 Q 110 75 90 95 Q 65 118 65 145 Q 65 165 85 165';
const KAF_TOP = 'M 38 52 Q 52 44 68 47 Q 82 50 90 60';
const KAF_BODY = 'M 90 60 Q 125 80 130 110 Q 136 145 110 160 Q 92 170 78 165';
const LAM = 'M 130 30 Q 145 30 145 55 Q 145 100 120 140 Q 100 165 70 160 Q 45 155 45 135';
const MIM = 'M 155 80 Q 155 60 135 60 Q 115 60 115 80 Q 115 100 135 100 Q 150 100 155 88 Q 160 75 140 75 Q 110 75 90 95 Q 65 118 65 145 Q 65 165 85 165';
const NOON = 'M 160 90 Q 100 75 55 90 Q 30 100 35 125 Q 40 150 80 155 Q 120 160 150 145 Q 175 132 160 90';
const VAV = 'M 130 60 Q 158 60 158 90 Q 158 120 130 135 Q 100 148 75 135 Q 50 120 55 90';
const HE = 'M 42 86 Q 42 64 64 60 Q 86 56 96 74 Q 107 93 92 106 Q 78 118 57 115 Q 40 112 32 98 Q 24 82 42 86';
const YE = 'M 160 80 Q 140 65 110 70 Q 80 75 65 95 Q 50 115 60 140 Q 70 162 100 165 Q 135 168 155 148 Q 172 130 165 105';

const repeatDots = (dots: { x: number; y: number }[]) => dots;

export const FARSI_LETTERS: FarsiLetter[] = [
  { id: 'alef', letter: 'ا', nameFa: 'الف', nameEn: 'Alef', exampleFa: 'ابر', exampleEn: 'Cloud', exampleIcon: '☁️', viewBox, strokes: [stroke('main', ALEF, 1, arrows([0.1, 0.45, 0.8]))], color: '#F15A7B' },
  { id: 'be', letter: 'ب', nameFa: 'بِ', nameEn: 'Be', exampleFa: 'بره', exampleEn: 'Lamb', exampleIcon: '🐑', viewBox, strokes: [stroke('main', BOWL, 1)], dots: repeatDots([{ x: 100, y: 158 }]), color: '#FF8B2B' },
  { id: 'pe', letter: 'پ', nameFa: 'پِ', nameEn: 'Pe', exampleFa: 'پروانه', exampleEn: 'Butterfly', exampleIcon: '🦋', viewBox, strokes: [stroke('main', BOWL, 1)], dots: repeatDots([{ x: 88, y: 160 }, { x: 100, y: 160 }, { x: 112, y: 160 }]), color: '#9B5CFF' },
  { id: 'te', letter: 'ت', nameFa: 'تِ', nameEn: 'Te', exampleFa: 'توپ', exampleEn: 'Ball', exampleIcon: '⚽', viewBox, strokes: [stroke('main', BOWL, 1)], dots: repeatDots([{ x: 86, y: 70 }, { x: 114, y: 70 }]), color: '#4CC9F0' },
  { id: 'se', letter: 'ث', nameFa: 'ثِ', nameEn: 'Se', exampleFa: 'ثعلب', exampleEn: 'Fox', exampleIcon: '🦊', viewBox, strokes: [stroke('main', BOWL, 1)], dots: repeatDots([{ x: 82, y: 66 }, { x: 100, y: 64 }, { x: 118, y: 66 }]), color: '#FF6BB5' },
  { id: 'jim', letter: 'ج', nameFa: 'جیم', nameEn: 'Jim', exampleFa: 'جنگل', exampleEn: 'Jungle', exampleIcon: '🌴', viewBox, strokes: [stroke('main', JIM, 1)], dots: repeatDots([{ x: 120, y: 106 }]), color: '#55D16F' },
  { id: 'che', letter: 'چ', nameFa: 'چِ', nameEn: 'Che', exampleFa: 'چتر', exampleEn: 'Umbrella', exampleIcon: '☂️', viewBox, strokes: [stroke('main', JIM, 1)], dots: repeatDots([{ x: 86, y: 66 }, { x: 100, y: 64 }, { x: 114, y: 66 }]), color: '#7A67FF' },
  { id: 'he', letter: 'ح', nameFa: 'حِ', nameEn: 'Ha', exampleFa: 'حلوا', exampleEn: 'Halva', exampleIcon: '🍬', viewBox, strokes: [stroke('main', HA, 1, arrows([0.08, 0.38, 0.72]))], color: '#20C7B3' },
  { id: 'khe', letter: 'خ', nameFa: 'خِ', nameEn: 'Khe', exampleFa: 'خرس', exampleEn: 'Bear', exampleIcon: '🐻', viewBox, strokes: [stroke('main', HA, 1, arrows([0.08, 0.38, 0.72]))], dots: repeatDots([{ x: 132, y: 52 }]), color: '#F97316' },
  { id: 'dal', letter: 'د', nameFa: 'دال', nameEn: 'Dal', exampleFa: 'دریا', exampleEn: 'Sea', exampleIcon: '🌊', viewBox, strokes: [stroke('main', DAL, 1, arrows([0.12, 0.5, 0.82]))], color: '#4DBFFF' },
  { id: 'zal', letter: 'ذ', nameFa: 'ذال', nameEn: 'Zal', exampleFa: 'ذرت', exampleEn: 'Corn', exampleIcon: '🌽', viewBox, strokes: [stroke('main', DAL, 1, arrows([0.12, 0.5, 0.82]))], dots: repeatDots([{ x: 122, y: 48 }]), color: '#F6A62B' },
  { id: 're', letter: 'ر', nameFa: 'رِ', nameEn: 'Re', exampleFa: 'رنگ', exampleEn: 'Color', exampleIcon: '🎨', viewBox, strokes: [stroke('main', RE, 1, arrows([0.18, 0.5, 0.8]))], color: '#FF8C42' },
  { id: 'ze', letter: 'ز', nameFa: 'زِ', nameEn: 'Ze', exampleFa: 'زرافه', exampleEn: 'Giraffe', exampleIcon: '🦒', viewBox, strokes: [stroke('main', RE, 1, arrows([0.18, 0.5, 0.8]))], dots: repeatDots([{ x: 122, y: 80 }]), color: '#FFD93D' },
  { id: 'zhe', letter: 'ژ', nameFa: 'ژِ', nameEn: 'Zhe', exampleFa: 'ژاله', exampleEn: 'Dew', exampleIcon: '💧', viewBox, strokes: [stroke('main', RE, 1, arrows([0.18, 0.5, 0.8]))], dots: repeatDots([{ x: 108, y: 48 }, { x: 122, y: 46 }, { x: 136, y: 48 }]), color: '#FF64B8' },
  { id: 'sin', letter: 'س', nameFa: 'سین', nameEn: 'Sin', exampleFa: 'سیب', exampleEn: 'Apple', exampleIcon: '🍎', viewBox, strokes: [stroke('main', SIN, 1, arrows([0.15, 0.42, 0.76]))], color: '#FF6B6B' },
  { id: 'shin', letter: 'ش', nameFa: 'شین', nameEn: 'Shin', exampleFa: 'شیر', exampleEn: 'Lion', exampleIcon: '🦁', viewBox, strokes: [stroke('main', SIN, 1, arrows([0.15, 0.42, 0.76])), stroke('dot1', 'M 100 64', 2, []), stroke('dot2', 'M 115 60', 3, []), stroke('dot3', 'M 130 64', 4, [])], dots: repeatDots([{ x: 100, y: 64 }, { x: 115, y: 60 }, { x: 130, y: 64 }]), color: '#FF80C0' },
  { id: 'sad', letter: 'ص', nameFa: 'صاد', nameEn: 'Sad', exampleFa: 'صابون', exampleEn: 'Soap', exampleIcon: '🧼', viewBox, strokes: [stroke('main', SAD, 1, arrows([0.15, 0.46, 0.8]))], color: '#06B6D4' },
  { id: 'zad', letter: 'ض', nameFa: 'ضاد', nameEn: 'Zad', exampleFa: 'ضربان', exampleEn: 'Beat', exampleIcon: '🥁', viewBox, strokes: [stroke('main', SAD, 1, arrows([0.15, 0.46, 0.8]))], dots: repeatDots([{ x: 120, y: 74 }]), color: '#EC4899' },
  { id: 'ta', letter: 'ط', nameFa: 'طا', nameEn: 'Ta', exampleFa: 'طبل', exampleEn: 'Drum', exampleIcon: '🥁', viewBox, strokes: [stroke('main', SAD, 1, arrows([0.15, 0.46, 0.8]))], color: '#84CC16' },
  { id: 'za', letter: 'ظ', nameFa: 'ظا', nameEn: 'Za', exampleFa: 'ظرف', exampleEn: 'Dish', exampleIcon: '🍽️', viewBox, strokes: [stroke('main', SAD, 1, arrows([0.15, 0.46, 0.8]))], dots: repeatDots([{ x: 120, y: 74 }]), color: '#8B5CF6' },
  { id: 'eyn', letter: 'ع', nameFa: 'عین', nameEn: 'Eyn', exampleFa: 'عروسک', exampleEn: 'Doll', exampleIcon: '🪆', viewBox, strokes: [stroke('main', EYN, 1, arrows([0.15, 0.46, 0.78]))], color: '#F97316' },
  { id: 'gheyn', letter: 'غ', nameFa: 'غین', nameEn: 'Gheyn', exampleFa: 'غذا', exampleEn: 'Food', exampleIcon: '🍲', viewBox, strokes: [stroke('main', EYN, 1, arrows([0.15, 0.46, 0.78]))], dots: repeatDots([{ x: 136, y: 52 }]), color: '#06B6D4' },
  { id: 'fe', letter: 'ف', nameFa: 'فا', nameEn: 'Fe', exampleFa: 'فیل', exampleEn: 'Elephant', exampleIcon: '🐘', viewBox, strokes: [stroke('main', FE, 1, arrows([0.15, 0.45, 0.75]))], dots: repeatDots([{ x: 130, y: 50 }]), color: '#22C55E' },
  { id: 'ghaf', letter: 'ق', nameFa: 'قاف', nameEn: 'Qaf', exampleFa: 'قلب', exampleEn: 'Heart', exampleIcon: '❤️', viewBox, strokes: [stroke('main', FE, 1, arrows([0.15, 0.45, 0.75]))], dots: repeatDots([{ x: 120, y: 50 }, { x: 140, y: 50 }]), color: '#FF4D8C' },
  { id: 'kaf', letter: 'ک', nameFa: 'کاف', nameEn: 'Kaf', exampleFa: 'کتاب', exampleEn: 'Book', exampleIcon: '📖', viewBox, strokes: [stroke('top', KAF_TOP, 1, arrows([0.12, 0.4, 0.72])), stroke('body', KAF_BODY, 2, arrows([0.2, 0.5, 0.82]))], color: '#5C6BFF' },
  { id: 'gaf', letter: 'گ', nameFa: 'گاف', nameEn: 'Gaf', exampleFa: 'گربه', exampleEn: 'Cat', exampleIcon: '🐱', viewBox, strokes: [stroke('top', KAF_TOP, 1, arrows([0.12, 0.4, 0.72])), stroke('body', KAF_BODY, 2, arrows([0.2, 0.5, 0.82]))], dots: repeatDots([{ x: 148, y: 50 }]), color: '#FF8C42' },
  { id: 'lam', letter: 'ل', nameFa: 'لام', nameEn: 'Lam', exampleFa: 'لاک‌پشت', exampleEn: 'Turtle', exampleIcon: '🐢', viewBox, strokes: [stroke('main', LAM, 1, arrows([0.12, 0.45, 0.82]))], color: '#4ECDC4' },
  { id: 'mim', letter: 'م', nameFa: 'میم', nameEn: 'Mim', exampleFa: 'ماه', exampleEn: 'Moon', exampleIcon: '🌙', viewBox, strokes: [stroke('main', MIM, 1, arrows([0.2, 0.5, 0.82]))], color: '#FFD93D' },
  { id: 'noon', letter: 'ن', nameFa: 'نون', nameEn: 'Nun', exampleFa: 'نخل', exampleEn: 'Palm', exampleIcon: '🌴', viewBox, strokes: [stroke('main', NOON, 1, arrows([0.15, 0.48, 0.82]))], dots: repeatDots([{ x: 107, y: 68 }]), color: '#5BDA7A' },
  { id: 'vav', letter: 'و', nameFa: 'واو', nameEn: 'Vav', exampleFa: 'ورزش', exampleEn: 'Sports', exampleIcon: '⚽', viewBox, strokes: [stroke('main', VAV, 1, arrows([0.15, 0.48, 0.78]))], color: '#4CC9F0' },
  { id: 'heh', letter: 'ه', nameFa: 'هِ', nameEn: 'He', exampleFa: 'هندوانه', exampleEn: 'Watermelon', exampleIcon: '🍉', viewBox, strokes: [stroke('main', HE, 1, arrows([0.2, 0.5, 0.8]))], color: '#FF6B6B' },
  { id: 'ye', letter: 'ی', nameFa: 'یِ', nameEn: 'Ye', exampleFa: 'یوزپلنگ', exampleEn: 'Cheetah', exampleIcon: '🐆', viewBox, strokes: [stroke('main', YE, 1, arrows([0.15, 0.45, 0.78]))], dots: repeatDots([{ x: 100, y: 175 }, { x: 120, y: 178 }]), color: '#C77DFF' },
];

export const FARSI_LETTER_BY_ID = Object.fromEntries(FARSI_LETTERS.map(item => [item.id, item])) as Record<string, FarsiLetter>;
