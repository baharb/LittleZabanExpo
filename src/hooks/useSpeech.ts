/**
 * useSpeech - Robust bilingual TTS for LittleZaban
 * FIXED: fa-IR always used for Persian. Speech.stop() before every call.
 * Supports all 7 languages. Child-friendly pitch + slow rate for Persian.
 */
import { useContext, useRef } from 'react';
import * as Speech from 'expo-speech';
import { AppContext } from '../store/AppContext';

export const LANG_TAG: Record<string, string> = {
  fa:'fa-IR', en:'en-US', fr:'fr-FR',
  es:'es-ES', ar:'ar-SA', zh:'zh-CN', ko:'ko-KR',
};
export const LANG_RATE: Record<string, number> = {
  fa:0.65, ar:0.68, zh:0.76, ko:0.76,
  en:0.80, fr:0.80, es:0.80,
};
const PITCH = 1.18;
let voiceCache: Speech.Voice[] | null = null;

async function getBestVoice(tag: string) {
  try {
    if (!voiceCache) voiceCache = await Speech.getAvailableVoicesAsync();
    const base = tag.split('-')[0];
    const exact = voiceCache.find(v => v.language?.toLowerCase() === tag.toLowerCase());
    const sameLang = voiceCache.find(v => v.language?.toLowerCase().startsWith(base));
    const voice = exact ?? sameLang;
    return voice?.identifier ? { voice: voice.identifier, language: voice.language ?? tag } : { language: tag };
  } catch {
    return { language: tag };
  }
}

export function useSpeech() {
  const { lang } = useContext(AppContext);
  const active = useRef(false);

  const stop = () => { Speech.stop(); active.current = false; };

  const _speak = (text: string, tag: string, rate: number, onDone?: ()=>void) => {
    Speech.stop();
    active.current = true;
    getBestVoice(tag).then(voiceOptions => {
      if (!active.current) return;
      Speech.speak(text, {
        ...voiceOptions, rate, pitch: PITCH,
        onDone:  ()=>{ active.current=false; onDone?.(); },
        onError: ()=>{ active.current=false; onDone?.(); },
      });
    });
  };

  /** Speak item: primary language first, then translation */
  const speakItem = (item:{fa:string;en:string;[k:string]:string}, onDone?:()=>void) => {
    stop();
    const isPfa = lang==='fa'||lang==='ar';
    const pri   = isPfa ? item.fa : (item[lang]??item.en);
    const priTag= isPfa ? 'fa-IR' : (LANG_TAG[lang]??'en-US');
    const priRate= LANG_RATE[lang]??0.80;
    const sec   = isPfa ? item.en : item.fa;
    const secTag= isPfa ? 'en-US' : 'fa-IR';
    const secRate= isPfa ? LANG_RATE.en : LANG_RATE.fa;

    active.current = true;
    getBestVoice(priTag).then(priVoice => {
      if (!active.current) return;
      Speech.speak(pri, {
      ...priVoice, rate:priRate, pitch:PITCH,
      onDone:()=>{
        if(!active.current) return;
        getBestVoice(secTag).then(secVoice => {
          setTimeout(()=>{
            if(!active.current) return;
            Speech.speak(sec,{
              ...secVoice, rate:secRate, pitch:PITCH,
              onDone:()=>{ active.current=false; onDone?.(); },
              onError:()=>{ active.current=false; onDone?.(); },
            });
          },380);
        });
      },
      onError:()=>{
        active.current=false;
        // Fallback: English only
        if(isPfa&&item.en) Speech.speak(item.en,{language:'en-US',rate:LANG_RATE.en,pitch:PITCH,onDone:onDone,onError:onDone});
        else onDone?.();
      },
    });
    });
  };

  /** Speak Farsi only */
  const speakFarsiOnly = (text:string, onDone?:()=>void) => {
    _speak(text, 'fa-IR', LANG_RATE.fa, onDone);
  };

  /** Speak in current UI language */
  const speakText = (text:string, onDone?:()=>void) => {
    _speak(text, LANG_TAG[lang]??'en-US', LANG_RATE[lang]??0.80, onDone);
  };

  /** Speak letter - always with stop+delay to prevent repeat bug */
  const speakLetter = (name:string, letterLang?:string) => {
    Speech.stop(); active.current=false;
    const useLang = letterLang??lang;
    const tag  = LANG_TAG[useLang]??'en-US';
    const rate = LANG_RATE[useLang]??0.68;
    setTimeout(()=>{
      active.current=true;
      getBestVoice(tag).then(voiceOptions => {
        if (!active.current) return;
        Speech.speak(name,{
        ...voiceOptions, rate, pitch:PITCH,
        onDone:()=>{ active.current=false; },
        onError:()=>{ active.current=false; },
      });
      });
    },120);
  };

  /** Speak in any given language */
  const speakInLang = (text:string, langCode:string, onDone?:()=>void) => {
    _speak(text, LANG_TAG[langCode]??'en-US', LANG_RATE[langCode]??0.80, onDone);
  };

  /** Farsi first, then current language */
  const speakBilingual = (fa:string, other:string, otherLang?:string, onDone?:()=>void) => {
    stop(); active.current=true;
    const tag  = LANG_TAG[otherLang??lang]??'en-US';
    const rate = LANG_RATE[otherLang??lang]??0.80;
    getBestVoice('fa-IR').then(faVoice => {
      if (!active.current) return;
      Speech.speak(fa,{
      ...faVoice, rate:LANG_RATE.fa, pitch:PITCH,
      onDone:()=>{
        if(!active.current) return;
        getBestVoice(tag).then(otherVoice => {
          setTimeout(()=>{
            Speech.speak(other,{...otherVoice,rate,pitch:PITCH,
              onDone:()=>{ active.current=false; onDone?.(); },
              onError:()=>{ active.current=false; onDone?.(); },
            });
          },350);
        });
      },
      onError:()=>{
        active.current=false;
        Speech.speak(other,{language:tag,rate,pitch:PITCH,onDone:onDone,onError:onDone});
      },
    });
    });
  };

  return { speakItem, speakFarsiOnly, speakText, speakLetter, speakInLang, speakBilingual, stop, lang };
}
