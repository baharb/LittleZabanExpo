import React, { useContext } from 'react';
import { View, ActivityIndicator, I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Vazirmatn_400Regular,
  Vazirmatn_500Medium,
  Vazirmatn_600SemiBold,
  Vazirmatn_700Bold,
  Vazirmatn_800ExtraBold,
} from '@expo-google-fonts/vazirmatn';
import { AppProvider } from './src/store/AppContext';
import { NavProvider, NavContext } from './src/store/NavContext';

import SplashScreen        from './src/screens/SplashScreen';
import AccountSetupScreen  from './src/screens/AccountSetupScreen';
import SettingsUnlockScreen from './src/screens/SettingsUnlockScreen';
import PremiumUnlockScreen  from './src/screens/PremiumUnlockScreen';
import PremiumScreen        from './src/screens/PremiumScreen';
import AgeScreen           from './src/screens/AgeScreen';
import MainTabs            from './src/screens/MainTabs';
import SectionScreen       from './src/screens/SectionScreen';
import GameScreen          from './src/screens/GameScreen';
import CharactersScreen    from './src/screens/CharactersScreen';
import BabyWorldScreen     from './src/screens/BabyWorldScreen';
import StickerRewardScreen from './src/screens/StickerRewardScreen';
import ColoringScreen      from './src/screens/ColoringScreen';
import VideoShowsScreen    from './src/screens/VideoLibraryScreen';
import AlphabetShowScreen  from './src/screens/VideoShowsScreen';
import AlphabetTrainScreen from './src/screens/AlphabetTrainScreen';
import InteractiveFarsiTraceScreen from './src/screens/InteractiveFarsiTraceScreen';
import FirstLettersTracingScreen from './src/screens/FirstLettersTracingScreen';
import LearningPathScreen  from './src/screens/LearningPathScreen';
import AudiobooksScreen    from './src/screens/AudiobooksScreen';
import PhysicalActivityScreen from './src/screens/PhysicalActivityScreen';
import SELScreen           from './src/screens/SELScreen';
import InteractiveGamesHub from './src/screens/interactive/InteractiveGamesHub';
import DailyRoutineGame    from './src/screens/interactive/DailyRoutineGame';
import FeedAnimalsGame     from './src/screens/interactive/FeedAnimalsGame';
import BuildSceneGame      from './src/screens/interactive/BuildSceneGame';
import DressUpGame         from './src/screens/interactive/DressUpGame';
import CookingGame         from './src/screens/interactive/CookingGame';
import ToothBrushGame      from './src/screens/interactive/ToothBrushGame';
import ConversationGame    from './src/screens/interactive/ConversationGame';
import IranPuzzleGame      from './src/screens/interactive/IranPuzzleGame';
import SolarSystemPuzzleGame from './src/screens/interactive/SolarSystemPuzzleGame';
import GameLandscapeFrame  from './src/components/GameLandscapeFrame';
import TimeUpScreen        from './src/screens/TimeUpScreen';
import { AppContext } from './src/store/AppContext';
import { getCurrentCustomerInfo, hasPremiumEntitlement, initPurchases, subscribeToCustomerInfo } from './src/services/purchases';

// Force LTR at the OS level so Persian text is controlled by per-element styles
I18nManager.forceRTL(false);

function Router() {
  const { screen } = useContext(NavContext);
  switch (screen.name) {
    case 'Splash':           return <SplashScreen />;
    case 'AccountSetup':     return <AccountSetupScreen />;
    case 'SettingsUnlock':   return <SettingsUnlockScreen />;
    case 'PremiumUnlock':    return <PremiumUnlockScreen />;
    case 'Premium':          return <PremiumScreen />;
    case 'Age':              return <AgeScreen />;
    case 'Main':             return <MainTabs initialTab={screen.tab} />;
    case 'BabyWorld':        return <BabyWorldScreen />;
    case 'Section':          return <SectionScreen id={screen.id} />;
    case 'Game':             return <GameLandscapeFrame><GameScreen gameId={screen.gameId} /></GameLandscapeFrame>;
    case 'Characters':       return <CharactersScreen />;
    case 'StickerReward':    return <StickerRewardScreen sticker={screen.sticker} message={screen.message} />;
    case 'Coloring':         return <ColoringScreen />;
    case 'VideoShows':       return <VideoShowsScreen />;
    case 'AlphabetShow':     return <AlphabetShowScreen />;
    case 'AlphabetTrain':    return <AlphabetTrainScreen />;
    case 'InteractiveFarsiTrace': return <InteractiveFarsiTraceScreen />;
    case 'FirstLettersTracing': return <InteractiveFarsiTraceScreen />;
    case 'LearningPath':     return <LearningPathScreen />;
    case 'Audiobooks':       return <AudiobooksScreen />;
    case 'PhysicalActivity': return <PhysicalActivityScreen />;
    case 'SEL':              return <SELScreen />;
    case 'InteractiveGames': return <InteractiveGamesHub />;
    case 'DailyRoutine':     return <GameLandscapeFrame><DailyRoutineGame /></GameLandscapeFrame>;
    case 'FeedAnimals':      return <GameLandscapeFrame><FeedAnimalsGame /></GameLandscapeFrame>;
    case 'BuildScene':       return <GameLandscapeFrame><BuildSceneGame /></GameLandscapeFrame>;
    case 'DressUp':          return <GameLandscapeFrame><DressUpGame /></GameLandscapeFrame>;
    case 'Cooking':          return <GameLandscapeFrame><CookingGame /></GameLandscapeFrame>;
    case 'ToothBrush':       return <GameLandscapeFrame><ToothBrushGame /></GameLandscapeFrame>;
    case 'ConversationGame':  return <GameLandscapeFrame><ConversationGame /></GameLandscapeFrame>;
    case 'IranPuzzle':       return <GameLandscapeFrame><IranPuzzleGame /></GameLandscapeFrame>;
    case 'SolarPuzzle':      return <GameLandscapeFrame><SolarSystemPuzzleGame /></GameLandscapeFrame>;
    case 'TimeUp':           return <TimeUpScreen />;
    default:                 return <SplashScreen />;
  }
}

// Screens a kid could otherwise be left staring at once the daily limit is
// hit. Parent-facing / pre-app screens are exempt so a parent who is already
// inside settings (or entering the settings password) isn't bounced out.
// (The Settings page itself — Main/Profile — is exempted separately below,
// since unlocking from TimeUp now lands there directly.)
const TIME_GATE_EXEMPT = new Set(['TimeUp', 'SettingsUnlock', 'AccountSetup', 'Splash', 'PremiumUnlock', 'Premium']);

// Boots the RevenueCat SDK once auth/local state has loaded, then keeps
// AppContext.isPremium in sync with the user's real subscription status —
// renewals, cancellations, billing issues, and restores done on another
// device all flow through this listener automatically. A no-op (and
// isPremium stays whatever was last saved locally) until real RevenueCat
// API keys are set in src/config/revenuecat.ts.
function PurchasesBridge() {
  const { authReady, setIsPremium } = useContext(AppContext);
  React.useEffect(() => {
    if (!authReady) return;
    let unsubscribe = () => {};
    let cancelled = false;
    (async () => {
      await initPurchases();
      const info = await getCurrentCustomerInfo();
      if (cancelled) return;
      if (info) setIsPremium(hasPremiumEntitlement(info));
      unsubscribe = subscribeToCustomerInfo(nextInfo => setIsPremium(hasPremiumEntitlement(nextInfo)));
    })();
    return () => { cancelled = true; unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady]);
  return null;
}

function ScreenTimeGate() {
  const { timeExpired } = useContext(AppContext);
  const { screen, reset } = useContext(NavContext);
  React.useEffect(() => {
    if (!timeExpired) return;
    const isProfileTab = screen.name === 'Main' && screen.tab === 'Profile';
    if (isProfileTab || TIME_GATE_EXEMPT.has(screen.name)) return;
    reset({ name: 'TimeUp' });
  }, [timeExpired, screen, reset]);
  return null;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Vazirmatn_400Regular,
    Vazirmatn_500Medium,
    Vazirmatn_600SemiBold,
    Vazirmatn_700Bold,
    Vazirmatn_800ExtraBold,
    Nunito_400Regular: require('./assets/fonts/Nunito_400Regular.ttf'),
    Nunito_700Bold: require('./assets/fonts/Nunito_700Bold.ttf'),
    Nunito_800ExtraBold: require('./assets/fonts/Nunito_800ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#6B4EFF', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavProvider>
        <StatusBar style="light" backgroundColor="#2D1B69" translucent={false} />
        <PurchasesBridge />
        <ScreenTimeGate />
        <Router />
      </NavProvider>
    </AppProvider>
  );
}
