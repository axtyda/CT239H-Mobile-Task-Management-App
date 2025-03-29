import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { styles } from './Style/AddTaskStyle';
import { backArrowImg, calenderImg } from '../../theme/Images';
import TaskService from '../../taskService';
import { v4 as uuidv4 } from 'uuid';

export default function AddTask({ navigation }) {
  const goBack = () => {
    navigation.goBack();
  };

  // Priority level
  const [priorityLevel, setPriorityLevel] = useState('Red');

  // Basic fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Start date/time
  const initialDueDate = new Date();
  const [startDate, setStartDate] = useState(new Date(initialDueDate));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [isStartDateDisabled, setIsStartDateDisabled] = useState(false);

  // Due date/time
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showDueTimePicker, setShowDueTimePicker] = useState(false);

  // Notification type
  const [notificationType, setNotificationType] = useState('push');

  // Sub-goals
  const [subGoals, setSubGoals] = useState([]);
  const [newSubGoalName, setNewSubGoalName] = useState('');

  const [notificationOffset, setNotificationOffset] = useState('1-hour');
  const [enableRecurringReminder, setEnableRecurringReminder] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('hourly');

  const offsetOptions = [
    '1-hour', '2-hour', '1-day', '2-day', '1-week', '2-week', '1-month',];
  const frequencyOptions = ['hourly', 'daily', 'weekly'];

  // Helper to color the priority preview box
  const getPriorityColor = (level) => {
    switch (level) {
      case 'Red':
        return '#FF0000';
      case 'Yellow':
        return '#FFD700';
      case 'Blue':
        return '#0000FF';
      case 'Green':
      default:
        return '#008000';
    }
  };

  // Start Date and Time handlers
  const showStartPicker = () => {
    if (isStartDateDisabled) setShowStartDatePicker(true);
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setShowStartTimePicker(true);
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const updatedDate = new Date(startDate);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setStartDate(updatedDate);
    }
  };

  // Due Date and Time handlers
  const showDuePicker = () => {
    setShowDueDatePicker(true);
  };

  const onDueDateChange = (event, selectedDate) => {
    setShowDueDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
      setShowDueTimePicker(true);
    }
  };

  const onDueTimeChange = (event, selectedTime) => {
    setShowDueTimePicker(false);
    if (selectedTime) {
      const updatedDate = new Date(dueDate);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setDueDate(updatedDate);
    }
  };

  // Add sub-goal
  const addSubGoal = () => {
    if (newSubGoalName.trim() !== '') {
      const newId = Date.now().toString();
      setSubGoals([
        ...subGoals,
        { subGoalId: newId, name: newSubGoalName, isCompleted: false },
      ]);
      setNewSubGoalName('');
    }
  };

  // Remove sub-goal
  const removeSubGoal = (id) => {
    const updated = subGoals.filter((sg) => sg.subGoalId !== id);
    setSubGoals(updated);
  };

  // Create task
  const createTask = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Title is required.');
      return;
    }
    if (!dueDate) {
      Alert.alert('Missing Field', 'Due date/time is required.');
      return;
    }
    if (!startDate) {
      Alert.alert('Missing Field', 'Start date/time is required.');
      return;
    }
    if (!notificationType) {
      Alert.alert('Missing Field', 'Notification type is required.');
      return;
    }

    const newTask = {
      id: Date.now().toString(), // Unique ID for the task
      title,
      description,
      priorityLevel,
      startDate,
      dueDate,
      notificationType,
      notificationOffset,
      enableRecurringReminder,
      recurringFrequency: enableRecurringReminder ? recurringFrequency : '',
      subGoals,
      createdAt: new Date(),
    };

    try {
      await TaskService.addTask(newTask);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Could not create the task.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Image source={backArrowImg} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Task</Text>
      </View>

      {/* Title */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter task title"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Description */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.textInput, { height: 80 }]}
          placeholder="Enter task description (optional)"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Priority Level */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          <View style={styles.priorityPickerContainer}>
            <Picker
              selectedValue={priorityLevel}
              onValueChange={(value) => setPriorityLevel(value)}
              style={styles.priorityPicker}
            >
              <Picker.Item label="Urgent and Important" value="Red" />
              <Picker.Item label="Not Urgent but Important" value="Yellow" />
              <Picker.Item label="Urgent but Not Important" value="Blue" />
              <Picker.Item label="Not Urgent and Not Important" value="Green" />
            </Picker>
          </View>
          <View
            style={[
              styles.priorityColorBox,
              { backgroundColor: getPriorityColor(priorityLevel) },
            ]}
          />
        </View>
      </View>

      {/* Start Date and Time */}
      <View style={styles.inputWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.label}>Start Date and Time</Text>
          <Switch
            value={isStartDateDisabled}
            onValueChange={(value) => {
              setIsStartDateDisabled(value);
              if (value) setStartDate(new Date(dueDate));
            }}
          />
        </View>
        <TouchableOpacity
          onPress={showStartPicker}
          style={[
            styles.dateTimeDisplay,
            !isStartDateDisabled && { backgroundColor: '#E0E0E0', opacity: 0.6 }, // Disabled style
          ]}
          disabled={!isStartDateDisabled}
        >
          <Text style={{ flex: 1, fontSize: 14, fontFamily: 'regular' }}>
            {startDate.toLocaleString()}
          </Text>
          <Image source={calenderImg} style={styles.calendarIcon} />
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onStartDateChange}
          />
        )}
        {showStartTimePicker && (
          <DateTimePicker
            value={startDate}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onStartTimeChange}
          />
        )}
      </View>

      {/* Due Date and Time */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Due Date and Time</Text>
        <TouchableOpacity onPress={showDuePicker} style={styles.dateTimeDisplay}>
          <Text style={{ flex: 1, fontSize: 14, fontFamily: 'regular' }}>
            {dueDate.toLocaleString()}
          </Text>
          <Image source={calenderImg} style={styles.calendarIcon} />
        </TouchableOpacity>
        {showDueDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDueDateChange}
          />
        )}
        {showDueTimePicker && (
          <DateTimePicker
            value={dueDate}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onDueTimeChange}
          />
        )}
      </View>

      {/* Notification Type */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Notification</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={notificationType}
            onValueChange={(value) => setNotificationType(value)}
            style={styles.picker}
          >
            <Picker.Item label="Push Notification" value="push" />
            <Picker.Item label="High-Priority Call" value="call" />
            <Picker.Item label="None" value="" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Reminder Before Deadline</Text>
        <Picker
          selectedValue={notificationOffset}
          onValueChange={(value) => setNotificationOffset(value)}
          style={styles.picker}
        >
          {offsetOptions.map((opt) => (
            <Picker.Item key={opt} label={opt.replace('-', ' ')} value={opt} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.label}>Enable Regular Reminders</Text>
          <Switch
            value={enableRecurringReminder}
            onValueChange={setEnableRecurringReminder}
          />
        </View>
        {enableRecurringReminder && (
          <Picker
            selectedValue={recurringFrequency}
            onValueChange={(value) => setRecurringFrequency(value)}
            style={styles.picker}
          >
            {frequencyOptions.map((freq) => (
              <Picker.Item key={freq} label={freq} value={freq} />
            ))}
          </Picker>
        )}
      </View>

      {/* Sub-Goals */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Sub-Goals</Text>
        {subGoals.map((subGoal) => (
          <View key={subGoal.subGoalId} style={styles.subGoalRow}>
            <Text style={styles.subGoalText}>{subGoal.name}</Text>
            <TouchableOpacity onPress={() => removeSubGoal(subGoal.subGoalId)}>
              <Text style={styles.removeSubGoalText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.subGoalInputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Add a sub-goal..."
            value={newSubGoalName}
            onChangeText={setNewSubGoalName}
          />
          <TouchableOpacity onPress={addSubGoal} style={styles.addSubGoalBtn}>
            <Text style={styles.addSubGoalBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Button */}
      <TouchableOpacity style={styles.createBtn} onPress={createTask}>
        <Text style={styles.createBtnText}>Create Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}