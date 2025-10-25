/**
 * SummaryCard.tsx
 * Component for displaying various dashboard summary cards with icons and actionable messages
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';

interface SummaryCardProps {
  icon: string;
  iconColor: string;
  backgroundColor: string;
  title: string;
  description: string;
  actionText?: string;
  onPress?: () => void;
  badge?: number | string;
  badgeColor?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  iconColor,
  backgroundColor,
  title,
  description,
  actionText,
  onPress,
  badge,
  badgeColor = COLORS.DANGER,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Icon name={icon} size={24} color={iconColor} />
        {badge !== undefined && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {actionText && <Text style={styles.actionText}>{actionText}</Text>}
      </View>

      {onPress && <Icon name="chevron-right" size={20} color={COLORS.GRAY} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 16,
  },
  actionText: {
    fontSize: 11,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginTop: 4,
  },
});
