import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { Container } from '@/components/container';
import { SearchInput } from '@/components/SearchInput';
import { ResultCard } from '@/components/ResultCard';
import { useSearch } from '@/hooks/useSearch';
import { useLocationSync } from '@/hooks/useLocationSync';

const SearchScreen = observer(() => {
  const { q, category, nearby } = useLocalSearchParams<{
    q?: string;
    category?: string;
    nearby?: string;
  }>();

  const router = useRouter();
  const { searchServices, searchState } = useSearch();
  const { requestLocationPermission, locationPermission } = useLocationSync();
  const [initialQuery, setInitialQuery] = useState(q || '');

  useEffect(() => {
    if (nearby === 'true' && locationPermission === 'undetermined') {
      handleLocationRequest();
    } else if (q) {
      searchServices(q);
    }
  }, [q, nearby, locationPermission]);

  const handleLocationRequest = async () => {
    const granted = await requestLocationPermission();
    if (granted && q) {
      // Re-search with location
      searchServices(q);
    }
  };

  const handleSearch = (query: string) => {
    if (query !== searchState.query.get()) {
      searchServices(query);
    }
  };

  const handleResultPress = (result: any) => {
    // TODO: Open bottom sheet with office details
    console.log('Selected result:', result);
  };

  return (
    <Container className="flex-1">
      {/* Header */}
      <View className="flex-row items-center p-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2">
          <Text className="text-gray-700 text-xl">←</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <SearchInput
            placeholder="Search for services..."
            onSearch={handleSearch}
            autoFocus={!q}
          />
        </View>
      </View>

      {/* Location Permission Request */}
      {locationPermission === 'undetermined' && (
        <View className="mx-4 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Text className="text-blue-900 font-medium mb-2">
            Enable location for better results
          </Text>
          <Text className="text-blue-800 text-sm mb-3">
            Get personalized results based on your location and find nearby offices.
          </Text>
          <TouchableOpacity
            onPress={handleLocationRequest}
            className="bg-blue-600 rounded-lg py-2 px-4 self-start"
          >
            <Text className="text-white font-medium">Enable Location</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      <ScrollView className="flex-1 px-4">
        {searchState.loading.get() && (
          <View className="flex-1 justify-center items-center py-12">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-600 mt-4">Searching...</Text>
          </View>
        )}

        {searchState.error.get() && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-red-800 font-medium">Search Error</Text>
            <Text className="text-red-700 text-sm mt-1">
              {searchState.error.get()}
            </Text>
          </View>
        )}

        {!searchState.loading.get() && searchState.results.get().length === 0 && searchState.query.get() && (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </Text>
            <Text className="text-gray-600 text-center">
              Try searching for different terms like "birth certificate" or "passport"
            </Text>
          </View>
        )}

        {searchState.results.get().map((result, index) => (
          <ResultCard
            key={`${result.office._id}-${result.matchedService._id}-${index}`}
            result={result}
            onPress={() => handleResultPress(result)}
            onDetailPress={() => {
              router.push({
                pathname: '/detail',
                params: {
                  officeId: result.office._id,
                  serviceId: result.matchedService._id
                }
              });
            }}
          />
        ))}

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </Container>
  );
});

export default SearchScreen;