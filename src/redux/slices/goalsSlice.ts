import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GoalsState, Goal, GoalStatus } from '../../types';
import * as goalThunks from '../thunks/goalThunks';

/**
 * Initial state for goals
 */
const initialState: GoalsState = {
  items: [],
  loading: false,
  error: null,
};

/**
 * Goals Redux Slice
 */
const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    /**
     * Set loading state
     */
    setGoalsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Set error message
     */
    setGoalsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Clear error
     */
    clearGoalsError: (state) => {
      state.error = null;
    },

    /**
     * Set all goals
     */
    setGoals: (state, action: PayloadAction<Goal[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },

    /**
     * Add a new goal
     */
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.items.push(action.payload);
    },

    /**
     * Update an existing goal
     */
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.items.findIndex((goal) => goal.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    /**
     * Delete a goal
     */
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((goal) => goal.id !== action.payload);
    },

    /**
     * Update goal status
     */
    updateGoalStatus: (state, action: PayloadAction<{ goalId: string; status: GoalStatus }>) => {
      const goal = state.items.find((g) => g.id === action.payload.goalId);
      if (goal) {
        goal.status = action.payload.status;
        goal.updated_at = new Date().toISOString();
      }
    },

    /**
     * Update goal progress
     */
    updateGoalProgress: (state, action: PayloadAction<{ goalId: string; progress: number }>) => {
      const goal = state.items.find((g) => g.id === action.payload.goalId);
      if (goal) {
        goal.progress = Math.min(100, Math.max(0, action.payload.progress));
        goal.updated_at = new Date().toISOString();
      }
    },

    /**
     * Update SMART fields
     */
    updateGoalSmartFields: (
      state,
      action: PayloadAction<{
        goalId: string;
        specific?: string;
        measurable?: string;
        achievable?: string;
        relevant?: string;
        time_bound?: string;
      }>
    ) => {
      const goal = state.items.find((g) => g.id === action.payload.goalId);
      if (goal) {
        if (action.payload.specific) goal.specific = action.payload.specific;
        if (action.payload.measurable) goal.measurable = action.payload.measurable;
        if (action.payload.achievable) goal.achievable = action.payload.achievable;
        if (action.payload.relevant) goal.relevant = action.payload.relevant;
        if (action.payload.time_bound) goal.time_bound = action.payload.time_bound;
        goal.updated_at = new Date().toISOString();
      }
    },

    /**
     * Clear all goals (useful for logout)
     */
    clearGoals: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },

    /**
     * Get active goals
     */
    getActiveGoals: (state) => {
      state.items = state.items.filter((goal) => goal.status === GoalStatus.IN_PROGRESS);
    },

    /**
     * Get achieved goals
     */
    getAchievedGoals: (state) => {
      state.items = state.items.filter((goal) => goal.status === GoalStatus.ACHIEVED);
    },

    /**
     * Get goals by status
     */
    getGoalsByStatus: (state, action: PayloadAction<GoalStatus>) => {
      state.items = state.items.filter((goal) => goal.status === action.payload);
    },

    /**
     * Delete sub-goals of a parent goal
     */
    deleteSubGoals: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((goal) => goal.parent_goal_id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(goalThunks.fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(goalThunks.fetchGoals.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(goalThunks.fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(goalThunks.createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(goalThunks.createGoal.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(goalThunks.createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(goalThunks.updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(goalThunks.updateGoal.fulfilled, (state, action) => {
        const index = state.items.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(goalThunks.updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(goalThunks.deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      })
      .addCase(goalThunks.fetchActiveGoals.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(goalThunks.fetchAchievedGoals.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  },
});

// Export actions
export const {
  setGoalsLoading,
  setGoalsError,
  clearGoalsError,
  setGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  updateGoalStatus,
  updateGoalProgress,
  updateGoalSmartFields,
  clearGoals,
  getActiveGoals,
  getAchievedGoals,
  getGoalsByStatus,
  deleteSubGoals,
} = goalsSlice.actions;

// Export reducer
export default goalsSlice.reducer;
