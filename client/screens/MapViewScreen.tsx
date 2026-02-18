import React from 'react';
import { View, StyleSheet, Pressable, Platform, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useCelestial } from '@/contexts/CelestialContext';
import { MapArcOverlay } from '@/components/MapArcOverlay';
import { TranslucentPanel } from '@/components/TranslucentPanel';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { TimelineSlider } from '@/components/TimelineSlider';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { AppColors, Spacing, Shadows } from '@/constants/theme';
import { RootStackParamList } from '@/navigation/RootStackNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MapViewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const {
    selectedBody,
    timeRange,
    setTimeRange,
    waypoints,
    currentPosition,
    sliderValue,
    setSliderValue,
    selectedWaypoint,
    location,
    locationPermission,
    requestLocationPermission,
    useGPS,
  } = useCelestial();

  const handleLocationPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  const handleRequestLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await requestLocationPermission();
  };

  const HeaderContent = () => (
    <View style={styles.headerContent}>
      <View style={styles.titleContainer}>
        <View style={[styles.bodyIndicator, { backgroundColor: selectedBody.color }]} />
        <ThemedText style={styles.title}>Overhead View</ThemedText>
      </View>
      <Pressable
        onPress={handleLocationPress}
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.iconButtonPressed,
        ]}
      >
        <Feather name="map-pin" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapArcOverlay
        waypoints={waypoints}
        selectedWaypoint={selectedWaypoint}
        currentPosition={currentPosition}
        celestialBody={selectedBody}
        sliderValue={sliderValue}
        location={location}
      />

      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={30}
          tint="dark"
          style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
        >
          <View style={styles.headerOverlay}>
            <HeaderContent />
          </View>
        </BlurView>
      ) : (
        <View style={[styles.header, styles.headerFallback, { paddingTop: insets.top + Spacing.sm }]}>
          <HeaderContent />
        </View>
      )}

      {!useGPS && locationPermission !== 'granted' ? (
        <View style={styles.locationPrompt}>
          <TranslucentPanel>
            <View style={styles.locationPromptContent}>
              <Feather name="crosshair" size={24} color={AppColors.accent} />
              <ThemedText style={styles.locationPromptText}>
                Enable GPS for accurate positioning
              </ThemedText>
              <Pressable
                onPress={handleRequestLocation}
                style={styles.locationPromptButton}
              >
                <ThemedText style={styles.locationPromptButtonText}>Enable</ThemedText>
              </Pressable>
            </View>
          </TranslucentPanel>
        </View>
      ) : null}

      <View style={[styles.controlsContainer, { bottom: tabBarHeight + Spacing.lg }]}>
        <TranslucentPanel style={styles.panel}>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <View style={styles.sliderContainer}>
            <TimelineSlider
              value={sliderValue}
              onChange={setSliderValue}
              waypoints={waypoints}
              selectedWaypoint={selectedWaypoint}
            />
          </View>
        </TranslucentPanel>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: selectedBody.color }]} />
          <ThemedText style={styles.legendText}>Current Position</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(255, 255, 255, 0.7)' }]} />
          <ThemedText style={styles.legendText}>Path Waypoints</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerOverlay: {
    backgroundColor: 'rgba(10, 17, 40, 0.6)',
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  headerFallback: {
    backgroundColor: 'rgba(10, 17, 40, 0.85)',
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  locationPrompt: {
    position: 'absolute',
    top: 120,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  locationPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  locationPromptText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  locationPromptButton: {
    backgroundColor: AppColors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  locationPromptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
  },
  controlsContainer: {
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
  legendContainer: {
    position: 'absolute',
    bottom: 200,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing['2xl'],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.xs,
  },
  legendText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
