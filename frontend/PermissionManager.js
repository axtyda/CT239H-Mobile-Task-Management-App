import { Platform, Alert, Linking } from "react-native"
import { PermissionsAndroid } from "react-native"
import * as Notifications from "expo-notifications"

/**
 * A utility class to handle all permission requests in the app
 */
class PermissionManager {
  /**
   * Request notification permissions
   */
  static async requestNotificationPermissions() {
    try {
      console.log("Requesting notification permissions...")
      const { status: existingStatus } = await Notifications.getPermissionsAsync()

      // Only request if not already granted
      if (existingStatus !== "granted") {
        console.log("Notification permission not granted, requesting...")
        const { status } = await Notifications.requestPermissionsAsync()
        const granted = status === "granted"
        console.log(`Notification permission ${granted ? "granted" : "denied"}`)
        return granted
      } else {
        console.log("Notification permission already granted")
        return true
      }
    } catch (error) {
      console.error("Error requesting notification permissions:", error)
      return false
    }
  }

  /**
   * Request phone state permissions (for call notifications)
   */
  static async requestPhoneStatePermission() {
    if (Platform.OS !== "android") {
      return true // iOS handles this differently
    }

    try {
      console.log("Requesting READ_PHONE_STATE permission...")

      // First check if we already have the permission
      const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE)
      if (alreadyGranted) {
        console.log("READ_PHONE_STATE permission already granted")
        return true
      }

      // Request the permission with a clear explanation
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE, {
        title: "Phone State Permission Required",
        message:
          "This app needs access to your phone state to display call notifications for important tasks. Without this permission, you'll only receive standard notifications.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "Grant Permission",
      })

      const result = granted === PermissionsAndroid.RESULTS.GRANTED
      console.log(`READ_PHONE_STATE permission ${result ? "granted" : "denied"}`)

      // If we got the phone state permission, also request CALL_PHONE permission
      // which might be needed on some devices
      if (result) {
        try {
          console.log("Also requesting CALL_PHONE permission...")
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE, {
            title: "Call Phone Permission",
            message: "This permission is needed to fully support call notifications",
            buttonPositive: "Grant Permission",
          })
        } catch (err) {
          console.log("Error requesting CALL_PHONE permission:", err)
          // We can continue even if this fails
        }
      }

      return result
    } catch (error) {
      console.error("Error requesting phone state permission:", error)
      return false
    }
  }

  /**
   * Check if phone state permission is granted
   */
  static async hasPhoneStatePermission() {
    if (Platform.OS !== "android") {
      return true // iOS handles this differently
    }

    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE)
      return granted
    } catch (error) {
      console.error("Error checking phone state permission:", error)
      return false
    }
  }

  /**
   * Request all required permissions for the app
   */
  static async requestAllPermissions() {
    const notificationPermission = await this.requestNotificationPermissions()
    const phoneStatePermission = await this.requestPhoneStatePermission()

    return {
      notifications: notificationPermission,
      phoneState: phoneStatePermission,
    }
  }

  /**
   * Show a dialog to explain why permissions are needed
   * and provide a button to open settings
   */
  static showPermissionExplanation(onRequestPermission) {
    Alert.alert(
      "Permissions Required",
      "This app needs permissions to send you notifications about your tasks, including call-style notifications for important deadlines.",
      [
        {
          text: "Not Now",
          style: "cancel",
        },
        {
          text: "Grant Permissions",
          onPress: onRequestPermission,
        },
      ],
    )
  }

  /**
   * Open app settings
   */
  static openSettings() {
    Linking.openSettings()
  }
}

export default PermissionManager

