"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      // sessionStorageからテーマ設定を読み込む
      const storedIsDarkMode = sessionStorage.getItem("isDarkMode");
      if (storedIsDarkMode !== null) {
        setIsDarkMode(JSON.parse(storedIsDarkMode));
    
      }
    } catch (error) {
      console.error("Error accessing storage:", error);
    }
  }, []);

  useEffect(() => {
    // DOMクラスの更新
    document.documentElement.classList.toggle("dark", isDarkMode);
    
    // ストレージに保存
    try {
      sessionStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
