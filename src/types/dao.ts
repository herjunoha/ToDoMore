/**
 * Data Access Object (DAO) related types
 * Defines interfaces for database operations and queries
 */

import { Task, Goal, User, Streak } from './index';

/**
 * Generic query options for filtering and pagination
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Task DAO operations
 */
export interface TaskQuery extends QueryOptions {
  userId?: string;
  status?: string;
  priority?: string;
  goalId?: string;
  parentTaskId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface TaskCreateInput {
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  status: string;
  parentTaskId?: string;
  goalId?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
  goalId?: string;
  parentTaskId?: string;
}

/**
 * Goal DAO operations
 */
export interface GoalQuery extends QueryOptions {
  userId?: string;
  status?: string;
  parentGoalId?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface GoalCreateInput {
  userId: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  title?: string;
  description?: string;
  status: string;
  parentGoalId?: string;
}

export interface GoalUpdateInput {
  specific?: string;
  measurable?: string;
  achievable?: string;
  relevant?: string;
  timeBound?: string;
  title?: string;
  description?: string;
  status?: string;
  progress?: number;
  parentGoalId?: string;
}

/**
 * User DAO operations
 */
export interface UserCreateInput {
  username: string;
  pin_hash: string;
}

export interface UserUpdateInput {
  username?: string;
  pin_hash?: string;
}

/**
 * Streak DAO operations
 */
export interface StreakCreateInput {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface StreakUpdateInput {
  currentStreak?: number;
  longestStreak?: number;
  lastCompletedDate?: string;
}

/**
 * Generic DAO result type
 */
export interface DAOResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
  }>;
}
