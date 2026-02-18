import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

import RootStackNavigator from '@/navigation/RootStackNavigator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CelestialProvider } from '@/contexts/CelestialContext';
import { AppColors } from '@/constants/theme';

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.root}>
            <KeyboardProvider>
              <CelestialProvider>
                <NavigationContainer>
                  <RootStackNavigator />
                </NavigationContainer>
              </CelestialProvider>
              <StatusBar style="light" />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});
