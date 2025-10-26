/**
 * ScaleButton.tsx
 * Button with scale animation on press
 */

import React from 'react';
import { Animated, Pressable, PressableProps } from 'react-native';
import { createScaleAnimation, ANIMATION_DURATION } from '../../utils/animations';

export interface ScaleButtonProps extends Omit<PressableProps, 'style'> {
  onPress: () => void | Promise<void>;
  children: React.ReactNode;
  scaleValue?: number;
  style?: Animated.WithAnimatedValue<any>;
}

export const ScaleButton: React.FC<ScaleButtonProps> = ({
  onPress,
  scaleValue = 0.95,
  children,
  ...props
}) => {
  const { scale, scaleDown, scaleUp } = createScaleAnimation();

  const handlePressIn = () => {
    scaleDown(scaleValue).start();
  };

  const handlePressOut = () => {
    scaleUp().start();
  };

  const handlePress = async () => {
    await onPress();
  };

  return (
    <Animated.View
      style={[
        props.style,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};
