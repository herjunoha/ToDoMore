/**
 * Color Theme System
 * Centralized color palette for the entire app
 */

/**
 * Light theme colors
 */
export const LIGHT_THEME = {
  // Primary colors
  PRIMARY: '#007AFF',
  PRIMARY_LIGHT: '#E8F4FF',
  PRIMARY_DARK: '#0051CC',

  // Secondary colors
  SECONDARY: '#5AC8FA',
  SECONDARY_LIGHT: '#E8F8FF',
  SECONDARY_DARK: '#0087D4',

  // Status colors
  SUCCESS: '#34C759',
  SUCCESS_LIGHT: '#E8F5E9',
  SUCCESS_DARK: '#00A040',

  WARNING: '#FF9500',
  WARNING_LIGHT: '#FFF3E0',
  WARNING_DARK: '#E68900',

  DANGER: '#FF3B30',
  DANGER_LIGHT: '#FFEBEE',
  DANGER_DARK: '#CC2E25',

  INFO: '#5AC8FA',
  INFO_LIGHT: '#E0F7FF',
  INFO_DARK: '#0087D4',

  // Neutral colors
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#8E8E93',
  TEXT_TERTIARY: '#C7C7CC',
  TEXT_DISABLED: '#C7C7CC',

  BACKGROUND: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F2F2F7',
  BACKGROUND_TERTIARY: '#FFFFFF',

  BORDER: '#E5E5EA',
  BORDER_LIGHT: '#F2F2F7',
  BORDER_DARK: '#C7C7CC',

  // Grayscale
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  LIGHT_GRAY: '#F2F2F7',
  GRAY: '#8E8E93',
  DARK_GRAY: '#3C3C43',

  // Overlay
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.1)',
  OVERLAY_MEDIUM: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_DARK: 'rgba(0, 0, 0, 0.8)',

  // Status specific
  COMPLETED: '#34C759',
  IN_PROGRESS: '#FF9500',
  PENDING: '#8E8E93',
  FAILED: '#FF3B30',

  // Priority specific
  HIGH_PRIORITY: '#FF3B30',
  MEDIUM_PRIORITY: '#FF9500',
  LOW_PRIORITY: '#34C759',

  // Streak colors
  STREAK_ACTIVE: '#FF6B35',
  STREAK_INACTIVE: '#8E8E93',
  STREAK_MILESTONE: '#FFD700',
} as const;

/**
 * Dark theme colors (for future implementation)
 */
export const DARK_THEME = {
  // Primary colors
  PRIMARY: '#0A84FF',
  PRIMARY_LIGHT: '#1E3A5F',
  PRIMARY_DARK: '#0051CC',

  // Secondary colors
  SECONDARY: '#5AC8FA',
  SECONDARY_LIGHT: '#1E3A5F',
  SECONDARY_DARK: '#0087D4',

  // Status colors
  SUCCESS: '#34C759',
  SUCCESS_LIGHT: '#1F3A1F',
  SUCCESS_DARK: '#00A040',

  WARNING: '#FF9500',
  WARNING_LIGHT: '#3A2F1F',
  WARNING_DARK: '#E68900',

  DANGER: '#FF3B30',
  DANGER_LIGHT: '#3A1F1F',
  DANGER_DARK: '#CC2E25',

  INFO: '#5AC8FA',
  INFO_LIGHT: '#1E3A4F',
  INFO_DARK: '#0087D4',

  // Neutral colors
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A0A0A0',
  TEXT_TERTIARY: '#5A5A5A',
  TEXT_DISABLED: '#5A5A5A',

  BACKGROUND: '#1C1C1E',
  BACKGROUND_SECONDARY: '#2C2C2E',
  BACKGROUND_TERTIARY: '#3A3A3C',

  BORDER: '#3A3A3C',
  BORDER_LIGHT: '#2C2C2E',
  BORDER_DARK: '#5A5A5A',

  // Grayscale
  WHITE: '#000000',
  BLACK: '#FFFFFF',
  LIGHT_GRAY: '#3A3A3C',
  GRAY: '#8E8E93',
  DARK_GRAY: '#D1D1D6',

  // Overlay
  OVERLAY_LIGHT: 'rgba(255, 255, 255, 0.1)',
  OVERLAY_MEDIUM: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_DARK: 'rgba(0, 0, 0, 0.8)',

  // Status specific
  COMPLETED: '#34C759',
  IN_PROGRESS: '#FF9500',
  PENDING: '#8E8E93',
  FAILED: '#FF3B30',

  // Priority specific
  HIGH_PRIORITY: '#FF3B30',
  MEDIUM_PRIORITY: '#FF9500',
  LOW_PRIORITY: '#34C759',

  // Streak colors
  STREAK_ACTIVE: '#FF6B35',
  STREAK_INACTIVE: '#8E8E93',
  STREAK_MILESTONE: '#FFD700',
} as const;

/**
 * Current active theme (light by default)
 */
export const COLORS = LIGHT_THEME;

export type ThemeType = typeof LIGHT_THEME;
