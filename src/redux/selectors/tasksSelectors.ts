import { AppRootState } from '../store/configureStore';
import { Task, TaskStatus, Priority } from '../../types';

/**
 * Task Selectors
 * Memoized selectors for accessing task state
 */

/**
 * Select all tasks
 */
export const selectAllTasks = (state: AppRootState): Task[] => state.tasks.items;

/**
 * Select tasks loading state
 */
export const selectTasksLoading = (state: AppRootState): boolean => state.tasks.loading;

/**
 * Select tasks error
 */
export const selectTasksError = (state: AppRootState): string | null => state.tasks.error;

/**
 * Select task by ID
 */
export const selectTaskById = (state: AppRootState, taskId: string): Task | undefined =>
  state.tasks.items.find((task) => task.id === taskId);

/**
 * Select tasks by status
 */
export const selectTasksByStatus = (state: AppRootState, status: TaskStatus): Task[] =>
  state.tasks.items.filter((task) => task.status === status);

/**
 * Select tasks by priority
 */
export const selectTasksByPriority = (state: AppRootState, priority: Priority): Task[] =>
  state.tasks.items.filter((task) => task.priority === priority);

/**
 * Select tasks by goal ID
 */
export const selectTasksByGoalId = (state: AppRootState, goalId: string): Task[] =>
  state.tasks.items.filter((task) => task.goal_id === goalId);

/**
 * Select completed tasks
 */
export const selectCompletedTasks = (state: AppRootState): Task[] =>
  state.tasks.items.filter((task) => task.status === TaskStatus.COMPLETED);

/**
 * Select pending tasks
 */
export const selectPendingTasks = (state: AppRootState): Task[] =>
  state.tasks.items.filter((task) => task.status === TaskStatus.PENDING);

/**
 * Select in-progress tasks
 */
export const selectInProgressTasks = (state: AppRootState): Task[] =>
  state.tasks.items.filter((task) => task.status === TaskStatus.IN_PROGRESS);

/**
 * Select tasks with due date
 */
export const selectTasksWithDueDate = (state: AppRootState): Task[] =>
  state.tasks.items.filter((task) => !!task.due_date);

/**
 * Select overdue tasks
 */
export const selectOverdueTasks = (state: AppRootState): Task[] => {
  const now = new Date().toISOString();
  return state.tasks.items.filter(
    (task) => task.due_date && task.due_date < now && task.status !== TaskStatus.COMPLETED
  );
};

/**
 * Select subtasks for a parent task
 */
export const selectSubtasks = (state: AppRootState, parentTaskId: string): Task[] =>
  state.tasks.items.filter((task) => task.parent_task_id === parentTaskId);

/**
 * Select total task count
 */
export const selectTaskCount = (state: AppRootState): number => state.tasks.items.length;

/**
 * Select completed task count
 */
export const selectCompletedTaskCount = (state: AppRootState): number =>
  selectCompletedTasks(state).length;

/**
 * Select pending task count
 */
export const selectPendingTaskCount = (state: AppRootState): number =>
  selectPendingTasks(state).length;

/**
 * Select task completion percentage
 */
export const selectTaskCompletionPercentage = (state: AppRootState): number => {
  const total = selectTaskCount(state);
  if (total === 0) return 0;
  return Math.round((selectCompletedTaskCount(state) / total) * 100);
};

/**
 * Select high-priority tasks
 */
export const selectHighPriorityTasks = (state: AppRootState): Task[] =>
  selectTasksByPriority(state, Priority.HIGH);
