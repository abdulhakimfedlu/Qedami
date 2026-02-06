import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearch } from '../hooks/useSearch';
import { Suggestion } from '../types';

export const SuggestionsChips: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showAll, setShowAll] = useState(false);
  const { getSuggestions } = useSearch();
  const router = useRouter();

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const data = await getSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSuggestionPress = (suggestion: Suggestion) => {
    if (suggestion.type === 'service' && suggestion.serviceId) {
      router.push(`/search?q=${encodeURIComponent(suggestion.text.en)}`);
    } else if (suggestion.type === 'category' && suggestion.categoryId) {
      router.push(`/search?category=${suggestion.categoryId}`);
    } else if (suggestion.action === 'request_location') {
      // Handle location request
      router.push('/search?nearby=true');
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion.text.en)}`);
    }
  };

  const visibleSuggestions = showAll ? suggestions : suggestions.slice(0, 4);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View className="mt-6">
      <Text className="text-lg font-semibold text-gray-900 mb-3">
        Popular Services
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row space-x-3 px-1">
          {visibleSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSuggestionPress(suggestion)}
              className="bg-blue-50 border border-blue-200 rounded-full px-4 py-2"
            >
              <Text className="text-blue-700 font-medium">
                {suggestion.text.en}
              </Text>
            </TouchableOpacity>
          ))}
          
          {suggestions.length > 4 && !showAll && (
            <TouchableOpacity
              onPress={() => setShowAll(true)}
              className="bg-gray-100 border border-gray-200 rounded-full px-4 py-2"
            >
              <Text className="text-gray-600 font-medium">
                +{suggestions.length - 4} More
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      
      {showAll && suggestions.length > 4 && (
        <TouchableOpacity
          onPress={() => setShowAll(false)}
          className="self-center mt-2"
        >
          <Text className="text-blue-600 font-medium">Show Less</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};