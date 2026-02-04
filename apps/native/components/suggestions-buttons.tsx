import { View, Text } from 'react-native';
import { Button, useThemeColor } from 'heroui-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Baby01Icon,
  Compass01Icon,
  WeddingIcon,
  Airplane01Icon,
  SkullIcon,
  Certificate01Icon,
  File01Icon,
  Home01Icon,
  Mail01Icon,
  MapPinIcon,
} from '@hugeicons/core-free-icons';
import { useState, useCallback, memo, forwardRef, useImperativeHandle } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';
import type { IconSvgElement } from '@hugeicons/react-native';

interface Suggestion {
  id: number;
  label: string;
  query: string;
  icon: IconSvgElement;
  color: 'accent' | 'success' | 'warning' | 'danger' | 'default';
  iconColor: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: 1,
    label: 'Birth Certificate',
    query: 'birth certificate',
    icon: Baby01Icon,
    color: 'accent',
    iconColor: '#3B82F6',
  },
  {
    id: 2,
    label: 'ID Renewal',
    query: 'id renewal',
    icon: Compass01Icon,
    color: 'success',
    iconColor: '#10B981',
  },
  {
    id: 3,
    label: 'Marriage Certificate',
    query: 'marriage certificate',
    icon: WeddingIcon,
    color: 'danger',
    iconColor: '#EF4444',
  },
  {
    id: 4,
    label: 'Passport',
    query: 'passport',
    icon: Airplane01Icon,
    color: 'warning',
    iconColor: '#F59E0B',
  },
  {
    id: 5,
    label: 'Death Certificate',
    query: 'death certificate',
    icon: SkullIcon,
    color: 'default',
    iconColor: '#6B7280',
  },
  {
    id: 6,
    label: 'Education Cert',
    query: 'education certificate',
    icon: Certificate01Icon,
    color: 'accent',
    iconColor: '#3B82F6',
  },
  {
    id: 7,
    label: 'Driving License',
    query: 'driving license',
    icon: File01Icon,
    color: 'success',
    iconColor: '#10B981',
  },
  {
    id: 8,
    label: 'Address Cert',
    query: 'address certificate',
    icon: Home01Icon,
    color: 'warning',
    iconColor: '#F59E0B',
  },
  {
    id: 9,
    label: 'Property Document',
    query: 'property document',
    icon: Mail01Icon,
    color: 'danger',
    iconColor: '#EF4444',
  },
  {
    id: 10,
    label: 'Travel Permit',
    query: 'travel permit',
    icon: MapPinIcon,
    color: 'default',
    iconColor: '#6B7280',
  },
];

const SuggestionButton = memo(
  ({
    suggestion,
    onPress,
    surfaceColor,
  }: {
    suggestion: Suggestion;
    onPress: (query: string) => void;
    surfaceColor: string;
  }) => {
    return (
      <Button
        size="lg"
        variant="tertiary"
        className="rounded-full shadow-lg"
        style={{ backgroundColor: surfaceColor }}
        onPress={() => onPress(suggestion.query)}
      >
        <HugeiconsIcon
          icon={suggestion.icon}
          size={20}
          strokeWidth={2.5}
          color={suggestion.iconColor}
        />
        <Text className="text-foreground text-base font-semibold">
          {suggestion.label}
        </Text>
      </Button>
    );
  }
);

SuggestionButton.displayName = 'SuggestionButton';

interface SuggestionsButtonsProps {
  onSuggestPress: (query: string) => void;
}

export const SuggestionsButtons = forwardRef<{ collapse: () => void }, SuggestionsButtonsProps>(
  ({ onSuggestPress }, ref) => {
    const [expanded, setExpanded] = useState(false);
    const surfaceColor = useThemeColor('surface');

    // Expose collapse method to parent
    useImperativeHandle(ref, () => ({
      collapse: () => setExpanded(false),
    }));

  const handleSuggestPress = useCallback(
    (query: string) => {
      onSuggestPress(query);
    },
    [onSuggestPress]
  );

    const visibleSuggestions = expanded ? SUGGESTIONS : SUGGESTIONS.slice(0, 4);

    return (
      <Animated.View 
        className="gap-4 items-center"
      >
        <Text className="text-foreground text-2xl font-semibold">
          What can I help with?
        </Text>
        <View
          className="flex-row flex-wrap gap-2 justify-center"
        >
          {visibleSuggestions.map((suggestion) => (
            <SuggestionButton
              key={suggestion.id}
              suggestion={suggestion}
              onPress={handleSuggestPress}
              surfaceColor={surfaceColor}
            />
          ))}
          {!expanded ? (
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full shadow-lg"
              style={{ backgroundColor: surfaceColor }}
              onPress={() => setExpanded(true)}
            >
              <Text className="text-foreground text-base font-semibold">More</Text>
            </Button>
          ) : (
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full shadow-lg"
              style={{ backgroundColor: surfaceColor }}
              onPress={() => setExpanded(false)}
            >
              <Text className="text-foreground text-base font-semibold">Show Less</Text>
            </Button>
          )}
        </View>
      </Animated.View>
    );
  }
);

SuggestionsButtons.displayName = 'SuggestionsButtons';
