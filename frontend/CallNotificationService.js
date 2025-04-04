import RNCallKeep from "react-native-callkeep"
import uuid from "uuid"

// Store active calls
const activeCalls = new Map()

// Configuration for CallKeep
const callKeepOptions = {
  ios: {
    appName: "TaskManager",
    supportsVideo: false,
    maximumCallGroups: "1",
    maximumCallsPerCallGroup: "1",
  },
  android: {
    alertTitle: "Permissions required",
    alertDescription: "This application needs to access your phone accounts",
    cancelButton: "Cancel",
    okButton: "OK",
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: "com.taskmanager.callnotification",
      channelName: "Task Reminder Calls",
      notificationTitle: "Task Reminder Active",
      notificationIcon: "notification_icon",
    },
    // Setting this to false will use a fallback if CallKeep isn't available
    skipPermissionCheck: true,
  },
}

// Flag to track if CallKeep is available
let isCallKeepAvailable = false

/**
 * Initialize CallKeep with fallback handling
 */
export const setupCallKeep = async () => {
  try {
    console.log("Setting up CallKeep...")

    // Try to set up CallKeep
    await RNCallKeep.setup(callKeepOptions)

    // Register event listeners
    RNCallKeep.addEventListener("didReceiveStartCallAction", onNativeCall)
    RNCallKeep.addEventListener("answerCall", onAnswerCallAction)
    RNCallKeep.addEventListener("endCall", onEndCallAction)
    RNCallKeep.addEventListener("didDisplayIncomingCall", onIncomingCallDisplayed)

    isCallKeepAvailable = true
    console.log("CallKeep initialized successfully")
    return true
  } catch (err) {
    console.log("CallKeep initialization failed, using fallback:", err.message)
    isCallKeepAvailable = false
    return false
  }
}

/**
 * Display an incoming call notification for a task
 * @param {Object} task - The task object
 * @returns {string} - The UUID of the call or null if using fallback
 */
export const displayIncomingCall = async (task) => {
  try {
    // Generate a unique call UUID
    const callUUID = uuid.v4()

    // Format the caller name to include task details
    const callerName = `Task Reminder: ${task.title}`
    const callDetails = `Due: ${new Date(task.dueDate).toLocaleString()}`

    if (isCallKeepAvailable) {
      // Use CallKeep if available
      await RNCallKeep.displayIncomingCall(
        callUUID,
        "Task Manager",
        callerName,
        "generic",
        true, // hasVideo
        {
          taskId: task.id,
          dueDate: task.dueDate,
          details: callDetails,
        },
      )

      // Store the call information
      activeCalls.set(callUUID, {
        taskId: task.id,
        title: task.title,
        dueDate: task.dueDate,
        startTime: new Date(),
      })

      console.log(`Incoming call displayed for task: ${task.title}`)
      return callUUID
    } else {
      // Return null to indicate we're using the fallback UI
      console.log(`Using fallback UI for task: ${task.title}`)
      return null
    }
  } catch (error) {
    console.error("Error displaying incoming call:", error)
    return null
  }
}

/**
 * End an active call
 * @param {string} callUUID - The UUID of the call to end
 */
export const endCall = async (callUUID) => {
  if (!isCallKeepAvailable || !callUUID) return

  try {
    await RNCallKeep.endCall(callUUID)
    activeCalls.delete(callUUID)
    console.log(`Call ended: ${callUUID}`)
  } catch (error) {
    console.error("Error ending call:", error)
  }
}

/**
 * End all active calls
 */
export const endAllCalls = async () => {
  if (!isCallKeepAvailable) return

  try {
    const callUUIDs = Array.from(activeCalls.keys())
    for (const callUUID of callUUIDs) {
      await endCall(callUUID)
    }
    console.log("All calls ended")
  } catch (error) {
    console.error("Error ending all calls:", error)
  }
}

// Event Handlers
const onNativeCall = ({ handle, callUUID }) => {
  console.log("onNativeCall:", handle, callUUID)
  // Handle outgoing calls if needed
}

const onAnswerCallAction = ({ callUUID }) => {
  console.log("onAnswerCallAction:", callUUID)

  // Get the task information from the active calls map
  const callInfo = activeCalls.get(callUUID)
  if (callInfo) {
    // Navigate to the task details screen or show task information
    // This would typically be handled by your navigation system
    console.log(`User answered call for task: ${callInfo.title}`)

    // You could use a global event emitter to notify your app
    // or use a callback function passed during initialization
  }
}

const onEndCallAction = ({ callUUID }) => {
  console.log("onEndCallAction:", callUUID)
  activeCalls.delete(callUUID)
}

const onIncomingCallDisplayed = ({ callUUID, handle, fromPushKit, payload }) => {
  console.log("onIncomingCallDisplayed:", callUUID, handle, fromPushKit, payload)
  // Additional handling for when the call is displayed
}

/**
 * Check if CallKeep is available on this device
 */
export const isCallKeepSupported = () => {
  return isCallKeepAvailable
}

