import { createAsyncThunk } from '@reduxjs/toolkit';
import { Goal, GoalStatus } from '../../types';
import { GoalDAO } from '../../services/database/GoalDAO';
import { TaskDAO } from '../../services/database/TaskDAO';
import { ERROR_MESSAGES } from '../../constants';

const goalDAO = new GoalDAO();
const taskDAO = new TaskDAO();

/**
 * Goal creation input
 */
interface GoalCreatePayload {
  userId: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  title?: string;
  description?: string;
  status: GoalStatus;
  parentGoalId?: string;
}

/**
 * Goal update input
 */
interface GoalUpdatePayload {
  specific?: string;
  measurable?: string;
  achievable?: string;
  relevant?: string;
  timeBound?: string;
  title?: string;
  description?: string;
  status?: GoalStatus;
  progress?: number;
  parentGoalId?: string;
}

/**
 * Fetch all goals for a user
 */
export const fetchGoals = createAsyncThunk<Goal[], string>(
  'goals/fetchGoals',
  async (userId: string, { rejectWithValue }) => {
    try {
      const goals = await goalDAO.findAllByUserId(userId);
      return goals;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Fetch goal by ID
 */
export const fetchGoalById = createAsyncThunk<Goal, string>(
  'goals/fetchById',
  async (goalId: string, { rejectWithValue }) => {
    try {
      const goal = await goalDAO.findById(goalId);
      if (!goal) {
        return rejectWithValue('Goal not found');
      }
      return goal;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Create a new goal
 */
export const createGoal = createAsyncThunk<Goal, GoalCreatePayload>(
  'goals/create',
  async (goalInput: GoalCreatePayload, { rejectWithValue }) => {
    try {
      const goal = await goalDAO.create({
        user_id: goalInput.userId,
        specific: goalInput.specific,
        measurable: goalInput.measurable,
        achievable: goalInput.achievable,
        relevant: goalInput.relevant,
        time_bound: goalInput.timeBound,
        title: goalInput.title,
        description: goalInput.description,
        status: goalInput.status,
        parent_goal_id: goalInput.parentGoalId,
      } as any);
      return goal;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Update an existing goal
 */
export const updateGoal = createAsyncThunk<Goal, { goalId: string; updates: GoalUpdatePayload }>(
  'goals/update',
  async ({ goalId, updates }, { rejectWithValue }) => {
    try {
      const updateData = {
        specific: updates.specific,
        measurable: updates.measurable,
        achievable: updates.achievable,
        relevant: updates.relevant,
        time_bound: updates.timeBound,
        title: updates.title,
        description: updates.description,
        status: updates.status,
        progress: updates.progress,
        parent_goal_id: updates.parentGoalId,
      } as any;

      const success = await goalDAO.update(goalId, updateData);
      if (!success) {
        return rejectWithValue('Failed to update goal');
      }

      const updatedGoal = await goalDAO.findById(goalId);
      if (!updatedGoal) {
        return rejectWithValue('Goal not found after update');
      }
      return updatedGoal;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Delete a goal
 */
export const deleteGoal = createAsyncThunk<string, string>(
  'goals/delete',
  async (goalId: string, { rejectWithValue }) => {
    try {
      const success = await goalDAO.delete(goalId);
      if (!success) {
        return rejectWithValue('Failed to delete goal');
      }
      return goalId;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Update goal status
 */
export const updateGoalStatus = createAsyncThunk<Goal, { goalId: string; status: GoalStatus }>(
  'goals/updateStatus',
  async ({ goalId, status }, { rejectWithValue }) => {
    try {
      const success = await goalDAO.update(goalId, { status });
      if (!success) {
        return rejectWithValue('Failed to update goal status');
      }

      const updatedGoal = await goalDAO.findById(goalId);
      if (!updatedGoal) {
        return rejectWithValue('Goal not found');
      }
      return updatedGoal;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Update goal progress
 */
export const updateGoalProgress = createAsyncThunk<
  Goal,
  { goalId: string; progress: number }
>(
  'goals/updateProgress',
  async ({ goalId, progress }, { rejectWithValue }) => {
    try {
      const clampedProgress = Math.min(100, Math.max(0, progress));
      const success = await goalDAO.update(goalId, { progress: clampedProgress });
      if (!success) {
        return rejectWithValue('Failed to update goal progress');
      }

      const updatedGoal = await goalDAO.findById(goalId);
      if (!updatedGoal) {
        return rejectWithValue('Goal not found');
      }
      return updatedGoal;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Fetch active goals for a user
 */
export const fetchActiveGoals = createAsyncThunk<Goal[], string>(
  'goals/fetchActive',
  async (userId: string, { rejectWithValue }) => {
    try {
      const goals = await goalDAO.findWhere(
        'user_id = ? AND status = ?',
        [userId, GoalStatus.IN_PROGRESS]
      );
      return goals;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Fetch achieved goals for a user
 */
export const fetchAchievedGoals = createAsyncThunk<Goal[], string>(
  'goals/fetchAchieved',
  async (userId: string, { rejectWithValue }) => {
    try {
      const goals = await goalDAO.findWhere('user_id = ? AND status = ?', [
        userId,
        GoalStatus.ACHIEVED,
      ]);
      return goals;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Calculate goal progress based on linked tasks
 * Progress = (completed_tasks / total_tasks) * 100
 */
export const calculateGoalProgress = createAsyncThunk<
  Goal,
  string
>(
  'goals/calculateProgress',
  async (goalId: string, { rejectWithValue }) => {
    try {
      // Fetch the goal
      const goal = await goalDAO.findById(goalId);
      if (!goal) {
        return rejectWithValue('Goal not found');
      }

      // Fetch all linked tasks
      const linkedTasks = await taskDAO.findByGoalId(goalId);
      
      // Calculate progress based on task completion
      let progress = 0;
      if (linkedTasks.length > 0) {
        const completedTasks = linkedTasks.filter(
          (task) => task.status === 'completed'
        ).length;
        progress = Math.round((completedTasks / linkedTasks.length) * 100);
      }

      // Update goal progress in database
      const success = await goalDAO.update(goalId, { progress });
      if (!success) {
        return rejectWithValue('Failed to update goal progress');
      }

      // Fetch and return updated goal
      const updatedGoal = await goalDAO.findById(goalId);
      if (!updatedGoal) {
        return rejectWithValue('Goal not found after update');
      }
      
      return updatedGoal;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Delete a goal and its sub-goals
 * Removes the goal and all associated sub-goals from the database
 */
export const deleteGoalWithSubGoals = createAsyncThunk<
  string,
  string
>(
  'goals/deleteWithSubGoals',
  async (goalId: string, { rejectWithValue }) => {
    try {
      // Fetch all sub-goals first
      const subGoals = await goalDAO.findSubGoals(goalId);

      // Delete all sub-goals recursively
      for (const subGoal of subGoals) {
        const success = await goalDAO.delete(subGoal.id);
        if (!success) {
          return rejectWithValue('Failed to delete sub-goal: ' + subGoal.id);
        }
      }

      // Delete the main goal
      const success = await goalDAO.delete(goalId);
      if (!success) {
        return rejectWithValue('Failed to delete goal');
      }

      return goalId;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Recalculate progress for all goals based on linked tasks
 * Useful for batch updates when tasks are marked complete
 */
export const recalculateAllGoalProgress = createAsyncThunk<
  Goal[],
  string
>(
  'goals/recalculateAllProgress',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Fetch all user goals
      const goals = await goalDAO.findAllByUserId(userId);
      const updatedGoals: Goal[] = [];

      for (const goal of goals) {
        // Fetch linked tasks for each goal
        const linkedTasks = await taskDAO.findByGoalId(goal.id);
        
        // Calculate progress
        let progress = 0;
        if (linkedTasks.length > 0) {
          const completedTasks = linkedTasks.filter(
            (task) => task.status === 'completed'
          ).length;
          progress = Math.round((completedTasks / linkedTasks.length) * 100);
        }

        // Update goal if progress changed
        if (progress !== goal.progress) {
          const success = await goalDAO.update(goal.id, { progress });
          if (!success) {
            console.warn('Failed to update progress for goal:', goal.id);
          }
          
          // Fetch updated goal
          const updatedGoal = await goalDAO.findById(goal.id);
          if (updatedGoal) {
            updatedGoals.push(updatedGoal);
          }
        } else {
          updatedGoals.push(goal);
        }
      }

      return updatedGoals;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);
