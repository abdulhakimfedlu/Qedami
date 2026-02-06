import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, TextInput, Dimensions } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Container } from "@/components/container";

// UI Components
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "@/components/ui/molecules/search-bar/SearchBar";

// Icons
import { Menu, Search, MapPin } from "lucide-react-native";

// Constants
const COLORS = {
  background: "#FFFFFF",
  primary: "#000000",
  secondary: "#333333",
  muted: "#666666",
  pastelGreen: "#98D4BB",
  pastelGreenLight: "#B8E6D4",
  pastelGreenDark: "#7BC4A8",
};

// Suggestion chips data
const SUGGESTIONS = [
  "Passport",
  "Driver's License",
  "Birth Certificate",
  "Tax ID",
  "Marriage Certificate",
  "Business License",
];

// Featured/Recent items
const FEATURED_ITEMS = [
  { id: 1, title: "Passport Application", subtitle: "Ministry of Interior", icon: "document" },
  { id: 2, title: "Driver's License Renewal", subtitle: "Transport Authority", icon: "car" },
  { id: 3, title: "Tax Registration", subtitle: "Revenue Authority", icon: "receipt" },
];

function Header() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => {
          // Open drawer/menu
          console.log("Menu pressed");
        }}
        style={styles.menuButton}
      >
        <Icon as={Menu} style={styles.icon} />
      </Pressable>

      <View style={styles.headerRight}>
        <Pressable
          onPress={() => {
            // Notification action
            console.log("Notifications pressed");
          }}
          style={styles.iconButton}
        >
          <Icon as={MapPin} style={[styles.icon, { color: COLORS.pastelGreen }]} />
        </Pressable>
        <Avatar alt="User avatar" style={styles.avatar}>
          <AvatarFallback>
            <Text style={styles.avatarText}>JD</Text>
          </AvatarFallback>
        </Avatar>
      </View>
    </View>
  );
}

function HomeContent() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim().length > 2) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleFeaturedPress = (item: typeof FEATURED_ITEMS[0]) => {
    // Navigate to details using push for bottom sheet stack
    router.push({
      pathname: "/details",
      params: { id: item.id },
    });
  };

  return (
    <Container style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />

        <View style={styles.mainContent}>
          <Text style={styles.welcomeText}>Find Government Services</Text>
          <Text style={styles.subtitleText}>
            Search for services, offices, and document requirements
          </Text>

          <View style={styles.searchContainer}>
            <SearchBar 
              placeholder="Search services..." 
              onSearch={handleSearch}
              centerWhenUnfocused={false}
              containerWidth={Dimensions.get("window").width - 40}
            />
          </View>

          <SuggestionChips onSelect={handleSuggestionSelect} />

          <FeaturedSection onItemPress={handleFeaturedPress} />
        </View>
      </ScrollView>
    </Container>
  );
}

export default function HomePage() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
      <HomeContent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.pastelGreenLight,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  icon: {
    width: 24,
    height: 24,
    color: COLORS.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: COLORS.pastelGreen,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  // Welcome text
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 24,
    lineHeight: 20,
  },
  // Search bar
  searchContainer: {
    marginBottom: 24,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  searchIcon: {
    width: 20,
    height: 20,
    color: COLORS.muted,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.primary,
    paddingVertical: 0,
  },
  // Suggestions
  suggestionsContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 12,
  },
  chipsContent: {
    gap: 10,
    paddingRight: 20,
  },
  chip: {
    backgroundColor: COLORS.pastelGreenLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  chipFirst: {
    backgroundColor: COLORS.pastelGreen,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },
  // Featured section
  featuredContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.pastelGreenDark,
  },
  featuredGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featuredCard: {
    width: "47%",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  featuredIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.pastelGreenLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featuredCardIcon: {
    width: 22,
    height: 22,
    color: COLORS.pastelGreenDark,
  },
  featuredCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
  },
  featuredCardSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
  },
});
