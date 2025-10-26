/**
 * SlideInView.tsx
 * Component with slide-in animation
 */

import React, { useEffect } from 'react';
import { Animated, ViewProps } from 'react-native';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../../utils/animations';

export interface SlideInViewProps extends ViewProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  distance?: number;
  children: React.ReactNode;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  direction = 'right',
  duration = ANIMATION_DURATION.NORMAL,
  delay = 0,
  distance = 50,
  children,
  ...props
}) => {
  const initialValue = 
    direction === 'left' ? distance :
    direction === 'right' ? -distance :
    direction === 'up' ? distance :
    -distance;

  const [translation] = React.useState(new Animated.Value(initialValue));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(translation, {
        toValue: 0,
        duration,
        easing: ANIMATION_EASING.EASE_OUT,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [translation, duration, delay]);

  const isHorizontal = direction === 'left' || direction === 'right';
  const transform = isHorizontal
    ? { translateX: translation }
    : { translateY: translation };

  return (
    <Animated.View
      style={[
        props.style,
        {
          transform: [transform],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};
