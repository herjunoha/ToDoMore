/**
 * FadeInView.tsx
 * Screen component wrapper with fade-in animation
 */

import React, { useEffect } from 'react';
import { Animated, ViewProps } from 'react-native';
import { createFadeAnimation } from '../../utils/animations';

export interface FadeInViewProps extends ViewProps {
  duration?: number;
  children: React.ReactNode;
  delay?: number;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  duration = 300,
  delay = 0,
  children,
  ...props
}) => {
  const [opacity] = React.useState(new Animated.Value(0));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [opacity, duration, delay]);

  return (
    <Animated.View
      style={[
        props.style,
        {
          opacity,
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};
