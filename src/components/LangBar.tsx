import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { useNav } from '../store/NavContext';

interface Props {
  dark?: boolean;
  buttonSize?: number;
  iconSize?: number;
}

// Kept under the existing component name so every current TopBar call site
// automatically receives the shared settings control.
export default function LangBar({ dark = true, buttonSize = 56, iconSize = 44 }: Props) {
  const { navigate } = useNav();

  const openSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigate({ name: 'SettingsUnlock' });
  };

  return (
    <TouchableOpacity
      style={[styles.button, { width: buttonSize, height: buttonSize }]}
      onPress={openSettings}
      activeOpacity={0.78}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Image
        source={neliWorldAssets.ui.settingsIcon}
        style={[styles.icon, { width: iconSize, height: iconSize, tintColor: dark ? '#FFFFFF' : '#2D1B69' }]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {},
});
