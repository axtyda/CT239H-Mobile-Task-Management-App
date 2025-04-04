// // NotificationService.js
// import * as Notifications from 'expo-notifications';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';

// dayjs.extend(utc);
// dayjs.extend(timezone);

// // Configurable minimum time before deadline to schedule a notification (e.g., 30 minutes)
// const MIN_NOTIFICATION_BUFFER_MS = 30 * 60 * 1000; // 30 minutes in ms

// // Parses a string like "1-hour", "2-day", "1-week", "1-month" into a { value, unit } object.
// function parseNotificationOffset(offsetStr) {
//   const [numStr, unit] = offsetStr.split('-');
//   return { value: parseInt(numStr, 10), unit };
// }

// // Helper to calculate the scheduled time for the "before deadline" notification.
// // It subtracts the offset from the due date, but ensures that the notification
// // is scheduled at least MIN_NOTIFICATION_BUFFER_MS before the due date.
// function calculateBeforeDeadlineTime(dueDate, offsetStr) {
//   const { value, unit } = parseNotificationOffset(offsetStr);
//   let scheduledTime = dayjs(dueDate).subtract(value, unit);
//   if (dayjs(dueDate).diff(scheduledTime) < MIN_NOTIFICATION_BUFFER_MS) {
//     scheduledTime = dayjs(dueDate).subtract(MIN_NOTIFICATION_BUFFER_MS, 'milliseconds');
//   }
//   return scheduledTime;
// }

// /**
//  * Schedules a single notification before the deadline.
//  */
// async function scheduleBeforeDeadlineNotification(task) {
//   const scheduledTime = calculateBeforeDeadlineTime(task.dueDate, task.notificationOffset);
//   console.log('Scheduled trigger time (UTC):', scheduledTime.toISOString());

//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'Upcoming Deadline',
//       body: `Your task "${task.title}" is due soon.`,
//       // Optionally add additional notification config here (e.g., sound)
//     },
//     trigger: scheduledTime.toDate(), // Expo accepts a Date object for one-time notifications.
//   });
// }

// /**
//  * Schedules a missed deadline notification (e.g., 5 minutes after the due date).
//  */
// async function scheduleMissedDeadlineNotification(task) {
//   const scheduledTime = dayjs(task.dueDate).add(5, 'minutes');
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'Missed Deadline',
//       body: `Your task "${task.title}" has passed its deadline.`,
//     },
//     trigger: scheduledTime.toDate(),
//   });
// }

// /**
//  * Schedules recurring reminders if enabled.
//  *
//  * This function schedules a series of one-time notifications starting at the first reminder time
//  * and repeating at the specified recurring frequency until MIN_NOTIFICATION_BUFFER_MS before the due date.
//  */
// async function scheduleRecurringNotifications(task) {
//   if (!task.enableRecurringReminder || !task.recurringFrequency) {
//     return;
//   }

//   let currentTime = calculateBeforeDeadlineTime(task.dueDate, task.notificationOffset);

//   let frequencyInterval;
//   switch (task.recurringFrequency) {
//     case 'hourly':
//       frequencyInterval = { value: 1, unit: 'hour' };
//       break;
//     case 'daily':
//       frequencyInterval = { value: 1, unit: 'day' };
//       break;
//     case 'weekly':
//       frequencyInterval = { value: 1, unit: 'week' };
//       break;
//     case 'monthly':
//       frequencyInterval = { value: 1, unit: 'month' };
//       break;
//     default:
//       return;
//   }

//   // Schedule recurring notifications from the first reminder until MIN_NOTIFICATION_BUFFER_MS before dueDate.
//   while (currentTime.isBefore(dayjs(task.dueDate).subtract(MIN_NOTIFICATION_BUFFER_MS, 'milliseconds'))) {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: 'Reminder: Task Due Soon',
//         body: `Your task "${task.title}" is approaching its deadline.`,
//       },
//       trigger: currentTime.toDate(),
//     });
//     // Increment the current time by the recurring frequency.
//     currentTime = currentTime.add(frequencyInterval.value, frequencyInterval.unit);
//   }
// }

// /**
//  * Schedules all notifications for a given task.
//  */
// export async function scheduleTaskNotifications(task) {
//   // Optionally cancel previous notifications for this task if needed.
//   // For example, you might store and later cancel notifications using their IDs.

//   await scheduleBeforeDeadlineNotification(task);
//   await scheduleMissedDeadlineNotification(task);
//   if (task.enableRecurringReminder) {
//     await scheduleRecurringNotifications(task);
//   }
// }

// NotificationService.js
import * as Notifications from "expo-notifications"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

// Configurable minimum time before deadline to schedule a notification (e.g., 30 minutes)
const MIN_NOTIFICATION_BUFFER_MS = 30 * 60 * 1000 // 30 minutes in ms

// Parses a string like "1-hour", "2-day", "1-week", "1-month" into a { value, unit } object.
function parseNotificationOffset(offsetStr) {
  const [numStr, unit] = offsetStr.split("-")
  return { value: Number.parseInt(numStr, 10), unit }
}

// Helper to calculate the scheduled time for the "before deadline" notification.
// It subtracts the offset from the due date, but ensures that the notification
// is scheduled at least MIN_NOTIFICATION_BUFFER_MS before the due date.
function calculateBeforeDeadlineTime(dueDate, offsetStr) {
  const { value, unit } = parseNotificationOffset(offsetStr)
  let scheduledTime = dayjs(dueDate).subtract(value, unit)
  if (dayjs(dueDate).diff(scheduledTime) < MIN_NOTIFICATION_BUFFER_MS) {
    scheduledTime = dayjs(dueDate).subtract(MIN_NOTIFICATION_BUFFER_MS, "milliseconds")
  }
  return scheduledTime
}

/**
 * Schedules a single notification before the deadline.
 */
async function scheduleBeforeDeadlineNotification(task) {
  const scheduledTime = calculateBeforeDeadlineTime(task.dueDate, task.notificationOffset)
  console.log("Scheduled trigger time (UTC):", scheduledTime.toISOString())

  // Always schedule a regular notification
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: task.notificationType === "call" ? "URGENT: Upcoming Deadline" : "Upcoming Deadline",
      body: `Your task "${task.title}" is due soon.`,
      data: {
        taskId: task.id,
        isCallNotification: task.notificationType === "call",
        useCustomUI: true,
      },
    },
    trigger: scheduledTime.toDate(),
  })

  return {
    id: notificationId,
    scheduledTime: scheduledTime.toDate(),
    task,
  }
}

/**
 * Schedules a missed deadline notification (e.g., 5 minutes after the due date).
 */
async function scheduleMissedDeadlineNotification(task) {
  const scheduledTime = dayjs(task.dueDate).add(5, "minutes")

  // Always use a regular notification for missed deadlines
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: task.notificationType === "call" ? "URGENT: MISSED DEADLINE" : "Missed Deadline",
      body: `Your task "${task.title}" has passed its deadline!`,
      data: {
        taskId: task.id,
        isMissed: true,
        isCallNotification: task.notificationType === "call",
        useCustomUI: true,
      },
    },
    trigger: scheduledTime.toDate(),
  })

  return {
    id: notificationId,
    scheduledTime: scheduledTime.toDate(),
    task,
    isMissed: true,
  }
}

/**
 * Schedules recurring reminders if enabled.
 */
async function scheduleRecurringNotifications(task) {
  if (!task.enableRecurringReminder || !task.recurringFrequency) {
    return []
  }

  let currentTime = calculateBeforeDeadlineTime(task.dueDate, task.notificationOffset)
  const notificationIds = []

  let frequencyInterval
  switch (task.recurringFrequency) {
    case "hourly":
      frequencyInterval = { value: 1, unit: "hour" }
      break
    case "daily":
      frequencyInterval = { value: 1, unit: "day" }
      break
    case "weekly":
      frequencyInterval = { value: 1, unit: "week" }
      break
    case "monthly":
      frequencyInterval = { value: 1, unit: "month" }
      break
    default:
      return []
  }

  // Schedule recurring notifications from the first reminder until MIN_NOTIFICATION_BUFFER_MS before dueDate.
  while (currentTime.isBefore(dayjs(task.dueDate).subtract(MIN_NOTIFICATION_BUFFER_MS, "milliseconds"))) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder: Task Due Soon",
        body: `Your task "${task.title}" is approaching its deadline.`,
        data: { taskId: task.id, isRecurring: true },
      },
      trigger: currentTime.toDate(),
    })

    notificationIds.push(id)

    // Increment the current time by the recurring frequency.
    currentTime = currentTime.add(frequencyInterval.value, frequencyInterval.unit)
  }

  return notificationIds
}

/**
 * Schedules all notifications for a given task.
 */
export async function scheduleTaskNotifications(task) {
  // Store all notification IDs
  const notificationIds = []

  // Schedule the before deadline notification
  const beforeDeadlineNotification = await scheduleBeforeDeadlineNotification(task)
  if (beforeDeadlineNotification && beforeDeadlineNotification.id) {
    notificationIds.push(beforeDeadlineNotification.id)

    // Log call notification info
    if (task.notificationType === "call") {
      console.log(`Call notification scheduled for task ${task.id} at ${beforeDeadlineNotification.scheduledTime}`)
    }
  }

  // Schedule the missed deadline notification
  const missedDeadlineNotification = await scheduleMissedDeadlineNotification(task)
  if (missedDeadlineNotification && missedDeadlineNotification.id) {
    notificationIds.push(missedDeadlineNotification.id)

    // Log call notification info
    if (task.notificationType === "call") {
      console.log(
        `Missed deadline call notification scheduled for task ${task.id} at ${missedDeadlineNotification.scheduledTime}`,
      )
    }
  }

  // Schedule recurring notifications if enabled
  if (task.enableRecurringReminder) {
    const recurringIds = await scheduleRecurringNotifications(task)
    notificationIds.push(...recurringIds)
  }

  return notificationIds
}

/**
 * Handle incoming notifications and trigger call notifications if needed
 */
export function handleNotification(notification) {
  const data = notification.request.content.data

  // Check if this is a call notification
  if (data && data.isCallNotification && data.taskId) {
    // We'll handle this in the notification received listener in App.js
    console.log("Call notification received for task:", data.taskId)
  }

  return {
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }
}

