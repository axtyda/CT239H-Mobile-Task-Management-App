"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Colors, DarkColors } from "./theme/Colors"

// Create the theme context
const ThemeContext = createContext({
  isDarkMode: false,
  colors: Colors,
  toggleTheme: () => {},
})

// Theme storage key
const THEME_PREFERENCE_KEY = "@theme_preference"

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get device color scheme
  const deviceTheme = useColorScheme()

  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY)
        // If we have a saved preference, use it, otherwise use device theme
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === "dark")
        } else {
          setIsDarkMode(deviceTheme === "dark")
        }
      } catch (error) {
        console.error("Error loading theme preference:", error)
      }
    }

    loadThemePreference()
  }, [deviceTheme])

  // Toggle theme function
  const toggleTheme = async () => {
    try {
      const newThemeValue = !isDarkMode
      setIsDarkMode(newThemeValue)
      // Save the new theme preference
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newThemeValue ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme preference:", error)
    }
  }

  // Get the current theme colors
  const colors = isDarkMode ? DarkColors : Colors

  // Context value
  const contextValue = {
    isDarkMode,
    colors,
    toggleTheme,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext)

