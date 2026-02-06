import { Text, View } from "react-native";
import { Container } from "@/components/container";

export default function Home() {
  return (
    <Container className="p-4">
      <View className="py-6 mb-4">
        <Text className="text-3xl font-semibold text-foreground tracking-tight">
          Better T Stack
        </Text>
        <Text className="text-muted text-sm mt-1">Full-stack TypeScript starter</Text>
      </View>

      <View className="p-4 rounded-lg bg-muted/10 border border-muted/20">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-foreground font-medium">System Status</Text>
          <View className="px-2 py-0.5 rounded-full bg-success/20">
            <Text className="text-success text-xs font-bold">LIVE</Text>
          </View>
        </View>
      </View>
    </Container>
  );
}