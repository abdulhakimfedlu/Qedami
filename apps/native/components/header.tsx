import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/contexts/app-theme-context';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const insets = useSafeAreaInsets();
  const { isLight } = useAppTheme();

  return (
    <View
      className="absolute top-0 left-0 right-0 z-50"
      pointerEvents="box-none"
      style={{
        height: 120 + insets.top,
      }}
    >
      <LinearGradient
        pointerEvents="none"
        colors={[isLight ? '#ffffff' : '#000000', isLight ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)']}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View style={{ height: insets.top }} />
      <View className="px-4 py-4 flex-row justify-between items-center relative z-10">
        <Text className="text-foreground text-2xl font-bold">Qedami</Text>
        <ThemeToggle />
      </View>
    </View>
  );
}
