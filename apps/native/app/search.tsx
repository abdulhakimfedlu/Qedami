import React, { memo, useCallback } from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Container } from "@/components/container";

// UI Components
import { Text as UIText } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

// Reacticx
import { useBottomSheet } from "@/components/ui/templates/bottom-sheet-stack";
import BottomSheet from "@/components/ui/templates/bottom-sheet";
import { DetailsSheetContent } from "@/components/ui/templates/details-sheet";

// Icons
import { ArrowLeft, MapPin, ChevronRight } from "lucide-react-native";

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

// Mock data - In production, this would be fetched from the API with lat/lng
// Proximity is used as a ranking signal, not a filter, per Technical Spec.
const MOCK_SEARCH_RESULTS = [
  {
    id: 1,
    name: "Central Passport Office",
    type: "Passport Office",
    address: "123 Main Street, Downtown",
    matchedServices: ["Passport Application", "Passport Renewal", "ID Cards"],
  },
  {
    id: 2,
    name: "Ministry of Interior - Branch Office",
    type: "Government Office",
    address: "456 Government Plaza",
    matchedServices: ["ID Cards", "Residency Permits", "Background Checks"],
  },
  {
    id: 3,
    name: "Transport Authority - License Center",
    type: "Transport Office",
    address: "789 Transportation Ave",
    matchedServices: ["Driver's License", "Vehicle Registration", "Road Tax"],
  },
  {
    id: 4,
    name: "Revenue Authority Tax Office",
    type: "Tax Office",
    address: "321 Fiscal Street",
    matchedServices: ["Tax Registration", "Tax Filing", "Tax Clearance"],
  },
  {
    id: 5,
    name: "Civil Registry - Birth/Death Certificates",
    type: "Registry Office",
    address: "555 Vital Records Blvd",
    matchedServices: ["Birth Certificate", "Death Certificate", "Marriage Certificate"],
  },
  {
    id: 6,
    name: "Business Licensing Center",
    type: "Licensing Office",
    address: "888 Commerce Way",
    matchedServices: ["Business License", "Permit Applications", "Compliance"],
  },
];

interface SearchResult {
  id: number;
  name: string;
  type: string;
  address: string;
  matchedServices: string[];
}

// Memoized Result Item for Performance
const ResultItem = memo(({ item, onPress }: { item: SearchResult; onPress: (item: SearchResult) => void }) => {
  return (
    <Pressable 
      onPress={() => onPress(item)} 
      style={({ pressed }) => [styles.resultItem, pressed && styles.resultItemPressed]}
    >
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={styles.resultInfo}>
            <UIText style={styles.resultName}>{item.name}</UIText>
            <UIText style={styles.resultType}>{item.type}</UIText>
            <View style={styles.locationRow}>
              <Icon as={MapPin} style={styles.locationIcon} />
              <UIText style={styles.resultAddress}>{item.address}</UIText>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <Icon as={ChevronRight} style={styles.chevronIcon} />
          </View>
        </View>

        <View style={styles.servicesContainer}>
          {item.matchedServices.slice(0, 3).map((service, index) => (
            <View key={index} style={styles.serviceChip}>
              <UIText style={styles.serviceChipText}>{service}</UIText>
            </View>
          ))}
          {item.matchedServices.length > 3 && (
            <UIText style={styles.moreServices}>+{item.matchedServices.length - 3} more</UIText>
          )}
        </View>
      </Card>
    </Pressable>
  );
});

function SearchHeader({ query }: { query: string }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Icon as={ArrowLeft} style={styles.backIcon} />
      </Pressable>
      <View style={styles.headerTitleContainer}>
        <UIText style={styles.headerTitle}>Search Results</UIText>
        <UIText style={styles.headerSubtitle} numberOfLines={1}>"{query}"</UIText>
      </View>
    </View>
  );
}

export default function SearchPage() {
  const params = useLocalSearchParams();
  const query = (params.q as string) || "";
  const { present } = useBottomSheet();

  const handleResultPress = useCallback((item: SearchResult) => {
    present(
      <BottomSheet snapPoints={["90%", "100%"]}>
        <DetailsSheetContent officeId={item.id.toString()} officeName={item.name} />
      </BottomSheet>
    );
  }, [present]);

  const renderItem = useCallback(({ item }: { item: SearchResult }) => (
    <ResultItem item={item} onPress={handleResultPress} />
  ), [handleResultPress]);

  const keyExtractor = useCallback((item: SearchResult) => item.id.toString(), []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
      <Container style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SearchHeader query={query} />
        
        <FlatList
          data={MOCK_SEARCH_RESULTS}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.resultsListContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultsInfo}>
              <UIText style={styles.resultsCount}>{MOCK_SEARCH_RESULTS.length} results found</UIText>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon as={MapPin} style={styles.emptyIcon} />
              <UIText style={styles.emptyTitle}>No results found</UIText>
              <UIText style={styles.emptySubtitle}>Try a different search term</UIText>
            </View>
          }
          // Performance props for FlatList
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
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
    borderRadius: 12,
    backgroundColor: COLORS.pastelGreenLight,
    borderCurve: "continuous",
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
    fontWeight: "700",
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 2,
  },
  resultsInfo: {
    paddingHorizontal: 4,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.muted,
  },
  resultsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  resultItem: {
    marginBottom: 16,
  },
  resultItemPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  resultCard: {
    padding: 16,
    backgroundColor: "#FDFDFD",
    borderRadius: 20,
    borderCurve: "continuous",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  resultType: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.pastelGreenDark,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 14,
    height: 14,
    color: COLORS.muted,
    marginRight: 6,
  },
  resultAddress: {
    fontSize: 13,
    color: COLORS.muted,
    flex: 1,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronIcon: {
    width: 18,
    height: 18,
    color: COLORS.muted,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  serviceChip: {
    backgroundColor: COLORS.pastelGreenLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderCurve: "continuous",
  },
  serviceChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  moreServices: {
    fontSize: 11,
    color: COLORS.muted,
    alignSelf: "center",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    color: "#E0E0E0",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.muted,
  },
});