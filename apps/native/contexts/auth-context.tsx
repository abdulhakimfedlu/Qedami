import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://192.168.1.4:8081';

interface User {
  _id: string;
  name: string;
  email: string;
  profile: {
    preferredLanguage: 'en' | 'am';
    savedLocation?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  searchHistory: Array<{
    query: string;
    timestamp: string;
  }>;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'qedami_auth_token';
const USER_KEY = 'qedami_user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid
        try {
          const response = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          if (response.data.success) {
            setUser(response.data.data.user);
          } else {
            // Token is invalid, clear stored data
            await clearStoredAuth();
          }
        } catch (error) {
          // Token verification failed, clear stored data
          await clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuth = async (token: string, user: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, token),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
      ]);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  };

  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/signup`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        await storeAuth(token, user);
      } else {
        throw new Error(response.data.error?.message || 'Sign up failed');
      }
    } catch (error: any) {
      if (error.response?.data?.error?.code === 'USER_EXISTS') {
        throw new Error('User already exists with this email');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create account');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/signin`, {
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        await storeAuth(token, user);
      } else {
        throw new Error(response.data.error?.message || 'Sign in failed');
      }
    } catch (error: any) {
      if (error.response?.data?.error?.code === 'INVALID_CREDENTIALS') {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to sign in');
    }
  };

  const signOut = async () => {
    try {
      // Call server to log out (optional, for tracking)
      if (token) {
        await axios.post(`${API_BASE_URL}/api/v1/auth/signout`);
      }
    } catch (error) {
      // Don't throw error if server call fails, still clear local data
      console.error('Error calling server signout:', error);
    } finally {
      await clearStoredAuth();
    }
  };

  const signInWithGoogle = async () => {
    // For now, this is a placeholder
    // In a real implementation, you'd integrate with Google Sign-In
    throw new Error('Google Sign-In not implemented yet');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}