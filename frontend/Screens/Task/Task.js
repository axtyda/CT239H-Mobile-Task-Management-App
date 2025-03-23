import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Style/TaskStyle';
import { notificationImg, UserProfile, AddImg } from '../../theme/Images';
import { Agenda, calendarTheme } from 'react-native-calendars';
import TaskService from '../../taskService';
import TaskItem from './TaskItem';

export default function Task() {
  const navigation = useNavigation();
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Format tasks when they're fetched from the API
  const formatTasks = useCallback((tasks) => {
    let formattedTasks = {};

    tasks.forEach((task) => {
      // Convert the date to a YYYY-MM-DD string
      const dateKey = task.dueDate.toISOString().split('T')[0];
      
      if (!formattedTasks[dateKey]) {
        formattedTasks[dateKey] = [];
      }
      
      formattedTasks[dateKey].push({
        id: task.id,
        name: task.title,
        time: task.dueDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        task: task.description,
        subGoals: task.subGoals,
        dueDate: task.dueDate.toLocaleDateString(),
        dateObj: task.dueDate,
      });
    });

    // Sort tasks for each day by time
    Object.keys(formattedTasks).forEach((date) => {
      formattedTasks[date].sort((a, b) => a.dateObj - b.dateObj);
    });

    return formattedTasks;
  }, []);

  // Fetch tasks from the service
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const tasks = await TaskService.getAllTasks();
      const formattedTasks = formatTasks(tasks);
      setItems(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [formatTasks]);

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Navigation to add task screen
  const goToTask = useCallback(() => {
    navigation.navigate('AddTask');
  }, [navigation]);

  // Customize the Agenda theme
  const customTheme = useMemo(() => ({
    ...calendarTheme,
    agendaTodayColor: '#20bf55',
    agendaKnobColor: '#20bf55',
    selectedDayBackgroundColor: '#20bf55',
    dotColor: '#20bf55',
  }), []);

  // Render empty day state
  const renderEmptyData = useCallback(() => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No Task for this day</Text>
    </View>
  ), []);

  // Memoize items to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [items]);

  // Memoize the render item function
  const renderItem = useCallback((item) => (
    <TaskItem item={item} />
  ), []);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.taskView}>
        <View style={styles.profileView}>
          <Image source={UserProfile} style={styles.userProfile} />
          <View style={styles.details}>
            <Text style={styles.mesText}>Task List</Text>
            <Text style={styles.taskText}>Upcoming Task</Text>
          </View>
        </View>

        <TouchableOpacity>
          <Image source={notificationImg} style={styles.notiImg} />
        </TouchableOpacity>

        <TouchableOpacity onPress={fetchTasks} style={{ marginRight: 10 }}>
          <Text style={{ color: 'blue' }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar / Agenda */}
      <View style={styles.calenderView}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#20bf55" />
            <Text style={{ marginTop: 10 }}>Loading tasks...</Text>
          </View>
        ) : (
          <View style={styles.mainCalenderView}>
            <Agenda
              key="task-agenda"
              items={memoizedItems}
              theme={customTheme}
              showOnlySelectedDayItems={false}
              renderEmptyData={renderEmptyData}
              renderItem={renderItem}
              selected={selectedDate}
              onDayPress={(day) => setSelectedDate(day.dateString)}
              // Additional performance optimizations
              pastScrollRange={3}
              futureScrollRange={3}
              refreshControl={null}
              refreshing={false}
            />
          </View>
        )}
      </View>

      {/* Floating Action Button to add a task */}
      <TouchableOpacity onPress={goToTask} style={styles.stickyCircle}>
        <Image source={AddImg} style={styles.addImg} />
      </TouchableOpacity>
    </View>
  );
}