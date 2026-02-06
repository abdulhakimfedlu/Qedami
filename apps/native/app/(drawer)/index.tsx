import React from "react";
import { Text, View, ScrollView } from "react-native";
import { Container } from "@/components/container";
import { SearchInput } from "@/components/SearchInput";
import { SuggestionsChips } from "@/components/SuggestionsChips";
import { useLocationSync } from "@/hooks/useLocationSync";

export default function Home() {
  const { userLocation, locationPermission } = useLocationSync();

  return (
    <Container className="flex-1">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="py-6 mb-6">
          <Text className="text-3xl font-bold text-gray-900 tracking-tight">
            Qedami Scout
          </Text>
          <Text className="text-gray-600 text-base mt-2">
            Find government services and document requirements
          </Text>
        </View>

        {/* Search Input */}
        <SearchInput placeholder="Search for services like 'Birth Certificate'..." />

        {/* Location Status */}
        {locationPermission === 'granted' && userLocation && (
          <View className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <Text className="text-sm text-green-800">
              📍 Location enabled - showing nearby results
            </Text>
          </View>
        )}

        {/* Suggestions */}
        <SuggestionsChips />

        {/* Quick Info */}
        <View className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Text className="text-lg font-semibold text-blue-900 mb-2">
            How it works
          </Text>
          <Text className="text-blue-800 text-sm leading-5">
            Search for any government service to find exact document requirements, 
            office locations, and operating hours. Get personalized results based on your location.
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}