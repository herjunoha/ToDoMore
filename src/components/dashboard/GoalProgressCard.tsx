/**
 * GoalProgressCard.tsx
 * Component for displaying individual goal progress with visual indicators
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Goal } from '../../types';
import { COLORS } from '../../constants';
import { ProgressBar } from './ProgressBar';

interface GoalProgressCardProps {
  goal: Goal;
  onPress?: () => void;
  showChevron?: boolean;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  goal,
  onPress,
  showChevron = true,
}) => {
  const progress = goal.progress || 0;
  const daysRemaining = goal.time_bound
    ? Math.ceil(
        (new Date(goal.time_bound).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
    : null;

  // Determine goal status color
  const getStatusColor = () => {
    if (progress >= 100) return COLORS.SUCCESS;
    if (progress >= 75) return '#FF9500'; // Orange
    if (progress >= 50) return '#3B82F6'; // Blue
    return COLORS.GRAY;
  };

  // Determine status icon
  const getStatusIcon = () => {
    if (progress >= 100) return 'check-circle';
    if (daysRemaining !== null && daysRemaining < 0) return 'alert-circle';
    return 'target';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Icon name={getStatusIcon()} size={20} color={getStatusColor()} />
          <Text style={styles.goalTitle} numberOfLines={1}>
            {goal.title || goal.specific}
          </Text>
        </View>
        {showChevron && <Icon name="chevron-right" size={20} color={COLORS.GRAY} />}
      </View>

      <View style={styles.progressSection}>
        <ProgressBar percentage={progress} color={getStatusColor()} showPercentage={true} />
      </View>

      <View style={styles.metaRow}>
        {daysRemaining !== null && (
          <View style={[styles.metaBadge, daysRemaining < 0 && styles.overdueBadge]}>
            <Icon
              name={daysRemaining < 0 ? 'alert' : 'clock-outline'}
              size={12}
              color={daysRemaining < 0 ? COLORS.DANGER : COLORS.TEXT_SECONDARY}
            />
            <Text
              style={[
                styles.metaText,
                daysRemaining < 0 && { color: COLORS.DANGER },
              ]}
            >
              {daysRemaining < 0
                ? `${Math.abs(daysRemaining)} days overdue`
                : `${daysRemaining} days left`}
            </Text>
          </View>
        )}
        <Text style={styles.metaSmall}>{goal.measurable}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 8,
    flex: 1,
  },
  progressSection: {
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  overdueBadge: {
    backgroundColor: '#FEF2F2',
  },
  metaText: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 4,
    fontWeight: '500',
  },
  metaSmall: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
    lineHeight: 14,
  },
});
