import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import { v4 as uuidv4 } from 'uuid';
import { styles } from './Style/AddTaskStyle';
import { backArrowImg, calenderImg } from '../../theme/Images';
import TaskService from '../../taskService';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AddTask({ navigation }) {
  // State management
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('Red');
  const [dueDate, setDueDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [subGoals, setSubGoals] = useState([]);
  const [newSubGoalName, setNewSubGoalName] = useState('');
  const [notificationOffset, setNotificationOffset] = useState('1-hour');
  const [enableRecurringReminder, setEnableRecurringReminder] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('daily');
  const [isStartDateEnabled, setIsStartDateEnabled] = useState(false);
  const [notificationType, setNotificationType] = useState('push');

  // Priority options using Eisenhower Matrix
  const priorityOptions = [
    { label: 'Urgent and Important', value: 'Red' },
    { label: 'Not Urgent but Important', value: 'Yellow' },
    { label: 'Urgent but Not Important', value: 'Blue' },
    { label: 'Not Urgent and Not Important', value: 'Green' },
  ];

  const offsetOptions = [
    '15-minutes', '30-minutes', '1-hour', '2-hours',
    '6-hours', '12-hours', '1-day', '2-days', '1-week'
  ];

  const frequencyOptions = ['daily', 'weekly', 'monthly'];

  // Sub-goal handling
  const addSubGoal = () => {
    if (newSubGoalName.trim()) {
      setSubGoals([...subGoals, {
        subGoalId: Date.now().toString(),
        name: newSubGoalName,
        isCompleted: false
      }]);
      setNewSubGoalName('');
    }
  };

  const removeSubGoal = (id) => {
    setSubGoals(subGoals.filter(sg => sg.subGoalId !== id));
  };

  // Date handling
  const handleStartDateConfirm = (date) => {
    setShowStartDatePicker(false);
    setStartDate(date);
  };

  const handleDueDateConfirm = (date) => {
    setShowDueDatePicker(false);
    setDueDate(date);
  };

  // Priority color function
  const getPriorityColor = (level) => {
    switch(level) {
      case 'Red': return '#FF4757';
      case 'Yellow': return '#FFD93D';
      case 'Blue': return '#2F89FC';
      case 'Green': return '#2ED573';
      default: return '#A4B0BE';
    }
  };

  // Task creation
  const createTask = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Title is required.');
      return;
    }

    const taskData = {
      id: Date.now().toString(),
      title,
      description,
      priorityLevel,
      startDate: isStartDateEnabled ? startDate : null,
      dueDate,
      notificationType,
      notificationOffset,
      enableRecurringReminder,
      recurringFrequency: enableRecurringReminder ? recurringFrequency : '',
      subGoals,
      createdAt: new Date(),
      finishedStatus: 'pending'
    };

    try {
      await TaskService.addTask(taskData);
      Alert.alert('Success', 'Task created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Could not create the task.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Task</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Basic Info Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Task Information</Text>
          
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What needs to be done?"
            placeholderTextColor="#A4B0BE"
            value={title}
            onChangeText={setTitle}
          />
          
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Add details about this task..."
            placeholderTextColor="#A4B0BE"
            multiline
            value={description}
            onChangeText={setDescription}
          />
          
          <Text style={styles.inputLabel}>Priority</Text>
          <View style={styles.priorityRow}>
            <View style={styles.priorityPickerContainer}>
              <Picker
                selectedValue={priorityLevel}
                onValueChange={setPriorityLevel}
                style={styles.picker}
              >
                {priorityOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
            <View style={[
              styles.priorityColorBox,
              { backgroundColor: getPriorityColor(priorityLevel) }
            ]} />
          </View>
        </View>

        {/* Timing Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Timing</Text>
          
          <View style={styles.switchRow}>
            <Text style={styles.inputLabel}>Enable Start Date</Text>
            <Switch
              value={isStartDateEnabled}
              onValueChange={setIsStartDateEnabled}
              trackColor={{ false: '#D3D3D3', true: '#2ED573' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          
          <TouchableOpacity
            onPress={() => isStartDateEnabled && setShowStartDatePicker(true)}
            style={[styles.dateContainer, !isStartDateEnabled && { opacity: 0.5 }]}
            disabled={!isStartDateEnabled}
          >
            <Text style={styles.dateText}>
              {isStartDateEnabled ? startDate.toLocaleString() : 'Start date not set'}
            </Text>
            <Icon name="event" size={24} color="#57606F" />
          </TouchableOpacity>
          
          <Text style={styles.inputLabel}>Due Date & Time</Text>
          <TouchableOpacity
            onPress={() => setShowDueDatePicker(true)}
            style={styles.dateContainer}
          >
            <Text style={styles.dateText}>
              {dueDate.toLocaleString()}
            </Text>
            <Icon name="event" size={24} color="#57606F" />
          </TouchableOpacity>
          
          {/* Date Pickers (Modal) */}
          <DatePicker
            modal
            open={showStartDatePicker}
            date={startDate}
            onConfirm={handleStartDateConfirm}
            onCancel={() => setShowStartDatePicker(false)}
            mode="datetime"
          />
          
          <DatePicker
            modal
            open={showDueDatePicker}
            date={dueDate}
            onConfirm={handleDueDateConfirm}
            onCancel={() => setShowDueDatePicker(false)}
            mode="datetime"
          />
        </View>

        {/* Notification Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <Text style={styles.inputLabel}>Notification Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={notificationType}
              onValueChange={setNotificationType}
              style={styles.picker}
            >
              <Picker.Item label="Push Notification" value="push" />
              <Picker.Item label="High-Priority Call" value="call" />
              <Picker.Item label="No Notification" value="none" />
            </Picker>
          </View>
          
          <Text style={styles.inputLabel}>Reminder Before Deadline</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={notificationOffset}
              onValueChange={setNotificationOffset}
              style={styles.picker}
            >
              {offsetOptions.map(opt => (
                <Picker.Item
                  key={opt}
                  label={opt.replace('-', ' ')}
                  value={opt}
                />
              ))}
            </Picker>
          </View>
          
          <View style={styles.switchRow}>
            <Text style={styles.inputLabel}>Enable Recurring Reminders</Text>
            <Switch
              value={enableRecurringReminder}
              onValueChange={setEnableRecurringReminder}
              trackColor={{ false: '#D3D3D3', true: '#2ED573' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          
          {enableRecurringReminder && (
            <>
              <Text style={styles.inputLabel}>Repeat Frequency</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={recurringFrequency}
                  onValueChange={setRecurringFrequency}
                  style={styles.picker}
                >
                  {frequencyOptions.map(freq => (
                    <Picker.Item 
                      key={freq} 
                      label={freq.charAt(0).toUpperCase() + freq.slice(1)} 
                      value={freq} 
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}
        </View>

        {/* Sub-Goals Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sub-Goals</Text>
          
          <View style={styles.subGoalContainer}>
            {subGoals.map(subGoal => (
              <View key={subGoal.subGoalId} style={styles.subGoalRow}>
                <Text style={styles.subGoalText}>{subGoal.name}</Text>
                <TouchableOpacity 
                  onPress={() => removeSubGoal(subGoal.subGoalId)}
                  style={styles.removeButton}
                >
                  <Icon name="close" size={20} color="#FF4757" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <View style={styles.subGoalInputRow}>
            <TextInput
              style={styles.subGoalInput}
              placeholder="Add a sub-goal..."
              placeholderTextColor="#A4B0BE"
              value={newSubGoalName}
              onChangeText={setNewSubGoalName}
            />
            <TouchableOpacity onPress={addSubGoal} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={createTask}>
          <Text style={styles.createButtonText}>Create Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}