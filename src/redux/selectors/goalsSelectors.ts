import { AppRootState } from '../store/configureStore';
import { Goal, GoalStatus } from '../../types';

/**
 * Goal Selectors
 */

export const selectAllGoals = (state: AppRootState): Goal[] => state.goals.items;

export const selectGoalsLoading = (state: AppRootState): boolean => state.goals.loading;

export const selectGoalsError = (state: AppRootState): string | null => state.goals.error;

export const selectGoalById = (state: AppRootState, goalId: string): Goal | undefined =>
  state.goals.items.find((goal) => goal.id === goalId);

export const selectGoalsByStatus = (state: AppRootState, status: GoalStatus): Goal[] =>
  state.goals.items.filter((goal) => goal.status === status);

export const selectActiveGoals = (state: AppRootState): Goal[] =>
  selectGoalsByStatus(state, GoalStatus.IN_PROGRESS);

export const selectAchievedGoals = (state: AppRootState): Goal[] =>
  selectGoalsByStatus(state, GoalStatus.ACHIEVED);

export const selectSubGoals = (state: AppRootState, parentGoalId: string): Goal[] =>
  state.goals.items.filter((goal) => goal.parent_goal_id === parentGoalId);

export const selectParentGoals = (state: AppRootState): Goal[] =>
  state.goals.items.filter((goal) => !goal.parent_goal_id);

export const selectGoalCount = (state: AppRootState): number => state.goals.items.length;

export const selectAchievedGoalCount = (state: AppRootState): number =>
  selectAchievedGoals(state).length;

export const selectActiveGoalCount = (state: AppRootState): number =>
  selectActiveGoals(state).length;

export const selectGoalAchievementPercentage = (state: AppRootState): number => {
  const total = selectGoalCount(state);
  if (total === 0) return 0;
  return Math.round((selectAchievedGoalCount(state) / total) * 100);
};

export const selectAverageGoalProgress = (state: AppRootState): number => {
  const goals = selectAllGoals(state);
  if (goals.length === 0) return 0;
  const totalProgress = goals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
  return Math.round(totalProgress / goals.length);
};
