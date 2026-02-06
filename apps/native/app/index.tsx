import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/base/button";

export default function OnboardingPage() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <Image
        source={require("@/assets/images/onboarding-bg.png")}
        style={styles.backgroundImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View className="mb-12">
          <Text className="text-white text-5xl font-bold text-center tracking-tighter">
            Qedami
          </Text>
          <Text className="text-white/60 text-lg text-center mt-2">
            Experience the future of UI
          </Text>
        </View>

        <View style={styles.footer}>
          <Link href="/home" asChild>
            <Button
              width={280}
              height={64}
              backgroundColor="#fff"
            >
              <Text className="text-black font-bold text-lg">Get Started</Text>
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center",
  },
});
