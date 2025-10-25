/**
 * DashboardScreen.tsx
 * Home screen displaying overview of tasks, goals, and streaks
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppDispatch } from '../../redux/store/configureStore';
import { selectCurrentUsername } from '../../redux/selectors/authSelectors';
import {
  selectTaskCompletionPercentage,
  selectPendingTaskCount,
  selectCompletedTaskCount,
  selectOverdueTasks,
} from '../../redux/selectors/tasksSelectors';
import {
  selectAchievedGoalCount,
  selectActiveGoalCount,
  selectAverageGoalProgress,
} from '../../redux/selectors/goalsSelectors';
import {
  selectCurrentStreak,
  selectLongestStreak,
  selectIsStreakActive,
} from '../../redux/selectors/streaksSelectors';
import { DashboardCard, StreakCard, StatCard, ProgressBar } from '../../components/dashboard';
import { COLORS } from '../../constants';

export const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = React.useState(false);

  // Get user data
  const username = useSelector(selectCurrentUsername);

  // Get task stats
  const taskCompletionPercentage = useSelector(selectTaskCompletionPercentage);
  const pendingTasks = useSelector(selectPendingTaskCount);
  const completedTasks = useSelector(selectCompletedTaskCount);
  const overdueTasks = useSelector(selectOverdueTasks).length;

  // Get goal stats
  const activeGoals = useSelector(selectActiveGoalCount);
  const achievedGoals = useSelector(selectAchievedGoalCount);
  const goalProgress = useSelector(selectAverageGoalProgress);

  // Get streak stats
  const currentStreak = useSelector(selectCurrentStreak);
  const longestStreak = useSelector(selectLongestStreak);
  const isStreakActive = useSelector(selectIsStreakActive);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Implement refresh logic to reload data from database
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {username}! 👋</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <Icon name="bell-outline" size={24} color={COLORS.TEXT_PRIMARY} />
      </View>

      {/* Streak Card */}
      <StreakCard currentStreak={currentStreak} longestStreak={longestStreak} isActive={isStreakActive} />

      {/* Quick Stats Section */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="checkbox-marked-circle"
          iconColor={COLORS.SUCCESS}
          title="Tasks Done"
          value={completedTasks}
          backgroundColor="#F0FFF4"
        />
        <StatCard
          icon="clipboard-list"
          iconColor={COLORS.PRIMARY}
          title="Pending"
          value={pendingTasks}
          backgroundColor="#EBF4FF"
        />
      </View>

      {/* Task Progress Section */}
      <DashboardCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tasks Progress</Text>
          <Icon name="chevron-right" size={20} color={COLORS.GRAY} />
        </View>
        <ProgressBar
          percentage={taskCompletionPercentage}
          label="Overall completion"
          color={COLORS.SUCCESS}
        />
        {overdueTasks > 0 && (
          <View style={styles.warningBox}>
            <Icon name="alert-circle" size={18} color={COLORS.DANGER} />
            <Text style={styles.warningText}>{overdueTasks} overdue task(s)</Text>
          </View>
        )}
      </DashboardCard>

      {/* Goals Section */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="target"
          iconColor="#FF9500"
          title="Active Goals"
          value={activeGoals}
          backgroundColor="#FFF8E8"
        />
        <StatCard
          icon="check-circle"
          iconColor={COLORS.SUCCESS}
          title="Achieved"
          value={achievedGoals}
          backgroundColor="#F0FFF4"
        />
      </View>

      {/* Goal Progress Section */}
      <DashboardCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Goals Progress</Text>
          <Icon name="chevron-right" size={20} color={COLORS.GRAY} />
        </View>
        <ProgressBar
          percentage={goalProgress}
          label="Average goal progress"
          color="#FF9500"
        />
      </DashboardCard>

      {/* Summary Cards */}
      <DashboardCard>
        <View style={styles.summaryItem}>
          <View style={styles.summaryIcon}>
            <Icon name="lightning-bolt" size={20} color="#FF9500" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Keep Your Streak Going</Text>
            <Text style={styles.summaryText}>Complete a task today to maintain your streak</Text>
          </View>
        </View>
      </DashboardCard>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.DANGER,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 12,
    color: COLORS.DANGER,
    fontWeight: '500',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFF8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  summaryText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  bottomSpacing: {
    height: 30,
  },
});
