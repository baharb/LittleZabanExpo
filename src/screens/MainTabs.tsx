import React from 'react';
import GamesScreen from './GamesScreen';
import ProfileScreen from './ProfileScreen';

export default function MainTabs({ initialTab }: { initialTab?: string }) {
  return initialTab === 'Profile' ? <ProfileScreen /> : <GamesScreen />;
}
