import { useCallback } from 'react';
import { apiClient } from '../api/client';
import { servicesState, SearchResult } from '../store/servicesState';
import { useAppStore } from '../store/appStore';

export const useSearch = () => {
  const { userLocation } = useAppStore();

  const searchServices = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      servicesState.results.set([]);
      return;
    }

    servicesState.loading.set(true);
    servicesState.error.set(null);
    servicesState.query.set(query);

    try {
      const params: any = {
        q: query,
        limit: 20,
      };

      // Add location if available
      if (userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
      }

      const response = await apiClient.get('/scout/search', { params });
      
      if (response.data.success) {
        servicesState.results.set(response.data.data || []);
      } else {
        servicesState.error.set('Search failed');
        servicesState.results.set([]);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      servicesState.error.set(error.response?.data?.error?.message || 'Network error');
      servicesState.results.set([]);
    } finally {
      servicesState.loading.set(false);
    }
  }, [userLocation]);

  const getSuggestions = useCallback(async () => {
    try {
      const params: any = { limit: 6 };
      
      if (userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
      }

      const response = await apiClient.get('/scout/suggestions', { params });
      
      if (response.data.success) {
        return response.data.data.suggestions || [];
      }
      return [];
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }, [userLocation]);

  return {
    searchServices,
    getSuggestions,
    searchState: servicesState,
  };
};