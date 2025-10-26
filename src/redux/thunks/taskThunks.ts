import { createAsyncThunk } from '@reduxjs/toolkit';
import { Task, Priority, TaskStatus } from '../../types';
import { TaskDAO } from '../../services/database/TaskDAO';
import { GoalDAO } from '../../services/database/GoalDAO';
import { ERROR_MESSAGES } from '../../constants';

const taskDAO = new TaskDAO();
const goalDAO = new GoalDAO();

/**
 * Task creation input type
 */
interface TaskCreatePayload {
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  status: TaskStatus;
  parentTaskId?: string;
  goalId?: string;
}

/**
 * Task update input type
 */
interface TaskUpdatePayload {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  status?: TaskStatus;
  goalId?: string;
}

/**
 * Fetch all tasks for a user
 */
export const fetchTasks = createAsyncThunk<Task[], string>(
  'tasks/fetchTasks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskDAO.findAllByUserId(userId);
      return tasks;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Fetch tasks by goal ID
 */
export const fetchTasksByGoalId = createAsyncThunk<Task[], string>(
  'tasks/fetchByGoal',
  async (goalId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskDAO.findByGoalId(goalId);
      return tasks;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Fetch task by ID
 */
export const fetchTaskById = createAsyncThunk<Task, string>(
  'tasks/fetchById',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const task = await taskDAO.findById(taskId);
      if (!task) {
        return rejectWithValue('Task not found');
      }
      return task;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Create a new task
 */
export const createTask = createAsyncThunk<Task, TaskCreatePayload>(
  'tasks/create',
  async (taskInput: TaskCreatePayload, { rejectWithValue }) => {
    try {
      const task = await taskDAO.create({
        user_id: taskInput.userId,
        title: taskInput.title,
        description: taskInput.description,
        due_date: taskInput.dueDate,
        priority: taskInput.priority,
        status: taskInput.status,
        parent_task_id: taskInput.parentTaskId,
        goal_id: taskInput.goalId,
      } as any);
      return task;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Update an existing task
 */
export const updateTask = createAsyncThunk<
  Task,
  { taskId: string; updates: TaskUpdatePayload }
>(
  'tasks/update',
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const updateData = {
        title: updates.title,
        description: updates.description,
        due_date: updates.dueDate,
        priority: updates.priority,
        status: updates.status,
        goal_id: updates.goalId,
      } as any;
      const success = await taskDAO.update(taskId, updateData);
      if (!success) {
        return rejectWithValue('Failed to update task');
      }
      const updatedTask = await taskDAO.findById(taskId);
      if (!updatedTask) {
        return rejectWithValue('Task not found after update');
      }
      return updatedTask;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Delete a task
 */
export const deleteTask = createAsyncThunk<string, string>(
  'tasks/delete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const success = await taskDAO.delete(taskId);
      if (!success) {
        return rejectWithValue('Failed to delete task');
      }
      return taskId;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Delete a task and update linked goal progress
 * Recalculates goal progress when a task is deleted
 */
export const deleteTaskWithGoalProgress = createAsyncThunk<
  string,
  string
>(
  'tasks/deleteWithProgress',
  async (taskId: string, { rejectWithValue }) => {
    try {
      // Get the task before deleting it to find linked goal
      const task = await taskDAO.findById(taskId);
      if (!task) {
        return rejectWithValue('Task not found');
      }

      const linkedGoalId = task.goal_id;

      // Delete the task
      const success = await taskDAO.delete(taskId);
      if (!success) {
        return rejectWithValue('Failed to delete task');
      }

      // If task was linked to a goal, recalculate goal progress
      if (linkedGoalId) {
        const remainingTasks = await taskDAO.findByGoalId(linkedGoalId);
        if (remainingTasks && remainingTasks.length > 0) {
          const completedTasks = remainingTasks.filter(
            (t) => t.status === TaskStatus.COMPLETED
          ).length;
          const newProgress = Math.round((completedTasks / remainingTasks.length) * 100);
          await goalDAO.update(linkedGoalId, { progress: newProgress });
        } else {
          // No more tasks linked to this goal, reset progress to 0
          await goalDAO.update(linkedGoalId, { progress: 0 });
        }
      }

      return taskId;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Update task status
 */
export const updateTaskStatus = createAsyncThunk<
  Task,
  { taskId: string; status: TaskStatus }
>(
  'tasks/updateStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const success = await taskDAO.update(taskId, { status });
      if (!success) {
        return rejectWithValue('Failed to update task status');
      }
      const updatedTask = await taskDAO.findById(taskId);
      if (!updatedTask) {
        return rejectWithValue('Task not found');
      }
      return updatedTask;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Update task status with auto-calculation of linked goal progress
 * Triggered when task status changes (especially on completion)
 */
export const updateTaskStatusWithGoalProgress = createAsyncThunk<
  Task,
  { taskId: string; status: TaskStatus }
>(
  'tasks/updateStatusWithProgress',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      // First, get the task to check if it has a linked goal
      const task = await taskDAO.findById(taskId);
      if (!task) {
        return rejectWithValue('Task not found');
      }

      // Update task status
      const success = await taskDAO.update(taskId, { status });
      if (!success) {
        return rejectWithValue('Failed to update task status');
      }

      // If task is linked to a goal, recalculate goal progress
      if (task.goal_id) {
        const linkedTasks = await taskDAO.findByGoalId(task.goal_id);
        if (linkedTasks && linkedTasks.length > 0) {
          const completedTasks = linkedTasks.filter(
            (t) => t.status === TaskStatus.COMPLETED
          ).length;
          const newProgress = Math.round((completedTasks / linkedTasks.length) * 100);
          
          // Update goal progress
          await goalDAO.update(task.goal_id, { progress: newProgress });
        }
      }

      // Return updated task
      const updatedTask = await taskDAO.findById(taskId);
      if (!updatedTask) {
        return rejectWithValue('Task not found after update');
      }
      return updatedTask;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Fetch overdue tasks
 */
export const fetchOverdueTasks = createAsyncThunk<Task[], string>(
  'tasks/fetchOverdue',
  async (userId: string, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const tasks = await taskDAO.findWhere('user_id = ? AND due_date < ? AND status != ?', [
        userId,
        now,
        'completed',
      ]);
      return tasks;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Fetch completed tasks
 */
export const fetchCompletedTasks = createAsyncThunk<Task[], string>(
  'tasks/fetchCompleted',
  async (userId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskDAO.findWhere('user_id = ? AND status = ?', [
        userId,
        'completed',
      ]);
      return tasks;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);

/**
 * Fetch pending tasks
 */
export const fetchPendingTasks = createAsyncThunk<Task[], string>(
  'tasks/fetchPending',
  async (userId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskDAO.findWhere('user_id = ? AND status = ?', [userId, 'pending']);
      return tasks;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
);
