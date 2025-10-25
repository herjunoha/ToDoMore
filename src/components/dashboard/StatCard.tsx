/**
 * StatCard.tsx
 * Card component for displaying statistics (tasks, goals, completion rates)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DashboardCard } from './DashboardCard';
import { COLORS } from '../../constants';

interface StatCardProps {
  icon: string;
  iconColor: string;
  title: string;
  value: number | string;
  subtitle?: string;
  backgroundColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor,
  title,
  value,
  subtitle,
  backgroundColor = '#F5F5F5',
}) => {
  return (
    <DashboardCard style={{ ...styles.container, backgroundColor }}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </DashboardCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
});
