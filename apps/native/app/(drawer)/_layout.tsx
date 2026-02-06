import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useCallback } from "react";
import { Pressable, Text, TouchableOpacity, Alert } from "react-native";

import { ThemeToggle } from "@/components/theme-toggle";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/contexts/auth-context";

function DrawerLayout() {
  const { signOut, user } = useAuth();
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => signOut()
        }
      ]
    );
  };

  const renderSignOutButton = useCallback(() => (
    <TouchableOpacity onPress={handleSignOut} style={{ marginRight: 16 }}>
      <Ionicons name="log-out-outline" size={24} color={themeColorForeground} />
    </TouchableOpacity>
  ), [themeColorForeground]);

  return (
    <AuthGuard>
      <Drawer
        screenOptions={{
          headerTintColor: themeColorForeground,
          headerStyle: { backgroundColor: themeColorBackground },
          headerTitleStyle: {
            fontWeight: "600",
            color: themeColorForeground,
          },
          headerRight: renderSignOutButton,
          drawerStyle: { backgroundColor: themeColorBackground },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerTitle: `Welcome, ${user?.name || 'User'}`,
            drawerLabel: ({ color, focused }) => (
              <Text style={{ color: focused ? color : themeColorForeground }}>Home</Text>
            ),
            drawerIcon: ({ size, color, focused }) => (
              <Ionicons
                name="home-outline"
                size={size}
                color={focused ? color : themeColorForeground}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="(tabs)"
          options={{
            headerTitle: "Services",
            drawerLabel: ({ color, focused }) => (
              <Text style={{ color: focused ? color : themeColorForeground }}>Services</Text>
            ),
            drawerIcon: ({ size, color, focused }) => (
              <MaterialIcons
                name="border-bottom"
                size={size}
                color={focused ? color : themeColorForeground}
              />
            ),
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable className="mr-4">
                  <Ionicons name="add-outline" size={24} color={themeColorForeground} />
                </Pressable>
              </Link>
            ),
          }}
        />
      </Drawer>
    </AuthGuard>
  );
}

export default DrawerLayout;
