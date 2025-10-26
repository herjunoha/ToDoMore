/**
 * Components index
 * Centralized exports for all app components
 */

// Common components
export {
  LoadingOverlay,
  Toast,
  EmptyState,
  ConfirmationDialog,
  ErrorBoundary,
  ToastContainer,
  useToast,
} from './common';

// Dashboard components
export { DashboardCard, StreakCard, StatCard, ProgressBar } from './dashboard';

// Task components
export { TaskItemComponent } from './tasks';
