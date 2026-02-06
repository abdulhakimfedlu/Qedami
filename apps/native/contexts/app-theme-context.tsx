import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { Uniwind, useUniwind } from "uniwind";
import { Platform } from "react-native";

type AppThemeContextType = {
  isLight: boolean;
};

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

// Force light mode globally
Uniwind.setTheme("light");

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useUniwind();

  // Apply light mode only (no dark mode support)
  useEffect(() => {
    // Always ensure light mode is set
    Uniwind.setTheme("light");

    // Apply light class to document body for web
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.body.classList.add("light");
    }
  });

  const value = useMemo(
    () => ({
      isLight: true,
    }),
    [],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
};

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}
