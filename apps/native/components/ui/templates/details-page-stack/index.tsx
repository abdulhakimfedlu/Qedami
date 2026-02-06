import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
  memo,
} from "react";
import {
  StyleSheet,
  ViewStyle,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import {
  STACK_SPRING_CONFIG,
  SCALE_FACTOR,
  TRANSLATE_Y_FACTOR,
  OPACITY_FACTOR,
  HEADER_HEIGHT,
  DEFAULT_HEADER_STYLE,
  DEFAULT_BACK_BUTTON_SIZE,
} from "./conf";
import type {
  IDetailsPageStackConfig,
  IDetailsPageStackItem,
  IDetailsPageStackContextValue,
  IDetailsPageStackProvider,
  IStackedPageWrapper,
} from "./types";

// ============================================
// Context Creation
// ============================================

const DetailsPageStackContext = createContext<
  IDetailsPageStackContextValue | undefined
>(undefined);

// ============================================
// Hook: useDetailsPageStack
// ============================================

export const useDetailsPageStack = (): IDetailsPageStackContextValue => {
  const context = useContext(DetailsPageStackContext);
  if (!context) {
    throw new Error(
      "useDetailsPageStack must be used within DetailsPageStackProvider",
    );
  }
  return context;
};

// ============================================
// Default Header Component
// ============================================

interface DefaultHeaderProps {
  title?: string;
  onBack: () => void;
  showBackButton: boolean;
}

const DefaultHeader: React.FC<DefaultHeaderProps> = memo(
  ({ title, onBack, showBackButton }: DefaultHeaderProps) => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
          )}
        </View>
        {title && (
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
        )}
        <View style={styles.headerRight} />
      </View>
    );
  },
);

DefaultHeader.displayName = "DefaultHeader";

// ============================================
// Stacked Page Wrapper Component
// ============================================

const StackedPageWrapper: React.FC<IStackedPageWrapper> = memo(
  ({
    page,
    stackIndex,
    totalPages,
    onClose,
  }: IStackedPageWrapper): React.ReactElement => {
    const isTopPage = stackIndex === totalPages - 1;
    const depth = totalPages - 1 - stackIndex;

    // Animation values
    const scale = useSharedValue<number>(1);
    const translateY = useSharedValue<number>(0);
    const opacity = useSharedValue<number>(1);
    const zIndex = useSharedValue<number>(stackIndex);

    useEffect(() => {
      if (isTopPage) {
        // Top page: full scale, no translation
        scale.value = withSpring<number>(1, STACK_SPRING_CONFIG);
        translateY.value = withSpring<number>(0, STACK_SPRING_CONFIG);
        opacity.value = withSpring<number>(1, STACK_SPRING_CONFIG);
        zIndex.value = withSpring<number>(totalPages, STACK_SPRING_CONFIG);
      } else {
        // Background pages: scaled down, translated upward, slightly transparent
        scale.value = withSpring<number>(
          Math.pow(SCALE_FACTOR, depth),
          STACK_SPRING_CONFIG,
        );
        translateY.value = withSpring<number>(
          -(depth * TRANSLATE_Y_FACTOR),
          STACK_SPRING_CONFIG,
        );
        opacity.value = withSpring<number>(
          1 - depth * OPACITY_FACTOR,
          STACK_SPRING_CONFIG,
        );
        zIndex.value = withSpring<number>(stackIndex, STACK_SPRING_CONFIG);
      }
    }, [isTopPage, depth, stackIndex, totalPages]);

    const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
      zIndex: zIndex.value,
    }));

    // Render the page component with callbacks
    const pageElement = React.cloneElement(page.component, {
      // Standard props that can be passed to page components
      stackIndex,
      totalPages,
      onDismiss: () => {
        page.onDismiss?.();
        onClose();
      },
    });

    return (
      <Animated.View
        style={[styles.stackLayer, animatedStyle]}
        pointerEvents={isTopPage ? "auto" : "none"}
      >
        {/* Header overlay for non-top pages */}
        {!isTopPage && (
          <View style={styles.headerOverlay}>
            <View style={styles.headerPlaceholder}>
              <Text style={styles.placeholderTitle} numberOfLines={1}>
                {page.title || "Loading..."}
              </Text>
            </View>
          </View>
        )}
        {pageElement}
      </Animated.View>
    );
  },
);

StackedPageWrapper.displayName = "StackedPageWrapper";

// ============================================
// Stack Provider Component
// ============================================

export const DetailsPageStackProvider: React.FC<IDetailsPageStackProvider> =
  memo<IDetailsPageStackProvider>(
    ({
      children,
      config,
      renderHeader,
    }: IDetailsPageStackProvider): React.ReactElement => {
      const [pages, setPages] = useState<IDetailsPageStackItem[]>([]);
      const idCounter = useRef(0);

      // Get the current config or use defaults
      const stackConfig: Required<IDetailsPageStackConfig> = {
        scaleFactor: config?.scaleFactor ?? SCALE_FACTOR,
        translateYFactor: config?.translateYFactor ?? TRANSLATE_Y_FACTOR,
        opacityFactor: config?.opacityFactor ?? OPACITY_FACTOR,
        enableSharedElementTransitions:
          config?.enableSharedElementTransitions ?? true,
        animationDuration: config?.animationDuration ?? 350,
        animationConfig: config?.animationConfig ?? STACK_SPRING_CONFIG,
      };

      // Push a new page onto the stack
      const pushPage = useCallback<IDetailsPageStackContextValue["pushPage"]>(
        (page) => {
          const id = `page-${idCounter.current++}`;

          setPages((prev) => {
            // Check if we've reached max depth
            if (prev.length >= 5) {
              // Remove the oldest page
              return [...prev.slice(1), { ...page, id }];
            }
            return [...prev, { ...page, id }];
          });

          return id;
        },
        [],
      );

      // Pop the top page from the stack
      const popPage = useCallback<IDetailsPageStackContextValue["popPage"]>(
        () => {
          setPages((prev) => {
            if (!prev.length) return prev;
            return prev.slice(0, -1);
          });
        },
        [],
      );

      // Pop to a specific page by ID
      const popToPage = useCallback<IDetailsPageStackContextValue["popToPage"]>(
        (id: string) => {
          setPages((prev) => {
            const index = prev.findIndex((p) => p.id === id);
            if (index === -1) return prev;
            return prev.slice(0, index + 1);
          });
        },
        [],
      );

      // Pop all pages except the root
      const popToRoot = useCallback<IDetailsPageStackContextValue["popToRoot"]>(
        () => {
          setPages((prev) => {
            if (prev.length <= 1) return prev;
            return [prev[0]];
          });
        },
        [],
      );

      // Get the current stack depth
      const getStackDepth = useCallback<() => number>(
        () => pages.length,
        [pages],
      );

      // Get the active page ID
      const getActivePageId = useCallback<() => string | null>(
        () => pages[pages.length - 1]?.id ?? null,
        [pages],
      );

      // Handle back action (can be connected to hardware back button)
      const handleBack = useCallback(() => {
        if (pages.length > 1) {
          popPage();
        }
      }, [pages.length, popPage]);

      // Context value
      const contextValue: IDetailsPageStackContextValue = {
        pushPage,
        popPage,
        popToPage,
        popToRoot,
        getStackDepth,
        getActivePageId,
      };

      return (
        <DetailsPageStackContext.Provider value={contextValue}>
          {children}
          {pages.map((page, index) => (
            <StackedPageWrapper
              key={page.id}
              page={page}
              stackIndex={index}
              totalPages={pages.length}
              onClose={() => {
                setPages((prev) => prev.filter((p) => p.id !== page.id));
              }}
            />
          ))}
        </DetailsPageStackContext.Provider>
      );
    },
  );

DetailsPageStackProvider.displayName = "DetailsPageStackProvider";

// ============================================
// Hook: useDetailsPage
// ============================================

export const useDetailsPage = () => {
  const { pushPage, popPage, popToRoot, getStackDepth } =
    useDetailsPageStack();

  const present = useCallback(
    (page: Omit<IDetailsPageStackItem, "id">) => {
      return pushPage(page);
    },
    [pushPage],
  );

  const dismiss = useCallback(() => {
    popPage();
  }, [popPage]);

  return { present, dismiss, popToRoot, getStackDepth };
};

// ============================================
// Navigation Hook: useDetailsPageNavigation
// ============================================

export const useDetailsPageNavigation = () => {
  const { pushPage, popPage, popToPage, popToRoot, getActivePageId } =
    useDetailsPageStack();

  return {
    push: pushPage,
    pop: popPage,
    navigate: popToPage,
    reset: popToRoot,
    getActivePageId,
  };
};

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
  stackLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 12,
    zIndex: 1000,
  },
  headerLeft: {
    width: 44,
    justifyContent: "center" as const,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerRight: {
    width: 44,
  },
  backButton: {
    width: DEFAULT_BACK_BUTTON_SIZE,
    height: DEFAULT_BACK_BUTTON_SIZE,
    borderRadius: DEFAULT_BACK_BUTTON_SIZE / 2,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  backButtonText: {
    fontSize: 28,
    lineHeight: 28,
    color: "#98D4BB",
    marginTop: Platform.OS === "ios" ? -2 : 0,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: "#000",
  },
  headerOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 100,
  },
  headerPlaceholder: {
    flex: 1,
    justifyContent: "center" as const,
    paddingHorizontal: 60,
  },
  placeholderTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: "#666",
    textAlign: "center" as const,
  },
});

// ============================================
// Export types
// ============================================

export type {
  IDetailsPageStackConfig,
  IDetailsPageStackItem,
  IDetailsPageStackContextValue,
  IDetailsPageStackProvider,
  IStackedPageWrapper,
};
