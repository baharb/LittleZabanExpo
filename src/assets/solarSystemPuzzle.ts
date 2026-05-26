import { ImageSourcePropType } from 'react-native';

export const SOLAR_SYSTEM_BACKGROUND: ImageSourcePropType = require('../../assets/neli-world/puzzle/Solarsystem/solarsystem.png');

export type SolarSystemPlanet = {
  id: string;
  labelFa: string;
  source: ImageSourcePropType;
  sizeFactor: number;
  slotX: number;
  slotY: number;
  orbitY: number;
};

export const LEGACY_SOLAR_SYSTEM_PLANETS: SolarSystemPlanet[] = [
  {
    id: 'mercury',
    labelFa: 'تیر',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/mercury.png'),
    sizeFactor: 2.05,
    slotX: 0.265,
      slotY: 0.451,
      orbitY: 0.451,
  },
  {
    id: 'venus',
    labelFa: 'ونوس',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/venus.png'),
    sizeFactor: 4.87,
    slotX: 0.35,
      slotY: 0.451,
      orbitY: 0.451,
  },
  {
    id: 'earth',
    labelFa: 'زمین',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/earth.png'),
    sizeFactor: 5.15,
    slotX: 0.435,
    slotY: 0.41,
    orbitY: 0.41,
  },
  {
    id: 'moon',
    labelFa: 'ماه',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/moon.png'),
    sizeFactor: 0.15525,
    slotX: 0.395,
    slotY: 0.232,
    orbitY: 0.232,
  },
  {
    id: 'mars',
    labelFa: 'مریخ',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/mars.png'),
    sizeFactor: 2.71,
    slotX: 0.52,
    slotY: 0.41,
    orbitY: 0.41,
  },
  {
    id: 'jupiter',
    labelFa: 'مشتری',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/jupiter.png'),
    sizeFactor: 43.1,
    slotX: 0.605,
    slotY: 0.41,
    orbitY: 0.41,
  },
  {
    id: 'saturn',
    labelFa: 'کیوان',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/saturn.png'),
    sizeFactor: 36,
    slotX: 0.69,
    slotY: 0.41,
    orbitY: 0.41,
  },
  {
    id: 'uranus',
    labelFa: 'اورانوس',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/uranus.png'),
    sizeFactor: 14.6,
    slotX: 0.775,
    slotY: 0.41,
    orbitY: 0.41,
  },
  {
    id: 'neptune',
    labelFa: 'نپتون',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/neptune.png'),
    sizeFactor: 14.4,
    slotX: 0.855,
    slotY: 0.41,
    orbitY: 0.41,
  },
  {
    id: 'pluto',
    labelFa: 'پلوتو',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/pluto_clean.png'),
    sizeFactor: 1,
    slotX: 0.935,
    slotY: 0.41,
    orbitY: 0.41,
  },
] as const;

export const REAL_SOLAR_SYSTEM_PLANETS: SolarSystemPlanet[] = [
  {
    id: 'mercury',
    labelFa: 'تیر',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/mercury.png'),
    sizeFactor: 1.243025,
    slotX: 0.265,
    slotY: 0.41,
    orbitY: 0.41,
  },
  {
    id: 'venus',
    labelFa: 'ونوس',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/venus.png'),
    sizeFactor: 1.564562304,
    slotX: 0.35,
    slotY: 0.451,
    orbitY: 0.451,
  },
  {
    id: 'earth',
    labelFa: 'زمین',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/earth.png'),
    sizeFactor: 1.647703296,
    slotX: 0.435,
    slotY: 0.369,
    orbitY: 0.369,
  },
  {
    id: 'moon',
    labelFa: 'ماه',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/moon.png'),
    sizeFactor: 0.761805,
    slotX: 0.4145,
    slotY: 0.2786,
    orbitY: 0.2786,
  },
  {
    id: 'mars',
    labelFa: 'مریخ',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/mars.png'),
    sizeFactor: 1.3699368,
    slotX: 0.5118,
    slotY: 0.4715,
    orbitY: 0.4715,
  },
  {
    id: 'jupiter',
    labelFa: 'مشتری',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/jupiter.png'),
    sizeFactor: 3.74969496111664,
    slotX: 0.596,
    slotY: 0.2868,
    orbitY: 0.2868,
  },
  {
    id: 'saturn',
    labelFa: 'کیوان',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/saturn.png'),
    sizeFactor: 4.040356056674289,
    slotX: 0.6772,
    slotY: 0.5948,
    orbitY: 0.5948,
  },
  {
    id: 'uranus',
    labelFa: 'اورانوس',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/uranus.png'),
    sizeFactor: 2.9848758016532,
    slotX: 0.775,
    slotY: 0.3075,
    orbitY: 0.3075,
  },
  {
    id: 'neptune',
    labelFa: 'نپتون',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/neptune.png'),
    sizeFactor: 2.239733577536,
    slotX: 0.855,
    slotY: 0.5125,
    orbitY: 0.5125,
  },
  {
    id: 'pluto',
    labelFa: 'پلوتو',
    source: require('../../assets/neli-world/puzzle/Solarsystem/planets/pluto_clean.png'),
    sizeFactor: 1,
    slotX: 0.935,
    slotY: 0.41,
    orbitY: 0.41,
  },
] as const;

export const SOLAR_SYSTEM_PLANETS = REAL_SOLAR_SYSTEM_PLANETS;
