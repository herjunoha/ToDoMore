/**
 * Common Components Index
 * Export all common UI components used throughout the app
 */

// Feedback components
export { LoadingOverlay, type LoadingOverlayProps } from './LoadingOverlay';
export { Toast, type ToastProps } from './Toast';
export { EmptyState, type EmptyStateProps } from './EmptyState';
export { ConfirmationDialog, type ConfirmationDialogProps } from './ConfirmationDialog';
export { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary';
export {
  ToastContainer,
  ToastContext,
  useToast,
  type ToastContextType,
  type ToastItem,
} from './ToastContainer';

// Animation components
export { FadeInView, type FadeInViewProps } from './FadeInView';
export { SlideInView, type SlideInViewProps } from './SlideInView';
export { ScaleButton, type ScaleButtonProps } from './ScaleButton';
export { PulseLoader, type PulseLoaderProps } from './PulseLoader';
