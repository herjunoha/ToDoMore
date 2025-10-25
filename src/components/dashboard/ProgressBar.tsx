/**
 * ProgressBar.tsx
 * Reusable progress bar component for showing completion percentages
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  color = COLORS.PRIMARY,
  showPercentage = true,
}) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && <Text style={styles.percentage}>{clampedPercentage}%</Text>}
        </View>
      )}
      <View style={styles.barContainer}>
        <View
          style={[
            styles.barFill,
            {
              width: `${clampedPercentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  barContainer: {
    height: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
