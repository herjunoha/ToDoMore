/**
 * ErrorBoundary.tsx
 * Error boundary component for error handling
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, TEXT_STYLES, GLOBAL_STYLES, BUTTON_STYLES } from '../../theme';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={[GLOBAL_STYLES.screenContainer, styles.container]}>
          <View style={styles.content}>
            <Icon
              name="alert-circle-outline"
              size={64}
              color={COLORS.DANGER}
            />
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              {this.state.error?.message ||
                'An unexpected error occurred. Please try again.'}
            </Text>

            <Pressable
              style={BUTTON_STYLES.primaryButton}
              onPress={this.handleReset}
            >
              <Text style={BUTTON_STYLES.primaryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    ...TEXT_STYLES.H5,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.LG,
  },
  message: {
    ...TEXT_STYLES.BODY_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
    marginBottom: SPACING.LG,
    textAlign: 'center',
    maxWidth: 300,
  },
});
