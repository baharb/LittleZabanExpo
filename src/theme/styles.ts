/**
 * Shared dark-purple Lingokids style constants
 * BG = deep purple background
 * CARD = white rounded card
 */
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { C } from './colors';

export const BG   = '#2D1B69';
export const BG2  = '#1A0A4A';
export const STATUS_H = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 24);

export const CARD = {
  backgroundColor: '#fff',
  borderRadius: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 6,
} as const;

export const BACK_BTN = {
  width: 46, height: 46, borderRadius: 23,
  backgroundColor: 'rgba(255,255,255,0.20)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const sharedStyles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: BG },
  backBtn: { width: 46, height: 46, borderRadius: 23,
             backgroundColor: 'rgba(255,255,255,0.20)',
             alignItems: 'center', justifyContent: 'center' },
  backTxt: { color: '#fff', fontSize: 28, fontWeight: '900',
             lineHeight: 32, includeFontPadding: false },
  card:    { backgroundColor: '#fff', borderRadius: 24,
             shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
             shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  title:   { color: '#fff', fontSize: 22, fontWeight: '900' },
  subtitle:{ color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  whiteText: { color: '#fff' },
});
