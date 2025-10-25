import { createAsyncThunk } from '@reduxjs/toolkit';
import { Streak } from '../../types';
import { StreakDAO } from '../../services/database/StreakDAO';
import { ERROR_MESSAGES } from '../../constants';

const streakDAO = new StreakDAO();

/**
 * Fetch streak by user ID
 */
export const fetchStreak = createAsyncThunk<Streak, string>(
  'streaks/fetchStreak',
  async (userId: string, { rejectWithValue }) => {
    try {
      const streak = await streakDAO.findByUserId(userId);
      if (!streak) {
        return rejectWithValue('Streak not found for user');
      }
      return streak;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Create a new streak
 */
export const createStreak = createAsyncThunk<
  Streak,
  { userId: string; currentStreak?: number; longestStreak?: number }
>(
  'streaks/create',
  async ({ userId, currentStreak = 0, longestStreak = 0 }, { rejectWithValue }) => {
    try {
      const streak = await streakDAO.create({
        user_id: userId,
        current_streak: currentStreak,
        longest_streak: longestStreak,
      } as any);
      return streak;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Increment streak
 */
export const incrementStreakAsync = createAsyncThunk<Streak, { streakId: string; date: string }>(
  'streaks/increment',
  async ({ streakId, date }, { rejectWithValue }) => {
    try {
      const success = await streakDAO.incrementStreak(streakId, date);
      if (!success) {
        return rejectWithValue('Failed to increment streak');
      }

      const updated = await streakDAO.findById(streakId);
      if (!updated) {
        return rejectWithValue('Streak not found after increment');
      }
      return updated;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Reset streak
 */
export const resetStreakAsync = createAsyncThunk<Streak, string>(
  'streaks/reset',
  async (streakId: string, { rejectWithValue }) => {
    try {
      const success = await streakDAO.resetStreak(streakId);
      if (!success) {
        return rejectWithValue('Failed to reset streak');
      }

      const updated = await streakDAO.findById(streakId);
      if (!updated) {
        return rejectWithValue('Streak not found after reset');
      }
      return updated;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Update streak
 */
export const updateStreakAsync = createAsyncThunk<
  Streak,
  { userId: string; currentStreak?: number; longestStreak?: number; lastCompletedDate?: string }
>(
  'streaks/update',
  async ({ userId, currentStreak, longestStreak, lastCompletedDate }, { rejectWithValue }) => {
    try {
      const updateData: any = {};
      if (currentStreak !== undefined) updateData.current_streak = currentStreak;
      if (longestStreak !== undefined) updateData.longest_streak = longestStreak;
      if (lastCompletedDate !== undefined) updateData.last_completed_date = lastCompletedDate;

      // Find the streak first to get the ID
      const streak = await streakDAO.findByUserId(userId);
      if (!streak) {
        return rejectWithValue('Streak not found');
      }

      const success = await streakDAO.update(streak.id, updateData);
      if (!success) {
        return rejectWithValue('Failed to update streak');
      }

      const updated = await streakDAO.findByUserId(userId);
      if (!updated) {
        return rejectWithValue('Streak not found after update');
      }
      return updated;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

