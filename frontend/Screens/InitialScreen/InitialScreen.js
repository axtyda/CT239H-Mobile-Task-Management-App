"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Image, StatusBar, Alert } from "react-native"
import { InitialScreenStyle } from "./Style/InitialScreenStyle"
import { WelcomeImg } from "../../theme/Images"
import PermissionManager from "../../PermissionManager"
import { useTheme } from "../../ThemeContext"

export default function InitialScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme()
  const [permissionsChecked, setPermissionsChecked] = useState(false)
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false)

  useEffect(() => {
    // Check permissions when component mounts
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    // Check if we already have phone state permission
    const hasPhonePermission = await PermissionManager.hasPhoneStatePermission()
    setPermissionsChecked(true)

    // Log the permission status
    console.log("Phone state permission status:", hasPhonePermission)
  }

  const requestPermissions = async () => {
    // Show loading state
    setIsRequestingPermissions(true)

    try {
      // First request notification permissions
      const notificationPermission = await PermissionManager.requestNotificationPermissions()
      console.log("Notification permission result:", notificationPermission)

      // Show intermediate feedback
      if (notificationPermission) {
        Alert.alert(
          "Notification Permission Granted",
          "Now we'll request phone state permission for call notifications.",
          [
            {
              text: "Continue",
              onPress: async () => {
                // Then request phone state permission
                const phonePermission = await PermissionManager.requestPhoneStatePermission()
                console.log("Phone state permission result:", phonePermission)

                // Show final result
                if (phonePermission) {
                  Alert.alert(
                    "All Permissions Granted",
                    "Great! You'll now receive call notifications for important tasks.",
                    [{ text: "OK" }],
                  )
                } else {
                  Alert.alert(
                    "Limited Functionality",
                    "Without phone permissions, you'll only receive standard notifications for tasks.",
                    [{ text: "OK" }],
                  )
                }
              },
            },
          ],
        )
      } else {
        Alert.alert(
          "Notification Permission Denied",
          "Without notification permission, you won't receive task reminders.",
          [{ text: "OK" }],
        )
      }
    } catch (error) {
      console.error("Error requesting permissions:", error)
      Alert.alert("Error", "There was a problem requesting permissions.")
    } finally {
      setIsRequestingPermissions(false)
    }
  }

  const goToHome = () => {
    navigation.navigate("MainNavigation")
  }

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text_alt,
    },
    button: {
      backgroundColor: colors.primary,
    },
  }

  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[InitialScreenStyle.container, dynamicStyles.container]}>
        <View style={InitialScreenStyle.mainContainer}>
          <Image source={WelcomeImg} style={InitialScreenStyle.img} />
          <View>
            <Text style={[InitialScreenStyle.text, dynamicStyles.text]}>A Task manager you cannot trust</Text>
            <Text style={[InitialScreenStyle.textSub, dynamicStyles.text]}>A workspace for 1 single person</Text>
          </View>

          {/* Permission button - only show after initial check */}
          {permissionsChecked && (
            <TouchableOpacity
              style={[
                InitialScreenStyle.btn,
                { backgroundColor: "#4A90E2", marginBottom: 15 },
                isRequestingPermissions && { opacity: 0.7 },
              ]}
              onPress={requestPermissions}
              disabled={isRequestingPermissions}
            >
              <Text style={InitialScreenStyle.btnText}>
                {isRequestingPermissions ? "Requesting Permissions..." : "Enable Notifications"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[InitialScreenStyle.btn, dynamicStyles.button]} onPress={goToHome}>
            <Text style={InitialScreenStyle.btnText}>Get Started!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

