import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCelestial } from '@/contexts/CelestialContext';
import { CelestialListItem } from '@/components/CelestialListItem';
import { ThemedText } from '@/components/ThemedText';
import { CELESTIAL_BODIES, CelestialBody } from '@/lib/celestial';
import { AppColors, Spacing, BorderRadius } from '@/constants/theme';
import { MainTabParamList } from '@/navigation/MainTabNavigator';
import { SearchStackParamList } from '@/navigation/SearchStackNavigator';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<SearchStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface CelestialSection {
  title: string;
  data: CelestialBody[];
}

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { selectedBody, setSelectedBody, location } = useCelestial();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBodies = useMemo(() => {
    if (!searchQuery.trim()) return CELESTIAL_BODIES;
    const query = searchQuery.toLowerCase();
    return CELESTIAL_BODIES.filter(
      body => 
        body.name.toLowerCase().includes(query) ||
        body.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const sections = useMemo((): CelestialSection[] => {
    const sunMoon = filteredBodies.filter(b => b.type === 'sun' || b.type === 'moon');
    const planets = filteredBodies.filter(b => b.type === 'planet');
    
    const result: CelestialSection[] = [];
    if (sunMoon.length > 0) {
      result.push({ title: 'Sun & Moon', data: sunMoon });
    }
    if (planets.length > 0) {
      result.push({ title: 'Planets', data: planets });
    }
    return result;
  }, [filteredBodies]);

  const handleSelectBody = (body: CelestialBody) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedBody(body);
    navigation.navigate('ARTab');
  };

  const renderItem = ({ item }: { item: CelestialBody }) => (
    <CelestialListItem
      body={item}
      location={location}
      isSelected={selectedBody.id === item.id}
      onPress={() => handleSelectBody(item)}
    />
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../../assets/images/empty-search.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText style={styles.emptyTitle}>No celestial objects found</ThemedText>
      <ThemedText style={styles.emptyText}>
        Try searching for "Sun", "Moon", or planet names
      </ThemedText>
    </View>
  );

  const allData = sections.flatMap((section, sectionIndex) => [
    { type: 'header', title: section.title, key: `header-${sectionIndex}` },
    ...section.data.map(item => ({ type: 'item', item, key: item.id })),
  ]);

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { marginTop: headerHeight + Spacing.sm }]}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search celestial objects..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 ? (
            <Feather
              name="x"
              size={20}
              color="rgba(255, 255, 255, 0.5)"
              onPress={() => setSearchQuery('')}
            />
          ) : null}
        </View>
      </View>

      <FlatList
        data={allData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return renderSectionHeader(item.title as string);
          }
          return renderItem({ item: (item as any).item });
        }}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
          allData.length === 0 && styles.emptyListContent,
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: Spacing.sm,
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  emptyListContent: {
    flex: 1,
  },
  sectionHeader: {
    paddingVertical: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: Spacing['2xl'],
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
