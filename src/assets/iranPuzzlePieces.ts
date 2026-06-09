import { ImageSourcePropType } from 'react-native';

const IRAN_PUZZLE_CROP_X = 897;
const IRAN_PUZZLE_CROP_Y = 40;

export const IRAN_PUZZLE_SOURCE_WIDTH = 2063;
export const IRAN_PUZZLE_SOURCE_HEIGHT = 2042;

export const IRAN_PUZZLE_OUTLINE: ImageSourcePropType = require('../../assets/neli-world/puzzle/Iran/generated/iran_kids_placeholder_cropped_labeled.png');

export type IranPuzzlePiece = {
  id: string;
  nameFa: string;
  nameEn: string;
  source: ImageSourcePropType;
  side: 'left' | 'right';
  sourceBox: [number, number, number, number];
  centroid: [number, number];
  area: number;
};

type IranPuzzleShapeMeta = Omit<IranPuzzlePiece, 'source'> & {
  file?: string;
  normalizedBox?: [number, number, number, number];
  shapeFile?: string;
};

const SHAPE_META = require('../../assets/neli-world/puzzle/Iran/generated/iran_puzzle_shapes_meta.json') as IranPuzzleShapeMeta[];

const SHAPE_SOURCES: ImageSourcePropType[] = [
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_01.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_02.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_03.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_04.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_05.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_06.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_07.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_08.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_09.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_10.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_11.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_12.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_13.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_14.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_15.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_16.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_17.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_18.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_19.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_20.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_21.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_22.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_23.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_24.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_25.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_26.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_27.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_28.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_29.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_30.png'),
  require('../../assets/neli-world/puzzle/Iran/generated/province-shapes/province_kids_labeled_31.png'),
];

const PROVINCE_NAMES_FA: Record<string, string> = {
  west_azerbaijan: 'آذربایجان غربی',
  east_azerbaijan: 'آذربایجان شرقی',
  ardabil: 'اردبیل',
  gilan: 'گیلان',
  zanjan: 'زنجان',
  kurdistan: 'کردستان',
  kermanshah: 'کرمانشاه',
  ilam: 'ایلام',
  hamadan: 'همدان',
  qazvin: 'قزوین',
  alborz: 'البرز',
  tehran: 'تهران',
  qom: 'قم',
  markazi: 'مرکزی',
  lorestan: 'لرستان',
  khuzestan: 'خوزستان',
  chaharmahal: 'چهارمحال و بختیاری',
  kohgiluyeh: 'کهگیلویه و بویراحمد',
  bushehr: 'بوشهر',
  fars: 'فارس',
  isfahan: 'اصفهان',
  yazd: 'یزد',
  kerman: 'کرمان',
  hormozgan: 'هرمزگان',
  sistan: 'سیستان و بلوچستان',
  south_khorasan: 'خراسان جنوبی',
  razavi_khorasan: 'خراسان رضوی',
  north_khorasan: 'خراسان شمالی',
  semnan: 'سمنان',
  mazandaran: 'مازندران',
  golestan: 'گلستان',
};

export const IRAN_PUZZLE_PIECES: IranPuzzlePiece[] = SHAPE_META.map((piece, index) => ({
  id: piece.id,
  nameFa: PROVINCE_NAMES_FA[piece.id] ?? piece.nameFa ?? piece.id,
  nameEn: piece.nameEn ?? piece.id,
  source: SHAPE_SOURCES[index],
  side: piece.side,
  sourceBox: [
    piece.sourceBox[0] - IRAN_PUZZLE_CROP_X,
    piece.sourceBox[1] - IRAN_PUZZLE_CROP_Y,
    piece.sourceBox[2] - IRAN_PUZZLE_CROP_X,
    piece.sourceBox[3] - IRAN_PUZZLE_CROP_Y,
  ],
  centroid: piece.centroid,
  area: piece.area,
}));

