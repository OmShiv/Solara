import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { CelestialBody } from '@/lib/celestial';
import { AppColors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface ARHeaderProps {
  celestialBody: CelestialBody;
  cameraEnabled: boolean;
  onCameraToggle: () => void;
  onSettingsPress: () => void;
}

export function ARHeader({ 
  celestialBody, 
  cameraEnabled, 
  onCameraToggle, 
  onSettingsPress 
}: ARHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleCameraToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCameraToggle();
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSettingsPress();
  };

  const HeaderContent = () => (
    <View style={styles.content}>
      <Pressable
        onPress={handleSettingsPress}
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.iconButtonPressed,
        ]}
      >
        <Feather name="settings" size={22} color="#FFFFFF" />
      </Pressable>

      <View style={styles.titleContainer}>
        <View style={[styles.bodyIndicator, { backgroundColor: celestialBody.color }]} />
        <ThemedText style={styles.title}>{celestialBody.name}</ThemedText>
      </View>

      <Pressable
        onPress={handleCameraToggle}
        style={({ pressed }) => [
          styles.iconButton,
          cameraEnabled && styles.iconButtonActive,
          pressed && styles.iconButtonPressed,
        ]}
      >
        <Feather 
          name={cameraEnabled ? 'camera' : 'camera-off'} 
          size={22} 
          color={cameraEnabled ? AppColors.primary : '#FFFFFF'} 
        />
      </Pressable>
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={30}
        tint="dark"
        style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}
      >
        <View style={styles.overlay}>
          <HeaderContent />
        </View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.container, styles.fallbackContainer, { paddingTop: insets.top + Spacing.sm }]}>
      <HeaderContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  overlay: {
    backgroundColor: 'rgba(10, 17, 40, 0.6)',
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  fallbackContainer: {
    backgroundColor: 'rgba(10, 17, 40, 0.85)',
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    backgroundColor: AppColors.accent,
  },
  iconButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
    ...Shadows.glow,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
