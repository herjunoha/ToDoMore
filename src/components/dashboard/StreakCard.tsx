/**
 * StreakCard.tsx
 * Card component for displaying user streak information with animations
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DashboardCard } from './DashboardCard';
import { COLORS, ANIMATION_DURATION } from '../../constants';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
}

const getStreakMilestone = (streak: number): string | null => {
  if (streak > 0 && streak % 30 === 0) return `🎯 ${streak} day milestone!`;
  if (streak > 0 && streak % 7 === 0) return `⭐ ${streak} day streak!`;
  return null;
};

const getStreakMessage = (streak: number, isActive: boolean): string => {
  if (!isActive) return '🎯 Start your streak today';
  if (streak >= 30) return '🔥 Amazing dedication!';
  if (streak >= 14) return '💪 Great consistency!';
  if (streak >= 7) return '✨ Solid progress!';
  if (streak >= 3) return '🚀 Getting started!';
  return '💫 Keep it going!';
};

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  isActive,
}) => {
  const [flameScale] = useState(new Animated.Value(1));
  const [showMilestone, setShowMilestone] = useState(false);
  const milestone = getStreakMilestone(currentStreak);

  // Animate flame icon on mount or when streak changes
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameScale, {
            toValue: 1.2,
            duration: ANIMATION_DURATION.NORMAL,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(flameScale, {
            toValue: 1,
            duration: ANIMATION_DURATION.NORMAL,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      flameScale.setValue(1);
    }
  }, [isActive, flameScale]);

  // Show milestone animation
  useEffect(() => {
    if (milestone) {
      setShowMilestone(true);
      const timer = setTimeout(() => setShowMilestone(false), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [milestone]);

  const streakMessage = getStreakMessage(currentStreak, isActive);

  return (
    <DashboardCard style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Streak</Text>
          {isActive && <View style={styles.activeBadge} />}
        </View>
        <Animated.View style={{ transform: [{ scale: flameScale }] }}>
          <Icon
            name="fire"
            size={32}
            color={isActive ? '#FF6B35' : COLORS.GRAY}
          />
        </Animated.View>
      </View>

      <View style={styles.streakContent}>
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>Current</Text>
          <Text style={styles.streakValue}>{currentStreak}</Text>
          <Text style={styles.streakSubtext}>days</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>Personal Best</Text>
          <Text style={styles.streakValue}>{longestStreak}</Text>
          <Text style={styles.streakSubtext}>days</Text>
        </View>
      </View>

      {milestone && showMilestone && (
        <View style={styles.milestoneBox}>
          <Text style={styles.milestoneText}>{milestone}</Text>
        </View>
      )}

      <View style={styles.motivationText}>
        <Text style={styles.motivation}>{streakMessage}</Text>
      </View>
    </DashboardCard>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8F4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginRight: 8,
  },
  activeBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  streakSubtext: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginHorizontal: 16,
  },
  milestoneBox: {
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  milestoneText: {
    fontSize: 13,
    color: '#FF6B35',
    fontWeight: '600',
    textAlign: 'center',
  },
  motivationText: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
  },
  motivation: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    textAlign: 'center',
  },
});
