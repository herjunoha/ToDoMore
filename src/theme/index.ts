/**
 * Theme index
 * Central export file for all theme-related modules
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './globalStyles';

/**
 * Default theme configuration
 */
export const DEFAULT_THEME = {
  mode: 'light' as const,
} as const;
