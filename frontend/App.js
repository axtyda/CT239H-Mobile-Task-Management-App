"use client"
import { useEffect, useState, useRef } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "react-native"
import Navigation from "./Navigation/Navigation"
import InitialScreen from "./Screens/InitialScreen/InitialScreen"
import AddTask from "./Screens/Task/AddTask"
import Task from "./Screens/Task/Task"
import TaskDetails from "./Screens/Task/TaskDetails"
import * as Notifications from "expo-notifications"
import { setupCallKeep } from "./CallNotificationService"
import { handleNotification } from "./NotificationService"
import CallNotificationUI from "./CallNotificationUI"
import TaskService from "./taskService"
import PermissionManager from "./PermissionManager"
import { ThemeProvider, useTheme } from "./ThemeContext"

const Stack = createStackNavigator()

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async (notification) => handleNotification(notification),
})

// Main app component
function MainApp() {
  const { isDarkMode } = useTheme()
  const [callNotificationVisible, setCallNotificationVisible] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [callKeepAvailable, setCallKeepAvailable] = useState(false)
  const navigationRef = useRef(null)

  // Initialize notifications and CallKeep
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Set up notification listener
        const subscription = Notifications.addNotificationReceivedListener((notification) => {
          const data = notification.request.content.data

          // Check if this is a call notification
          if (data && data.isCallNotification && data.taskId) {
            // Fetch the task and show call UI
            TaskService.getTaskById(data.taskId).then((task) => {
              if (task) {
                setCurrentTask(task)
                setCallNotificationVisible(true)
              }
            })
          }
        })

        // Check if we have phone state permission
        const hasPhonePermission = await PermissionManager.hasPhoneStatePermission()
        console.log("Phone permission status during app init:", hasPhonePermission)

        if (hasPhonePermission) {
          // Setup CallKeep
          try {
            const callKeepSetupResult = await setupCallKeep()
            setCallKeepAvailable(callKeepSetupResult)
            console.log("CallKeep setup result:", callKeepSetupResult)
          } catch (error) {
            console.error("Error setting up CallKeep:", error)
            setCallKeepAvailable(false)
          }
        }

        return () => {
          subscription.remove()
        }
      } catch (error) {
        console.error("Error initializing app:", error)
      }
    }

    initializeApp()
  }, [])

  // Handle accepting the call
  const handleAcceptCall = () => {
    if (currentTask && navigationRef.current) {
      // Navigate to the task details
      navigationRef.current.navigate("TaskDetails", { taskId: currentTask.id })
      setCallNotificationVisible(false)
    }
  }

  // Handle declining the call
  const handleDeclineCall = () => {
    setCallNotificationVisible(false)
  }

  // Handle dismissing the call UI
  const handleDismissCall = () => {
    setCallNotificationVisible(false)
  }

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#232931" : "#2ED573"}
      />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="InitialScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="InitialScreen" component={InitialScreen} />
          <Stack.Screen name="MainNavigation" component={Navigation} />
          <Stack.Screen name="AddTask" component={AddTask} />
          <Stack.Screen name="Task" component={Task} />
          <Stack.Screen name="TaskDetails" component={TaskDetails} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Call Notification UI - Always use our custom UI */}
      <CallNotificationUI
        visible={callNotificationVisible}
        taskTitle={currentTask?.title || ""}
        dueDate={currentTask?.dueDate || new Date()}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        onDismiss={handleDismissCall}
      />
    </>
  )
}

// Wrap the app with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  )
}

