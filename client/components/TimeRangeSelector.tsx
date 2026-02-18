import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  WithSpringConfig,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { AppColors, BorderRadius, Spacing } from '@/constants/theme';
import { TimeRange } from '@/lib/celestial';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const RANGES: { key: TimeRange; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.5,
  stiffness: 200,
};

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const selectedIndex = RANGES.findIndex(r => r.key === value);

  const handlePress = (range: TimeRange) => {
    if (range !== value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(range);
    }
  };

  return (
    <View style={styles.container}>
      {RANGES.map((range, index) => {
        const isSelected = range.key === value;
        return (
          <Pressable
            key={range.key}
            onPress={() => handlePress(range.key)}
            style={[
              styles.segment,
              isSelected && styles.segmentSelected,
            ]}
          >
            <ThemedText
              style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}
            >
              {range.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: AppColors.accent,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  labelSelected: {
    color: AppColors.primary,
    fontWeight: '600',
  },
});
