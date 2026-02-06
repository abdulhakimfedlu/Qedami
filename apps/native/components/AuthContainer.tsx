import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';

export function AuthContainer({
    children,
    title,
    subtitle,
}: {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}) {
    const insets = useSafeAreaInsets();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: insets.top + 40,
                    paddingBottom: insets.bottom + 20,
                    paddingHorizontal: 24,
                }}>
                <View className="mb-8">
                    <Text className="text-3xl font-bold text-black mb-2">{title}</Text>
                    {subtitle && (
                        <Text className="text-base text-gray-500">{subtitle}</Text>
                    )}
                </View>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
