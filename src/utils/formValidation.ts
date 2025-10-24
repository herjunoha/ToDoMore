import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants';

/**
 * Form validation utility functions for authentication screens
 */

export const formValidation = {
  /**
   * Validate username format and length
   */
  validateUsername: (username: string): { isValid: boolean; error: string } => {
    if (!username || username.trim() === '') {
      return {
        isValid: false,
        error: 'Username is required',
      };
    }

    if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.INVALID_USERNAME,
      };
    }

    if (username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.INVALID_USERNAME,
      };
    }

    return {
      isValid: true,
      error: '',
    };
  },

  /**
   * Validate PIN format (4 digits)
   */
  validatePin: (pin: string): { isValid: boolean; error: string } => {
    if (!pin) {
      return {
        isValid: false,
        error: 'PIN is required',
      };
    }

    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(pin)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.INVALID_PIN,
      };
    }

    return {
      isValid: true,
      error: '',
    };
  },

  /**
   * Validate that two PINs match
   */
  validatePinMatch: (pin: string, confirmPin: string): { isValid: boolean; error: string } => {
    if (!confirmPin) {
      return {
        isValid: false,
        error: 'Confirm PIN is required',
      };
    }

    if (pin !== confirmPin) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.PIN_MISMATCH,
      };
    }

    return {
      isValid: true,
      error: '',
    };
  },

  /**
   * Filter numeric input to only allow digits
   */
  filterNumericInput: (text: string, maxLength: number = 4): string => {
    return text
      .replace(/[^0-9]/g, '') // Remove non-digits
      .slice(0, maxLength); // Limit to maxLength
  },

  /**
   * Validate entire registration form
   */
  validateRegistrationForm: (
    username: string,
    pin: string,
    confirmPin: string
  ): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    const usernameValidation = formValidation.validateUsername(username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error;
    }

    const pinValidation = formValidation.validatePin(pin);
    if (!pinValidation.isValid) {
      errors.pin = pinValidation.error;
    }

    const confirmPinValidation = formValidation.validatePinMatch(pin, confirmPin);
    if (!confirmPinValidation.isValid) {
      errors.confirmPin = confirmPinValidation.error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Validate entire login form
   */
  validateLoginForm: (
    username: string,
    pin: string
  ): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    const usernameValidation = formValidation.validateUsername(username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error;
    }

    const pinValidation = formValidation.validatePin(pin);
    if (!pinValidation.isValid) {
      errors.pin = pinValidation.error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
