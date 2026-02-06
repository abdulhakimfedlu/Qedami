import type { StyleProp, ViewStyle } from "react-native";
import type { WithSpringConfig } from "react-native-reanimated";

// ============================================
// Stack Configuration Types
// ============================================

export interface IDetailsPageStackConfig {
  /**
   * Animation configuration for stack transitions
   */
  readonly animationConfig?: WithSpringConfig;
  /**
   * Scale factor for each depth level (Apple Maps style)
   * @default 0.95
   */
  readonly scaleFactor?: number;
  /**
   * Translation Y factor for each depth level
   * @default 15
   */
  readonly translateYFactor?: number;
  /**
   * Opacity factor for each depth level
   * @default 0.1
   */
  readonly opacityFactor?: number;
  /**
   * Whether to enable shared element transitions
   * @default true
   */
  readonly enableSharedElementTransitions?: boolean;
  /**
   * Duration of the scale animation in milliseconds
   * @default 300
   */
  readonly animationDuration?: number;
}

// ============================================
// Stack Item Types
// ============================================

export interface IDetailsPageStackItem {
  /**
   * Unique identifier for the stack item
   */
  readonly id: string;
  /**
   * The component to render for this page
   */
  readonly component: React.ReactElement;
  /**
   * Optional title for the header
   */
  readonly title?: string;
  /**
   * Callback when this page is dismissed
   */
  readonly onDismiss?: () => void;
  /**
   * Optional custom header styles
   */
  readonly headerStyle?: StyleProp<ViewStyle>;
  /**
   * Optional shared element ID for transitions
   */
  readonly sharedElementId?: string;
}

export interface IStackedPageWrapper {
  page: IDetailsPageStackItem;
  stackIndex: number;
  totalPages: number;
  onClose: () => void;
}

// ============================================
// Context Types
// ============================================

export interface IDetailsPageStackContextValue {
  /**
   * Push a new page onto the stack
   */
  pushPage: (page: Omit<IDetailsPageStackItem, "id">) => string;
  /**
   * Pop the top page from the stack
   */
  popPage: () => void;
  /**
   * Pop to a specific page by ID
   */
  popToPage: (id: string) => void;
  /**
   * Pop all pages except the root
   */
  popToRoot: () => void;
  /**
   * Get the current stack depth
   */
  getStackDepth: () => number;
  /**
   * Get the current active page ID
   */
  getActivePageId: () => string | null;
}

export interface IDetailsPageStackProvider {
  children: Required<React.ReactNode>;
  /**
   * Optional configuration for the stack
   */
  readonly config?: IDetailsPageStackConfig;
  /**
   * Optional custom header render function
   */
  readonly renderHeader?: (
    page: IDetailsPageStackItem,
    onBack: () => void,
  ) => React.ReactNode;
}

// ============================================
// Navigation Types
// ============================================

export interface IDetailsPageNavigation {
  /**
   * Navigate to a new page
   */
  push: (page: Omit<IDetailsPageStackItem, "id">) => string;
  /**
   * Go back to the previous page
   */
  pop: () => void;
  /**
   * Navigate to a specific page
   */
  navigate: (id: string) => void;
  /**
   * Reset to root
   */
  reset: () => void;
}

export type {
  IDetailsPageStackConfig,
  IDetailsPageStackItem,
  IStackedPageWrapper,
  IDetailsPageStackContextValue,
  IDetailsPageStackProvider,
  IDetailsPageNavigation,
};
