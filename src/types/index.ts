/**
 * Central type definitions file for the To Do: More application
 * Exports all types and interfaces used throughout the app
 */

// Status enums and types
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum GoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  ACHIEVED = 'achieved',
  FAILED = 'failed',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// User type
export interface User {
  id: string;
  username: string;
  pin_hash: string;
  created_at: string;
  updated_at: string;
}

// Task type
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string; // ISO 8601 format
  priority?: Priority;
  status: TaskStatus;
  parent_task_id?: string; // For subtasks
  goal_id?: string; // Link to associated goal
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

// Goal type (SMART framework)
export interface Goal {
  id: string;
  user_id: string;
  specific: string; // Specific - Clear definition of the goal
  measurable: string; // Measurable - How progress will be measured
  achievable: string; // Achievable - Confirmation or notes on achievability
  relevant: string; // Relevant - Why this goal is important
  time_bound: string; // Time-bound - Deadline (ISO 8601 date format)
  title?: string; // Auto-generated or user-defined
  description?: string;
  status: GoalStatus;
  progress?: number; // Calculated based on linked tasks (0-100)
  parent_goal_id?: string; // For sub-goals
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

// Streak type
export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date?: string; // ISO 8601 format
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

// Redux state types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

export interface GoalsState {
  items: Goal[];
  loading: boolean;
  error: string | null;
}

export interface StreaksState {
  streak: Streak | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  tasks: TasksState;
  goals: GoalsState;
  streaks: StreaksState;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncThunkPayload<T> = { data: T } | { error: string };
