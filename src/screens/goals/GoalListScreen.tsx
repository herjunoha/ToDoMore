/**
 * GoalListScreen.tsx
 * Screen for displaying list of goals with filtering and progress tracking
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store/configureStore';
import { fetchGoals } from '../../redux/thunks/goalThunks';
import {
  selectAllGoals,
  selectGoalsLoading,
  selectGoalsError,
  selectActiveGoals,
  selectAchievedGoals,
} from '../../redux/selectors/goalsSelectors';
import { selectCurrentUserId } from '../../redux/selectors/authSelectors';
import { Goal, GoalStatus } from '../../types';
import { COLORS } from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type FilterType = 'all' | 'active' | 'achieved';

interface GoalItemProps {
  goal: Goal;
  onPress?: () => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onPress }) => {
  const progress = goal.progress || 0;
  const daysRemaining = goal.time_bound
    ? Math.ceil(
        (new Date(goal.time_bound).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  const getStatusColor = (): string => {
    if (progress >= 100) return COLORS.SUCCESS;
    if (progress >= 75) return '#FF9500'; // Orange
    if (progress >= 50) return '#3B82F6'; // Blue
    return COLORS.GRAY;
  };

  const getStatusIcon = (): string => {
    if (progress >= 100) return 'check-circle';
    if (isOverdue) return 'alert-circle';
    return 'target';
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.goalItem,
        pressed && styles.goalItemPressed,
        goal.status === GoalStatus.ACHIEVED && styles.goalItemCompleted,
      ]}
    >
      <View style={styles.goalContent}>
        <View style={styles.goalHeader}>
          <MaterialCommunityIcons
            name={getStatusIcon()}
            size={20}
            color={getStatusColor()}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.goalTitle, goal.status === GoalStatus.ACHIEVED && styles.completedText]} numberOfLines={2}>
            {goal.title || goal.specific}
          </Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        </View>

        <Text style={styles.goalMeasurable} numberOfLines={1}>
          {goal.measurable}
        </Text>

        <View style={styles.goalMeta}>
          {goal.time_bound && (
            <View style={[styles.metaBadge, isOverdue && styles.overdueBadge]}>
              <MaterialCommunityIcons
                name={isOverdue ? 'alert-circle' : 'calendar'}
                size={12}
                color={isOverdue ? COLORS.DANGER : COLORS.TEXT_SECONDARY}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.metaText, isOverdue && styles.overdueText]}>
                {isOverdue
                  ? `${Math.abs(daysRemaining)} days overdue`
                  : `${daysRemaining} days left`}
              </Text>
            </View>
          )}
          <View style={[styles.progressBar, { backgroundColor: getStatusColor() + '30' }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%`, backgroundColor: getStatusColor() },
              ]}
            />
          </View>
        </View>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={COLORS.TEXT_SECONDARY}
      />
    </Pressable>
  );
};

export const GoalListScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectCurrentUserId);
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const allGoals = useSelector(selectAllGoals);
  const activeGoals = useSelector(selectActiveGoals);
  const achievedGoals = useSelector(selectAchievedGoals);
  const loading = useSelector(selectGoalsLoading);
  const error = useSelector(selectGoalsError);

  useEffect(() => {
    if (userId) {
      dispatch(fetchGoals(userId));
    }
  }, [userId, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) {
      await dispatch(fetchGoals(userId));
    }
    setRefreshing(false);
  };

  const getFilteredGoals = (): Goal[] => {
    switch (filter) {
      case 'active':
        return activeGoals;
      case 'achieved':
        return achievedGoals;
      case 'all':
      default:
        return allGoals;
    }
  };

  const filteredGoals = getFilteredGoals();

  const handleGoalPress = (goalId: string) => {
    navigation?.navigate('GoalDetail', { goalId });
  };

  const handleCreateGoal = () => {
    navigation?.navigate('GoalForm');
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="bullseye"
        size={64}
        color={COLORS.LIGHT_GRAY}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.emptyTitle}>No goals found</Text>
      <Text style={styles.emptyText}>
        {filter === 'all'
          ? 'Create a goal to get started!'
          : `No ${filter} goals.`}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={64}
        color={COLORS.DANGER}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.emptyTitle}>Error loading goals</Text>
      <Text style={styles.emptyText}>{error}</Text>
    </View>
  );

  if (loading && !refreshing && filteredGoals.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={COLORS.PRIMARY}
          style={styles.loader}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(['all', 'active', 'achieved'] as FilterType[]).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterButton,
                filter === filterType && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === filterType && styles.filterButtonTextActive,
                ]}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Goal count and create button */}
      {filteredGoals.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {filteredGoals.length} {filteredGoals.length === 1 ? 'goal' : 'goals'}
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
            <MaterialCommunityIcons name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Goals list or empty/error state */}
      {error ? (
        renderError()
      ) : (
        <FlatList
          data={filteredGoals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GoalItem
              goal={item}
              onPress={() => handleGoalPress(item.id)}
            />
          )}
          ListEmptyComponent={renderEmpty()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.PRIMARY]}
              tintColor={COLORS.PRIMARY}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            filteredGoals.length === 0 && styles.listContentEmpty,
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* FAB for creating goal */}
      {!error && filteredGoals.length === 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleCreateGoal}>
          <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  goalItemPressed: {
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  goalItemCompleted: {
    opacity: 0.6,
  },
  goalContent: {
    flex: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.TEXT_SECONDARY,
  },
  progressBadge: {
    backgroundColor: COLORS.PRIMARY + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  goalMeasurable: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  goalMeta: {
    gap: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  overdueBadge: {
    backgroundColor: COLORS.DANGER + '20',
  },
  metaText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.TEXT_SECONDARY,
  },
  overdueText: {
    color: COLORS.DANGER,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  progressFill: {
    height: '100%',
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
