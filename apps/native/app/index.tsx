import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView, useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { Header } from '@/components/header';
import { SearchInput } from '@/components/search-input';
import { SuggestionsButtons } from '@/components/suggestions-buttons';

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler({
    onMove: (event) => {
      'worklet';
      height.value = Math.max(event.height, 0);
    },
  });

  return { height };
};

export default function Home() {
   const insets = useSafeAreaInsets();
   const router = useRouter();
   const suggestionsRef = useRef<{ collapse: () => void }>(null);
   const { height: keyboardHeight } = useGradualAnimation();

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -Math.max(keyboardHeight.value - 16, 0) }],
  }));

  // Collapse suggestions when user taps search
  const handleSearchFocus = useCallback(() => {
    suggestionsRef.current?.collapse();
  }, []);

  // Stabilize callbacks per react-state-dispatcher pattern
  const navigateToSearch = useCallback(
    (query: string) => {
      router.push({
        pathname: '/search',
        params: { q: query },
      });
    },
    [router]
  );

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-background"
    >
      {/* Header (absolute positioned, never scrolls) */}
      <Header />

      {/* Main scrollable content - centered suggestions */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 140, paddingBottom: 20, flexGrow: 1, justifyContent: 'center' }}
        scrollEnabled={true}
      >
        <View className="gap-8 justify-center flex-1">
          <SuggestionsButtons ref={suggestionsRef} onSuggestPress={navigateToSearch} />
        </View>
      </KeyboardAwareScrollView>

      {/* Search input that avoids keyboard */}
      <Animated.View 
        style={animatedInputStyle}
        className="pb-4 gap-2"
      >
        <SearchInput onSubmit={navigateToSearch} onFocus={handleSearchFocus} />
      </Animated.View>
    </View>
  );
}
