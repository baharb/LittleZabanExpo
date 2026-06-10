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
import AgeScreen           from './src/screens/AgeScreen';
import MainTabs            from './src/screens/MainTabs';
import SectionScreen       from './src/screens/SectionScreen';
import GameScreen          from './src/screens/GameScreen';
import ParentScreen        from './src/screens/ParentScreen';
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

// Force LTR at the OS level so Persian text is controlled by per-element styles
I18nManager.forceRTL(false);

function Router() {
  const { screen } = useContext(NavContext);
  switch (screen.name) {
    case 'Splash':           return <SplashScreen />;
    case 'Age':              return <AgeScreen />;
    case 'Main':             return <MainTabs initialTab={screen.tab} />;
    case 'BabyWorld':        return <BabyWorldScreen />;
    case 'Section':          return <SectionScreen id={screen.id} />;
    case 'Game':             return <GameLandscapeFrame><GameScreen gameId={screen.gameId} /></GameLandscapeFrame>;
    case 'Parent':           return <ParentScreen />;
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
    default:                 return <SplashScreen />;
  }
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
        <Router />
      </NavProvider>
    </AppProvider>
  );
}
