import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  TextInput,
  Animated 
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import { styles } from './Style/HomeStyle';
import TaskService from '../../taskService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserProfile } from '../../theme/Images';

const HomeScreen = ({ navigation }) => {
  // State management
  const [allTasks, setAllTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const isFocused = useIsFocused();
  const searchAnimation = new Animated.Value(0);
  const profileAnimation = new Animated.Value(1);

  // Fetch tasks when screen is focused
  useEffect(() => {
    if (isFocused) fetchTasks();
  }, [isFocused]);

  // Animation for search field
  useEffect(() => {
    // Animation for search field expansion
    Animated.parallel([
      Animated.timing(searchAnimation, {
        toValue: searchVisible ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
      
      // Animate profile section
      Animated.timing(profileAnimation, {
        toValue: searchVisible ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start();
  }, [searchVisible]);

  // Get all tasks and filter them
  const fetchTasks = async () => {
    try {
      const allTasksData = await TaskService.getAllTasks();
      setAllTasks(allTasksData);
      
      const now = dayjs();
      
      // Filter tasks due today that aren't completed
      const today = allTasksData.filter(task => 
        dayjs(task.dueDate).isSame(now, 'day')
      );
      
      // Filter upcoming tasks (not today, not completed)
      const upcoming = allTasksData.filter(task => 
        dayjs(task.dueDate).isAfter(now, 'day') && 
        !dayjs(task.dueDate).isSame(now, 'day') &&
        task.finishedStatus !== 'done'
      ).slice(0, 5); // Limit to 5 upcoming tasks

      setTodayTasks(today);
      setUpcomingTasks(upcoming);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (text) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = allTasks.filter(task => 
      task.title.toLowerCase().includes(text.toLowerCase())
    );
    
    setSearchResults(results);
  };

  // Toggle search visibility
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (searchVisible) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Get the color based on priority level
  const getPriorityColor = (level) => {
    switch (level) {
      case 'Red': return '#FF4757';
      case 'Yellow': return '#FFD93D';
      case 'Blue': return '#2F89FC';
      case 'Green': return '#2ED573';
      default: return '#A4B0BE';
    }
  };

  // Component for progress header section
  const ProgressHeader = () => {
    // Count tasks that are fully completed (status = done)
    const completedTasks = todayTasks.filter(t => t.finishedStatus === 'done').length;
    const total = todayTasks.length;
    
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${total > 0 ? (completedTasks/total)*100 : 0}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedTasks} of {total} tasks completed
        </Text>
      </View>
    );
  };

  // Component for individual task cards
  const TaskCard = ({ task }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => navigation.navigate('Task', { taskId: task.id })}
    >
      <View 
        style={[
          styles.priorityIndicator, 
          { backgroundColor: getPriorityColor(task.priorityLevel) }
        ]}
      />
      
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        
        {task.description && (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        
        <View style={styles.taskMeta}>
          <Icon name="access-time" size={16} color="#57606F" />
          <Text style={styles.taskTime}>
            {dayjs(task.dueDate).format('h:mm A')}
          </Text>
          
          {task.subGoals.length > 0 && (
            <View style={styles.metaItem}>
              <Icon name="checklist" size={16} color="#57606F" />
              <Text style={styles.taskMetaText}>
                {task.subGoals.filter(sg => sg.isCompleted).length}/{task.subGoals.length}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section with Integrated Search */}
      <View style={styles.header}>
        {/* Profile Section - Animated to hide when search is active */}
        <Animated.View 
          style={[
            styles.profileSection,
            {
              opacity: profileAnimation,
              width: profileAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, '80%']
              }),
              flex: profileAnimation
            }
          ]}
        >
          <Image source={UserProfile} style={styles.userProfileImg} />
          <View style={styles.profileText}>
            <Text style={styles.greeting}>Hello, User!</Text>
            <Text style={styles.subGreeting}>Your tasks today</Text>
          </View>
        </Animated.View>
        
        {/* Search Input - Animated to expand when search is active */}
        <Animated.View
          style={[
            styles.headerSearchContainer,
            {
              flex: 0, // Don't use flex animation
              width: searchAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, '85%']
              }),
              opacity: searchAnimation,
              position: searchVisible ? 'absolute' : 'relative',
              right: searchVisible ? 50 : 0,
              height: 36, // Fixed height
            }
          ]}
        >
          <View style={styles.searchInputWrapper}>
            <Icon name="search" size={18} color="rgba(255, 255, 255, 0.7)" />
            <TextInput
              style={styles.headerSearchInput}
              placeholder="Search tasks..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus={searchVisible}
            />
          </View>
          
          {/* Cancel search button */}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearSearch}>
              <Icon name="close" size={18} color="white" />
            </TouchableOpacity>
          )}
        </Animated.View>
        
        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
          <Icon 
            name={searchVisible ? "close" : "search"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Search Results */}
        {searchVisible && searchQuery.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.sectionTitle}>
              Search Results ({searchResults.length})
            </Text>
            
            {searchResults.length > 0 ? (
              searchResults.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <Text style={styles.emptyText}>No matching tasks found</Text>
            )}
          </View>
        )}

        {/* Only show regular content when not searching or when search is empty */}
        {(!searchVisible || searchQuery.length === 0) && (
          <>
            {/* Progress Section */}
            <ProgressHeader />

            {/* Today's Tasks Section */}
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            
            {loading ? (
              <ActivityIndicator size="large" color="#2ED573" style={styles.loader} />
            ) : todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <Text style={styles.emptyText}>No tasks for today! 🎉</Text>
            )}

            {/* Upcoming Tasks Section */}
            <Text style={[styles.sectionTitle, styles.upcomingTitle]}>Upcoming Next</Text>
            
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <TouchableOpacity 
                  key={task.id} 
                  style={styles.upcomingCard}
                  onPress={() => navigation.navigate('Task', { taskId: task.id })}
                >
                  <View style={styles.upcomingContent}>
                    <Text style={styles.upcomingDate}>
                      {dayjs(task.dueDate).format('ddd, MMM D')}
                    </Text>
                    <Text style={styles.upcomingTaskTitle} numberOfLines={1}>
                      {task.title}
                    </Text>
                  </View>
                  
                  <View 
                    style={[
                      styles.upcomingPriority, 
                      { backgroundColor: getPriorityColor(task.priorityLevel) }
                    ]}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No upcoming tasks 📅</Text>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Icon name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;