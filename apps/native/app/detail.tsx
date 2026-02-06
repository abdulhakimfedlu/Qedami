import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Container } from '@/components/container';
import { apiClient } from '@/api/client';
import { Ionicons } from '@expo/vector-icons';

type LocalizedString = string | { en: string; am: string };

interface ChecklistItem {
    id: string;
    item: LocalizedString;
    description?: LocalizedString;
    source: 'base' | 'office';
    warning?: LocalizedString;
    condition?: LocalizedString;
}

interface ChecklistResponse {
    office: {
        name: string;
        type: string;
        phone?: string;
        openNow: boolean;
        todaysHours?: {
            open?: string;
            close?: string;
            isOpen: boolean;
            note?: string;
        };
    };
    service: {
        name: { en: string; am: string };
        processingNotes?: { en: string; am: string };
        fees?: { amount: number; currency: string; note?: string };
    };
    checklist: {
        required: ChecklistItem[];
        optional: ChecklistItem[];
    };
    officeSpecificNotes: Array<{ en: string; am: string }>;
    lastVerifiedAt: string;
}

// Helper to safely get string from potential localized object
const getLocaleString = (val: LocalizedString | undefined): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val.en || '';
};

export default function DetailScreen() {
    const { officeId, serviceId } = useLocalSearchParams<{ officeId: string; serviceId: string }>();
    const router = useRouter();
    const [data, setData] = useState<ChecklistResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (officeId && serviceId) {
            fetchDetails();
        }
    }, [officeId, serviceId]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get<any>(`/scout/checklist`, {
                params: { officeId, serviceId }
            });

            if (response.data?.success) {
                setData(response.data.data);
            } else {
                setError('Failed to load details');
            }
        } catch (err) {
            console.error('Fetch details error:', err);
            setError('An error occurred while loading details');
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneCall = () => {
        if (data?.office.phone) {
            Linking.openURL(`tel:${data.office.phone}`);
        }
    };

    if (loading) {
        return (
            <Container className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-600 mt-4">Loading details...</Text>
            </Container>
        );
    }

    if (error || !data) {
        return (
            <Container className="flex-1 p-4">
                <View className="bg-red-50 border border-red-200 rounded-xl p-6 items-center">
                    <Ionicons name="alert-circle" size={48} color="#DC2626" />
                    <Text className="text-red-800 font-bold text-lg mt-2">Error</Text>
                    <Text className="text-red-600 text-center mt-1">{error || 'Details not found'}</Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mt-6 bg-red-100 px-6 py-3 rounded-full"
                    >
                        <Text className="text-red-800 font-medium">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </Container>
        );
    }

    return (
        <Container className="flex-1">
            <View className="flex-row items-center p-4 border-b border-gray-100 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 flex-1" numberOfLines={1}>
                    Service Details
                </Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Service Header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        {getLocaleString(data.service.name)}
                    </Text>
                    <View className="flex-row items-center bg-blue-50 self-start px-3 py-1 rounded-full border border-blue-100">
                        <Ionicons name="location" size={16} color="#2563EB" />
                        <Text className="text-blue-700 font-medium ml-1">
                            {data.office.name}
                        </Text>
                    </View>
                </View>

                {/* Status Card */}
                <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className="text-sm text-gray-500 mb-1">Status</Text>
                            <View className="flex-row items-center">
                                <View className={`w-3 h-3 rounded-full mr-2 ${data.office.openNow ? 'bg-green-500' : 'bg-red-500'}`} />
                                <Text className={`font-medium ${data.office.openNow ? 'text-green-700' : 'text-red-700'}`}>
                                    {data.office.openNow ? 'Open Now' : 'Closed'}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text className="text-sm text-gray-500 mb-1">Hours Today</Text>
                            <Text className="font-medium text-gray-900">
                                {data.office.todaysHours?.isOpen
                                    ? `${data.office.todaysHours.open} - ${data.office.todaysHours.close}`
                                    : 'Closed today'}
                            </Text>
                        </View>
                    </View>

                    {data.office.phone && (
                        <TouchableOpacity
                            onPress={handlePhoneCall}
                            className="flex-row items-center justify-center bg-gray-50 py-3 rounded-lg border border-gray-200 mt-2"
                        >
                            <Ionicons name="call" size={20} color="#374151" />
                            <Text className="ml-2 font-medium text-gray-700">Call Office</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Requirements */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Requirements</Text>

                    {data.checklist.required.map((req) => (
                        <View key={req.id} className="flex-row mb-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3 mt-1">
                                <Text className="text-blue-600 font-bold">✓</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-medium text-base mb-1">{getLocaleString(req.item)}</Text>
                                {req.description && (
                                    <Text className="text-gray-500 text-sm leading-5">{getLocaleString(req.description)}</Text>
                                )}
                                {req.warning && (
                                    <View className="mt-2 flex-row items-start">
                                        <Ionicons name="warning" size={14} color="#D97706" style={{ marginTop: 2 }} />
                                        <Text className="text-amber-600 text-xs ml-1 flex-1">{getLocaleString(req.warning)}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}

                    {data.checklist.optional.length > 0 && (
                        <View className="mt-2">
                            <Text className="text-gray-500 font-medium mb-3 ml-1">Optional Items</Text>
                            {data.checklist.optional.map((opt) => (
                                <View key={opt.id} className="flex-row mb-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3 mt-1">
                                        <Text className="text-gray-500 font-bold">?</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-700 font-medium text-base mb-1">{getLocaleString(opt.item)}</Text>
                                        {opt.description && (
                                            <Text className="text-gray-500 text-sm leading-5">{getLocaleString(opt.description)}</Text>
                                        )}
                                        {opt.condition && (
                                            <Text className="text-gray-400 text-xs mt-1 italic">If: {getLocaleString(opt.condition)}</Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Fees */}
                {data.service.fees && (
                    <View className="mb-6 bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="card" size={24} color="#059669" />
                            <Text className="text-emerald-900 font-bold text-lg ml-2">Service Fee</Text>
                        </View>
                        <Text className="text-3xl font-bold text-emerald-700 my-1">
                            {data.service.fees.amount} {data.service.fees.currency}
                        </Text>
                        {data.service.fees.note && (
                            <Text className="text-emerald-800 text-sm mt-1">{data.service.fees.note}</Text>
                        )}
                    </View>
                )}

                {/* Notes */}
                {(data.officeSpecificNotes.length > 0 || data.service.processingNotes) && (
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-gray-900 mb-3">Important Notes</Text>

                        {data.service.processingNotes?.en && (
                            <View className="mb-3 flex-row items-start">
                                <Text className="text-blue-500 mr-2">•</Text>
                                <Text className="text-gray-600 leading-5 flex-1">{data.service.processingNotes.en}</Text>
                            </View>
                        )}

                        {data.officeSpecificNotes.map((note, idx) => (
                            <View key={idx} className="mb-3 flex-row items-start">
                                <Text className="text-blue-500 mr-2">•</Text>
                                <Text className="text-gray-600 leading-5 flex-1">{note.en}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <View className="h-8" />
            </ScrollView>
        </Container>
    );
}
