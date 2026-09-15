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
  se:   require('../../assets/neli-world/alphabet-icons/clock.webp'),         // ثانیه
  jim:  require('../../assets/neli-world/alphabet-icons/chick.webp'),         // جوجه
  che:  require('../../assets/neli-world/alphabet-icons/umbrella.webp'),      // چتر
  haa:  require('../../assets/neli-world/bathroom/towel.webp'),               // حوله
  khe:  require('../../assets/neli-world/animals/bear_kids_app_clean_transparent.webp'), // خرس
  dal:  require('../../assets/neli-world/alphabet-icons/tree.webp'),          // درخت
  zal:  require('../../assets/neli-world/vegetables/corn.webp'),             // ذرت
  re:   require('../../assets/neli-world/ui-icons/paintbrush.webp'),          // رنگ
  ze:   require('../../assets/neli-world/alphabet-icons/bee.webp'),           // زنبور
  zhe:  require('../../assets/neli-world/alphabet-icons/jelly.webp'),         // ژله
  sin:  require('../../assets/neli-world/fruits/apple_1024.webp'),           // سیب
  shin: require('../../assets/neli-world/food-flat/milk.webp'),               // شیر (شیر = lion AND milk)
  sad:  require('../../assets/neli-world/bathroom/soap_dish.webp'),            // صابون
  zad:  require('../../assets/neli-world/alphabet-icons/cross.webp'),         // ضربدر
  taa:  require('../../assets/neli-world/alphabet-icons/parrot.webp'),        // طوطی
  zaa:  require('../../assets/neli-world/kitchen/plate.webp'),                // ظرف
  eyn:  require('../../assets/neli-world/clothes/sunglasses_black.webp'),     // عینک
  gheyn:require('../../assets/neli-world/persian-foods/kebab.webp'),           // غذا
  fe:   require('../../assets/neli-world/alphabet-icons/elephant.webp'),      // فیل
  ghaf: require('../../assets/neli-world/ui-icons/heart.webp'),               // قلب
  kaf:  require('../../assets/neli-world/ingredients/book.webp'),            // کتاب
  gaf:  require('../../assets/neli-world/alphabet-icons/flower.webp'),        // گل
  lam:  require('../../assets/neli-world/food-flat/lemon.webp'),              // لیمو
  mim:  require('../../assets/neli-world/alphabet-icons/fish.webp'),          // ماهی
  nun:  require('../../assets/neli-world/food-flat/toast.webp'),              // نان
  vav:  require('../../assets/neli-world/alphabet-icons/exercise.webp'),      // ورزش
  heh:  require('../../assets/neli-world/vegetables/carrot.webp'),           // هویج
  ye:   require('../../assets/neli-world/alphabet-icons/ice.webp'),           // یخ
};
