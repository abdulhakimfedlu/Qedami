import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { ServiceCardData } from "@/types/scout-types";

interface ServiceResultCardProps extends ServiceCardData {
    onClick?: () => void;
}

export function ServiceResultCard({
    serviceName,
    description,
    category,
    documentsRequired,
    officeLocation,
    distance,
    onClick,
}: ServiceResultCardProps) {
    return (
        <Pressable
            onPress={onClick}
            className="bg-card border border-border rounded-lg p-4 active:opacity-80 transition-opacity"
        >
            {/* Header with icon and category */}
            <View className="flex-row items-start justify-between mb-2">
                <View className="flex-row items-center gap-2 flex-1">
                    <View className="w-10 h-10 rounded-lg bg-accent/10 items-center justify-center">
                        <Ionicons name="document-text" size={20} color="#10B981" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground leading-tight">
                            {serviceName}
                        </Text>
                    </View>
                </View>
                <View className="bg-accent/10 px-2 py-1 rounded-md ml-2">
                    <Text className="text-xs font-medium text-accent">{category}</Text>
                </View>
            </View>

            {/* Description */}
            <Text
                className="text-sm text-muted-foreground leading-relaxed mb-3"
                numberOfLines={2}
            >
                {description}
            </Text>

            {/* Footer info */}
            <View className="flex-row items-center justify-between pt-3 border-t border-border">
                <View className="flex-row items-center gap-4">
                    {/* Documents required */}
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="document-text-outline" size={14} color="#6B7280" />
                        <Text className="text-xs text-muted-foreground">
                            {documentsRequired} docs
                        </Text>
                    </View>

                    {/* Location */}
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                        <Text className="text-xs text-muted-foreground">
                            {officeLocation} · {distance}
                        </Text>
                    </View>
                </View>

                {/* Chevron */}
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </View>
        </Pressable>
    );
}
