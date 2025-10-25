import { AppRootState } from '../store/configureStore';
import { Streak } from '../../types';

/**
 * Streak Selectors
 */

export const selectStreak = (state: AppRootState): Streak | null => state.streaks.streak;

export const selectStreaksLoading = (state: AppRootState): boolean => state.streaks.loading;

export const selectStreaksError = (state: AppRootState): string | null => state.streaks.error;

export const selectCurrentStreak = (state: AppRootState): number =>
  state.streaks.streak?.current_streak || 0;

export const selectLongestStreak = (state: AppRootState): number =>
  state.streaks.streak?.longest_streak || 0;

export const selectLastCompletedDate = (state: AppRootState): string | undefined =>
  state.streaks.streak?.last_completed_date;

export const selectIsStreakActive = (state: AppRootState): boolean => {
  const streak = state.streaks.streak;
  if (!streak || !streak.last_completed_date) return false;

  const lastDate = new Date(streak.last_completed_date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastDateOnly = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );

  return lastDateOnly >= yesterdayOnly;
};

export const selectStreakPercentage = (state: AppRootState): number => {
  const longest = selectLongestStreak(state);
  const current = selectCurrentStreak(state);
  if (longest === 0) return 0;
  return Math.round((current / longest) * 100);
};
