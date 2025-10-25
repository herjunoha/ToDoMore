/**
 * Service layer types for business logic and API responses
 */

import { Task, Goal, User, Streak } from './index';

/**
 * Authentication service response types
 */
export interface AuthServiceResponse<T> {
  success: boolean;
  user?: T;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface ChangePinResponse {
  success: boolean;
  error?: string;
}

export interface CheckCredentialsResponse {
  isAuthenticated: boolean;
  user?: User;
}

/**
 * Task service response types
 */
export interface TaskServiceResponse {
  success: boolean;
  data?: Task | Task[];
  error?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Goal service response types
 */
export interface GoalServiceResponse {
  success: boolean;
  data?: Goal | Goal[];
  error?: string;
}

export interface GoalListResponse {
  goals: Goal[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GoalProgress {
  goalId: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
}

/**
 * Streak service response types
 */
export interface StreakServiceResponse {
  success: boolean;
  streak?: Streak;
  error?: string;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysTracked: number;
  lastCompletedDate?: string;
}

/**
 * Database operation results
 */
export interface DatabaseOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  rowsAffected?: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}