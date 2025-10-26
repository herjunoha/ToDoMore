/**
 * Spacing System
 * Consistent spacing and sizing tokens
 */

/**
 * Spacing scale based on 8px grid system
 */
export const SPACING = {
  // Extra small
  XS: 4,
  // Small
  SM: 8,
  // Medium
  MD: 12,
  // Large
  LG: 16,
  // Extra large
  XL: 24,
  // XXL
  XXL: 32,
  // XXXL
  XXXL: 40,
} as const;

/**
 * Padding helpers
 */
export const PADDING = {
  NONE: 0,
  EXTRA_SMALL: SPACING.XS,
  SMALL: SPACING.SM,
  MEDIUM: SPACING.MD,
  LARGE: SPACING.LG,
  EXTRA_LARGE: SPACING.XL,
  HUGE: SPACING.XXL,
} as const;

/**
 * Margin helpers
 */
export const MARGIN = {
  NONE: 0,
  EXTRA_SMALL: SPACING.XS,
  SMALL: SPACING.SM,
  MEDIUM: SPACING.MD,
  LARGE: SPACING.LG,
  EXTRA_LARGE: SPACING.XL,
  HUGE: SPACING.XXL,
} as const;

/**
 * Border radius tokens
 */
export const BORDER_RADIUS = {
  NONE: 0,
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  EXTRA_LARGE: 16,
  FULL: 9999,
} as const;

/**
 * Shadow tokens
 */
export const SHADOWS = {
  NONE: {
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  SMALL: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  MEDIUM: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  LARGE: {
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  EXTRA_LARGE: {
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
} as const;

/**
 * Border width tokens
 */
export const BORDER_WIDTH = {
  NONE: 0,
  THIN: 1,
  MEDIUM: 2,
  THICK: 3,
} as const;

/**
 * Component sizing
 */
export const COMPONENT_SIZE = {
  // Touch targets (minimum 44x44)
  TOUCH_TARGET: 48,

  // Icon sizes
  ICON_SMALL: 20,
  ICON_MEDIUM: 24,
  ICON_LARGE: 32,
  ICON_EXTRA_LARGE: 40,

  // Button sizes
  BUTTON_SMALL: 36,
  BUTTON_MEDIUM: 44,
  BUTTON_LARGE: 52,

  // Input sizes
  INPUT_HEIGHT: 48,
  INPUT_PADDING: SPACING.MD,
} as const;

/**
 * Screen dimensions
 */
export const SCREEN = {
  // Safe area padding (platform specific)
  SAFE_AREA_PADDING: SPACING.LG,
  // Horizontal padding for content
  CONTENT_PADDING: SPACING.LG,
  // Max content width
  MAX_CONTENT_WIDTH: 600,
} as const;
