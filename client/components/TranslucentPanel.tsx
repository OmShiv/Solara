import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { AppColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

interface TranslucentPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function TranslucentPanel({ children, style, intensity = 30 }: TranslucentPanelProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[styles.panel, style]}
      >
        <View style={styles.overlay}>
          {children}
        </View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.panel, styles.fallbackPanel, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.small,
  },
  overlay: {
    backgroundColor: 'rgba(10, 17, 40, 0.6)',
    padding: Spacing.md,
  },
  fallbackPanel: {
    backgroundColor: 'rgba(10, 17, 40, 0.85)',
    padding: Spacing.md,
  },
});
