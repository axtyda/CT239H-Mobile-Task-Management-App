"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, StatusBar } from "react-native"
import { Colors } from "./theme"
import Icon from "react-native-vector-icons/MaterialIcons"

const { width, height } = Dimensions.get("window")
const isIOS = Platform.OS === "ios"

const CallNotificationUI = ({ visible, taskTitle, dueDate, onAccept, onDecline, onDismiss }) => {
  const [animation] = useState(new Animated.Value(0))

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      // Animate out
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, animation])

  if (!visible) return null

  // Format the due date
  const formattedDueDate = new Date(dueDate).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Animation styles
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0],
  })

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.7)" barStyle="light-content" />

      <Animated.View style={[styles.callContainer, { transform: [{ translateY }], opacity }]}>
        <View style={styles.callHeader}>
          <Text style={styles.callTitle}>Task Reminder</Text>
          <Text style={styles.callStatus}>Incoming Call</Text>
        </View>

        <View style={styles.taskInfoContainer}>
          <Text style={styles.taskTitle} numberOfLines={2}>
            {taskTitle}
          </Text>
          <Text style={styles.dueDate}>Due: {formattedDueDate}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.declineButton]} onPress={onDecline}>
            <Icon name="call-end" size={30} color="#fff" />
            <Text style={styles.actionText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={onAccept}>
            <Icon name="call" size={30} color="#fff" />
            <Text style={styles.actionText}>View Task</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={onDismiss} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-start",
    zIndex: 1000,
  },
  callContainer: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: isIOS ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    width: width,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  callHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  callTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  callStatus: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  taskInfoContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  dueDate: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  declineButton: {
    backgroundColor: "#FF4757",
  },
  acceptButton: {
    backgroundColor: Colors.primary,
  },
  actionText: {
    color: "#fff",
    marginTop: 5,
    fontSize: 12,
  },
  dismissArea: {
    flex: 1,
  },
})

export default CallNotificationUI

