import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AuthContainer } from '@/components/AuthContainer';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUp() {
    const { signUp, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) return;
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        try {
            await signUp(email, password);
            // Navigation provided by AuthContext
        } catch (error) {
            // Error handled by AuthContext
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
            title="Create Account"
            subtitle="Sign up to get started">
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
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View className="gap-2">
                    <Text className="text-sm font-medium text-gray-700">Confirm Password</Text>
                    <TextInput
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
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
                    onPress={handleSignUp}
                    disabled={isSubmitting}>
                    <Text className="text-base font-bold text-white">
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </Text>
                </Pressable>

                <View className="flex-row justify-center gap-1 py-4">
                    <Text className="text-gray-500">Already have an account?</Text>
                    <Link href="/sign-in" asChild>
                        <Pressable>
                            <Text className="font-bold text-black">Sign In</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </AuthContainer>
    );
}
