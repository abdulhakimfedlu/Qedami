import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AuthContainer } from '@/components/AuthContainer';
import { useAuth } from '@/contexts/AuthContext';

export default function SignIn() {
    const { signIn, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            await signIn(email, password);
            // Navigation provided by AuthContext
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to sign in. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <AuthContainer
            title="Welcome Back"
            subtitle="Sign in to continue to Qedami">
            <View className="gap-4">
                <View className="gap-2">
                    <Text className="text-sm font-medium text-gray-700">Email</Text>
                    <TextInput
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View className="gap-2">
                    <Text className="text-sm font-medium text-gray-700">Password</Text>
                    <TextInput
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {error && (
                    <View className="mb-2 rounded-lg bg-red-50 p-3">
                        <Text className="text-center text-sm text-red-600 font-medium">
                            {error}
                        </Text>
                    </View>
                )}

                <Pressable
                    className={`mt-4 w-full items-center justify-center rounded-xl bg-black p-4 active:opacity-80 ${isSubmitting ? 'opacity-50' : ''}`}
                    onPress={handleSignIn}
                    disabled={isSubmitting}>
                    <Text className="text-base font-bold text-white">
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Text>
                </Pressable>

                <View className="flex-row justify-center gap-1 py-4">
                    <Text className="text-gray-500">Don't have an account?</Text>
                    <Link href="/sign-up" asChild>
                        <Pressable>
                            <Text className="font-bold text-black">Sign Up</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </AuthContainer>
    );
}
