import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StreaksState, Streak } from '../../types';
import * as streakThunks from '../thunks/streakThunks';

/**
 * Initial state for streaks
 */
const initialState: StreaksState = {
  streak: null,
  loading: false,
  error: null,
};

/**
 * Streaks Redux Slice
 */
const streaksSlice = createSlice({
  name: 'streaks',
  initialState,
  reducers: {
    /**
     * Set loading state
     */
    setStreaksLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Set error message
     */
    setStreaksError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Clear error
     */
    clearStreaksError: (state) => {
      state.error = null;
    },

    /**
     * Set streak
     */
    setStreak: (state, action: PayloadAction<Streak | null>) => {
      state.streak = action.payload;
      state.loading = false;
      state.error = null;
    },

    /**
     * Increment current streak
     */
    incrementStreak: (state) => {
      if (state.streak) {
        state.streak.current_streak += 1;
        // Update longest streak if current exceeds it
        if (state.streak.current_streak > state.streak.longest_streak) {
          state.streak.longest_streak = state.streak.current_streak;
        }
        state.streak.last_completed_date = new Date().toISOString();
        state.streak.updated_at = new Date().toISOString();
      }
    },

    /**
     * Reset current streak
     */
    resetStreak: (state) => {
      if (state.streak) {
        state.streak.current_streak = 0;
        state.streak.updated_at = new Date().toISOString();
      }
    },

    /**
     * Set current streak value
     */
    setCurrentStreak: (state, action: PayloadAction<number>) => {
      if (state.streak) {
        state.streak.current_streak = action.payload;
        // Update longest streak if current exceeds it
        if (state.streak.current_streak > state.streak.longest_streak) {
          state.streak.longest_streak = state.streak.current_streak;
        }
        state.streak.updated_at = new Date().toISOString();
      }
    },

    /**
     * Update last completed date
     */
    updateLastCompletedDate: (state) => {
      if (state.streak) {
        state.streak.last_completed_date = new Date().toISOString();
        state.streak.updated_at = new Date().toISOString();
      }
    },

    /**
     * Set longest streak
     */
    setLongestStreak: (state, action: PayloadAction<number>) => {
      if (state.streak) {
        state.streak.longest_streak = action.payload;
        state.streak.updated_at = new Date().toISOString();
      }
    },

    /**
     * Check if streak should be reset based on date
     */
    checkAndResetStreak: (state) => {
      if (state.streak && state.streak.last_completed_date) {
        const lastDate = new Date(state.streak.last_completed_date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Reset if last completion was more than 1 day ago
        const lastDateOnly = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        const yesterdayOnly = new Date(
          yesterday.getFullYear(),
          yesterday.getMonth(),
          yesterday.getDate()
        );

        if (lastDateOnly < yesterdayOnly) {
          state.streak.current_streak = 0;
        }
      }
    },

    /**
     * Clear streak (useful for logout or account deletion)
     */
    clearStreak: (state) => {
      state.streak = null;
      state.loading = false;
      state.error = null;
    },

    /**
     * Update entire streak object
     */
    updateStreak: (state, action: PayloadAction<Streak>) => {
      state.streak = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(streakThunks.fetchStreak.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(streakThunks.fetchStreak.fulfilled, (state, action) => {
        state.streak = action.payload;
        state.loading = false;
      })
      .addCase(streakThunks.fetchStreak.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(streakThunks.createStreak.fulfilled, (state, action) => {
        state.streak = action.payload;
        state.loading = false;
      })
      .addCase(streakThunks.incrementStreakAsync.fulfilled, (state, action) => {
        state.streak = action.payload;
      })
      .addCase(streakThunks.resetStreakAsync.fulfilled, (state, action) => {
        state.streak = action.payload;
      })
      .addCase(streakThunks.updateStreakAsync.fulfilled, (state, action) => {
        state.streak = action.payload;
      });
  },
});

// Export actions
export const {
  setStreaksLoading,
  setStreaksError,
  clearStreaksError,
  setStreak,
  incrementStreak,
  resetStreak,
  setCurrentStreak,
  updateLastCompletedDate,
  setLongestStreak,
  checkAndResetStreak,
  clearStreak,
  updateStreak,
} = streaksSlice.actions;

// Export reducer
export default streaksSlice.reducer;
