import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Linking, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useCelestial } from '@/contexts/CelestialContext';
import { CelestialArcOverlay } from '@/components/CelestialArcOverlay';
import { FloatingControls } from '@/components/FloatingControls';
import { ARHeader } from '@/components/ARHeader';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { AppColors, Spacing, BorderRadius } from '@/constants/theme';
import { RootStackParamList } from '@/navigation/RootStackNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ARViewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const {
    selectedBody,
    timeRange,
    setTimeRange,
    waypoints,
    currentPosition,
    sliderValue,
    setSliderValue,
    selectedWaypoint,
    cameraEnabled,
    setCameraEnabled,
  } = useCelestial();

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Feather name="loader" size={40} color={AppColors.accent} />
          <ThemedText style={styles.loadingText}>Loading camera...</ThemedText>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Feather name="camera-off" size={48} color={AppColors.accent} />
          </View>
          <ThemedText style={styles.permissionTitle}>Camera Access Required</ThemedText>
          <ThemedText style={styles.permissionText}>
            To view celestial bodies in augmented reality, we need access to your camera.
          </ThemedText>
          
          {permission.status === 'denied' && !permission.canAskAgain ? (
            <>
              <ThemedText style={styles.permissionNote}>
                Camera permission was denied. Please enable it in your device settings.
              </ThemedText>
              {Platform.OS !== 'web' ? (
                <Button
                  onPress={async () => {
                    try {
                      await Linking.openSettings();
                    } catch (error) {
                      console.error('Failed to open settings:', error);
                    }
                  }}
                  style={styles.permissionButton}
                >
                  Open Settings
                </Button>
              ) : null}
            </>
          ) : (
            <Button onPress={requestPermission} style={styles.permissionButton}>
              Enable Camera
            </Button>
          )}
        </View>

        <CelestialArcOverlay
          waypoints={waypoints}
          selectedWaypoint={selectedWaypoint}
          currentPosition={currentPosition}
          celestialBody={selectedBody}
          sliderValue={sliderValue}
        />

        <ARHeader
          celestialBody={selectedBody}
          cameraEnabled={cameraEnabled}
          onCameraToggle={() => setCameraEnabled(!cameraEnabled)}
          onSettingsPress={handleSettingsPress}
        />

        <FloatingControls
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          sliderValue={sliderValue}
          onSliderChange={setSliderValue}
          waypoints={waypoints}
          selectedWaypoint={selectedWaypoint}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraEnabled ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.noCamera]} />
      )}

      <CelestialArcOverlay
        waypoints={waypoints}
        selectedWaypoint={selectedWaypoint}
        currentPosition={currentPosition}
        celestialBody={selectedBody}
        sliderValue={sliderValue}
      />

      <ARHeader
        celestialBody={selectedBody}
        cameraEnabled={cameraEnabled}
        onCameraToggle={() => setCameraEnabled(!cameraEnabled)}
        onSettingsPress={handleSettingsPress}
      />

      <FloatingControls
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        sliderValue={sliderValue}
        onSliderChange={setSliderValue}
        waypoints={waypoints}
        selectedWaypoint={selectedWaypoint}
      />

      <View style={styles.positionInfo}>
        <ThemedText style={styles.positionLabel}>Current Position</ThemedText>
        <ThemedText style={styles.positionValue}>
          Alt: {Math.round(currentPosition.altitude)}° • Az: {Math.round(currentPosition.azimuth)}°
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  noCamera: {
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  permissionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  permissionNote: {
    fontSize: 14,
    color: AppColors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  permissionButton: {
    minWidth: 200,
    backgroundColor: AppColors.accent,
  },
  positionInfo: {
    position: 'absolute',
    bottom: 200,
    left: Spacing.lg,
    right: Spacing.lg,
    alignItems: 'center',
  },
  positionLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  positionValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});
