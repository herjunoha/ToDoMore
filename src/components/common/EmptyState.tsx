/**
 * EmptyState.tsx
 * Empty state screen component for no data scenarios
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, TEXT_STYLES, GLOBAL_STYLES } from '../../theme';

export interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  iconColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  iconColor = COLORS.TEXT_SECONDARY,
}) => {
  return (
    <View style={[GLOBAL_STYLES.screenContainer, styles.container]}>
      <View style={styles.content}>
        <Icon name={icon} size={64} color={iconColor} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    ...TEXT_STYLES.H5,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.LG,
    textAlign: 'center',
  },
  message: {
    ...TEXT_STYLES.BODY_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
    textAlign: 'center',
    maxWidth: 300,
  },
});
