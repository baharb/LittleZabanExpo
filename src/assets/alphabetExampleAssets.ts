// Maps each Persian letter ID to its example image asset.
// Letter order: alef, be, pe, te, se, jim, che, haa, khe, dal,
//               zal, re, ze, zhe, sin, shin, sad, zad, taa, zaa,
//               eyn, gheyn, fe, ghaf, kaf, gaf, lam, mim, nun, vav, heh, ye

import { ImageSourcePropType } from 'react-native';

export const ALPHABET_EXAMPLE_ASSETS: Record<string, ImageSourcePropType> = {
  alef: require('../../assets/neli-world/ingredients/water.webp'),          // آب
  be:   require('../../assets/neli-world/ingredients/leaves.webp'),           // برگ
  pe:   require('../../assets/neli-world/fruits/orange_1024.webp'),         // پرتقال
  te:   require('../../assets/neli-world/fruits/strawberry_1024.webp'),     // توت فرنگی
  se:   require('../../assets/neli-world/alphabet-icons/clock.png'),         // ثانیه
  jim:  require('../../assets/neli-world/alphabet-icons/chick.png'),         // جوجه
  che:  require('../../assets/neli-world/alphabet-icons/umbrella.png'),      // چتر
  haa:  require('../../assets/neli-world/bathroom/towel.png'),               // حوله
  khe:  require('../../assets/neli-world/animals/bear_kids_app_clean_transparent.webp'), // خرس
  dal:  require('../../assets/neli-world/alphabet-icons/tree.png'),          // درخت
  zal:  require('../../assets/neli-world/vegetables/corn.webp'),             // ذرت
  re:   require('../../assets/neli-world/ui-icons/paintbrush.png'),          // رنگ
  ze:   require('../../assets/neli-world/alphabet-icons/bee.png'),           // زنبور
  zhe:  require('../../assets/neli-world/alphabet-icons/jelly.png'),         // ژله
  sin:  require('../../assets/neli-world/fruits/apple_1024.webp'),           // سیب
  shin: require('../../assets/neli-world/food-flat/milk.png'),               // شیر (شیر = lion AND milk)
  sad:  require('../../assets/neli-world/bathroom/soap_dish.png'),            // صابون
  zad:  require('../../assets/neli-world/alphabet-icons/cross.png'),         // ضربدر
  taa:  require('../../assets/neli-world/alphabet-icons/parrot.png'),        // طوطی
  zaa:  require('../../assets/neli-world/kitchen/plate.png'),                // ظرف
  eyn:  require('../../assets/neli-world/clothes/sunglasses_black.png'),     // عینک
  gheyn:require('../../assets/neli-world/persian-foods/kebab.png'),           // غذا
  fe:   require('../../assets/neli-world/alphabet-icons/elephant.png'),      // فیل
  ghaf: require('../../assets/neli-world/ui-icons/heart.png'),               // قلب
  kaf:  require('../../assets/neli-world/ingredients/book.webp'),            // کتاب
  gaf:  require('../../assets/neli-world/alphabet-icons/flower.png'),        // گل
  lam:  require('../../assets/neli-world/food-flat/lemon.png'),              // لیمو
  mim:  require('../../assets/neli-world/alphabet-icons/fish.png'),          // ماهی
  nun:  require('../../assets/neli-world/food-flat/toast.png'),              // نان
  vav:  require('../../assets/neli-world/alphabet-icons/exercise.png'),      // ورزش
  heh:  require('../../assets/neli-world/vegetables/carrot.webp'),           // هویج
  ye:   require('../../assets/neli-world/alphabet-icons/ice.png'),           // یخ
};
