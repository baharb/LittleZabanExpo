export interface Character {
  id: string;
  emoji: string;
  nameEn: string;
  nameFa: string;
  role: string;
  roleFa: string;
  personality: string;
  personalityFa: string;
  greeting: string;
  greetingFa: string;
  tip: string;
  tipFa: string;
  color: string;
  solidColors: readonly [string, string];
  bgPattern: string;
  subject: string;
  subjectFa: string;
  unlockAge: number;
}

export const CHARACTERS: Character[] = [
  {
    id: 'aidin',
    emoji: '🦉',
    nameEn: 'Aidin',
    nameFa: 'آیدین',
    role: 'The Wise Owl',
    roleFa: 'جغد دانا',
    personality: 'Calm, thoughtful, and curious.',
    personalityFa: 'آرام، فکرکن و کنجکاو.',
    greeting: 'Hoo! Let’s learn together.',
    greetingFa: 'هوو! بیا با هم یاد بگیریم.',
    tip: 'Try reading and listening with me.',
    tipFa: 'با من کتاب خواندن و گوش دادن را امتحان کن.',
    color: '#F0B848',
    solidColors: ['#F0B848', '#E67E22'] as const,
    bgPattern: '📚',
    subject: 'reading',
    subjectFa: 'خواندن',
    unlockAge: 0,
  },
  {
    id: 'mila',
    emoji: '🐰',
    nameEn: 'Mila',
    nameFa: 'میلا',
    role: 'The Playful Bunny',
    roleFa: 'خرگوش بازیگوش',
    personality: 'Fast, happy, and full of energy.',
    personalityFa: 'سریع، شاد و پرانرژی.',
    greeting: 'Hi! Let’s jump into learning!',
    greetingFa: 'سلام! بیا بپریم داخل یادگیری!',
    tip: 'Use me for fun games and easy words.',
    tipFa: 'من برای بازی‌های شاد و کلمه‌های ساده خوبم.',
    color: '#FF86B7',
    solidColors: ['#FF86B7', '#E5487B'] as const,
    bgPattern: '🌷',
    subject: 'games',
    subjectFa: 'بازی‌ها',
    unlockAge: 2,
  },
  {
    id: 'lila',
    emoji: '🐑',
    nameEn: 'Lila',
    nameFa: 'لیلا',
    role: 'The Cozy Lamb',
    roleFa: 'بره نرم و آرام',
    personality: 'Gentle, warm, and sweet.',
    personalityFa: 'مهربان، آرام و شیرین.',
    greeting: 'Hello, little friend.',
    greetingFa: 'سلام دوست کوچولو.',
    tip: 'I love stories and bedtime learning.',
    tipFa: 'من داستان‌ها و یادگیری آرام را دوست دارم.',
    color: '#FF69B4',
    solidColors: ['#FF69B4', '#9B59B6'] as const,
    bgPattern: '🌸',
    subject: 'stories',
    subjectFa: 'داستان‌ها',
    unlockAge: 3,
  },
  {
    id: 'dara',
    emoji: '🦒',
    nameEn: 'Dara',
    nameFa: 'دارا',
    role: 'The Brave Giraffe',
    roleFa: 'زرافه شجاع',
    personality: 'Bold, adventurous, and curious.',
    personalityFa: 'شجاع، ماجراجو و کنجکاو.',
    greeting: 'Roar! Ready for an adventure?',
    greetingFa: 'غُرر! آماده‌ی ماجراجویی هستی؟',
    tip: 'Great for animals, movement, and cooking scenes.',
    tipFa: 'برای حیوانات، حرکت و صحنه‌های آشپزی عالی‌ام.',
    color: '#FF8C42',
    solidColors: ['#FF8C42', '#FF4500'] as const,
    bgPattern: '🌿',
    subject: 'animals',
    subjectFa: 'حیوانات',
    unlockAge: 4,
  },
  {
    id: 'neli',
    emoji: '🐱',
    nameEn: 'Neli',
    nameFa: 'نلی',
    role: 'The Rainbow Cat',
    roleFa: 'گربه رنگین‌کمان',
    personality: 'Joyful, curious, and a friendly guide.',
    personalityFa: 'شاد، کنجکاو و راهنمای دوست‌داشتنی.',
    greeting: 'Meow! Hi friend! I’m Neli.',
    greetingFa: 'میو! سلام دوست من! من نلی‌ام.',
    tip: 'I am the last character in the set.',
    tipFa: 'من آخرین شخصیت این مجموعه هستم.',
    color: '#C8A8E0',
    solidColors: ['#C8A8E0', '#9B6FCA'] as const,
    bgPattern: '🌈',
    subject: 'all',
    subjectFa: 'همه',
    unlockAge: 5,
  },
];

export const getCharacterForAge = (age: number): Character => {
  if (age <= 2) return CHARACTERS[0];
  if (age <= 4) return CHARACTERS[1];
  if (age <= 6) return CHARACTERS[2];
  if (age <= 9) return CHARACTERS[3];
  return CHARACTERS[4];
};

export const BADGES = [
  { id: 'first', emoji: '🌟', labelEn: 'First Star', labelFa: 'اولین ستاره', check: (_w: number, _g: number, s: number) => s >= 1 },
  { id: 'ten', emoji: '⭐', labelEn: '10 Stars', labelFa: '۱۰ ستاره', check: (_w: number, _g: number, s: number) => s >= 10 },
  { id: 'w5', emoji: '📖', labelEn: '5 Words', labelFa: '۵ کلمه', check: (w: number) => w >= 5 },
  { id: 'w20', emoji: '📚', labelEn: '20 Words', labelFa: '۲۰ کلمه', check: (w: number) => w >= 20 },
  { id: 'g1', emoji: '🎮', labelEn: 'First Game', labelFa: 'اولین بازی', check: (_w: number, g: number) => g >= 1 },
  { id: 'g5', emoji: '🏆', labelEn: '5 Games', labelFa: '۵ بازی', check: (_w: number, g: number) => g >= 5 },
  { id: 's50', emoji: '💎', labelEn: '50 Stars', labelFa: '۵۰ ستاره', check: (_w: number, _g: number, s: number) => s >= 50 },
  { id: 'cult', emoji: '🏺', labelEn: 'Culture Fan', labelFa: 'فرهنگ‌دوست', check: (w: number) => w >= 30 },
  { id: 'king', emoji: '👑', labelEn: 'Master', labelFa: 'استاد', check: (_w: number, _g: number, s: number) => s >= 100 },
  { id: 'trace', emoji: '✍️', labelEn: 'Letter Tracer', labelFa: 'خوشنویس', check: (_w: number, _g: number, s: number) => s >= 20 },
  { id: 'reader', emoji: '📚', labelEn: 'Bookworm', labelFa: 'کتابخوان', check: (w: number) => w >= 15 },
  { id: 'mover', emoji: '🤸', labelEn: 'Active Star', labelFa: 'ستاره فعال', check: (_w: number, _g: number, s: number) => s >= 30 },
];
