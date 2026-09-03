import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Lang } from '../store/AppContext';
import { ff } from '../theme/fonts';

// Common presets shown as quick-select chips, matching the pattern used by
// mainstream screen-time tools (iOS Screen Time, Google Family Link, YouTube
// Kids): a handful of sensible durations plus a "Custom" option, instead of
// separate hour/minute steppers.
const PRESETS = [30, 60, 90, 120, 180];
const CUSTOM_STEP = 15;
const CUSTOM_MIN = 15;
const CUSTOM_MAX = 480;

function fmtDuration(mins: number, isFa: boolean) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (isFa) {
    if (h && m) return `${h} ساعت ${m} دقیقه`;
    if (h) return `${h} ساعت`;
    return `${m} دقیقه`;
  }
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function fmtClock(ms: number) {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

interface Props {
  lang: Lang;
  enabled: boolean;
  onToggleEnabled: (v: boolean) => void;
  minutes: number;
  onChangeMinutes: (v: number) => void;
  usedTodayMs: number;
  remainingMs: number;
  bonusMinutesToday: number;
  onAddBonus: (mins: number) => void;
}

export default function DailyLimitCard({
  lang, enabled, onToggleEnabled, minutes, onChangeMinutes,
  usedTodayMs, remainingMs, bonusMinutesToday, onAddBonus,
}: Props) {
  const isFa = lang === 'fa';
  const isPreset = PRESETS.includes(minutes);
  const [customOpen, setCustomOpen] = useState(!isPreset);

  const selectPreset = (mins: number) => {
    setCustomOpen(false);
    onChangeMinutes(mins);
  };
  const openCustom = () => {
    setCustomOpen(true);
    if (isPreset) onChangeMinutes(Math.max(CUSTOM_MIN, minutes - CUSTOM_STEP || 15));
  };
  const stepCustom = (delta: number) => {
    const next = Math.max(CUSTOM_MIN, Math.min(CUSTOM_MAX, minutes + delta));
    onChangeMinutes(next);
  };

  const totalLimitMs = (minutes + bonusMinutesToday) * 60000;
  const usedPct = totalLimitMs > 0 ? Math.min(100, Math.round((usedTodayMs / totalLimitMs) * 100)) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { fontFamily: ff(lang, 'black') }, dirStyle(isFa)]}>
            {isFa ? 'محدودیت زمان روزانه' : 'Daily time limit'}
          </Text>
          <Text style={[styles.helper, { fontFamily: ff(lang, 'regular') }, dirStyle(isFa)]}>
            {isFa
              ? 'بر اساس ساعت دستگاه اندازه‌گیری می‌شود و هر روز از نو شروع می‌شود.'
              : 'Measured by the device clock and resets every day.'}
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggleEnabled}
          trackColor={{ true: '#6C4EFF', false: '#E3DDF7' }}
          thumbColor="#FFFFFF"
        />
      </View>

      {enabled ? (
        <View style={styles.body}>
          <View style={styles.chipRow}>
            {PRESETS.map(p => {
              const active = !customOpen && minutes === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => selectPreset(p)}
                  activeOpacity={0.82}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive, { fontFamily: ff(lang, 'bold') }]}>
                    {fmtDuration(p, isFa)}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.chip, customOpen && styles.chipActive]}
              onPress={openCustom}
              activeOpacity={0.82}
            >
              <Text style={[styles.chipText, customOpen && styles.chipTextActive, { fontFamily: ff(lang, 'bold') }]}>
                {isFa ? 'دلخواه' : 'Custom'}
              </Text>
            </TouchableOpacity>
          </View>

          {customOpen ? (
            <View style={styles.customRow}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => stepCustom(-CUSTOM_STEP)}
                activeOpacity={0.82}
                disabled={minutes <= CUSTOM_MIN}
              >
                <Text style={styles.stepBtnTxt}>–</Text>
              </TouchableOpacity>
              <Text style={[styles.customValue, { fontFamily: ff(lang, 'black') }]}>{fmtDuration(minutes, isFa)}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => stepCustom(CUSTOM_STEP)}
                activeOpacity={0.82}
                disabled={minutes >= CUSTOM_MAX}
              >
                <Text style={styles.stepBtnTxt}>+</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${usedPct}%` }]} />
          </View>
          <View style={styles.usageRow}>
            <Text style={[styles.usageLabel, { fontFamily: ff(lang, 'bold') }]}>
              {isFa ? `استفاده شده: ${fmtClock(usedTodayMs)}` : `Used: ${fmtClock(usedTodayMs)}`}
            </Text>
            <Text style={[styles.usageLabel, { fontFamily: ff(lang, 'bold') }]}>
              {isFa ? `باقی‌مانده: ${fmtClock(remainingMs)}` : `Remaining: ${fmtClock(remainingMs)}`}
            </Text>
          </View>

          <Text style={[styles.bonusTitle, { fontFamily: ff(lang, 'bold') }, dirStyle(isFa)]}>
            {isFa ? 'زمان اضافه برای امروز' : 'Add time for today'}
          </Text>
          <View style={styles.bonusRow}>
            {[15, 30, 60].map(n => (
              <TouchableOpacity key={n} style={styles.bonusChip} onPress={() => onAddBonus(n)} activeOpacity={0.82}>
                <Text style={[styles.bonusChipText, { fontFamily: ff(lang, 'bold') }]}>+{n}{isFa ? ' دقیقه' : 'm'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {bonusMinutesToday > 0 ? (
            <Text style={[styles.bonusNote, { fontFamily: ff(lang, 'bold') }, dirStyle(isFa)]}>
              {isFa ? `${bonusMinutesToday}+ دقیقه اضافه برای امروز` : `+${bonusMinutesToday} bonus min today`}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function dirStyle(isFa: boolean) {
  return { writingDirection: (isFa ? 'rtl' : 'ltr') as 'rtl' | 'ltr', textAlign: (isFa ? 'right' : 'left') as 'right' | 'left' };
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerText: { flex: 1 },
  title: { color: '#1A0050', fontSize: 16 },
  helper: { color: '#6B5A89', fontSize: 12, lineHeight: 17, marginTop: 3 },
  body: { marginTop: 16, gap: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: '#F4F2FF', borderWidth: 1.5, borderColor: 'transparent' },
  chipActive: { backgroundColor: '#6C4EFF' },
  chipText: { color: '#4A2FD0', fontSize: 13 },
  chipTextActive: { color: '#FFFFFF' },
  customRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18, backgroundColor: '#F8F7FD', borderRadius: 14, paddingVertical: 10 },
  stepBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#6C4EFF', alignItems: 'center', justifyContent: 'center' },
  stepBtnTxt: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', lineHeight: 20 },
  customValue: { color: '#1A0050', fontSize: 16, minWidth: 90, textAlign: 'center' },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: '#EDEAFB', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: '#6C4EFF' },
  usageRow: { flexDirection: 'row', justifyContent: 'space-between' },
  usageLabel: { color: '#4A3E63', fontSize: 12.5 },
  bonusTitle: { color: '#6B5A89', fontSize: 12, marginTop: 2 },
  bonusRow: { flexDirection: 'row', gap: 8 },
  bonusChip: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF6E0', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFE9B3' },
  bonusChipText: { color: '#8A5A00', fontSize: 12.5 },
  bonusNote: { color: '#0B9362', fontSize: 12 },
});
