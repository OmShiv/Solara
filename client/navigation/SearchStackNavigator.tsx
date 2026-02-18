import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '@/screens/SearchScreen';
import { useScreenOptions } from '@/hooks/useScreenOptions';
import { AppColors } from '@/constants/theme';

export type SearchStackParamList = {
  Search: undefined;
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: {
          backgroundColor: AppColors.background,
        },
        headerTintColor: '#FFFFFF',
        contentStyle: {
          backgroundColor: AppColors.background,
        },
      }}
    >
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerTitle: 'Celestial Objects',
        }}
      />
    </Stack.Navigator>
  );
}
