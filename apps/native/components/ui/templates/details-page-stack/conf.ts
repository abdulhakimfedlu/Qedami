import type { WithSpringConfig } from "react-native-reanimated";

// ============================================
// Default Spring Animation Configuration
// ============================================

export const STACK_SPRING_CONFIG: WithSpringConfig = {
  damping: 25,
  stiffness: 300,
  mass: 0.5,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// ============================================
// Stack Depth Factors (Apple Maps Style)
// ============================================

/**
 * Scale factor for each depth level
 * Each subsequent page is scaled down by this factor
 */
export const SCALE_FACTOR = 0.94;

/**
 * Vertical offset factor for each depth level
 * Creates the depth perception by translating pages upward
 */
export const TRANSLATE_Y_FACTOR = 15;

/**
 * Opacity factor for each depth level
 * Each subsequent page is slightly more transparent
 */
export const OPACITY_FACTOR = 0.08;

/**
 * Maximum number of pages that can be stacked
 * Prevents performance issues with too many nested pages
 */
export const MAX_STACK_DEPTH = 5;

/**
 * Default animation duration in milliseconds
 * Used as fallback when spring config is not provided
 */
export const DEFAULT_ANIMATION_DURATION = 350;

// ============================================
// Header Configuration
// ============================================

export const HEADER_HEIGHT = 56;

export const DEFAULT_HEADER_STYLE = {
  height: HEADER_HEIGHT,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  paddingHorizontal: 16,
  backgroundColor: "transparent",
};

export const DEFAULT_BACK_BUTTON_SIZE = 40;

// ============================================
// Page Transition Configuration
// ============================================

export const PAGE_TRANSITION_CONFIG = {
  presentation: "card" as const,
  gestureDirection: "horizontal" as const,
  cardStyleInterpolator: ({ current, next }: { current: { progress: { value: number } }; next: { progress: { value: number } } }) => ({
    cardStyle: {
      opacity: current.progress.value,
    },
  }),
};

// ============================================
// Shared Element Transition Configuration
// ============================================

export const SHARED_ELEMENT_TRANSITION_CONFIG = {
  duration: 350,
  easing: "spring" as const,
  interpolation: "decelerate" as const,
};

export {
  STACK_SPRING_CONFIG,
  SCALE_FACTOR,
  TRANSLATE_Y_FACTOR,
  OPACITY_FACTOR,
  MAX_STACK_DEPTH,
  DEFAULT_ANIMATION_DURATION,
  HEADER_HEIGHT,
  DEFAULT_HEADER_STYLE,
  DEFAULT_BACK_BUTTON_SIZE,
};
