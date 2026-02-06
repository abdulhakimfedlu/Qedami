import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SearchResult } from '../store/servicesState';

interface ResultCardProps {
    result: SearchResult;
    onPress: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onPress }) => {
    const { office, matchedService, proximity } = result;

    const getDistanceColor = (category?: string) => {
        switch (category) {
            case 'nearby': return 'text-green-600';
            case 'moderate': return 'text-yellow-600';
            case 'distant': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getDistanceText = (proximity?: { distanceKm: number; category: string }) => {
        if (!proximity) return null;

        const { distanceKm, category } = proximity;
        const distance = distanceKm < 1
            ? `${Math.round(distanceKm * 1000)}m`
            : `${distanceKm.toFixed(1)}km`;

        return `${distance} • ${category}`;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
        >
            {/* Service Name */}
            <Text className="text-lg font-semibold text-gray-900 mb-1">
                {matchedService.name.en}
            </Text>

            {/* Office Name and Type */}
            <View className="flex-row items-center mb-2">
                <Text className="text-base text-gray-700 font-medium">
                    {office.name}
                </Text>
                <View className="bg-blue-100 px-2 py-1 rounded-md ml-2">
                    <Text className="text-xs text-blue-700 font-medium">
                        {office.type}
                    </Text>
                </View>
            </View>

            {/* Location */}
            <View className="flex-row items-center mb-2">
                <Text className="text-gray-500 text-sm mr-2">📍</Text>
                <Text className="text-sm text-gray-600">
                    {office.address.subcity}
                    {office.address.kebeleNumber && `, Kebele ${office.address.kebeleNumber}`}
                    {office.address.landmark && ` • ${office.address.landmark}`}
                </Text>
            </View>

            {/* Distance and Availability */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    {proximity && (
                        <Text className={`text-sm font-medium ${getDistanceColor(proximity.category)}`}>
                            {getDistanceText(proximity)}
                        </Text>
                    )}
                </View>

                <View className="flex-row items-center">
                    {matchedService.isAvailable ? (
                        <>
                            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            <Text className="text-sm text-green-600 font-medium">Available</Text>
                        </>
                    ) : (
                        <>
                            <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                            <Text className="text-sm text-red-600 font-medium">Unavailable</Text>
                        </>
                    )}
                </View>
            </View>

            {/* Operational Notes */}
            {matchedService.operationalNotes?.en && (
                <View className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Text className="text-sm text-yellow-800">
                        💡 {matchedService.operationalNotes.en}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};