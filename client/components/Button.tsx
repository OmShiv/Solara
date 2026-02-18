import React, { ReactNode } from 'react';
import { StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { AppColors, BorderRadius, Spacing } from '@/constants/theme';

interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  onPress,
  children,
  style,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.98, springConfig);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, springConfig);
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return AppColors.accent;
      case 'secondary':
        return AppColors.secondary;
      case 'outline':
        return 'transparent';
      default:
        return AppColors.accent;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return AppColors.primary;
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
        return AppColors.accent;
      default:
        return AppColors.primary;
    }
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: disabled ? 0.5 : 1,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: AppColors.accent,
        },
        style,
        animatedStyle,
      ]}
    >
      <ThemedText
        type="body"
        style={[styles.buttonText, { color: getTextColor() }]}
      >
        {children}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  buttonText: {
    fontWeight: '600',
  },
});
