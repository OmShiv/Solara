import React, { useState } from 'react';
import { reloadAppAsync } from 'expo';
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Text,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { AppColors, Spacing, BorderRadius, Fonts } from '@/constants/theme';

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRestart = async () => {
    try {
      await reloadAppAsync();
    } catch (restartError) {
      console.error('Failed to restart app:', restartError);
      resetError();
    }
  };

  const formatErrorDetails = (): string => {
    let details = `Error: ${error.message}\n\n`;
    if (error.stack) {
      details += `Stack Trace:\n${error.stack}`;
    }
    return details;
  };

  return (
    <View style={styles.container}>
      {__DEV__ ? (
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={({ pressed }) => [
            styles.topButton,
            {
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather name="alert-circle" size={20} color="#FFFFFF" />
        </Pressable>
      ) : null}

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="alert-triangle" size={48} color={AppColors.secondary} />
        </View>
        
        <ThemedText type="h1" style={styles.title}>
          Houston, we have a problem
        </ThemedText>

        <ThemedText type="body" style={styles.message}>
          Celestial Tracker encountered an unexpected error. Please restart the app to continue your stargazing journey.
        </ThemedText>

        <Pressable
          onPress={handleRestart}
          style={({ pressed }) => [
            styles.button,
            {
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Feather name="refresh-cw" size={20} color={AppColors.primary} style={styles.buttonIcon} />
          <ThemedText
            type="body"
            style={styles.buttonText}
          >
            Restart Mission
          </ThemedText>
        </Pressable>
      </View>

      {__DEV__ ? (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <ThemedText type="h2" style={styles.modalTitle}>
                  Error Details
                </ThemedText>
                <Pressable
                  onPress={() => setIsModalVisible(false)}
                  style={({ pressed }) => [
                    styles.closeButton,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <Feather name="x" size={24} color="#FFFFFF" />
                </Pressable>
              </View>

              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator
              >
                <View style={styles.errorContainer}>
                  <Text
                    style={[
                      styles.errorText,
                      {
                        fontFamily: Fonts?.mono || 'monospace',
                      },
                    ]}
                    selectable
                  >
                    {formatErrorDetails()}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
    backgroundColor: AppColors.background,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    width: '100%',
    maxWidth: 600,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    lineHeight: 40,
    color: '#FFFFFF',
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  topButton: {
    position: 'absolute',
    top: Spacing['2xl'] + Spacing.lg,
    right: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing['2xl'],
    minWidth: 200,
    backgroundColor: AppColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.accent,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
    color: AppColors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    height: '90%',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    backgroundColor: AppColors.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: Spacing.lg,
  },
  errorContainer: {
    width: '100%',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    padding: Spacing.lg,
    backgroundColor: AppColors.background,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    width: '100%',
    color: '#FFFFFF',
  },
});
