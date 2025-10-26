/**
 * PulseLoader.tsx
 * Animated pulse loader for loading states
 */

import React, { useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../../utils/animations';

export interface PulseLoaderProps {
  size?: number;
  color?: string;
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({
  size = 40,
  color = COLORS.PRIMARY,
}) => {
  const scale1 = React.useRef(new Animated.Value(0)).current;
  const scale2 = React.useRef(new Animated.Value(0)).current;
  const scale3 = React.useRef(new Animated.Value(0)).current;
  const opacity1 = React.useRef(new Animated.Value(1)).current;
  const opacity2 = React.useRef(new Animated.Value(1)).current;
  const opacity3 = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateRing = (scale: Animated.Value, opacity: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            easing: ANIMATION_EASING.LINEAR,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            easing: ANIMATION_EASING.LINEAR,
            useNativeDriver: true,
          }),
        ]),
      ]);
    };

    Animated.loop(
      Animated.parallel([
        animateRing(scale1, opacity1, 0),
        animateRing(scale2, opacity2, 300),
        animateRing(scale3, opacity3, 600),
      ])
    ).start();
  }, [scale1, scale2, opacity1, scale2, opacity2, scale3, opacity3]);

  const Ring = ({
    scale,
    opacity,
  }: {
    scale: Animated.Value;
    opacity: Animated.Value;
  }) => (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
          },
        ]}
      />
    </Animated.View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Ring scale={scale1} opacity={opacity1} />
      <Ring scale={scale2} opacity={opacity2} />
      <Ring scale={scale3} opacity={opacity3} />
      <View
        style={[
          styles.center,
          {
            width: size / 3,
            height: size / 3,
            borderRadius: size / 6,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    borderWidth: 2,
  },
  center: {},
});
