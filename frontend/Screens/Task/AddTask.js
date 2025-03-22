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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import TaskService from '../../taskService';
import { styles } from './Style/AddTaskStyle';
import { backArrowImg, calenderImg } from '../../theme/Images';

export default function AddTask({ navigation }) {
  const goBack = () => {
    navigation.goBack();
  };

  // Priority level
  const [priorityLevel, setPriorityLevel] = useState('Red');

  // Basic fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Due date/time
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Notification type
  const [notificationType, setNotificationType] = useState('push');

  // Sub-goals
  const [subGoals, setSubGoals] = useState([]);
  const [newSubGoalName, setNewSubGoalName] = useState('');

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

  // Date picker handler
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      // Keep the old time
      const hours = dueDate.getHours();
      const minutes = dueDate.getMinutes();

      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hours);
      newDateTime.setMinutes(minutes);

      setDueDate(newDateTime);
    }
  };

  // Time picker handler
  const onTimeChange = (event, selectedTime) => {
    if (Platform.OS !== 'ios') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      // Keep the old date
      const year = dueDate.getFullYear();
      const month = dueDate.getMonth();
      const day = dueDate.getDate();

      const newDateTime = new Date(selectedTime);
      newDateTime.setFullYear(year, month, day);

      setDueDate(newDateTime);
    }
  };

  // Show pickers
  const showDueDatePicker = () => setShowDatePicker(true);
  const showDueTimePicker = () => setShowTimePicker(true);

  // Add sub-goal
  const addSubGoal = () => {
    if (newSubGoalName.trim() !== '') {
      const newId = Date.now();
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
    if (!notificationType) {
      Alert.alert('Missing Field', 'Notification type is required.');
      return;
    }

    const newTask = {
      title,
      description,
      priorityLevel,
      dueDate,
      notificationType,
      subGoals,
    };

    console.log('Creating new task:', newTask);

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

      {/* Due Date */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Due Date</Text>
        <View style={styles.dateRow}>
          <TextInput
            style={styles.textInput}
            value={dueDate.toDateString()} // e.g. "Mon Jun 26 2025"
            placeholder="Select due date"
            editable={false}
          />
          <TouchableOpacity onPress={showDueDatePicker}>
            <Image source={calenderImg} style={styles.calendarIcon} />
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Due Time */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Due Time</Text>
        <View style={styles.dateRow}>
          <TextInput
            style={styles.textInput}
            value={dueDate.toLocaleTimeString()} // e.g. "10:30:00 AM"
            placeholder="Select due time"
            editable={false}
          />
          <TouchableOpacity onPress={showDueTimePicker}>
            <Image source={calenderImg} style={styles.calendarIcon} />
          </TouchableOpacity>
        </View>
        {showTimePicker && (
          <DateTimePicker
            value={dueDate}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
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

        {/* New sub-goal input */}
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
