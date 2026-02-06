import { Link, Stack } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { Container } from "@/components/container";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <Container>
        <View className="flex-1 justify-center items-center p-4">
          <View className="items-center p-6 max-w-sm rounded-lg bg-muted/10 border border-muted/20">
            <Text className="text-4xl mb-3">🤔</Text>
            <Text className="text-foreground font-medium text-lg mb-1">Page Not Found</Text>
            <Text className="text-muted text-sm text-center mb-4">
              The page you're looking for doesn't exist.
            </Text>
            <Link href="/" asChild>
              <Pressable className="bg-foreground px-4 py-2 rounded-md active:opacity-80">
                <Text className="text-background font-medium">Go Home</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </Container>
    </>
  );
}