import { useEffect } from 'react';
import * as Location from 'expo-location';
import { AppState } from 'react-native';
import { useAppStore } from '../store/appStore';

const LOCATION_STALE_TIME = 10 * 60 * 1000; // 10 minutes
const ADDIS_ABABA_CENTER = { lat: 9.0100, lng: 38.7635 }; // Fallback location

export const useLocationSync = () => {
  const { 
    userLocation, 
    locationPermission, 
    setLocation, 
    setLocationPermission 
  } = useAppStore();

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted' ? 'granted' : 'denied');
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission('denied');
      return false;
    }
  };

  const syncLocation = async (force = false) => {
    if (locationPermission !== 'granted') {
      return;
    }

    try {
      // Check if we have recent location data
      if (!force && userLocation) {
        const isStale = Date.now() - userLocation.timestamp > LOCATION_STALE_TIME;
        if (!isStale) {
          return; // Location is still fresh
        }
      }

      // Try to get last known position first (instant)
      const lastKnown = await Location.getLastKnownPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (lastKnown) {
        setLocation({
          lat: lastKnown.coords.latitude,
          lng: lastKnown.coords.longitude,
          timestamp: Date.now(),
        });
      }

      // Then get current position for precision (may take time)
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (current) {
        setLocation({
          lat: current.coords.latitude,
          lng: current.coords.longitude,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error syncing location:', error);
      // Set fallback location if we don't have any location data
      if (!userLocation) {
        setLocation({
          ...ADDIS_ABABA_CENTER,
          timestamp: Date.now(),
        });
      }
    }
  };

  // Initialize location on mount
  useEffect(() => {
    const initializeLocation = async () => {
      if (locationPermission === 'undetermined') {
        // Don't request permission automatically - wait for user intent
        return;
      }
      
      if (locationPermission === 'granted') {
        await syncLocation();
      }
    };

    initializeLocation();
  }, [locationPermission]);

  // Listen for app state changes to refresh location
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && locationPermission === 'granted') {
        // Refresh location when app becomes active
        syncLocation();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [locationPermission]);

  return {
    userLocation,
    locationPermission,
    requestLocationPermission,
    syncLocation,
  };
};