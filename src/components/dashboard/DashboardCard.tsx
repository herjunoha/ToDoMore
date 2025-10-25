/**
 * DashboardCard.tsx
 * Reusable card component for dashboard sections
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants';

interface DashboardCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});
