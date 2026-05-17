/**
 * LangBar — language picker chip, visible on EVERY screen via TopBar.
 * Tapping opens a modal with 7 language options.
 * Works on both dark (purple) and light (white) backgrounds.
 */
import React, { useState, useContext } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, ScrollView, Pressable, useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppContext, LANGUAGES, Lang } from '../store/AppContext';
import { ff, dir } from '../theme/fonts';
import { C } from '../theme/colors';

interface Props {
  dark?: boolean;   // true = on purple bg (default), false = on white bg
}

export default function LangBar({ dark = true }: Props) {
  const { lang, setLang } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();
  const cur = LANGUAGES.find(l => l.code === lang)!;

  const chipBg    = dark ? 'rgba(255,255,255,0.22)' : C.purpleLight;
  const chipBdr   = dark ? 'rgba(255,255,255,0.35)' : C.purple + '44';
  const chipColor = dark ? '#fff' : C.purple;

  const pick = (code: Lang) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLang(code);
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.chip, { backgroundColor: chipBg, borderColor: chipBdr }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.flag}>{cur.flag}</Text>
        <Text style={[styles.lbl, { color: chipColor, fontFamily: ff(lang, 'bold') }]} numberOfLines={1}>
          {cur.nativeLabel.slice(0, 3)}
        </Text>
        <Text style={[styles.caret, { color: chipColor + 'BB', fontFamily: ff(lang, 'bold') }]}>▾</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { width: Math.min(width - 48, 300) }]}>
            <Text style={[styles.sheetTitle, { fontFamily: ff('en', 'bold') }]}>🌍 Language</Text>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {LANGUAGES.map(l => (
                <TouchableOpacity
                  key={l.code}
                  style={[styles.option, l.code === lang && styles.optionActive]}
                  onPress={() => pick(l.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optFlag}>{l.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      styles.optNative,
                      { fontFamily: ff(l.code) },
                      dir(l.code),
                    ]}>
                      {l.nativeLabel}
                    </Text>
                    <Text style={[styles.optEn, { fontFamily: ff('en', 'bold') }]}>{l.label}</Text>
                  </View>
                  {l.code === lang && (
                    <View style={styles.checkCircle}>
                      <Text style={[styles.checkMark, { fontFamily: ff('en', 'bold') }]}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1.5,
  },
  flag:  { fontFamily: ff('fa', 'bold'), fontSize: 18 },
  lbl:   { fontSize: 11, fontWeight: '900', maxWidth: 36 },
  caret: { fontSize: 9 },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,0,80,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 28,
    maxHeight: 440,
    padding: 18,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 20,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: C.textDark,
    textAlign: 'center',
    marginBottom: 14,
  },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, paddingHorizontal: 8,
    borderRadius: 16, marginBottom: 2,
  },
  optionActive: { backgroundColor: C.purpleLight },
  optFlag: { fontFamily: ff('fa', 'bold'), fontSize: 26 },
  optNative: { fontFamily: ff('fa', 'bold'), fontSize: 15, color: C.textDark, fontWeight: '800' },
  optEn:     { fontSize: 11, color: C.textMid, fontWeight: '600', marginTop: 1 },
  checkCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.purple,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: '900' },
});
