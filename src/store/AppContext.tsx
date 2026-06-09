import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lang = 'en' | 'fa' | 'fr' | 'es' | 'zh' | 'ko' | 'ar';

export const LANGUAGES: {
  code: Lang; flag: string; label: string; nativeLabel: string;
  rtl: boolean; speechCode: string;
}[] = [
  { code: 'en', flag: '🇺🇸', label: 'English',  nativeLabel: 'English',  rtl: false, speechCode: 'en-US' },
  { code: 'fa', flag: '🇮🇷', label: 'Farsi',    nativeLabel: 'فارسی',    rtl: true,  speechCode: 'fa-IR' },
  { code: 'fr', flag: '🇫🇷', label: 'French',   nativeLabel: 'Français', rtl: false, speechCode: 'fr-FR' },
  { code: 'es', flag: '🇪🇸', label: 'Spanish',  nativeLabel: 'Español',  rtl: false, speechCode: 'es-ES' },
  { code: 'zh', flag: '🇨🇳', label: 'Chinese',  nativeLabel: '中文',     rtl: false, speechCode: 'zh-CN' },
  { code: 'ko', flag: '🇰🇷', label: 'Korean',   nativeLabel: '한국어',   rtl: false, speechCode: 'ko-KR' },
  { code: 'ar', flag: '🇸🇦', label: 'Arabic',   nativeLabel: 'العربية',  rtl: true,  speechCode: 'ar-SA' },
];

export function isRTL(lang: Lang) { return lang === 'fa' || lang === 'ar'; }
export function getLang(lang: Lang) { return LANGUAGES.find(l => l.code === lang)!; }

interface AppContextType {
  lang: Lang; setLang: (l: Lang) => void; rtl: boolean;
  settingsLang: Lang; setSettingsLang: (l: Lang) => void;
  age: number; setAge: (a: number) => void;
  stars: number; addStars: (n: number) => void;
  streak: number;
  badges: string[]; addBadge: (b: string) => void;
  stickers: string[]; addSticker: (s: string) => void;
  completedSections: string[]; completeSection: (id: string) => void;
  pathProgress: number; setPathProgress: (n: number) => void;
  parentPin: string; setParentPin: (p: string) => void;
  selectedCharacterId: string; setSelectedCharacter: (id: string) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang] = useState<Lang>('fa');
  const [settingsLang, setSettingsLangState] = useState<Lang>('fa');
  const [age, setAgeState] = useState(0);
  const [stars, setStars] = useState(0);
  const [streak] = useState(3);
  const [badges, setBadges] = useState<string[]>([]);
  const [stickers, setStickers] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [pathProgress, setPathProgressState] = useState(0);
  const [parentPin, setParentPinState] = useState('1234');
  const [selectedCharacterId, setSelectedCharacterState] = useState('neli');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('lz_state_v2');
        if (saved) {
          const s = JSON.parse(saved);
          if (LANGUAGES.some(language => language.code === s.settingsLang)) setSettingsLangState(s.settingsLang);
          if (s.age) setAgeState(s.age);
          if (s.stars) setStars(s.stars);
          if (s.badges) setBadges(s.badges);
          if (s.stickers) setStickers(s.stickers);
          if (s.completedSections) setCompletedSections(s.completedSections);
          if (s.pathProgress) setPathProgressState(s.pathProgress);
          if (s.parentPin) setParentPinState(s.parentPin);
          if (s.selectedCharacterId) setSelectedCharacterState(s.selectedCharacterId);
        }
      } catch {}
    })();
  }, []);

  const save = async (patch: object) => {
    try {
      const cur = await AsyncStorage.getItem('lz_state_v2');
      const state = cur ? JSON.parse(cur) : {};
      await AsyncStorage.setItem('lz_state_v2', JSON.stringify({ ...state, ...patch }));
    } catch {}
  };

  const setLang = (_l: Lang) => { save({ lang: 'fa' }); };
  const setSettingsLang = (l: Lang) => { setSettingsLangState(l); save({ settingsLang: l }); };
  const setAge = (a: number) => { setAgeState(a); save({ age: a }); };
  const addStars = (n: number) => setStars(p => { const v = p + n; save({ stars: v }); return v; });
  const addBadge = (b: string) => setBadges(p => { if (p.includes(b)) return p; const v = [...p, b]; save({ badges: v }); return v; });
  const addSticker = (s: string) => setStickers(p => { const v = [...p, s]; save({ stickers: v }); return v; });
  const completeSection = (id: string) => setCompletedSections(p => { if (p.includes(id)) return p; const v = [...p, id]; save({ completedSections: v }); return v; });
  const setPathProgress = (n: number) => { setPathProgressState(n); save({ pathProgress: n }); };
  const setParentPin = (p: string) => { setParentPinState(p); save({ parentPin: p }); };
  const setSelectedCharacter = (id: string) => { setSelectedCharacterState(id); save({ selectedCharacterId: id }); };

  return (
    <AppContext.Provider value={{
      lang, setLang, rtl: isRTL(lang),
      settingsLang, setSettingsLang,
      age, setAge, stars, addStars, streak,
      badges, addBadge, stickers, addSticker,
      completedSections, completeSection,
      pathProgress, setPathProgress,
      parentPin, setParentPin,
      selectedCharacterId, setSelectedCharacter,
    }}>
      {children}
    </AppContext.Provider>
  );
}
