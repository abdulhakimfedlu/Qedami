import { useThemeColor as useHeroUIThemeColor } from 'heroui-native';

type ValidThemeColor =
  | 'accent'
  | 'accent-foreground'
  | 'background'
  | 'border'
  | 'danger'
  | 'danger-foreground'
  | 'default'
  | 'default-foreground'
  | 'field-foreground'
  | 'field-placeholder'
  | 'focus'
  | 'foreground'
  | 'muted'
  | 'overlay'
  | 'overlay-foreground'
  | 'success'
  | 'success-foreground'
  | 'surface'
  | 'surface-foreground'
  | 'warning'
  | 'warning-foreground';

/**
 * Hook to access HeroUI theme colors
 * 
 * @param name - The theme color name to retrieve
 * @returns The color value as a string
 * 
 * @example
 * const accentColor = useThemeColor('accent');
 */
export function useThemeColor(name: ValidThemeColor): string {
  return useHeroUIThemeColor(name);
}
