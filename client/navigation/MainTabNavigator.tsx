import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import ARViewScreen from '@/screens/ARViewScreen';
import MapViewScreen from '@/screens/MapViewScreen';
import SearchStackNavigator from '@/navigation/SearchStackNavigator';
import { AppColors } from '@/constants/theme';

export type MainTabParamList = {
  MapTab: undefined;
  ARTab: undefined;
  SearchTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="ARTab"
      screenOptions={{
        tabBarActiveTintColor: AppColors.accent,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: 'rgba(10, 17, 40, 0.95)',
            web: 'rgba(10, 17, 40, 0.95)',
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="MapTab"
        component={MapViewScreen}
        options={{
          title: '3D Map',
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ARTab"
        component={ARViewScreen}
        options={{
          title: 'AR View',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.centerIcon, focused && styles.centerIconActive]}>
              <Feather name="sun" size={size + 4} color={focused ? AppColors.primary : color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  centerIconActive: {
    backgroundColor: AppColors.accent,
    shadowColor: AppColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
});
