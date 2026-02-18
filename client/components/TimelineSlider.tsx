import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { AppColors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { Waypoint } from '@/lib/celestial';

interface TimelineSliderProps {
  value: number;
  onChange: (value: number) => void;
  waypoints: Waypoint[];
  selectedWaypoint: Waypoint | null;
}

const SLIDER_WIDTH = Dimensions.get('window').width - Spacing.lg * 4;
const THUMB_SIZE = 28;

export function TimelineSlider({ value, onChange, waypoints, selectedWaypoint }: TimelineSliderProps) {
  const translateX = useSharedValue(value * (SLIDER_WIDTH - THUMB_SIZE));
  const scale = useSharedValue(1);
  const lastHapticIndex = useSharedValue(-1);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(1.2, { damping: 15 });
    })
    .onUpdate((event) => {
      const newX = Math.max(0, Math.min(SLIDER_WIDTH - THUMB_SIZE, translateX.value + event.translationX - (translateX.value - value * (SLIDER_WIDTH - THUMB_SIZE))));
      translateX.value = newX;
      
      const newValue = newX / (SLIDER_WIDTH - THUMB_SIZE);
      const waypointIndex = Math.floor(newValue * waypoints.length);
      
      if (waypointIndex !== lastHapticIndex.value && waypointIndex >= 0 && waypointIndex < waypoints.length) {
        lastHapticIndex.value = waypointIndex;
        runOnJS(triggerHaptic)();
      }
      
      runOnJS(onChange)(newValue);
    })
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 15 });
      lastHapticIndex.value = -1;
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: value * (SLIDER_WIDTH - THUMB_SIZE) },
      { scale: scale.value },
    ],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: value * (SLIDER_WIDTH - THUMB_SIZE) + THUMB_SIZE / 2,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <View style={styles.track}>
          <Animated.View style={[styles.progress, progressStyle]} />
          
          {waypoints.map((waypoint, index) => {
            const position = (index / (waypoints.length - 1)) * (SLIDER_WIDTH - THUMB_SIZE) + THUMB_SIZE / 2 - 4;
            const isActive = index <= Math.floor(value * (waypoints.length - 1));
            return (
              <View
                key={waypoint.id}
                style={[
                  styles.waypointMarker,
                  { left: position },
                  isActive && styles.waypointMarkerActive,
                ]}
              />
            );
          })}
        </View>
        
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <View style={styles.thumbInner} />
          </Animated.View>
        </GestureDetector>
      </View>
      
      {selectedWaypoint ? (
        <View style={styles.labelContainer}>
          <ThemedText style={styles.waypointLabel}>
            {selectedWaypoint.label}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: THUMB_SIZE + Spacing.md,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'visible',
  },
  progress: {
    height: '100%',
    backgroundColor: AppColors.accent,
    borderRadius: 2,
  },
  waypointMarker: {
    position: 'absolute',
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  waypointMarkerActive: {
    backgroundColor: AppColors.accent,
    borderColor: AppColors.accent,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: AppColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },
  thumbInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppColors.primary,
  },
  labelContainer: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  waypointLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.accent,
  },
});
