/**
 * ToastContainer.tsx
 * Container component for managing multiple toast notifications
 */

import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Toast, ToastProps } from './Toast';
import { SPACING } from '../../theme';

export interface ToastItem extends ToastProps {
  id: string;
}

export interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info', duration = 3000) => {
      const id = `toast-${++toastIdRef.current}`;
      const newToast: ToastItem = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = { showToast, hideToast, clearAll };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.container}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onDismiss={() => hideToast(toast.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

/**
 * Hook to use toast notifications
 */
export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastContainer');
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SPACING.LG,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.LG,
    pointerEvents: 'box-none',
  },
});
