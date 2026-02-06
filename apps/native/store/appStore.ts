import { create } from 'zustand';

export interface UserLocation {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface AppState {
  // Location
  userLocation: UserLocation | null;
  locationPermission: 'undetermined' | 'granted' | 'denied';
  
  // UI State
  drawerOpen: boolean;
  
  // Actions
  setLocation: (location: UserLocation | null) => void;
  setLocationPermission: (status: 'undetermined' | 'granted' | 'denied') => void;
  setDrawerOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Location
  userLocation: null,
  locationPermission: 'undetermined',
  
  // UI State
  drawerOpen: false,
  
  // Actions
  setLocation: (location) => set({ userLocation: location }),
  setLocationPermission: (status) => set({ locationPermission: status }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
}));