/**
 * Animation Utilities
 * Centralized animation configurations and helpers
 */

import { Animated, Easing } from 'react-native';

/**
 * Standard animation durations (milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,      // Quick feedback animations
  NORMAL: 300,    // Standard transitions
  SLOW: 500,      // Elaborate animations
  VERY_SLOW: 1000, // Long animations (loading, celebrations)
} as const;

/**
 * Easing configurations
 */
export const ANIMATION_EASING = {
  // Standard easing functions
  EASE_IN: Easing.in(Easing.cubic),
  EASE_OUT: Easing.out(Easing.cubic),
  EASE_IN_OUT: Easing.inOut(Easing.cubic),

  // Smooth easing
  SMOOTH: Easing.ease,
  QUAD: Easing.quad,
  CUBIC: Easing.cubic,

  // Bounce easing for playful effects
  BOUNCE: Easing.bounce,

  // Linear for continuous animations
  LINEAR: Easing.linear,

  // Bezier curves for custom easing
  ELASTIC: Easing.elastic(1),
  BACK: Easing.back(1.5),
} as const;

/**
 * Create a fade animation
 */
export const createFadeAnimation = (
  initialValue: number = 0
): {
  opacity: Animated.Value;
  fadeIn: () => Animated.CompositeAnimation;
  fadeOut: () => Animated.CompositeAnimation;
} => {
  const opacity = new Animated.Value(initialValue);

  const fadeIn = () =>
    Animated.timing(opacity, {
      toValue: 1,
      duration: ANIMATION_DURATION.NORMAL,
      easing: ANIMATION_EASING.EASE_OUT,
      useNativeDriver: true,
    });

  const fadeOut = () =>
    Animated.timing(opacity, {
      toValue: 0,
      duration: ANIMATION_DURATION.NORMAL,
      easing: ANIMATION_EASING.EASE_IN,
      useNativeDriver: true,
    });

  return { opacity, fadeIn, fadeOut };
};

/**
 * Create a scale animation
 */
export const createScaleAnimation = (
  initialValue: number = 1
): {
  scale: Animated.Value;
  scaleUp: (targetValue?: number) => Animated.CompositeAnimation;
  scaleDown: (targetValue?: number) => Animated.CompositeAnimation;
} => {
  const scale = new Animated.Value(initialValue);

  const scaleUp = (targetValue = 1.1) =>
    Animated.timing(scale, {
      toValue: targetValue,
      duration: ANIMATION_DURATION.FAST,
      easing: ANIMATION_EASING.EASE_OUT,
      useNativeDriver: true,
    });

  const scaleDown = (targetValue = 1) =>
    Animated.timing(scale, {
      toValue: targetValue,
      duration: ANIMATION_DURATION.FAST,
      easing: ANIMATION_EASING.EASE_IN,
      useNativeDriver: true,
    });

  return { scale, scaleUp, scaleDown };
};

/**
 * Create a slide animation
 */
export const createSlideAnimation = (
  initialValue: number = 0,
  axis: 'x' | 'y' = 'x'
): {
  position: Animated.Value;
  slideIn: (distance?: number) => Animated.CompositeAnimation;
  slideOut: (distance?: number) => Animated.CompositeAnimation;
} => {
  const position = new Animated.Value(initialValue);

  const slideIn = (distance = 0) =>
    Animated.timing(position, {
      toValue: distance,
      duration: ANIMATION_DURATION.NORMAL,
      easing: ANIMATION_EASING.EASE_OUT,
      useNativeDriver: true,
    });

  const slideOut = (distance: number = -300) =>
    Animated.timing(position, {
      toValue: distance,
      duration: ANIMATION_DURATION.NORMAL,
      easing: ANIMATION_EASING.EASE_IN,
      useNativeDriver: true,
    });

  return { position, slideIn, slideOut };
};

/**
 * Create a bounce animation
 */
export const createBounceAnimation = (
  initialValue: number = 0,
  bounceDistance: number = 10
): {
  bounce: Animated.Value;
  playBounce: () => Animated.CompositeAnimation;
} => {
  const bounce = new Animated.Value(initialValue);

  const playBounce = () =>
    Animated.sequence([
      Animated.timing(bounce, {
        toValue: bounceDistance,
        duration: ANIMATION_DURATION.FAST,
        easing: ANIMATION_EASING.EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(bounce, {
        toValue: 0,
        duration: ANIMATION_DURATION.FAST,
        easing: ANIMATION_EASING.EASE_IN,
        useNativeDriver: true,
      }),
    ]);

  return { bounce, playBounce };
};

/**
 * Create a pulse animation (for loading/attention)
 */
export const createPulseAnimation = (
  initialValue: number = 1
): {
  pulse: Animated.Value;
  startPulse: () => Animated.CompositeAnimation;
  stopPulse: () => void;
} => {
  const pulse = new Animated.Value(initialValue);

  const startPulse = (): Animated.CompositeAnimation =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 600,
          easing: ANIMATION_EASING.LINEAR,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          easing: ANIMATION_EASING.LINEAR,
          useNativeDriver: true,
        }),
      ])
    );

  const stopPulse = () => {
    pulse.setValue(1);
  };

  return { pulse, startPulse, stopPulse };
};

/**
 * Create a rotation animation
 */
export const createRotationAnimation = (
  initialValue: number = 0
): {
  rotation: Animated.Value;
  rotate: (angle: number) => Animated.CompositeAnimation;
  spin: () => Animated.CompositeAnimation;
} => {
  const rotation = new Animated.Value(initialValue);

  const rotate = (angle: number): Animated.CompositeAnimation =>
    Animated.timing(rotation, {
      toValue: angle,
      duration: ANIMATION_DURATION.NORMAL,
      easing: ANIMATION_EASING.EASE_OUT,
      useNativeDriver: true,
    });

  const spin = (): Animated.CompositeAnimation =>
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 360,
        duration: 2000,
        easing: ANIMATION_EASING.LINEAR,
        useNativeDriver: true,
      })
    );

  return { rotation, rotate, spin };
};

/**
 * Create a combined animation (runs multiple animations together)
 */
export const createCombinedAnimation = (
  animations: Animated.CompositeAnimation[]
): {
  play: () => void;
  stop: () => void;
} => {
  let currentAnimation: Animated.CompositeAnimation | null = null;

  const play = () => {
    currentAnimation = Animated.parallel(animations);
    currentAnimation.start();
  };

  const stop = () => {
    if (currentAnimation) {
      currentAnimation.stop();
    }
  };

  return { play, stop };
};

/**
 * Create a sequence animation (runs multiple animations in order)
 */
export const createSequenceAnimation = (
  animations: Animated.CompositeAnimation[]
): {
  play: () => void;
  stop: () => void;
} => {
  let currentAnimation: Animated.CompositeAnimation | null = null;

  const play = () => {
    currentAnimation = Animated.sequence(animations);
    currentAnimation.start();
  };

  const stop = () => {
    if (currentAnimation) {
      currentAnimation.stop();
    }
  };

  return { play, stop };
};

/**
 * Create a stagger animation (multiple items with delay)
 */
export const createStaggerAnimation = (
  animations: Animated.CompositeAnimation[],
  delayBetweenItems: number = 100
): {
  play: () => void;
  stop: () => void;
} => {
  const staggeredAnimations = animations.map((anim, index) =>
    Animated.sequence([
      Animated.delay(index * delayBetweenItems),
      anim,
    ])
  );

  let currentAnimation: Animated.CompositeAnimation | null = null;

  const play = () => {
    currentAnimation = Animated.parallel(staggeredAnimations);
    currentAnimation.start();
  };

  const stop = () => {
    if (currentAnimation) {
      currentAnimation.stop();
    }
  };

  return { play, stop };
};