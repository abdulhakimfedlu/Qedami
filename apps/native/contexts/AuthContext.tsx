import { router, useRootNavigationState, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = 'http://10.1.41.94:8081/api/v1';

type User = {
    email: string;
    id: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// SecureStore wrapper for web compatibility
const saveItem = async (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

const getItem = async (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

const deleteItem = async (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};

function useProtectedRoute(user: User | null, isLoading: boolean) {
    const segments = useSegments();
    const rootNavigationState = useRootNavigationState();

    useEffect(() => {
        if (!rootNavigationState?.key || isLoading) return;

        const inAuthGroup = segments[0] === 'sign-in' || segments[0] === 'sign-up';

        if (!user && !inAuthGroup) {
            setTimeout(() => {
                router.replace('/sign-in');
            }, 0);
        } else if (user && inAuthGroup) {
            setTimeout(() => {
                router.replace('/');
            }, 0);
        }
    }, [user, segments, rootNavigationState, isLoading]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await getItem('auth_token');
                const userData = await getItem('user_data');
                if (token && userData) {
                    setUser(JSON.parse(userData));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Failed to load user', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    useProtectedRoute(user, isLoading);

    const signIn = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
            const { token, user } = response.data;

            await saveItem('auth_token', token);
            await saveItem('user_data', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
        } catch (error: any) {
            console.error("Sign In error:", error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
            const { token, user } = response.data;

            await saveItem('auth_token', token);
            await saveItem('user_data', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
        } catch (error: any) {
            console.error("Sign Up error:", error);
            throw error;
        }
    };

    const signOut = async () => {
        await deleteItem('auth_token');
        await deleteItem('user_data');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signUp,
                signOut,
                user,
                isAuthenticated: !!user,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
