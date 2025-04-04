import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  TextInput
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { styles } from './Style/TaskStyle';
import { UserProfile } from '../../theme/Images';
import TaskService from '../../taskService';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Helper to get date key (unchanged, still needed for grouping)
const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Task() {
  const navigation = useNavigation();

  // State
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [weekDays] = useState(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);


  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Search across all tasks, not just the selected date
    const results = tasks.filter(task =>
      task.title.toLowerCase().includes(text.toLowerCase())
    );

    setSearchResults(formatTasks(results));
  };

  const toggleSearch = () => {
    const newSearchVisible = !searchVisible;
    setSearchVisible(newSearchVisible);

    if (!newSearchVisible) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  // Format tasks using toLocaleString
  const formatTasks = useCallback((tasksArray) => {
    const formattedTasks = {};
    tasksArray.forEach((task) => {
      if (!task || !task.dueDate) return;

      // Convert dates into Date objects if needed
      const dueDateObj = new Date(task.dueDate);
      const startDateObj = new Date(task.startDate);
      const dateKey = getDateKey(dueDateObj);

      // Format dates as readable strings
      const formattedStartDate = startDateObj.toLocaleString([], { month: 'long', day: 'numeric', year: 'numeric' });
      const formattedDueDate = dueDateObj.toLocaleString([], { month: 'long', day: 'numeric', year: 'numeric' });
      const formattedTime = dueDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (!formattedTasks[dateKey]) {
        formattedTasks[dateKey] = [];
      }

      formattedTasks[dateKey].push({
        id: task.id,
        title: task.title,
        description: task.description,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        time: formattedTime,
        notificationType: task.notificationType,
        notificationOffset: task.notificationOffset,
        priorityLevel: task.priorityLevel,
        subGoals: task.subGoals ? task.subGoals.map(sg => ({
          subGoalId: sg.subGoalId,
          name: sg.name,
          isCompleted: sg.isCompleted,
        })) : [],
      });
    });
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

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
      console.log('Fetching tasks on focus...');
    }, [fetchTasks])
  );

  // Generate the monthly calendar data
  const generateCalendarData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonthCount = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

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
        date: new Date(year, month, i),
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

  // Change month handler
  const changeMonth = (direction) => {
    setCurrentMonth((prevMonth) => {
      return direction === 'prev' ? subMonths(prevMonth, 1) : addMonths(prevMonth, 1);
    });
  };

  useEffect(() => {
    generateCalendarData(currentMonth);
  }, [currentMonth]);

  // Expand/Collapse calendar
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
    setSelectedDate(date);
  };

  // Tasks for selected date
  const getTasksForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = getDateKey(selectedDate);
    return items[dateKey] || [];
  }, [items, selectedDate]);

  // Check if a date has tasks
  const hasTask = (date) => {
    if (!date || !items) return false;
    const dateKey = getDateKey(date);
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

  // Collapsed: show the current week only
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

  // Get background color based on priority level - similar to Home.js
  const getPriorityColor = (priorityLevel) => {
    switch (priorityLevel) {
      case 'Red':
        return '#FF4757'; // Urgent and Important
      case 'Yellow':
        return '#FFD93D'; // Not Urgent but Important
      case 'Blue':
        return '#2F89FC'; // Urgent but Not Important
      case 'Green':
      default:
        return '#2ED573'; // Not Urgent and Not Important
    }
  };

  // Toggle Subgoal completion
  const toggleSubGoal = async (taskId, subGoalId) => {
    try {
      await TaskService.updateSubGoal(taskId, subGoalId);
      fetchTasks(); // Refresh tasks to show updates
    } catch (error) {
      console.error("Error updating subgoal:", error);
    }
  };

  // Task Card component (similar to Home.js but with subgoals)
  const TaskCard = ({ task }) => {
    // Check if startDate is null or the same as dueDate
    const shouldShowSingleDate = !task.startDate || task.startDate === task.dueDate;
    const priorityColor = getPriorityColor(task.priorityLevel);

    return (
      <View style={styles.taskCard}>
        <View style={styles.taskContent}>
          {/* Task title with priority indicator as background and left border */}
          <View style={[
            styles.taskTitleContainer,
            {
              backgroundColor: priorityColor + '20',
              borderLeftWidth: 4,
              borderLeftColor: priorityColor,
              borderRightWidth: 4,
              borderRightColor: priorityColor,
            }
          ]}>
            <Text style={styles.taskTitle}>{task.title}</Text>
          </View>

          {task.description && (
            <Text style={styles.taskDescription} numberOfLines={2}>
              {task.description}
            </Text>
          )}

          {/* Task date and time metadata */}
          <View style={styles.taskMeta}>
            {/* Due date with icon */}
            <View style={styles.metaItem}>
              <Icon name="event" size={16} color="#57606F" />
              <Text style={styles.taskMetaText}>
                {shouldShowSingleDate ? task.dueDate : `${task.startDate} - ${task.dueDate}`}
              </Text>
            </View>

            {/* Time with icon */}
            <View style={styles.metaItem}>
              <Icon name="access-time" size={16} color="#57606F" />
              <Text style={styles.taskMetaText}>{task.time}</Text>
            </View>
          </View>

          {/* Subgoals section with checkboxes on the right */}
          {task.subGoals && task.subGoals.length > 0 && (
            <View style={styles.subGoalsContainer}>
              {task.subGoals.map((sub, index) => (
                <View key={index} style={styles.subGoalRow}>
                  <Text style={styles.subGoalText}>{sub.name}</Text>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => toggleSubGoal(task.id, sub.subGoalId)}
                  >
                    {sub.isCompleted && <View style={styles.checkboxTick} />}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  // Navigate to AddTask
  const goToTask = useCallback(() => {
    navigation.navigate('AddTask');
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.taskView}>
        {/* Hide profile when search is visible */}
        {!searchVisible ? (
          <View style={styles.profileView}>
            <Image source={UserProfile} style={styles.userProfile} />
            <View style={styles.details}>
              <Text style={styles.mesText}>Task List</Text>
              <Text style={styles.taskText}>Upcoming Task</Text>
            </View>
          </View>
        ) : (
          <View style={styles.headerSearchContainer}>
            <View style={styles.searchInputWrapper}>
              <Icon name="search" size={18} color="rgba(255, 255, 255, 0.7)" />
              <TextInput
                ref={searchInputRef}
                style={styles.headerSearchInput}
                placeholder="Search tasks..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus={true}
              />
            </View>

            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearSearch}>
                <Icon name="close" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.headerActions}>
          {/* Add search toggle button */}
          <TouchableOpacity onPress={toggleSearch} style={styles.headerButton}>
            <Icon name={searchVisible ? "close" : "search"} size={22} color="white" />
          </TouchableOpacity>

          {!searchVisible && (
            <>
              <TouchableOpacity onPress={fetchTasks} style={styles.headerButton}>
                <Icon name="refresh" size={22} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }}
                style={styles.headerButton}
              >
                <Icon name="today" size={22} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#20bf55" />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              {searchVisible && searchQuery.length > 0 ? (
                <View style={styles.searchResultsContainer}>
                  <Text style={styles.sectionTitle}>Search Results</Text>
                  {Object.values(searchResults).flat().length > 0 ? (
                    Object.values(searchResults).flat().map((task, index) => (
                      <TaskCard key={`search-task-${task.id}-${index}`} task={task} />
                    ))
                  ) : (
                    <View style={styles.emptyTaskContainer}>
                      <Text style={styles.emptyTaskText}>No matching tasks found</Text>
                    </View>
                  )}
                </View>
              ) : (
                <>
                  <View style={styles.calendarContainer}>
                    <View style={styles.calendarHeader}>
                      <TouchableOpacity
                        onPress={() => changeMonth("prev")}
                        style={styles.monthNavButton}
                      >
                        <Icon name="chevron-left" size={24} color="#333" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={isCalendarExpanded ? collapseCalendar : expandCalendar}
                      >
                        <Text style={styles.monthYearText}>
                          {currentMonth.toLocaleString([], {
                            month: "long",
                            year: "numeric",
                          })}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => changeMonth("next")}
                        style={styles.monthNavButton}
                      >
                        <Icon name="chevron-right" size={24} color="#333" />
                      </TouchableOpacity>
                    </View>
                    {isCalendarExpanded ? renderMonthlyCalendar() : renderWeekView()}
                  </View>
                  <Text style={styles.sectionTitle}>
                    {selectedDate.toLocaleDateString([], {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  {getTasksForSelectedDate.length > 0 ? (
                    getTasksForSelectedDate.map((task, index) => (
                      <TaskCard key={`task-${task.id}-${index}`} task={task} />
                    ))
                  ) : (
                    <View style={styles.emptyTaskContainer}>
                      <Text style={styles.emptyTaskText}>No tasks for this day</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </ScrollView>
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity onPress={goToTask} style={styles.fab}>
        <Icon name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}