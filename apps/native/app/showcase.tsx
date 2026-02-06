import React, { useState } from "react";
import { View, ScrollView, Platform, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Container } from "@/components/container";

// RNR Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";

// Icons
import { MapPin, Search, Bell, Settings, Plus, ArrowRight, User, X } from "lucide-react-native";

// Color scheme
const COLORS = {
  background: "#FFFFFF",
  primary: "#000000",
  secondary: "#333333",
  muted: "#666666",
  pastelGreen: "#98D4BB",
  pastelGreenLight: "#B8E6D4",
  pastelGreenDark: "#7BC4A8",
  border: "#EEEEEE",
};

function ShowcaseContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigateToDetails = () => {
    router.push("/details");
  };

  return (
    <Container>
      <Stack.Screen options={{ 
        title: "Qedami Prototype", 
        headerShown: true,
        headerTransparent: true,
        headerShadowVisible: false,
        headerBackground: () => <View className="flex-1 bg-white" />,
      }} />
      
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text variant="h2" className="text-black font-bold text-3xl">Prototype v1</Text>
            <Text variant="muted" className="text-gray-500">Advanced UI Components</Text>
          </View>
          <Avatar alt="User avatar" className="size-12 border-2 border-gray-200">
            <AvatarImage source={{ uri: 'https://github.com/mrousavy.png' }} />
            <AvatarFallback><Text>JD</Text></AvatarFallback>
          </Avatar>
        </View>

        {/* Search Integration */}
        <View className="gap-2 mb-8">
          <Label nativeID="search-label" className="ml-1 text-gray-700 font-medium">Global Search</Label>
          <View className="flex-row gap-3">
            <View className="flex-1 relative justify-center">
               <Input 
                placeholder="Search locations..." 
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="pl-10 bg-gray-50 border-gray-200"
              />
              <View className="absolute left-3">
                <Icon as={Search} className="text-gray-400 size-4" />
              </View>
            </View>
            <Button size="icon" variant="secondary" className="bg-gray-50 border border-gray-200">
              <Icon as={Settings} className="text-gray-600 size-5" />
            </Button>
          </View>
        </View>

        <Separator className="mb-8 bg-gray-200" />

        {/* Feature Cards */}
        <View className="gap-6 mb-8">
           <Text variant="large" className="font-bold text-black text-xl">Active Modules</Text>
           
           <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-black text-lg">Details Page Stack</CardTitle>
              <CardDescription className="text-gray-500">Powered by Reacticx Headless Logic</CardDescription>
            </CardHeader>
            <CardContent>
              <Text variant="muted" className="text-gray-500 leading-relaxed">
                Experience Apple Maps style depth stacking with scaling and translation effects using the new details page stack navigation.
              </Text>
            </CardContent>
            <CardFooter>
              <Button onPress={handleNavigateToDetails} className="w-full flex-row gap-2 bg-black rounded-xl">
                <Icon as={ArrowRight} className="text-white size-4" />
                <Text className="text-white font-medium">View Details Page</Text>
              </Button>
            </CardFooter>
          </Card>

          <View className="flex-row gap-4">
            <Card className="flex-1 bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <Icon as={Bell} className="text-pastel-green mb-2 size-6" />
                <CardTitle className="text-black text-lg">Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="small" className="text-gray-500">12 new insights found today.</Text>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <Icon as={MapPin} className="text-pastel-green mb-2 size-6" />
                <CardTitle className="text-black text-lg">Scouts</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="small" className="text-gray-500">4 active field agents nearby.</Text>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Demo Content with Pastel Green */}
        <View className="gap-4 mb-8">
          <Text variant="large" className="font-bold text-black text-xl">UI Component Showcase</Text>
          
          <Card className="bg-pastel-green/20 border-pastel-green">
            <CardContent className="pt-6">
              <View className="flex-row items-center gap-4">
                <View className="bg-pastel-green p-3 rounded-full">
                  <Icon as={MapPin} className="text-black" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-black">Location Discovery</Text>
                  <Text variant="small" className="text-gray-600">Identify high-potential areas</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Button onPress={handleNavigateToDetails} className="w-full flex-row gap-2 bg-pastel-green rounded-xl">
            <Text className="text-black font-medium">Explore Details</Text>
            <Icon as={ArrowRight} className="text-black size-4" />
          </Button>
        </View>

        {/* Dialog Example */}
        <View className="mb-8">
           <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-gray-300 bg-white">
                <Text className="text-gray-700">System Configuration</Text>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-black">Update Preferences</DialogTitle>
                <DialogDescription className="text-gray-500">
                  Modify your real-time notification and data polling frequency.
                </DialogDescription>
              </DialogHeader>
              <View className="py-4 gap-4">
                <View className="gap-2">
                  <Label className="text-gray-700">Environment</Label>
                  <Input placeholder="Production" editable={false} className="bg-gray-50 border-gray-200" />
                </View>
              </View>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-black rounded-lg px-6" onPress={handleNavigateToDetails}>
                    <Text className="text-white font-medium">View in Details</Text>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </View>

      </ScrollView>
    </Container>
  );
}

export default function ShowcasePage() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ShowcaseContent />
    </SafeAreaView>
  );
}

const HEADER_HEIGHT = Platform.OS === "ios" ? 90 : 100;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: HEADER_HEIGHT,
    backgroundColor: COLORS.background,
  },
});
