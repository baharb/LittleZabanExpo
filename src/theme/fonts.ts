import type { Lang } from '../store/AppContext';

export const FA = {
  regular: 'Vazirmatn_400Regular',
  bold:    'Vazirmatn_700Bold',
  black:   'Vazirmatn_800ExtraBold',
};

export const EN = {
  regular: 'Nunito_400Regular',
  bold:    'Nunito_700Bold',
  black:   'Nunito_800ExtraBold',
};

export function ff(lang?: Lang, weight: 'regular' | 'bold' | 'black' = 'bold'): string {
  const family = lang === 'fa' || lang === 'ar' ? FA : EN;
  if (weight === 'regular') return family.regular;
  if (weight === 'black')   return family.black;
  return family.bold;
}
export function fontFamily(lang?: Lang, weight: 'regular' | 'bold' | 'black' = 'bold'): string {
  return ff(lang, weight);
}
export function dir(lang?: Lang): { writingDirection: 'rtl' | 'ltr'; textAlign: 'right' | 'left' } {
  const rtl = lang === 'fa' || lang === 'ar';
  return { writingDirection: rtl ? 'rtl' : 'ltr', textAlign: rtl ? 'right' : 'left' };
}
export function textStyle(lang?: Lang, weight: 'regular' | 'bold' | 'black' = 'bold') {
  return { fontFamily: ff(lang, weight), ...dir(lang) };
}
