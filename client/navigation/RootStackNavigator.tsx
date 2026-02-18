import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from '@/navigation/MainTabNavigator';
import SettingsScreen from '@/screens/SettingsScreen';
import { useScreenOptions } from '@/hooks/useScreenOptions';
import { AppColors } from '@/constants/theme';

export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        contentStyle: {
          backgroundColor: AppColors.background,
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: 'modal',
          headerTitle: 'Settings',
          headerTintColor: '#FFFFFF',
          headerStyle: {
            backgroundColor: AppColors.background,
          },
        }}
      />
    </Stack.Navigator>
  );
}
