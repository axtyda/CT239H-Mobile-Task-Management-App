"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import DatePicker from "react-native-date-picker"
import { Picker } from "@react-native-picker/picker"
import { Swipeable } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/MaterialIcons"
import TaskService from "../../taskService"
import { styles } from "./Style/TaskDetailsStyle"
import { useTheme } from "../../ThemeContext"

export default function TaskDetails({ route, navigation }) {
  const { taskId } = route.params
  const { colors, isDarkMode } = useTheme()

  // State for task data
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priorityLevel, setPriorityLevel] = useState(null)
  const [dueDate, setDueDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const [isStartDateEnabled, setIsStartDateEnabled] = useState(false)
  const [notificationType, setNotificationType] = useState("push")
  const [notificationOffset, setNotificationOffset] = useState("1-hour")
  const [enableRecurringReminder, setEnableRecurringReminder] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState("daily")
  const [subGoals, setSubGoals] = useState([])
  const [newSubGoalName, setNewSubGoalName] = useState("")

  // Date picker state
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)

  // Editing subgoal state
  const [editingSubGoalId, setEditingSubGoalId] = useState(null)
  const [editingSubGoalName, setEditingSubGoalName] = useState("")

  // Refs for swipeable items
  const swipeableRefs = useRef({})

  // Priority options using Eisenhower Matrix
  const priorityOptions = [
    { label: "None", value: null },
    { label: "Urgent and Important", value: "Red" },
    { label: "Not Urgent but Important", value: "Yellow" },
    { label: "Urgent but Not Important", value: "Blue" },
    { label: "Not Urgent and Not Important", value: "Green" },
  ]

  const offsetOptions = [
    "15-minutes",
    "30-minutes",
    "1-hour",
    "2-hours",
    "6-hours",
    "12-hours",
    "1-day",
    "2-days",
    "1-week",
  ]

  const frequencyOptions = ["daily", "weekly", "monthly"]

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      shadowColor: colors.shadow,
    },
    headerTitle: {
      color: colors.text,
    },
    card: {
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
    },
    sectionTitle: {
      color: colors.card_title,
    },
    inputLabel: {
      color: colors.text_empty,
    },
    textInput: {
      backgroundColor: colors.card,
      color: colors.text_alt,
      borderColor: colors.border,
    },
    textAreaInput: {
      backgroundColor: colors.card,
      color: colors.text_alt,
      borderColor: colors.border,
    },
    pickerContainer: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    picker: {
      color: colors.text_alt,
    },
    dateContainer: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    dateText: {
      color: colors.text_alt,
    },
    subGoalRow: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    subGoalText: {
      color: colors.text_alt,
    },
    subGoalInput: {
      backgroundColor: colors.card,
      color: colors.text_alt,
      borderColor: colors.border,
    },
    saveButton: {
      backgroundColor: '#2ED573',
    },
    valueText: {
      color: colors.text_alt,
    },
    swipeActions: {
      backgroundColor: colors.background,
    },
    editAction: {
      backgroundColor: "#2196F3",
      borderRadius: 8,
      marginLeft: 1,
    },
    deleteAction: {
      backgroundColor: "#FF4757",
      borderRadius: 8,
      marginLeft: 1,
    },
  }

  // Fetch task data on component mount
  useEffect(() => {
    fetchTaskDetails()
  }, [taskId])

  // Fetch task details from database
  const fetchTaskDetails = async () => {
    try {
      setLoading(true)
      const taskData = await TaskService.getTaskById(taskId)

      if (taskData) {
        setTask(taskData)

        // Initialize form state with task data
        setTitle(taskData.title || "")
        setDescription(taskData.description || "")
        setPriorityLevel(taskData.priorityLevel || null)
        setDueDate(new Date(taskData.dueDate) || new Date())

        // Handle start date
        const hasStartDate = taskData.startDate && taskData.startDate.toString() !== "Invalid Date"
        setIsStartDateEnabled(hasStartDate)
        setStartDate(hasStartDate ? new Date(taskData.startDate) : new Date())

        // Notification settings
        setNotificationType(taskData.notificationType || "push")
        setNotificationOffset(taskData.notificationOffset || "1-hour")
        setEnableRecurringReminder(taskData.enableRecurringReminder || false)
        setRecurringFrequency(taskData.recurringFrequency || "daily")

        // Subgoals
        setSubGoals(taskData.subGoals || [])
      } else {
        Alert.alert("Error", "Task not found")
        navigation.goBack()
      }
    } catch (error) {
      console.error("Error fetching task details:", error)
      Alert.alert("Error", "Failed to load task details")
    } finally {
      setLoading(false)
    }
  }

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // If we're exiting edit mode without saving, reset form values
      if (!confirmSave()) {
        resetFormValues()
      }
    }
    setEditMode(!editMode)
  }

  // Reset form values to original task data
  const resetFormValues = () => {
    if (task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setPriorityLevel(task.priorityLevel || null)
      setDueDate(new Date(task.dueDate) || new Date())

      const hasStartDate = task.startDate && task.startDate.toString() !== "Invalid Date"
      setIsStartDateEnabled(hasStartDate)
      setStartDate(hasStartDate ? new Date(task.startDate) : new Date())

      setNotificationType(task.notificationType || "push")
      setNotificationOffset(task.notificationOffset || "1-hour")
      setEnableRecurringReminder(task.enableRecurringReminder || false)
      setRecurringFrequency(task.recurringFrequency || "daily")

      setSubGoals([...(task.subGoals || [])])
    }
  }

  // Confirm save changes
  const confirmSave = () => {
    Alert.alert("Save Changes", "Do you want to save your changes?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          resetFormValues()
          setEditMode(false)
        },
      },
      {
        text: "Save",
        onPress: saveChanges,
      },
    ])
    return false // Return false to prevent immediate toggle
  }

  // Save changes to database
  const saveChanges = async () => {
    if (!title.trim()) {
      Alert.alert("Missing Field", "Title is required.")
      return
    }

    try {
      const updatedTask = {
        title,
        description,
        priorityLevel,
        startDate: isStartDateEnabled ? startDate : null,
        dueDate,
        notificationType,
        notificationOffset,
        enableRecurringReminder,
        recurringFrequency: enableRecurringReminder ? recurringFrequency : "",
        subGoals,
      }

      await TaskService.updateTask(taskId, updatedTask)

      // Update local task state
      setTask({ ...task, ...updatedTask })

      Alert.alert("Success", "Task updated successfully!")
      setEditMode(false)
    } catch (error) {
      console.error("Error updating task:", error)
      Alert.alert("Error", "Failed to update task")
    }
  }

  // Delete task
  const deleteTask = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await TaskService.deleteTask(taskId)
            Alert.alert("Success", "Task deleted successfully!")
            navigation.goBack()
          } catch (error) {
            console.error("Error deleting task:", error)
            Alert.alert("Error", "Failed to delete task")
          }
        },
      },
    ])
  }

  // Toggle subgoal completion
  const toggleSubGoal = async (subGoalId) => {
    try {
      await TaskService.updateSubGoal(taskId, subGoalId)
      fetchTaskDetails() // Refresh task data
    } catch (error) {
      console.error("Error updating subgoal:", error)
      Alert.alert("Error", "Failed to update subgoal")
    }
  }

  // Add new subgoal
  const addSubGoal = () => {
    if (newSubGoalName.trim()) {
      // Generate a more unique ID by combining timestamp and random string
      const newSubGoalId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const newSubGoal = {
        subGoalId: newSubGoalId,
        name: newSubGoalName,
        isCompleted: false
      };
      
      setSubGoals([...subGoals, newSubGoal]);
      setNewSubGoalName("");
    }
  };

  // Edit subgoal
  const startEditingSubGoal = (subGoal) => {
    setEditingSubGoalId(subGoal.subGoalId)
    setEditingSubGoalName(subGoal.name)
  }

  // Save subgoal edit
  const saveSubGoalEdit = () => {
    if (editingSubGoalName.trim() && editingSubGoalId) {
      // Preserve the original subGoalId when updating
      setSubGoals(subGoals.map(sg => 
        sg.subGoalId === editingSubGoalId 
          ? { ...sg, name: editingSubGoalName }
          : sg
      ));
      
      setEditingSubGoalId(null);
      setEditingSubGoalName("");
    }
  };

  // Cancel subgoal edit
  const cancelSubGoalEdit = () => {
    setEditingSubGoalId(null)
    setEditingSubGoalName("")
  }

  // Delete subgoal
  const deleteSubGoal = (subGoalId) => {
    setSubGoals(subGoals.filter((sg) => sg.subGoalId !== subGoalId))

    // Close the swipeable
    if (swipeableRefs.current[subGoalId]) {
      swipeableRefs.current[subGoalId].close()
    }
  }

  // Date handling
  const handleStartDateConfirm = (date) => {
    setShowStartDatePicker(false)
    setStartDate(date)
  }

  const handleDueDateConfirm = (date) => {
    setShowDueDatePicker(false)
    setDueDate(date)
  }

  // Priority color function
  const getPriorityColor = (level) => {
    switch (level) {
      case "Red":
        return "#FF4757"
      case "Yellow":
        return "#FFD93D"
      case "Blue":
        return "#2F89FC"
      case "Green":
        return "#2ED573"
      default:
        return "#FFFFFF" // White for null
    }
  }

  // Get priority label
  const getPriorityLabel = (level) => {
    const option = priorityOptions.find((opt) => opt.value === level)
    return option ? option.label : "None"
  }

  // Render swipeable actions for subgoal
  const renderRightActions = (subGoal) => {
    return (
      <View style={[localStyles.swipeActionsContainer, dynamicStyles.swipeActions]}>
        <TouchableOpacity
          style={[localStyles.swipeAction, dynamicStyles.editAction]}
          onPress={() => {
            if (swipeableRefs.current[subGoal.subGoalId]) {
              swipeableRefs.current[subGoal.subGoalId].close()
            }
            startEditingSubGoal(subGoal)
          }}
        >
          <Icon name="edit" size={20} color="white" />
          <Text style={localStyles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[localStyles.swipeAction, dynamicStyles.deleteAction]}
          onPress={() => deleteSubGoal(subGoal.subGoalId)}
        >
          <Icon name="delete" size={20} color="white" />
          <Text style={localStyles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Render subgoal item
  const renderSubGoalItem = (subGoal) => {
    // If this subgoal is being edited
    if (editingSubGoalId === subGoal.subGoalId) {
      return (
        <View key={subGoal.subGoalId} style={[styles.subGoalRow, dynamicStyles.subGoalRow]}>
          <TextInput
            style={[styles.subGoalInput, dynamicStyles.subGoalInput, { flex: 1 }]}
            value={editingSubGoalName}
            onChangeText={setEditingSubGoalName}
            autoFocus
          />
          <View style={localStyles.editActions}>
            <TouchableOpacity onPress={cancelSubGoalEdit} style={localStyles.editActionButton}>
              <Icon name="close" size={20} color="#FF4757" />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveSubGoalEdit} style={localStyles.editActionButton}>
              <Icon name="check" size={20} color="#2ED573" />
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    // Regular subgoal item (swipeable in edit mode)
    if (editMode) {
      return (
        <Swipeable
          key={subGoal.subGoalId}
          ref={(ref) => (swipeableRefs.current[subGoal.subGoalId] = ref)}
          renderRightActions={() => renderRightActions(subGoal)}
        >
          <View style={[styles.subGoalRow, dynamicStyles.subGoalRow]}>
            <Text style={[styles.subGoalText, dynamicStyles.subGoalText]}>{subGoal.name}</Text>
            <TouchableOpacity style={styles.checkbox} onPress={() => toggleSubGoal(subGoal.subGoalId)}>
              {subGoal.isCompleted && <View style={styles.checkboxTick} />}
            </TouchableOpacity>
          </View>
        </Swipeable>
      )
    }

    // Read-only subgoal item
    return (
      <View key={subGoal.subGoalId} style={[styles.subGoalRow, dynamicStyles.subGoalRow]}>
        <Text style={[styles.subGoalText, dynamicStyles.subGoalText]}>{subGoal.name}</Text>
        <TouchableOpacity style={styles.checkbox} onPress={() => toggleSubGoal(subGoal.subGoalId)}>
          {subGoal.isCompleted && <View style={styles.checkboxTick} />}
        </TouchableOpacity>
      </View>
    )
  }

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, dynamicStyles.container, localStyles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text_alt }]}>Loading task details...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="white" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>{editMode ? "Edit Task" : "Task Details"}</Text>

        <View style={localStyles.headerActions}>
          {editMode ? (
            <TouchableOpacity style={styles.headerButton} onPress={saveChanges}>
              <Icon name="check" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.headerButton} onPress={toggleEditMode}>
                <Icon name="edit" size={22} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.headerButton} onPress={deleteTask}>
                <Icon name="delete" size={22} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Basic Info Section */}
        <View style={[styles.card, dynamicStyles.card]}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Task Information</Text>

          <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Title</Text>
          {editMode ? (
            <TextInput
              style={[styles.textInput, dynamicStyles.textInput]}
              placeholder="What needs to be done?"
              placeholderTextColor={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#A4B0BE"}
              value={title}
              onChangeText={setTitle}
            />
          ) : (
            <Text style={[styles.valueText, dynamicStyles.valueText]}>{title}</Text>
          )}

          <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Description</Text>
          {editMode ? (
            <TextInput
              style={[styles.textAreaInput, dynamicStyles.textAreaInput]}
              placeholder="Add details about this task..."
              placeholderTextColor={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#A4B0BE"}
              multiline
              value={description}
              onChangeText={setDescription}
            />
          ) : (
            <Text style={[styles.valueText, dynamicStyles.valueText]}>{description || "No description provided"}</Text>
          )}

          <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Priority</Text>
          {editMode ? (
            <View style={styles.priorityRow}>
              <View style={[styles.priorityPickerContainer, dynamicStyles.pickerContainer]}>
                <Picker
                  selectedValue={priorityLevel}
                  onValueChange={setPriorityLevel}
                  style={[styles.picker, dynamicStyles.picker]}
                  dropdownIconColor={colors.text_alt}
                >
                  {priorityOptions.map((option) => (
                    <Picker.Item
                      key={option.value || "none"}
                      label={option.label}
                      value={option.value}
                      color={isDarkMode ? "white" : undefined}
                    />
                  ))}
                </Picker>
              </View>
              <View style={[styles.priorityColorBox, { backgroundColor: getPriorityColor(priorityLevel) }]} />
            </View>
          ) : (
            <View style={localStyles.priorityDisplay}>
              <View
                style={[localStyles.priorityColorIndicator, { backgroundColor: getPriorityColor(priorityLevel) }]}
              />
              <Text style={[styles.valueText, dynamicStyles.valueText]}>{getPriorityLabel(priorityLevel)}</Text>
            </View>
          )}
        </View>

        {/* Timing Section */}
        <View style={[styles.card, dynamicStyles.card]}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Timing</Text>

          {editMode ? (
            <>
              <View style={styles.switchRow}>
                <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Enable Start Date</Text>
                <Switch
                  value={isStartDateEnabled}
                  onValueChange={setIsStartDateEnabled}
                  trackColor={{ false: "#D3D3D3", true: colors.primary }}
                  thumbColor={"#FFFFFF"}
                />
              </View>

              <TouchableOpacity
                onPress={() => isStartDateEnabled && setShowStartDatePicker(true)}
                style={[styles.dateContainer, dynamicStyles.dateContainer, !isStartDateEnabled && { opacity: 0.5 }]}
                disabled={!isStartDateEnabled}
              >
                <Text style={[styles.dateText, dynamicStyles.dateText]}>
                  {isStartDateEnabled ? startDate.toLocaleString() : "Start date not set"}
                </Text>
                <Icon name="event" size={24} color={colors.card_description} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Start Date</Text>
              <Text style={[styles.valueText, dynamicStyles.valueText]}>
                {isStartDateEnabled ? startDate.toLocaleString() : "Not set"}
              </Text>
            </>
          )}

          <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Due Date & Time</Text>
          {editMode ? (
            <TouchableOpacity
              onPress={() => setShowDueDatePicker(true)}
              style={[styles.dateContainer, dynamicStyles.dateContainer]}
            >
              <Text style={[styles.dateText, dynamicStyles.dateText]}>{dueDate.toLocaleString()}</Text>
              <Icon name="event" size={24} color={colors.card_description} />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.valueText, dynamicStyles.valueText]}>{dueDate.toLocaleString()}</Text>
          )}

          {/* Date Pickers (Modal) */}
          <DatePicker
            modal
            open={showStartDatePicker}
            date={startDate}
            onConfirm={handleStartDateConfirm}
            onCancel={() => setShowStartDatePicker(false)}
            mode="datetime"
            theme={isDarkMode ? "dark" : "light"}
          />

          <DatePicker
            modal
            open={showDueDatePicker}
            date={dueDate}
            onConfirm={handleDueDateConfirm}
            onCancel={() => setShowDueDatePicker(false)}
            mode="datetime"
            theme={isDarkMode ? "dark" : "light"}
          />
        </View>

        {/* Notification Section */}
        <View style={[styles.card, dynamicStyles.card]}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Notifications</Text>

          <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Notification Type</Text>
          {editMode ? (
            <View style={[styles.pickerContainer, dynamicStyles.pickerContainer]}>
              <Picker
                selectedValue={notificationType}
                onValueChange={setNotificationType}
                style={[styles.picker, dynamicStyles.picker]}
                dropdownIconColor={colors.text_alt}
              >
                <Picker.Item label="Push Notification" value="push" color={isDarkMode ? "white" : undefined} />
                <Picker.Item label="High-Priority Call" value="call" color={isDarkMode ? "white" : undefined} />
                <Picker.Item label="No Notification" value="none" color={isDarkMode ? "white" : undefined} />
              </Picker>
            </View>
          ) : (
            <Text style={[styles.valueText, dynamicStyles.valueText]}>
              {notificationType === "push"
                ? "Push Notification"
                : notificationType === "call"
                  ? "High-Priority Call"
                  : "No Notification"}
            </Text>
          )}

          <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Reminder Before Deadline</Text>
          {editMode ? (
            <View style={[styles.pickerContainer, dynamicStyles.pickerContainer]}>
              <Picker
                selectedValue={notificationOffset}
                onValueChange={setNotificationOffset}
                style={[styles.picker, dynamicStyles.picker]}
                dropdownIconColor={colors.text_alt}
              >
                {offsetOptions.map((opt) => (
                  <Picker.Item
                    key={opt}
                    label={opt.replace("-", " ")}
                    value={opt}
                    color={isDarkMode ? "white" : undefined}
                  />
                ))}
              </Picker>
            </View>
          ) : (
            <Text style={[styles.valueText, dynamicStyles.valueText]}>{notificationOffset.replace("-", " ")}</Text>
          )}

          {editMode ? (
            <View style={styles.switchRow}>
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Enable Recurring Reminders</Text>
              <Switch
                value={enableRecurringReminder}
                onValueChange={setEnableRecurringReminder}
                trackColor={{ false: "#D3D3D3", true: colors.primary }}
                thumbColor={"#FFFFFF"}
              />
            </View>
          ) : (
            <>
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Recurring Reminders</Text>
              <Text style={[styles.valueText, dynamicStyles.valueText]}>
                {enableRecurringReminder ? "Enabled" : "Disabled"}
              </Text>
            </>
          )}

          {enableRecurringReminder && (
            <>
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>Repeat Frequency</Text>
              {editMode ? (
                <View style={[styles.pickerContainer, dynamicStyles.pickerContainer]}>
                  <Picker
                    selectedValue={recurringFrequency}
                    onValueChange={setRecurringFrequency}
                    style={[styles.picker, dynamicStyles.picker]}
                    dropdownIconColor={colors.text_alt}
                  >
                    {frequencyOptions.map((freq) => (
                      <Picker.Item
                        key={freq}
                        label={freq.charAt(0).toUpperCase() + freq.slice(1)}
                        value={freq}
                        color={isDarkMode ? "white" : undefined}
                      />
                    ))}
                  </Picker>
                </View>
              ) : (
                <Text style={[styles.valueText, dynamicStyles.valueText]}>
                  {recurringFrequency.charAt(0).toUpperCase() + recurringFrequency.slice(1)}
                </Text>
              )}
            </>
          )}
        </View>

        {/* Sub-Goals Section */}
        <View style={[styles.card, dynamicStyles.card]}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Sub-Goals</Text>

          <View style={styles.subGoalContainer}>
            {subGoals.length > 0 ? (
              subGoals.map((subGoal) => renderSubGoalItem(subGoal))
            ) : (
              <Text style={[styles.emptyText, { color: colors.text_empty }]}>No sub-goals for this task</Text>
            )}
          </View>

          {editMode && (
            <View style={styles.subGoalInputRow}>
              <TextInput
                style={[styles.subGoalInput, dynamicStyles.subGoalInput]}
                placeholder="Add a sub-goal..."
                placeholderTextColor={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#A4B0BE"}
                value={newSubGoalName}
                onChangeText={setNewSubGoalName}
              />
              <TouchableOpacity onPress={addSubGoal} style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {editMode && (
          <View style={localStyles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: "#FF4757" }]}
              onPress={() => {
                resetFormValues()
                setEditMode(false)
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveButton, dynamicStyles.saveButton]} onPress={saveChanges}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

// Local styles specific to this component
const localStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
  },
  priorityDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  priorityColorIndicator: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#A4B0BE",
  },
  swipeActionsContainer: {
    flexDirection: "row",
    width: 160,
    marginBottom: 8,
    // borderRadius: 10,
  },
  swipeAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  editActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editActionButton: {
    padding: 8,
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
})

