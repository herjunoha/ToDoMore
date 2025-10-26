/**
 * Toast.tsx
 * Toast/notification message component
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, TEXT_STYLES, BORDER_RADIUS } from '../../theme';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: () => void;
}

const getIconName = (type: string): string => {
  switch (type) {
    case 'success':
      return 'check-circle';
    case 'error':
      return 'alert-circle';
    case 'warning':
      return 'alert';
    case 'info':
      return 'information';
    default:
      return 'information';
  }
};

const getColors = (type: string) => {
  switch (type) {
    case 'success':
      return { bg: COLORS.SUCCESS_LIGHT, icon: COLORS.SUCCESS, text: COLORS.SUCCESS };
    case 'error':
      return { bg: COLORS.DANGER_LIGHT, icon: COLORS.DANGER, text: COLORS.DANGER };
    case 'warning':
      return { bg: COLORS.WARNING_LIGHT, icon: COLORS.WARNING, text: COLORS.WARNING };
    case 'info':
      return { bg: COLORS.INFO_LIGHT, icon: COLORS.INFO, text: COLORS.INFO };
    default:
      return { bg: COLORS.LIGHT_GRAY, icon: COLORS.GRAY, text: COLORS.GRAY };
  }
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onDismiss,
}) => {
  const [opacity] = React.useState(new Animated.Value(0));
  const colors = getColors(type);

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onDismiss?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [opacity, duration, onDismiss]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={[styles.toast, { backgroundColor: colors.bg }]}>
        <Icon name={getIconName(type)} size={20} color={colors.icon} />
        <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>
          {message}
        </Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onDismiss?.();
            });
          }}
        >
          <Icon name="close" size={18} color={colors.text} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MEDIUM,
    gap: SPACING.MD,
  },
  message: {
    flex: 1,
    ...TEXT_STYLES.BODY_SMALL,
    fontWeight: '500',
  },
  closeButton: {
    padding: SPACING.SM,
    marginLeft: SPACING.SM,
  },
});
