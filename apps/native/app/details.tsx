import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Container } from "@/components/container";

// UI Components
import { Text as UIText } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";

// Components
import { DetailsSheetContent } from "@/components/ui/templates/details-sheet";

// Icons
import { ArrowLeft } from "lucide-react-native";

// Constants
const COLORS = {
  background: "#FFFFFF",
  primary: "#000000",
  pastelGreenLight: "#B8E6D4",
};

// Header Component
function DetailsHeader({ officeName }: { officeName: string }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Icon as={ArrowLeft} style={styles.backIcon} />
      </Pressable>
      <View style={styles.headerTitleContainer}>
        <UIText style={styles.headerTitle} numberOfLines={1}>
          {officeName}
        </UIText>
      </View>
      <View style={styles.headerRight} />
    </View>
  );
}

export default function DetailsPage() {
  const params = useLocalSearchParams();
  const officeId = (params.id as string) || "1";
  const officeName = (params.name as string) || "Office";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
      <Container style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <DetailsHeader officeName={officeName} />
        <DetailsSheetContent officeId={officeId} officeName={officeName} />
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.pastelGreenLight,
  },
  backIcon: {
    width: 20,
    height: 20,
    color: COLORS.primary,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  headerRight: {
    width: 40,
  },
});