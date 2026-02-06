import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View, Pressable } from "react-native";

import { Container } from "@/components/container";
import { useThemeColor } from "@/hooks/useThemeColor";

function Modal() {
  const accentForegroundColor = useThemeColor("accent-foreground");

  function handleClose() {
    router.back();
  }

  return (
    <Container>
      <View className="flex-1 justify-center items-center p-4">
        <View className="p-5 w-full max-w-sm rounded-lg bg-muted/20">
          <View className="items-center">
            <View className="w-12 h-12 bg-accent rounded-lg items-center justify-center mb-3">
              <Ionicons name="checkmark" size={24} color={accentForegroundColor} />
            </View>
            <Text className="text-foreground font-medium text-lg mb-1">Modal Screen</Text>
            <Text className="text-muted text-sm text-center mb-4">
              This is an example modal screen for dialogs and confirmations.
            </Text>
          </View>
          <Pressable 
            onPress={handleClose} 
            className="w-full bg-foreground py-2 rounded-md active:opacity-80"
          >
            <Text className="text-background text-center font-medium">Close</Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

export default Modal;