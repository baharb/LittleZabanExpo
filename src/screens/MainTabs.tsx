import React, { useContext, useEffect, useState } from 'react';
import { Image, Platform, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { AppContext } from '../store/AppContext';
import { ff } from '../theme/fonts';
import { useResponsive } from '../theme/responsive';
import GamesScreen from './GamesScreen';
import HomeScreen from './HomeScreen';
import PersianScreen from './PersianScreen';
import ProfileScreen from './ProfileScreen';
import SubjectsScreen from './SubjectsScreen';

const TABS: { id: string; icon: any; fa: string; en: string; color: string }[] = [
  { id: 'Home', icon: neliWorldAssets.ui.home, fa: 'خانه', en: 'Home', color: '#16A36A' },
  { id: 'Subjects', icon: neliWorldAssets.ui.book, fa: 'یادگیری', en: 'Learn', color: '#078BFF' },
  { id: 'Games', icon: neliWorldAssets.ui.gamepad, fa: 'بازی', en: 'Games', color: '#7C3AED' },
  { id: 'Persian', icon: neliWorldAssets.ui.star, fa: 'فرهنگ', en: 'Culture', color: '#D946A6' },
  { id: 'Profile', icon: neliWorldAssets.ui.heart, fa: 'من', en: 'Me', color: '#FF8C18' },
];

let rememberedTab = 'Home';

export default function MainTabs({ initialTab }: { initialTab?: string }) {
  const [active, setActiveState] = useState(initialTab || rememberedTab);
  const { lang } = useContext(AppContext);
  const { sideRail, isSmall } = useResponsive();
  const tabIconSize = PixelRatio.roundToNearestPixel(isSmall ? 30 : 34);
  const railIconSize = PixelRatio.roundToNearestPixel(38);

  useEffect(() => {
    if (initialTab && initialTab !== active) {
      rememberedTab = initialTab;
      setActiveState(initialTab);
    }
  }, [active, initialTab]);

  const setActive = (tab: string) => {
    rememberedTab = tab;
    setActiveState(tab);
  };

  const renderScreen = () => {
    switch (active) {
      case 'Home': return <HomeScreen />;
      case 'Subjects': return <SubjectsScreen />;
      case 'Games': return <GamesScreen />;
      case 'Persian': return <PersianScreen />;
      case 'Profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <View style={[styles.container, sideRail && styles.containerWide]}>
      <View style={styles.content}>{renderScreen()}</View>
      <View style={[styles.tabBar, sideRail && styles.tabRail]}>
        {TABS.map(tab => {
          const isActive = tab.id === active;
          const color = isActive ? tab.color : '#9A90A8';
          return (
            <TouchableOpacity key={tab.id} style={[styles.tab, sideRail && styles.tabWide]} onPress={() => setActive(tab.id)} activeOpacity={0.78}>
              <View style={[styles.tabInner, sideRail && styles.tabInnerWide, isActive && { backgroundColor: tab.color + '1F' }]}>
                <Image
                  source={tab.icon}
                  style={[
                    styles.tabIcon,
                    { width: tabIconSize, height: tabIconSize },
                    sideRail && { width: railIconSize, height: railIconSize },
                    !isActive && styles.tabIconOff,
                  ]}
                  resizeMode="contain"
                  resizeMethod="resize"
                  fadeDuration={0}
                />
                <Text style={[styles.tabLabel, sideRail && styles.tabLabelWide, { color, fontFamily: ff(lang, isActive ? 'bold' : 'regular') }]} numberOfLines={1}>
                  {lang === 'fa' || lang === 'ar' ? tab.fa : tab.en}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4EE' },
  containerWide: { flexDirection: 'row-reverse' },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECE7DE',
    paddingTop: 7,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingHorizontal: 6,
    shadowColor: '#423357',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  tabRail: {
    width: 92,
    flexDirection: 'column',
    borderTopWidth: 0,
    borderRightWidth: 1,
    borderRightColor: '#ECE7DE',
    paddingTop: Platform.OS === 'ios' ? 20 : 12,
    paddingBottom: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    gap: 8,
  },
  tab: { flex: 1, alignItems: 'center' },
  tabWide: { flex: 0, width: '100%' },
  tabInner: { alignItems: 'center', justifyContent: 'center', borderRadius: 18, paddingVertical: 5, minWidth: 58, minHeight: 54 },
  tabInnerWide: { width: '100%', minWidth: 0, minHeight: 66, paddingHorizontal: 4 },
  tabIcon: { },
  tabIconWide: { },
  tabIconSmall: { },
  tabIconOff: { opacity: 0.45 },
  tabLabel: { fontSize: 10, fontWeight: '900', marginTop: 1, textAlign: 'center' },
  tabLabelWide: { fontSize: 10.5, maxWidth: 76 },
});
