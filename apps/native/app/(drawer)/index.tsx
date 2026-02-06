import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Container } from "@/components/container";
import { SearchInput } from "@/components/SearchInput";
import { SuggestionsChips } from "@/components/SuggestionsChips";
import { useLocationSync } from "@/hooks/useLocationSync";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { userLocation, locationPermission } = useLocationSync();
  const { signOut } = useAuth();

  return (
    <Container className="flex-1">
      <ScrollView className="flex-1 p-4">
        <View className="py-6 mb-6">
          <Text className="text-3xl font-bold text-gray-900 tracking-tight">
            Qedami Scout
          </Text>
          <Text className="text-gray-600 text-base mt-2">
            Find government services and document requirements
          </Text>
          <TouchableOpacity
            onPress={signOut}
            className="mt-4 self-start bg-red-100 px-4 py-2 rounded-lg border border-red-200"
          >
            <Text className="text-red-700 font-medium">Log Out</Text>
          </TouchableOpacity>
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
    </Container >
  );
}