"use client";

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";

import { ServiceResultCard } from "@/components/scout/ServiceResultCard";
import { Container } from "@/components/container";
import { sampleServices } from "@/data/mock-scout-data";

export default function ScoutSearch() {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter services based on search query
    const filteredServices = sampleServices.filter(
        (service) =>
            service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container className="flex-1 bg-background">
            {/* Header */}
            <View className="px-5 pt-12 pb-6">
                <View className="max-w-[400px] mx-auto">
                    <View className="flex-row items-center gap-2 mb-1">
                        <View className="w-2 h-2 rounded-full bg-accent" />
                        <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Qedami
                        </Text>
                    </View>
                    <Text className="text-[22px] font-bold text-foreground tracking-tight">
                        Government Services
                    </Text>
                </View>
            </View>

            {/* Search */}
            <View className="px-5 pb-5">
                <View className="max-w-[400px] mx-auto">
                    <View className="relative">
                        <View className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                            <Ionicons name="search" size={16} color="#6B7280" />
                        </View>
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search services..."
                            placeholderTextColor="#9CA3AF"
                            className="w-full h-11 pl-10 pr-4 rounded-lg bg-card border border-border text-foreground text-sm"
                        />
                    </View>
                </View>
            </View>

            {/* Results header */}
            <View className="px-5 pb-3">
                <View className="max-w-[400px] mx-auto flex-row items-center justify-between">
                    <Text className="text-xs font-medium text-muted-foreground">
                        {filteredServices.length} services found
                    </Text>
                    <Text className="text-xs text-muted-foreground">Near you</Text>
                </View>
            </View>

            {/* Results */}
            <View className="px-5 pb-8 flex-1">
                <View className="max-w-[400px] mx-auto flex-1">
                    <FlatList
                        data={filteredServices}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ServiceResultCard
                                {...item}
                                onClick={() => console.log(`Clicked: ${item.serviceName}`)}
                            />
                        )}
                        ItemSeparatorComponent={() => <View className="h-2.5" />}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-12">
                                <Text className="text-muted-foreground text-sm">
                                    No services found
                                </Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </Container>
    );
}
