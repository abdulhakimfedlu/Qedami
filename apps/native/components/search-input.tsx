import { View, Keyboard, useColorScheme } from 'react-native';
import { TextField, useThemeColor } from 'heroui-native';
import { useCallback, useMemo, useRef } from 'react';
import { useDebounce } from 'use-debounce';

interface SearchInputProps {
  onSubmit: (query: string) => void;
  onFocus?: () => void;
}

export function SearchInput({ onSubmit, onFocus }: SearchInputProps) {
  const [searchInput, setSearchInput] = useDebounce('', 300);
  const inputRef = useRef(null);
  const colorScheme = useColorScheme();
  const successColor = useThemeColor('success');
  const placeholderColor = useThemeColor('field-placeholder');
  const backgroundColor = useThemeColor('surface');
  const foregroundColor = useThemeColor('foreground');

  // Trigger navigation on debounced value change
  const handleDebouncedSearch = useCallback(() => {
    if (searchInput.trim().length > 0) {
      onSubmit(searchInput);
    }
  }, [searchInput, onSubmit]);

  // Watch debounced value
  useMemo(() => {
    handleDebouncedSearch();
  }, [searchInput, handleDebouncedSearch]);

  const handleBlur = () => {
    Keyboard.dismiss();
  };

  return (
    <View className="px-4">
      <TextField>
        <TextField.Input
          ref={inputRef}
          placeholder="Search services or offices..."
          onChangeText={(text) => setSearchInput(text)}
          placeholderTextColor={placeholderColor}
          cursorColor={successColor}
          style={{
            color: foregroundColor,
            paddingLeft: 28,
            paddingRight: 24,
            backgroundColor: backgroundColor,
          }}
          className="w-full py-4 text-lg rounded-full shadow-2xl"
          selectionColorClassName="accent-accent"
          placeholderColorClassName="field-placeholder"
          autoCapitalize="none"
          onFocus={onFocus}
          onBlur={handleBlur}
        />
      </TextField>
    </View>
  );
}
