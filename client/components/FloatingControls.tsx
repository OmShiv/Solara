import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { TranslucentPanel } from '@/components/TranslucentPanel';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { TimelineSlider } from '@/components/TimelineSlider';
import { TimeRange, Waypoint } from '@/lib/celestial';
import { Spacing } from '@/constants/theme';

interface FloatingControlsProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  sliderValue: number;
  onSliderChange: (value: number) => void;
  waypoints: Waypoint[];
  selectedWaypoint: Waypoint | null;
}

export function FloatingControls({
  timeRange,
  onTimeRangeChange,
  sliderValue,
  onSliderChange,
  waypoints,
  selectedWaypoint,
}: FloatingControlsProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={[styles.container, { bottom: tabBarHeight + Spacing.lg }]}>
      <TranslucentPanel style={styles.panel}>
        <TimeRangeSelector value={timeRange} onChange={onTimeRangeChange} />
        <View style={styles.sliderContainer}>
          <TimelineSlider
            value={sliderValue}
            onChange={onSliderChange}
            waypoints={waypoints}
            selectedWaypoint={selectedWaypoint}
          />
        </View>
      </TranslucentPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
  },
  panel: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sliderContainer: {
    marginTop: Spacing.lg,
  },
});
