/**
 * Form input types for authentication and CRUD operations
 */

// Authentication form types
export interface LoginFormValues {
  username: string;
  pin: string;
}

export interface RegistrationFormValues {
  username: string;
  pin: string;
  confirmPin: string;
}

export interface ChangePinFormValues {
  oldPin: string;
  newPin: string;
  confirmNewPin: string;
}

// Task form types
export interface TaskFormValues {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
  goalId?: string;
  parentTaskId?: string;
}

// Goal form types
export interface GoalFormValues {
  title?: string;
  description?: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  status?: 'not_started' | 'in_progress' | 'achieved' | 'failed';
  parentGoalId?: string;
}

// Shared form error type
export interface FormFieldError {
  [fieldName: string]: string | undefined;
}
