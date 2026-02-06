import { Text, View } from "react-native";
import { Container } from "@/components/container";

export default function TabOne() {
  return (
    <Container className="p-6">
      <View className="flex-1 justify-center items-center">
        <View className="p-8 items-center bg-muted/10 rounded-xl border border-muted/20">
          <Text className="text-3xl font-bold text-foreground mb-2">Tab One</Text>
        </View>
      </View>
    </Container>
  );
}