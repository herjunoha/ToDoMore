/**
 * App-wide constants and configuration
 */

// App metadata
export const APP_NAME = 'To Do: More';
export const APP_VERSION = '0.0.1';
export const APP_NAMESPACE = 'com.todomore';

// Database
export const DB_NAME = 'todomore.db';
export const DB_VERSION = 1;

// Secure storage keys
export const SECURE_STORAGE_KEYS = {
  USER_PIN: 'user_pin',
  USERNAME: 'username',
  USER_ID: 'user_id',
} as const;

// Validation constants
export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PIN_LENGTH: 4,
  PIN_MIN_VALUE: 0,
  PIN_MAX_VALUE: 9999,
  TASK_TITLE_MIN_LENGTH: 1,
  TASK_TITLE_MAX_LENGTH: 255,
  GOAL_TITLE_MIN_LENGTH: 1,
  GOAL_TITLE_MAX_LENGTH: 255,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_USERNAME: 'Username must be between 3 and 50 characters',
  INVALID_PIN: 'PIN must be a 4-digit number',
  PIN_MISMATCH: 'PINs do not match',
  USERNAME_TAKEN: 'Username already exists',
  INVALID_CREDENTIALS: 'Invalid username or PIN',
  NETWORK_ERROR: 'Network error. Please try again.',
  DATABASE_ERROR: 'Database error. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'Account created successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  GOAL_CREATED: 'Goal created successfully',
  GOAL_UPDATED: 'Goal updated successfully',
  GOAL_DELETED: 'Goal deleted successfully',
} as const;

// API timeouts (in milliseconds)
export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 60000, // 60 seconds
  DOWNLOAD: 60000, // 60 seconds
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  DATE_ONLY: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm',
} as const;

// Colors (placeholder - actual theme colors will be defined in theme file)
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5AC8FA',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  DANGER: '#FF3B30',
  LIGHT_GRAY: '#F2F2F7',
  GRAY: '#8E8E93',
  DARK_GRAY: '#3C3C43',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#8E8E93',
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Streak
export const STREAK = {
  MIN_DAYS_FOR_CELEBRATION: 7,
  MIN_DAYS_FOR_MILESTONE: 30,
} as const;
