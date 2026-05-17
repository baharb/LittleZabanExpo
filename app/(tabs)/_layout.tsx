import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { AppContext } from '../../src/store/AppContext';
import { COLORS } from '../../src/theme/colors';

export default function TabsLayout() {
  const { lang } = useContext(AppContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: lang === 'fa' ? 'خانه' : 'Home',
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          tabBarLabel: lang === 'fa' ? 'درس‌ها' : 'Learn',
          tabBarIcon: ({ color }) => <TabIcon icon="📚" color={color} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          tabBarLabel: lang === 'fa' ? 'بازی‌ها' : 'Games',
          tabBarIcon: ({ color }) => <TabIcon icon="🎮" color={color} />,
        }}
      />
      <Tabs.Screen
        name="persian"
        options={{
          tabBarLabel: lang === 'fa' ? 'فرهنگ' : 'Culture',
          tabBarIcon: ({ color }) => <TabIcon icon="🌙" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: lang === 'fa' ? 'من' : 'Me',
          tabBarIcon: ({ color }) => <TabIcon icon="⭐" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color }: { icon: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 22, opacity: color === COLORS.primary ? 1 : 0.5 }}>{icon}</Text>;
}
