import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '../src/store/AppContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="age" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="section" />
        <Stack.Screen name="game" />
        <Stack.Screen name="parent" />
      </Stack>
    </AppProvider>
  );
}
