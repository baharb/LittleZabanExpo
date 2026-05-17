export interface Section {
  id: string;
  emoji: string;
  label: string;
  labelFa: string;
  colors: string[];
}

export const SECTIONS: Section[] = [
  { id:'alphabet',    emoji:'🔤', label:'Alphabet',     labelFa:'الفبا',           colors:['#FF6B9D','#FF8E53'] },
  { id:'numbers',     emoji:'🔢', label:'Numbers',      labelFa:'اعداد',           colors:['#54A0FF','#5F27CD'] },
  { id:'colors',      emoji:'🎨', label:'Colors',       labelFa:'رنگ‌ها',           colors:['#1DD1A1','#00D2D3'] },
  { id:'animals',     emoji:'🦁', label:'Animals',      labelFa:'حیوانات',         colors:['#FF9F43','#FECA57'] },
  { id:'insects',     emoji:'🐛', label:'Insects',      labelFa:'حشرات',           colors:['#FF6B6B','#FF4757'] },
  { id:'pets',        emoji:'🐱', label:'Pets',         labelFa:'حیوانات خانگی',   colors:['#26de81','#20bf6b'] },
  { id:'sealife',     emoji:'🌊', label:'Sea Life',     labelFa:'دریا',            colors:['#a29bfe','#6c5ce7'] },
  { id:'food',        emoji:'🍎', label:'Food',         labelFa:'غذا',             colors:['#fd9644','#e55039'] },
  { id:'vegetables',  emoji:'🥦', label:'Vegetables',   labelFa:'سبزیجات',         colors:['#78e08f','#079992'] },
  { id:'family',      emoji:'👨‍👩‍👧', label:'Family',      labelFa:'خانواده',         colors:['#636e72','#2d3436'] },
  { id:'shapes',      emoji:'⭐', label:'Shapes',       labelFa:'اشکال',           colors:['#fdcb6e','#e17055'] },
  { id:'transport',   emoji:'🚗', label:'Transport',    labelFa:'وسایل نقلیه',    colors:['#e84393','#a0006a'] },
  { id:'nature',      emoji:'🌸', label:'Nature',       labelFa:'طبیعت',           colors:['#833471','#6F1E51'] },
  { id:'weather',     emoji:'☀️', label:'Weather',      labelFa:'آب‌وهوا',         colors:['#6ab04c','#badc58'] },
  { id:'school',      emoji:'📐', label:'School',       labelFa:'مدرسه',           colors:['#be2edd','#4834d4'] },
  { id:'sports',      emoji:'⚽', label:'Sports',       labelFa:'ورزش',            colors:['#00b894','#00cec9'] },
  { id:'house',       emoji:'🏠', label:'House',        labelFa:'خانه',            colors:['#6c5ce7','#a29bfe'] },
  { id:'professions', emoji:'👤', label:'Jobs',         labelFa:'مشاغل',           colors:['#55efc4','#00b894'] },
  { id:'cooking',     emoji:'🍳', label:'Cooking',      labelFa:'آشپزی',           colors:['#0652DD','#1289A7'] },
  { id:'mindfulness', emoji:'🧘', label:'Mindfulness',  labelFa:'آرامش',           colors:['#833471','#6F1E51'] },
  { id:'culture',     emoji:'🏛️', label:'Persian Stories', labelFa:'داستان‌های ایرانی', colors:['#e84393','#a0006a'] },
  { id:'songs',       emoji:'🎵', label:'Persian Songs', labelFa:'آهنگ‌های ایرانی', colors:['#0652DD','#1289A7'] },
  { id:'celebrations',emoji:'🎊', label:'Celebrations', labelFa:'جشن‌ها',          colors:['#FF9F43','#FECA57'] },
  { id:'iranfood',    emoji:'🍲', label:'Persian Food', labelFa:'غذای ایرانی',     colors:['#78e08f','#079992'] },
  { id:'iranart',     emoji:'🏺', label:'Persian Art',  labelFa:'هنر ایرانی',      colors:['#be2edd','#4834d4'] },
  { id:'nowruz',      emoji:'🌺', label:'Nowruz',       labelFa:'نوروز',           colors:['#f9ca24','#f0932b'] },
  { id:'poets',       emoji:'📜', label:'Great Poets',  labelFa:'شاعران بزرگ',     colors:['#833471','#6F1E51'] },
];
