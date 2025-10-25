/**
 * UI Component prop types and UI-related interfaces
 */

/**
 * Common screen navigation props
 */
export interface ScreenProps<ParamList = any> {
  navigation: any;
  route: any;
}

/**
 * Modal props
 */
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
}

/**
 * Button props
 */
export interface ButtonProps {
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * Input field props
 */
export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  maxLength?: number;
}

/**
 * List item props
 */
export interface ListItemProps {
  onPress: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

/**
 * Toast/Notification types
 */
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

/**
 * Loading state for UI
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * Dropdown/Picker option
 */
export interface PickerOption<T = string | number> {
  label: string;
  value: T;
}

/**
 * Component state management
 */
export interface ComponentState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Confirmation dialog props
 */
export interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isDangerous?: boolean;
}

/**
 * Bottom sheet props
 */
export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  height?: number;
  children?: React.ReactNode;
}

/**
 * Swipe action type
 */
export interface SwipeAction {
  label: string;
  onPress: () => void;
  color?: string;
  type?: 'delete' | 'edit' | 'action';
}

/**
 * Animated value type
 */
export interface AnimationValue {
  value: number;
  duration: number;
  easing?: (value: number) => number;
}