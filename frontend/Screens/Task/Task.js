import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Style/TaskStyle';
import { notificationImg, UserProfile, AddImg } from '../../theme/Images';
import TaskService from '../../taskService';
import TaskItem from './TaskItem';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Feather';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Task() {
  const navigation = useNavigation();

  // State
  const [tasks, setTasks] = useState([]);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [weekDays] = useState(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

  // Format tasks from API
  const formatTasks = useCallback((tasksArray) => {
    let formattedTasks = {};
    if (!Array.isArray(tasksArray)) return {};

    tasksArray.forEach((task) => {
      if (!task || !task.dueDate) return;

      // Use local date components instead of ISO
      const year = task.dueDate.getUTCFullYear();
      const month = task.dueDate.getUTCMonth() + 1; // UTC months are 0-based
      const day = task.dueDate.getUTCDate();
      const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;


      if (!formattedTasks[dateKey]) {
        formattedTasks[dateKey] = [];
      }
      formattedTasks[dateKey].push({
        id: task.id,
        name: task.title,
        time: task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        task: task.description,
        subGoals: task.subGoals || [],
        dueDate: task.dueDate.toLocaleDateString(),
        dateObj: task.dueDate,
      });
    });

    // Sort tasks by time
    // Object.keys(formattedTasks).forEach((date) => {
    //   formattedTasks[date].sort((a, b) => a.dateObj - b.dateObj);
    // });
    return formattedTasks;
  }, []);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const allTasks = await TaskService.getAllTasks();
      const tasksArray = Array.isArray(allTasks) ? allTasks : Array.from(allTasks || []);
      setTasks(tasksArray);
      setItems(formatTasks(tasksArray));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      setItems({});
    } finally {
      setLoading(false);
    }
  }, [formatTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Generate the monthly calendar data
  useEffect(() => {
    generateCalendarData(currentMonth);
  }, [currentMonth]);

  const generateCalendarData = (date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth(); // UTC month is 0-based
    const daysInMonthCount = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();

    let days = [];
    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthDays = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({
        day,
        month: prevMonth,
        year: prevMonthYear,
        date: new Date(prevMonthYear, prevMonth, day),
        isCurrentMonth: false,
      });
    }
    // Current month days
    for (let i = 1; i <= daysInMonthCount; i++) {
      days.push({
        day: i,
        month,
        year,
        date: new Date(Date.UTC(year, month, i)), // UTC date
        isCurrentMonth: true,
      });
    }
    // Next month days
    const totalCells = 42; // 6 rows x 7 columns
    const remainingCells = totalCells - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        date: new Date(nextMonthYear, nextMonth, i),
        isCurrentMonth: false,
      });
    }
    setDaysInMonth(days);
  };

  // Expand/Collapse with LayoutAnimation
  const expandCalendar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCalendarExpanded(true);
  };

  const collapseCalendar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCalendarExpanded(false);
  };

  // Select date
  const onDatePress = (date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    setSelectedDate(utcDate);
  };

  // Tasks for selected date
  const getTasksForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return items[dateString] || [];
  }, [items, selectedDate]);

  // Check if a date has tasks
  const hasTask = (date) => {
    if (!date || !items) return false;
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return !!(items[dateKey] && items[dateKey].length > 0);
  };

  // Render a single day cell
  const renderCalendarDay = (dayObj) => {
    if (!dayObj || !dayObj.date) return null;
    const isSelected =
      selectedDate &&
      selectedDate.getDate() === dayObj.day &&
      selectedDate.getMonth() === dayObj.month &&
      selectedDate.getFullYear() === dayObj.year;
    const dayHasTask = hasTask(dayObj.date);

    return (
      <TouchableOpacity
        key={`${dayObj.year}-${dayObj.month}-${dayObj.day}`}
        style={[
          styles.calendarDay,
          !dayObj.isCurrentMonth && styles.otherMonthDay,
          isSelected && styles.selectedDay,
        ]}
        onPress={() => onDatePress(dayObj.date)}
      >
        <Text
          style={[
            styles.calendarDayText,
            !dayObj.isCurrentMonth && styles.otherMonthDayText,
            isSelected && styles.selectedDayText,
          ]}
        >
          {dayObj.day}
        </Text>
        {dayHasTask && <View style={styles.taskIndicator} />}
      </TouchableOpacity>
    );
  };

  // Collapsed: show the current week only + month/year
  const renderWeekView = () => {
    if (!selectedDate) return null;
    const currentDate = new Date(selectedDate);
    const dayIndex = currentDate.getDay();
    const diff = currentDate.getDate() - dayIndex;

    const weekDaysData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(diff + i);
      weekDaysData.push({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        date,
        isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
      });
    }

    return (
      <View style={styles.weekViewContainer}>
        {/* (Optional) Month/Year in Collapsed View */}
        <View style={styles.monthYearContainer}>
        </View>
        <View style={styles.weekDaysHeader}>
          {weekDays.map((wDay, index) => (
            <Text key={`weekday-${index}`} style={styles.weekDayText}>
              {wDay}
            </Text>
          ))}
        </View>
        <View style={styles.weekDaysRow}>
          {weekDaysData.map((dayObj, idx) => (
            <React.Fragment key={`weekday-${idx}`}>
              {renderCalendarDay(dayObj)}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  };

  // Expanded: show the full month grid
  const renderMonthlyCalendar = () => {
    if (!daysInMonth.length) return null;
    const weeks = [];
    for (let i = 0; i < 6; i++) {
      weeks.push(daysInMonth.slice(i * 7, (i + 1) * 7));
    }

    return (
      <View style={styles.monthViewContainer}>
        <View style={styles.weekDaysHeader}>
          {weekDays.map((wDay, index) => (
            <Text key={`monthday-${index}`} style={styles.weekDayText}>
              {wDay}
            </Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.weekRow}>
              {week.map((dayObj, dayIndex) => (
                <React.Fragment key={`day-${weekIndex}-${dayIndex}`}>
                  {renderCalendarDay(dayObj)}
                </React.Fragment>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Navigate to AddTask
  const goToTask = useCallback(() => {
    navigation.navigate('AddTask');
  }, [navigation]);

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
            <ActivityIndicator size='large' color='#20bf55' />
            <Text style={{ marginTop: 10 }}>Loading tasks...</Text>
          </View>
        ) : (
          <View style={styles.mainCalenderView}>
            {/* Collapsed vs Expanded */}
            {!isCalendarExpanded ? (
              <View style={styles.calendarContainer}>
                {/* Week View */}
                <TouchableOpacity onPress={expandCalendar}>
                  <Text style={styles.monthYearText}>
                    {format(currentMonth, 'MMMM yyyy')}
                  </Text>
                </TouchableOpacity>
                {renderWeekView()}

                {/* Tap arrow to expand */}
              </View>
            ) : (
              <View style={styles.calendarContainer}>
                {/* Tap text to collapse */}
                <TouchableOpacity onPress={collapseCalendar}>
                  <Text style={styles.monthYearText}>
                    {format(currentMonth, 'MMMM yyyy')}
                  </Text>
                </TouchableOpacity>

                {/* Full Month View */}
                {renderMonthlyCalendar()}
              </View>
            )}

            {/* Tasks List */}
              <View style={styles.taskListContainer}>
                {getTasksForSelectedDate.length > 0 ? (
                  <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                  >
                    {getTasksForSelectedDate.map((task, index) => (
                      <TaskItem key={`task-${task.id}-${index}`} item={task} />
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.emptyTaskContainer}>
                    <Text style={styles.emptyTaskText}>No tasks for this day</Text>
                  </View>
                )}
              </View>
          </View>
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity onPress={goToTask} style={styles.stickyCircle}>
        <Image source={AddImg} style={styles.addImg} />
      </TouchableOpacity>
    </View>
  );
}
