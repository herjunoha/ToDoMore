/**
 * Accessibility Utilities
 * WCAG 2.1 AA compliance helpers and utilities
 */

import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Accessibility guidelines and standards
 */
export const ACCESSIBILITY = {
  // Color contrast ratios (WCAG 2.1 AA minimum: 4.5:1)
  CONTRAST: {
    MINIMUM_NORMAL: 4.5, // For normal text
    MINIMUM_LARGE: 3,    // For large text (18pt+)
    ENHANCED: 7,         // AAA standard
  },

  // Touch target sizes (minimum 48x48 dp)
  TOUCH_TARGET: {
    MINIMUM: 48,         // WCAG minimum
    RECOMMENDED: 56,     // Recommended
    COMFORTABLE: 64,     // Extra comfortable
  },

  // Font sizes for accessibility
  FONT_SIZE: {
    MINIMUM: 12,         // Absolute minimum
    RECOMMENDED_BODY: 14, // Body text recommendation
    LARGE_TEXT: 18,      // Considered large text
  },

  // Animation durations (avoid > 3s flashing)
  ANIMATION: {
    MAX_FLASH_RATE: 3,   // Max flashes per second
    REDUCED_MOTION_DURATION: 100, // For reduced motion preference
  },

  // Heading hierarchy
  HEADING_LEVELS: {
    H1: 'header',
    H2: 'header',
    H3: 'header',
    H4: 'header',
    H5: 'header',
    H6: 'header',
  } as const,
} as const;

/**
 * Check if text and background colors meet WCAG AA contrast ratio
 * Uses relative luminance calculation
 */
export const checkColorContrast = (
  textColor: string,
  backgroundColor: string
): number => {
  const getRelativeLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    // eslint-disable-next-line no-bitwise
    const r = ((rgb >> 16) & 0xff) / 255;
    // eslint-disable-next-line no-bitwise
    const g = ((rgb >> 8) & 0xff) / 255;
    // eslint-disable-next-line no-bitwise
    const b = (rgb & 0xff) / 255;

    const luminance = (channel: number): number => {
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * luminance(r) + 0.7152 * luminance(g) + 0.0722 * luminance(b);
  };

  const l1 = getRelativeLuminance(textColor);
  const l2 = getRelativeLuminance(backgroundColor);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Verify if colors meet WCAG AA standard
 */
export const meetsWCAGAA = (textColor: string, backgroundColor: string): boolean => {
  const contrast = checkColorContrast(textColor, backgroundColor);
  return contrast >= ACCESSIBILITY.CONTRAST.MINIMUM_NORMAL;
};

/**
 * Verify if colors meet WCAG AAA standard
 */
export const meetsWCAGAAA = (textColor: string, backgroundColor: string): boolean => {
  const contrast = checkColorContrast(textColor, backgroundColor);
  return contrast >= ACCESSIBILITY.CONTRAST.ENHANCED;
};

/**
 * Announce a message to screen readers (iOS/Android)
 */
export const announceForAccessibility = async (message: string): Promise<void> => {
  try {
    if (Platform.OS === 'android') {
      await AccessibilityInfo.announceForAccessibility(message);
    } else if (Platform.OS === 'ios') {
      await AccessibilityInfo.announceForAccessibility(message);
    }
  } catch (error) {
    console.warn('Failed to announce for accessibility:', error);
  }
};

/**
 * Check if screen reader is enabled
 */
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.warn('Failed to check screen reader status:', error);
    return false;
  }
};

/**
 * Check if bold text is preferred
 */
export const isBoldTextEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isBoldTextEnabled();
  } catch (error) {
    console.warn('Failed to check bold text status:', error);
    return false;
  }
};

/**
 * Get recommended font size multiplier for accessibility
 */
export const getFontSizeMultiplier = (baseSize: number, isLargeText: boolean = false): number => {
  // Users with vision impairments often use font size multipliers
  // 1.0 = base size, 1.25 = 125%, 1.5 = 150%, etc.
  return isLargeText ? 1.25 : 1.0;
};

/**
 * Accessibility properties for interactive elements
 */
export const getAccessibilityProps = (
  label: string,
  hint?: string,
  role: 'button' | 'link' | 'checkbox' | 'radio' | 'switch' | 'slider' = 'button',
  disabled: boolean = false
): {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole: typeof role;
  accessibilityState: {
    disabled: boolean;
    selected?: boolean;
    checked?: boolean;
  };
} => {
  return {
    accessible: true,
    accessibilityLabel: label,
    ...(hint && { accessibilityHint: hint }),
    accessibilityRole: role,
    accessibilityState: {
      disabled,
    },
  };
};

/**
 * Format text for accessibility (add screen reader friendly text)
 */
export const formatAccessibilityText = (text: string, additionalInfo?: string): string => {
  if (additionalInfo) {
    return `${text}. ${additionalInfo}`;
  }
  return text;
};

/**
 * Generate accessible error message for form fields
 */
export const getFormFieldErrorMessage = (fieldName: string, error: string): string => {
  return `${fieldName}: ${error}. Please correct this field.`;
};

/**
 * Generate accessible status message
 */
export const getStatusMessage = (
  action: string,
  status: 'success' | 'error' | 'pending'
): string => {
  switch (status) {
    case 'success':
      return `${action} completed successfully.`;
    case 'error':
      return `${action} failed. Please try again.`;
    case 'pending':
      return `${action} in progress. Please wait.`;
  }
};

/**
 * Check if content meets minimum font size requirements
 */
export const meetsMinimumFontSize = (fontSize: number): boolean => {
  return fontSize >= ACCESSIBILITY.FONT_SIZE.MINIMUM;
};

/**
 * Check if content is considered "large text" for contrast purposes
 */
export const isLargeText = (fontSize: number): boolean => {
  return fontSize >= ACCESSIBILITY.FONT_SIZE.LARGE_TEXT;
};

/**
 * Generate accessible label for buttons with icons
 */
export const getIconButtonLabel = (iconName: string, actionText: string): string => {
  const iconDescriptions: { [key: string]: string } = {
    'trash-can': 'Delete',
    'pencil': 'Edit',
    'check': 'Complete',
    'close': 'Close',
    'plus': 'Add',
    'bell': 'Notifications',
    'cog': 'Settings',
    'home': 'Home',
  };

  const iconDescription = iconDescriptions[iconName] || iconName;
  return `${iconDescription}: ${actionText}`;
};

/**
 * Get keyboard navigation hint for screen readers
 */
export const getKeyboardNavigationHint = (): string => {
  return 'Double tap to activate. Use arrow keys to navigate.';
};

/**
 * Accessibility checklist for components
 */
export const ACCESSIBILITY_CHECKLIST = {
  // Colors
  COLOR_CONTRAST: {
    description: 'Ensure 4.5:1 contrast ratio (WCAG AA)',
    verification: meetsWCAGAA,
  },

  // Touch targets
  TOUCH_TARGETS: {
    description: 'Minimum 48x48 dp touch target size',
    minimumSize: ACCESSIBILITY.TOUCH_TARGET.MINIMUM,
  },

  // Typography
  FONT_SIZE: {
    description: 'Minimum 12pt, body text 14pt+',
    minimumSize: ACCESSIBILITY.FONT_SIZE.MINIMUM,
  },

  // Labels
  LABELS: {
    description: 'All interactive elements have labels',
    check: 'Verify accessibilityLabel prop',
  },

  // Hints
  HINTS: {
    description: 'Complex elements have hints',
    check: 'Verify accessibilityHint prop',
  },

  // Roles
  ROLES: {
    description: 'Correct accessibility roles assigned',
    check: 'Verify accessibilityRole prop',
  },

  // States
  STATES: {
    description: 'Current state communicated',
    check: 'Verify accessibilityState prop',
  },

  // Keyboard
  KEYBOARD: {
    description: 'All features accessible via keyboard',
    check: 'Test with keyboard only',
  },

  // Screen reader
  SCREEN_READER: {
    description: 'Content navigable with screen reader',
    check: 'Test with TalkBack/VoiceOver',
  },
} as const;

/**
 * Platform-specific accessibility tips
 */
export const getPlatformAccessibilityInfo = (): string => {
  if (Platform.OS === 'android') {
    return 'Testing with TalkBack screen reader. Enable in Settings > Accessibility > TalkBack';
  } else if (Platform.OS === 'ios') {
    return 'Testing with VoiceOver screen reader. Enable in Settings > Accessibility > VoiceOver';
  }
  return 'Platform not recognized';
};
