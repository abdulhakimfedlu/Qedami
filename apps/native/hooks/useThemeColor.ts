import { useAppTheme } from "@/contexts/app-theme-context";

const Colors = {
  light: {
    foreground: "#000000",
    background: "#ffffff",
    success: "#22c55e",
    danger: "#ef4444",
    muted: "#71717a",
    accent: "#f4f4f5",
    "accent-foreground": "#18181b",
  },
  dark: {
    foreground: "#ffffff",
    background: "#000000",
    success: "#22c55e",
    danger: "#ef4444",
    muted: "#a1a1aa",
    accent: "#27272a",
    "accent-foreground": "#fafafa",
  },
};

export function useThemeColor(colorName: keyof typeof Colors.light) {
  const { currentTheme } = useAppTheme();
  const theme = (currentTheme === "dark" ? "dark" : "light") as "light" | "dark";
  return Colors[theme][colorName];
}