import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useDebounce } from 'use-debounce';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search for services...",
  onSearch,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const router = useRouter();

  React.useEffect(() => {
    if (debouncedQuery && onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
      <Text className="text-gray-500 text-lg mr-3">🔍</Text>
      
      <TextInput
        className="flex-1 text-base text-gray-900"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      {query.length > 0 && (
        <TouchableOpacity onPress={clearSearch} className="ml-2">
          <Text className="text-gray-500 text-lg">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};