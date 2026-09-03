import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { FA_TEST_AUDIO, FaTestAudioKey } from '../assets/faTestAudio.generated';

let currentSound: Audio.Sound | null = null;
let loadingToken = 0;

export async function stopFaAudio() {
  loadingToken += 1;
  if (currentSound) {
    try {
      await currentSound.stopAsync();
    } catch {
      // ignore
    }
    try {
      await currentSound.unloadAsync();
    } catch {
      // ignore
    }
    currentSound = null;
  }
}

type PlayFaAudioOptions = { interrupt?: boolean; awaitFinish?: boolean; playbackStatus?: Parameters<typeof Audio.Sound.createAsync>[1]; };

export async function playFaAudio(key: FaTestAudioKey, options?: PlayFaAudioOptions) {
  if (options?.interrupt !== false) {
    await stopFaAudio();
  }
  const token = ++loadingToken;
  const source = FA_TEST_AUDIO[key];
  if (!source) return false;

  const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true, ...(options?.playbackStatus ?? {}) });
  if (token !== loadingToken) {
    try { await sound.unloadAsync(); } catch {}
    return false;
  }
  currentSound = sound;
  if (options?.awaitFinish) {
    return await new Promise<boolean>(resolve => {
      sound.setOnPlaybackStatusUpdate(async status => {
        if (status.isLoaded && status.didJustFinish) {
          try { await sound.unloadAsync(); } catch {}
          if (currentSound === sound) currentSound = null;
          resolve(true);
        }
      });
    });
  }
  sound.setOnPlaybackStatusUpdate(async status => {
    if (status.isLoaded && status.didJustFinish) {
      try { await sound.unloadAsync(); } catch {}
      if (currentSound === sound) currentSound = null;
    }
  });
  return true;
}

export async function playFaAudioSequence(keys: FaTestAudioKey[], gapMs = 150) {
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]!;
    await playFaAudio(key, { awaitFinish: true, interrupt: i === 0 });
    if (i < keys.length - 1) {
      await new Promise(resolve => setTimeout(resolve, gapMs));
    }
  }
  return true;
}

export function makeAlphabetAudioKey(kind: 'name' | 'example' | 'trace', letterId: string) {
  return `alphabet/${kind}/${letterId}` as FaTestAudioKey;
}

// Some screens (VideoShowsScreen's "Alphabet Show", AlphabetTrainScreen's
// "Alphabet Train") use letter ids that differ from the ids the recorded
// voice clips (and farsiLetters.ts / the Tracing screens) use — translate
// before building an audio key so every letter finds its recorded clip
// instead of silently falling back to bare-glyph TTS.
export const ALPHABET_AUDIO_ID_OVERRIDE: Partial<Record<string, string>> = {
  'he-jimi': 'haa', // ح
  ta: 'taa', // ط
  za: 'zaa', // ظ
  noon: 'nun', // ن
  he: 'heh', // ه
};

// Some recorded alphabet clips used to be broken (cut off mid-word, silent,
// byte-identical duplicates of a different letter's clip, or minutes of
// unrelated/garbled audio) and were listed here so playback would skip them
// and speak the word with on-device TTS instead.
//
// All 11 were re-recorded 2026-09-02/03 (via scripts/generate_gemini_voice_pack.py)
// and verified via waveform inspection (reasonable duration, healthy
// non-silent RMS, matching their siblings). The set is intentionally kept
// (rather than deleted) as the mechanism to quarantine any future bad
// recording the same way — just add its FaTestAudioKey back below.
const BROKEN_ALPHABET_AUDIO = new Set<FaTestAudioKey>([]);

// taa/zaa/ye/zad/jim/zhe all now have working recorded "name" clips (see
// BROKEN_ALPHABET_AUDIO above), so this text is only a safety net for the
// rare case the recorded clip fails to play at runtime — the bare glyph
// alone ('ط', 'ظ', 'ی', 'ض', 'ج', 'ژ') doesn't always voice reliably via
// on-device TTS, so each entry spells out the full letter name instead.
export const FALLBACK_LETTER_NAME_FA: Partial<Record<string, string>> = {
  taa: 'طا',
  zaa: 'ظا',
  ye: 'یا',
  zad: 'ضاد',
  jim: 'جیم',
  zhe: 'ژه',
};

async function speakFaRawAwait(text: string, options?: { interrupt?: boolean; rate?: number; pitch?: number }) {
  if (!text) return false;
  if (options?.interrupt !== false) Speech.stop();
  return new Promise<boolean>(resolve => {
    Speech.speak(text, {
      language: 'fa-IR',
      rate: options?.rate ?? 0.72,
      pitch: options?.pitch ?? 1.14,
      onDone: () => resolve(true),
      onError: () => resolve(false),
    });
  });
}

/**
 * Like playFaAudio, but for a key known to be broken (BROKEN_ALPHABET_AUDIO
 * above) or with no recorded clip at all, falls back to speaking
 * `fallbackText` with on-device TTS instead of playing bad/no audio. Uses
 * raw TTS (not speakWithGeneratedVoice) so it can't resolve back to the
 * same broken recorded clip via the text-to-key dictionary.
 */
export async function playFaAudioOrSpeak(
  key: FaTestAudioKey,
  fallbackText: string,
  options?: PlayFaAudioOptions & { rate?: number; pitch?: number },
) {
  if (!BROKEN_ALPHABET_AUDIO.has(key)) {
    const played = await playFaAudio(key, options);
    if (played) return true;
  }
  return speakFaRawAwait(fallbackText, { interrupt: options?.interrupt, rate: options?.rate, pitch: options?.pitch });
}

function normalizeFaVoiceText(text: string) {
  return text
    .trim()
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670\u0640\s!?؟،,.:;\-\u200c]/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک');
}

const FA_VOICE_TEXT_TO_KEY: Record<string, FaTestAudioKey> = {
  [normalizeFaVoiceText('آفرین')]: 'feedback/afarin',
  [normalizeFaVoiceText('افرین')]: 'feedback/afarin',
  [normalizeFaVoiceText('آفرین!')]: 'feedback/afarin',
  [normalizeFaVoiceText('پاک کن')]: 'feedback/clear',
  [normalizeFaVoiceText('\u06cc\u06a9')]: 'counting/number/1',
  [normalizeFaVoiceText('\u0633\u0647')]: 'counting/number/3',
  [normalizeFaVoiceText('\u0686\u0647\u0627\u0631')]: 'counting/number/4',
  [normalizeFaVoiceText('\u067e\u0646\u062c')]: 'counting/number/5',
  [normalizeFaVoiceText('\u0647\u0641\u062a')]: 'counting/number/7',
  [normalizeFaVoiceText('\u0647\u0634\u062a')]: 'counting/number/8',
  [normalizeFaVoiceText('\u0646\u0647')]: 'counting/number/9',
  [normalizeFaVoiceText('از نقطه سبز شروع کن')]: 'guidance/start-here',
  [normalizeFaVoiceText('شروع کن')]: 'guidance/start-here',
  [normalizeFaVoiceText('مسیر را دنبال کن')]: 'guidance/follow-path',
  [normalizeFaVoiceText('دنبال کن')]: 'guidance/follow-path',
  [normalizeFaVoiceText('الف')]: 'alphabet/name/alef',
  [normalizeFaVoiceText('آب')]: 'alphabet/example/alef',
  [normalizeFaVoiceText('ب')]: 'alphabet/name/be',
  [normalizeFaVoiceText('برگ')]: 'alphabet/example/be',
  [normalizeFaVoiceText('پ')]: 'alphabet/name/pe',
  [normalizeFaVoiceText('پرتقال')]: 'alphabet/example/pe',
  [normalizeFaVoiceText('ت')]: 'alphabet/name/te',
  [normalizeFaVoiceText('توت فرنگی')]: 'alphabet/example/te',
  [normalizeFaVoiceText('ث')]: 'alphabet/name/se',
  [normalizeFaVoiceText('ثانیه')]: 'alphabet/example/se',
  [normalizeFaVoiceText('ج')]: 'alphabet/name/jim',
  [normalizeFaVoiceText('جوجه')]: 'alphabet/example/jim',
  [normalizeFaVoiceText('چ')]: 'alphabet/name/che',
  [normalizeFaVoiceText('چتر')]: 'alphabet/example/che',
  [normalizeFaVoiceText('ح')]: 'alphabet/name/haa',
  [normalizeFaVoiceText('حلوا')]: 'alphabet/example/haa',
};

export function resolveFaVoiceKey(text: string): FaTestAudioKey | null {
  const key = FA_VOICE_TEXT_TO_KEY[normalizeFaVoiceText(text)];
  return key ?? null;
}

export async function tryPlayGeneratedFaVoice(text: string, options?: { interrupt?: boolean; awaitFinish?: boolean }) {
  const key = resolveFaVoiceKey(text);
  if (!key) return false;
  if (BROKEN_ALPHABET_AUDIO.has(key)) {
    // The text->key lookup above (FA_VOICE_TEXT_TO_KEY) doesn't know a clip
    // is broken — it would otherwise happily hand back e.g. "alphabet/name/zad"
    // and playFaAudio() would play the garbled/cut-off recording just because
    // the file exists. Speak a TTS-friendly fallback instead, same as
    // playFaAudioOrSpeak does for other call sites.
    const m = /^alphabet\/name\/(.+)$/.exec(key);
    const fallbackText = (m && FALLBACK_LETTER_NAME_FA[m[1]!]) || text;
    return await speakFaRawAwait(fallbackText, { interrupt: options?.interrupt });
  }
  return await playFaAudio(key, { interrupt: options?.interrupt, awaitFinish: options?.awaitFinish ?? true });
}

export async function speakWithGeneratedVoice(
  text: string,
  language: string,
  options?: { interrupt?: boolean; awaitFinish?: boolean; rate?: number; pitch?: number; onDone?: () => void; onError?: () => void; },
) {
  const lang = (language ?? '').toLowerCase();
  const canUseGenerated = lang.startsWith('fa') || lang.startsWith('ar');
  if (canUseGenerated) {
    const played = await tryPlayGeneratedFaVoice(text, { interrupt: options?.interrupt, awaitFinish: options?.awaitFinish ?? true });
    if (played) {
      options?.onDone?.();
      return true;
    }
  }

  if (options?.interrupt !== false) {
    Speech.stop();
  }
  Speech.speak(text, {
    language,
    rate: options?.rate ?? 0.8,
    pitch: options?.pitch ?? 1.18,
    onDone: options?.onDone,
    onError: options?.onError ?? options?.onDone,
  });
  return false;
}

export const FA_AUDIO_KEYS = {
  feedback: {
    tryAgain: 'feedback/try-again' as const,
    afarin: 'feedback/afarin' as const,
    clear: 'feedback/clear' as const,
  },
  guidance: {
    startHere: 'guidance/start-here' as const,
    followPath: 'guidance/follow-path' as const,
  },
  toothbrush: {
    cleanNow: 'toothbrush/clean-now' as const,
    brushLilaTeeth: 'toothbrush/brush-lila-teeth' as const,
    brushTeeth: 'toothbrush/brush-teeth' as const,
  },
  solarSystem: {
    mercury: 'solar-system/mercury' as const,
    venus: 'solar-system/venus' as const,
    earth: 'solar-system/earth' as const,
    moon: 'solar-system/moon' as const,
    mars: 'solar-system/mars' as const,
    saturn: 'solar-system/saturn' as const,
    uranus: 'solar-system/uranus' as const,
    neptune: 'solar-system/neptune' as const,
  },
  clothes: {
    backpack: 'clothes/backpack' as const,
    bag: 'clothes/bag' as const,
    boots: 'clothes/boots' as const,
    coat: 'clothes/coat' as const,
    glasses: 'clothes/glasses' as const,
    hat: 'clothes/hat' as const,
    scarf: 'clothes/scarf' as const,
    shirt: 'clothes/shirt' as const,
    shoes: 'clothes/shoes' as const,
    shorts: 'clothes/shorts' as const,
    tshirt: 'clothes/tshirt' as const,
  },
  painting: {
    red: 'painting/color/red' as const,
    amber: 'painting/color/amber' as const,
    yellow: 'painting/color/yellow' as const,
    lime: 'painting/color/lime' as const,
    teal: 'painting/color/teal' as const,
  },
} as const;

/** Maps a planet id (from solarSystemPuzzle.ts) to its audio key. Returns null if no audio exists. */
export function getSolarSystemAudioKey(planetId: string): FaTestAudioKey | null {
  const key = `solar-system/${planetId}` as FaTestAudioKey;
  return key in FA_TEST_AUDIO ? key : null;
}

/** Maps a clothing slot name to its audio key. Returns null if no audio exists. */
const SLOT_TO_CLOTHES_KEY: Record<string, FaTestAudioKey> = {
  // shirt+pants combo → tshirt voice
  shirt: 'clothes/tshirt',
  pants: 'clothes/tshirt',
  tshirt: 'clothes/tshirt',
  shorts: 'clothes/shorts',
  // all dress variants → dress voice
  dress: 'clothes/dress',
  dressPink: 'clothes/dress',
  dressBlue: 'clothes/dress',
  dressGreen: 'clothes/dress',
  dressOrange: 'clothes/dress',
  dressRed: 'clothes/dress',
  dressLong: 'clothes/dress',
  // hats
  hat: 'clothes/hat',
  hatPink: 'clothes/hat',
  hatBlue: 'clothes/hat',
  sunhatCream: 'clothes/hat',
  // sunglasses
  sunglasses: 'clothes/glasses',
  sunglassesBlack: 'clothes/glasses',
  sunglassesPink: 'clothes/glasses',
  sunglassesGold: 'clothes/glasses',
  // other
  scarf: 'clothes/scarf',
  coat: 'clothes/coat',
  boots: 'clothes/boots',
  shoes: 'clothes/shoes',
  shoesGold: 'clothes/shoes',
  shoesWhite: 'clothes/shoes',
  shoesPink: 'clothes/shoes',
  sneakers: 'clothes/shoes',
  bag: 'clothes/bag',
  backpack: 'clothes/backpack',
};
export function getClothesAudioKey(slot: string): FaTestAudioKey | null {
  return SLOT_TO_CLOTHES_KEY[slot] ?? null;
}

/** Maps a painting color label (lowercase) to its audio key. Returns null if no audio exists. */
export function getPaintingColorAudioKey(label: string): FaTestAudioKey | null {
  const key = `painting/color/${label.toLowerCase()}` as FaTestAudioKey;
  return key in FA_TEST_AUDIO ? key : null;
}

/** Maps an ingredient id (from CookingGame) to its audio key. Returns null if no audio exists. */
export function getIngredientAudioKey(ingredientId: string): FaTestAudioKey | null {
  const key = `ingredients/${ingredientId}` as FaTestAudioKey;
  return key in FA_TEST_AUDIO ? key : null;
}

/** Maps a counting number (1-10) to its audio key. Returns null if no audio exists. */
export function getCountingNumberAudioKey(n: number): FaTestAudioKey | null {
  const key = `counting/number/${n}` as FaTestAudioKey;
  return key in FA_TEST_AUDIO ? key : null;
}
