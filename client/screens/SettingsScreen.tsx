import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Image, ScrollView, Platform, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCelestial } from '@/contexts/CelestialContext';
import { ThemedText } from '@/components/ThemedText';
import { AppColors, Spacing, BorderRadius } from '@/constants/theme';
import { getDisplayName, setDisplayName as saveDisplayName } from '@/lib/storage';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const {
    location,
    setLocation,
    useGPS,
    setUseGPS,
    locationPermission,
    requestLocationPermission,
  } = useCelestial();

  const [displayName, setDisplayName] = useState('Stargazer');
  const [manualLat, setManualLat] = useState(location.latitude.toString());
  const [manualLon, setManualLon] = useState(location.longitude.toString());
  const [locationName, setLocationName] = useState(location.name || '');

  useEffect(() => {
    loadDisplayName();
  }, []);

  useEffect(() => {
    setManualLat(location.latitude.toString());
    setManualLon(location.longitude.toString());
    setLocationName(location.name || '');
  }, [location]);

  const loadDisplayName = async () => {
    const name = await getDisplayName();
    setDisplayName(name);
  };

  const handleSaveDisplayName = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await saveDisplayName(displayName);
  };

  const handleToggleGPS = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!useGPS && locationPermission !== 'granted') {
      await requestLocationPermission();
    } else {
      setUseGPS(!useGPS);
    }
  };

  const handleOpenSettings = async () => {
    if (Platform.OS !== 'web') {
      try {
        await Linking.openSettings();
      } catch (error) {
        console.error('Failed to open settings:', error);
      }
    }
  };

  const handleSaveManualLocation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      setLocation({
        latitude: lat,
        longitude: lon,
        name: locationName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      });
      setUseGPS(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Profile</ThemedText>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/avatar-astronaut.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Display Name</ThemedText>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              onBlur={handleSaveDisplayName}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              placeholder="Enter your name"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Location</ThemedText>
        <View style={styles.card}>
          <Pressable
            onPress={handleToggleGPS}
            style={styles.toggleRow}
          >
            <View style={styles.toggleInfo}>
              <Feather name="crosshair" size={22} color={AppColors.accent} />
              <View style={styles.toggleText}>
                <ThemedText style={styles.toggleLabel}>Use GPS Location</ThemedText>
                <ThemedText style={styles.toggleDescription}>
                  {locationPermission === 'granted'
                    ? 'Location access granted'
                    : 'Requires location permission'}
                </ThemedText>
              </View>
            </View>
            <View style={[styles.toggle, useGPS && styles.toggleActive]}>
              <View style={[styles.toggleThumb, useGPS && styles.toggleThumbActive]} />
            </View>
          </Pressable>

          {locationPermission === 'denied' && Platform.OS !== 'web' ? (
            <Pressable onPress={handleOpenSettings} style={styles.settingsLink}>
              <Feather name="external-link" size={16} color={AppColors.accent} />
              <ThemedText style={styles.settingsLinkText}>Open Settings</ThemedText>
            </Pressable>
          ) : null}

          <View style={styles.divider} />

          <ThemedText style={styles.manualTitle}>Manual Location</ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Location Name</ThemedText>
            <TextInput
              style={styles.input}
              value={locationName}
              onChangeText={setLocationName}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              placeholder="e.g., New York, NY"
            />
          </View>

          <View style={styles.coordsRow}>
            <View style={[styles.inputGroup, styles.coordInput]}>
              <ThemedText style={styles.label}>Latitude</ThemedText>
              <TextInput
                style={styles.input}
                value={manualLat}
                onChangeText={setManualLat}
                keyboardType="numeric"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                placeholder="-90 to 90"
              />
            </View>
            <View style={[styles.inputGroup, styles.coordInput]}>
              <ThemedText style={styles.label}>Longitude</ThemedText>
              <TextInput
                style={styles.input}
                value={manualLon}
                onChangeText={setManualLon}
                keyboardType="numeric"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                placeholder="-180 to 180"
              />
            </View>
          </View>

          <Pressable
            onPress={handleSaveManualLocation}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
            ]}
          >
            <ThemedText style={styles.saveButtonText}>Save Location</ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <ThemedText style={styles.aboutLabel}>Version</ThemedText>
            <ThemedText style={styles.aboutValue}>1.0.0</ThemedText>
          </View>
          <View style={styles.aboutRow}>
            <ThemedText style={styles.aboutLabel}>App Name</ThemedText>
            <ThemedText style={styles.aboutValue}>Celestial Tracker</ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: AppColors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.accent + '20',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: AppColors.background,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  toggleDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: AppColors.accent,
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  settingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  settingsLinkText: {
    fontSize: 14,
    color: AppColors.accent,
    marginLeft: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: Spacing.lg,
  },
  manualTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: Spacing.md,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  coordInput: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: AppColors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.primary,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  aboutLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aboutValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
