import { View, Text } from 'react-native';
import { Avatar, Switch, Button, Tabs } from 'heroui-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useAppTheme } from '@/contexts/app-theme-context';

interface MenuSheetProps {
  onClose?: () => void;
}

export function MenuSheet({ onClose }: MenuSheetProps) {
  const { isLight, toggleTheme } = useAppTheme();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(true);
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>(isLight ? 'light' : 'dark');

  // Check location permission status on mount
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const status = await Location.getForegroundPermissionsAsync();
        setLocationEnabled(status.granted);
      } catch (error) {
        console.error('Error checking location permission:', error);
      } finally {
        setIsCheckingLocation(false);
      }
    };
    checkLocationPermission();
  }, []);

  // Request location permission
  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      try {
        const status = await Location.requestForegroundPermissionsAsync();
        setLocationEnabled(status.granted);
      } catch (error) {
        console.error('Error requesting location permission:', error);
        setLocationEnabled(false);
      }
    } else {
      setLocationEnabled(false);
    }
  };

  return (
    <View className="gap-4 px-4 py-3">
      {/* Profile Section */}
      <View className="gap-3">
        <View className="flex-row gap-4 items-center">
          <Avatar size="lg" color="accent" alt="User avatar">
            <Avatar.Fallback>JD</Avatar.Fallback>
          </Avatar>
          <View className="flex-1">
            <Text className={`${isLight ? 'text-foreground' : 'text-white'} text-base font-bold`}>
              John Doe
            </Text>
            <Text className={`${isLight ? 'text-muted' : 'text-white/60'} text-xs tracking-wide`}>
              john@example.com
            </Text>
          </View>
        </View>

        {/* Profile Actions */}
        <View className="flex-row gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 rounded-lg"
            onPress={() => {
              // TODO: Navigate to profile
              onClose?.();
            }}
          >
            <Text className={`${isLight ? 'text-foreground' : 'text-white'} text-xs font-medium`}>
              View Profile
            </Text>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 rounded-lg"
            onPress={() => {
              // TODO: Edit profile
              onClose?.();
            }}
          >
            <Text className={`${isLight ? 'text-foreground' : 'text-white'} text-xs font-medium`}>
              Edit
            </Text>
          </Button>
        </View>
      </View>

      {/* Divider */}
      <View className={`h-px ${isLight ? 'bg-border' : 'bg-white/10'}`} />

      {/* Settings Section */}
      <View className="gap-3">
        <Text className={`${isLight ? 'text-foreground' : 'text-white'} text-xs font-semibold uppercase tracking-widest opacity-60`}>
          Preferences
        </Text>

        {/* Location Services Toggle */}
        <View className="flex-row gap-3 items-center justify-between">
          <View className="flex-1">
            <Text className={`${isLight ? 'text-foreground' : 'text-white'} text-sm font-medium`}>
              Location Services
            </Text>
            <Text className={`${isLight ? 'text-muted' : 'text-white/50'} text-xs mt-0.5`}>
              {locationEnabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
          <Switch
            isSelected={locationEnabled}
            onSelectedChange={handleLocationToggle}
            isDisabled={isCheckingLocation}
            className="w-12 h-7"
          />
        </View>

        {/* Theme Selector */}
        <View className="gap-2">
          <Text className={`${isLight ? 'text-foreground' : 'text-white'} text-sm font-medium`}>
            Appearance
          </Text>
          <Tabs
            value={theme}
            onValueChange={(value) => {
              setTheme(value as 'light' | 'dark');
              toggleTheme();
            }}
            variant="pill"
            className="w-full"
          >
            <Tabs.List className="w-full">
              <Tabs.Indicator />
              <Tabs.Trigger value="light" className="flex-1">
                <Tabs.Label>Light</Tabs.Label>
              </Tabs.Trigger>
              <Tabs.Trigger value="dark" className="flex-1">
                <Tabs.Label>Dark</Tabs.Label>
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </View>

        {/* Language Selector */}
        <View className="gap-2">
          <Text className={`${isLight ? 'text-foreground' : 'text-white'} text-sm font-medium`}>
            Language
          </Text>
          <Tabs
            value={language}
            onValueChange={(value) => setLanguage(value as 'en' | 'am')}
            variant="pill"
            className="w-full"
          >
            <Tabs.List className="w-full">
              <Tabs.Indicator />
              <Tabs.Trigger value="en" className="flex-1">
                <Tabs.Label>English</Tabs.Label>
              </Tabs.Trigger>
              <Tabs.Trigger value="am" className="flex-1">
                <Tabs.Label>አማርኛ</Tabs.Label>
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </View>
      </View>

      {/* Divider */}
      <View className={`h-px ${isLight ? 'bg-border' : 'bg-white/10'}`} />

      {/* Quick Links Section */}
      <View className="gap-2">
        <Button
          variant="ghost"
          className="justify-start rounded-lg"
          onPress={() => {
            // TODO: Navigate to help
            onClose?.();
          }}
        >
          <Text className={`${isLight ? 'text-foreground' : 'text-white'} text-sm`}>Help & Support</Text>
        </Button>
        <Button
          variant="ghost"
          className="justify-start rounded-lg"
          onPress={() => {
            // TODO: Navigate to feedback
            onClose?.();
          }}
        >
          <Text className={`${isLight ? 'text-foreground' : 'text-white'} text-sm`}>Send Feedback</Text>
        </Button>
      </View>

      {/* Divider */}
      <View className={`h-px ${isLight ? 'bg-border' : 'bg-white/10'}`} />

      {/* API Health Indicator */}
      <View className="flex-row gap-2 items-center justify-center py-1">
        <View className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <Text className={`${isLight ? 'text-muted' : 'text-white/50'} text-xs`}>API Connected</Text>
      </View>
    </View>
  );
}
