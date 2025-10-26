/**
 * LoadingOverlay.tsx
 * Full-screen loading indicator with optional message
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TEXT_STYLES, MODAL_STYLES } from '../../theme';

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Semi-transparent overlay */}
      <View style={styles.overlay} />

      {/* Loading content */}
      <View style={styles.content}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.OVERLAY_MEDIUM,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
  },
  message: {
    ...TEXT_STYLES.BODY_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.LG,
    textAlign: 'center',
  },
});
