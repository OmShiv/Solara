import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { CelestialBody, getCelestialPosition, Location } from '@/lib/celestial';
import { AppColors, BorderRadius, Spacing } from '@/constants/theme';

interface CelestialListItemProps {
  body: CelestialBody;
  location: Location;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CelestialListItem({ body, location, isSelected, onPress }: CelestialListItemProps) {
  const scale = useSharedValue(1);
  const position = getCelestialPosition(body.id, new Date(), location);
  const isVisible = position.altitude > 0;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getIconName = (): keyof typeof Feather.glyphMap => {
    switch (body.type) {
      case 'sun':
        return 'sun';
      case 'moon':
        return 'moon';
      default:
        return 'circle';
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        animatedStyle,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: body.color + '20' }]}>
        <Feather name={getIconName()} size={24} color={body.color} />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.name}>{body.name}</ThemedText>
        <ThemedText style={styles.type}>
          {body.type.charAt(0).toUpperCase() + body.type.slice(1)}
        </ThemedText>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, isVisible ? styles.statusVisible : styles.statusHidden]} />
        <ThemedText style={styles.statusText}>
          {isVisible ? 'Visible' : 'Below horizon'}
        </ThemedText>
      </View>

      {isSelected ? (
        <View style={styles.checkmark}>
          <Feather name="check" size={20} color={AppColors.accent} />
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  containerSelected: {
    borderColor: AppColors.accent,
    backgroundColor: AppColors.primary + 'DD',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  type: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  statusVisible: {
    backgroundColor: '#4CAF50',
  },
  statusHidden: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.accent + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
