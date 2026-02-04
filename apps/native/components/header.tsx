import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, useThemeColor, BottomSheet } from 'heroui-native';
import { useState } from 'react';
import { useAppTheme } from '@/contexts/app-theme-context';
import { MenuSheet } from '@/components/menu-sheet';

export function Header() {
   const insets = useSafeAreaInsets();
   const { isLight } = useAppTheme();
   const surfaceColor = useThemeColor('surface');
   const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <BottomSheet isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
        <View className="px-4 py-4 flex-row justify-start items-center relative z-10">
           <Button
             isIconOnly
             variant="tertiary"
             className="rounded-full shadow-lg"
             style={{ backgroundColor: surfaceColor }}
             onPress={() => setIsMenuOpen(true)}
           >
             <Text className="text-foreground text-2xl">☰</Text>
           </Button>
         </View>
      </View>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          detached
          bottomInset={insets.bottom + 16}
          className="mx-4"
          backgroundClassName={`rounded-3xl ${isLight ? 'bg-default' : 'bg-black'}`}
        >
          <MenuSheet onClose={() => setIsMenuOpen(false)} />
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
