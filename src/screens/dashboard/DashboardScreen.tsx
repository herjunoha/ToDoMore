/**
 * DashboardScreen.tsx
 * Home screen displaying overview of tasks, goals, and streaks
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppDispatch } from '../../redux/store/configureStore';
import { selectCurrentUsername, selectCurrentUserId } from '../../redux/selectors/authSelectors';
import {
  selectTaskCompletionPercentage,
  selectPendingTaskCount,
  selectCompletedTaskCount,
  selectOverdueTasks,
  selectTasksDueToday,
  selectTasksDueThisWeek,
  selectHighPriorityTasks,
} from '../../redux/selectors/tasksSelectors';
import {
  selectAchievedGoalCount,
  selectActiveGoalCount,
  selectAverageGoalProgress,
  selectActiveGoalsSortedByProgress,
  selectOverdueGoals,
  selectGoalsExpiringSoon,
} from '../../redux/selectors/goalsSelectors';
import {
  selectCurrentStreak,
  selectLongestStreak,
  selectIsStreakActive,
} from '../../redux/selectors/streaksSelectors';
import { DashboardCard, StreakCard, StatCard, ProgressBar, GoalProgressCard, SummaryCard } from '../../components/dashboard';
import { recalculateAllGoalProgress } from '../../redux/thunks/goalThunks';
import { COLORS } from '../../constants';

export const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = React.useState(false);
  const userId = useSelector(selectCurrentUserId);

  // Get user data
  const username = useSelector(selectCurrentUsername);

  // Get task stats
  const taskCompletionPercentage = useSelector(selectTaskCompletionPercentage);
  const pendingTasks = useSelector(selectPendingTaskCount);
  const completedTasks = useSelector(selectCompletedTaskCount);
  const overdueTasks = useSelector(selectOverdueTasks).length;
  const tasksDueToday = useSelector(selectTasksDueToday);
  const tasksDueThisWeek = useSelector(selectTasksDueThisWeek);
  const highPriorityTasks = useSelector(selectHighPriorityTasks);

  // Get goal stats
  const activeGoals = useSelector(selectActiveGoalCount);
  const achievedGoals = useSelector(selectAchievedGoalCount);
  const goalProgress = useSelector(selectAverageGoalProgress);
  const activeGoalsSorted = useSelector(selectActiveGoalsSortedByProgress);
  const overdueGoals = useSelector(selectOverdueGoals);
  const expiringSoonGoals = useSelector(selectGoalsExpiringSoon);

  // Get streak stats
  const currentStreak = useSelector(selectCurrentStreak);
  const longestStreak = useSelector(selectLongestStreak);
  const isStreakActive = useSelector(selectIsStreakActive);

  // Sync goal progress when component mounts
  React.useEffect(() => {
    if (userId) {
      // Recalculate all goal progress on app startup
      dispatch(recalculateAllGoalProgress(userId)).catch((error) => {
        console.warn('Failed to recalculate goal progress on startup:', error);
      });
    }
  }, [userId, dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Recalculate all goal progress on refresh
    if (userId) {
      dispatch(recalculateAllGoalProgress(userId)).finally(() => {
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  }, [userId, dispatch]);

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

      {/* Active Goals List Section */}
      {activeGoalsSorted.length > 0 && (
        <View>
          <View style={styles.goalListHeader}>
            <Text style={styles.goalListTitle}>Active Goals ({activeGoalsSorted.length})</Text>
            {(overdueGoals.length > 0 || expiringSoonGoals.length > 0) && (
              <View style={styles.goalWarningBadge}>
                <Icon name="alert-circle" size={14} color={COLORS.DANGER} />
                <Text style={styles.goalWarningText}>
                  {overdueGoals.length > 0
                    ? `${overdueGoals.length} overdue`
                    : `${expiringSoonGoals.length} expiring soon`}
                </Text>
              </View>
            )}
          </View>
          {activeGoalsSorted.map((goal) => (
            <GoalProgressCard key={goal.id} goal={goal} showChevron />
          ))}
        </View>
      )}

      {/* Summary Cards Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summarySectionTitle}>Quick Overview</Text>

        {/* Tasks Due Today Card */}
        {tasksDueToday.length > 0 && (
          <SummaryCard
            icon="calendar-today"
            iconColor={COLORS.PRIMARY}
            backgroundColor="#EBF4FF"
            title="Due Today"
            description={`${tasksDueToday.length} task${tasksDueToday.length !== 1 ? 's' : ''} awaiting your attention`}
            actionText="View tasks"
            badge={tasksDueToday.length}
            badgeColor={COLORS.PRIMARY}
            onPress={() => {
              // TODO: Navigate to tasks tab or filtered view
            }}
          />
        )}

        {/* Tasks Due This Week Card */}
        {tasksDueThisWeek.length > 0 && (
          <SummaryCard
            icon="calendar-range"
            iconColor="#FF9500"
            backgroundColor="#FFF8E8"
            title="Due This Week"
            description={`${tasksDueThisWeek.length} task${tasksDueThisWeek.length !== 1 ? 's' : ''} scheduled for this week`}
            actionText="Upcoming tasks"
            badge={tasksDueThisWeek.length}
            badgeColor="#FF9500"
            onPress={() => {
              // TODO: Navigate to tasks tab or filtered view
            }}
          />
        )}

        {/* High Priority Tasks Card */}
        {highPriorityTasks.length > 0 && (
          <SummaryCard
            icon="alert-circle"
            iconColor={COLORS.DANGER}
            backgroundColor="#FEF2F2"
            title="High Priority"
            description={`${highPriorityTasks.length} high-priority task${highPriorityTasks.length !== 1 ? 's' : ''} need focus`}
            actionText="Review now"
            badge={highPriorityTasks.length}
            badgeColor={COLORS.DANGER}
            onPress={() => {
              // TODO: Navigate to high priority tasks
            }}
          />
        )}

        {/* Streak Maintenance Card */}
        {isStreakActive && currentStreak > 0 && (
          <SummaryCard
            icon="lightning-bolt"
            iconColor="#FF6B35"
            backgroundColor="#FFF8F4"
            title="Keep Your Streak"
            description={`You're on a ${currentStreak}-day streak! Complete a task today to maintain it.`}
            actionText="Complete a task"
            badgeColor="#FF6B35"
            onPress={() => {
              // TODO: Navigate to tasks tab
            }}
          />
        )}

        {/* No Tasks Card */}
        {tasksDueToday.length === 0 && tasksDueThisWeek.length === 0 && highPriorityTasks.length === 0 && (
          <SummaryCard
            icon="check-all"
            iconColor={COLORS.SUCCESS}
            backgroundColor="#F0FFF4"
            title="All Caught Up!"
            description="No urgent tasks right now. Great work on staying on top of things!"
            badgeColor={COLORS.SUCCESS}
            onPress={() => {
              // TODO: Navigate to create new task
            }}
          />
        )}
      </View>

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
  goalListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  goalListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  goalWarningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  goalWarningText: {
    fontSize: 11,
    color: COLORS.DANGER,
    marginLeft: 4,
    fontWeight: '600',
  },
  summarySection: {
    paddingVertical: 8,
  },
  summarySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  bottomSpacing: {
    height: 30,
  },
});
