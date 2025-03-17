// Home.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { styles } from './Style/HomeStyle';
import { notificationImg, UserProfile } from '../../theme/Images';

/** -------------------------------
 *  Helper Functions for Colors
 * -------------------------------
 */
const getCategoryColor = (category) => {
  switch (category) {
    case 'Do First':
      return 'red';
    case 'Must Do Soon':
      return 'yellow';
    case 'May Do Later':
      return 'blue';
    case 'Do Last':
      return 'green';
    default:
      return 'gray';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'grey';
    case 'In Progress':
      return 'yellow';
    case 'Done':
      return 'green';
    default:
      return 'lightgrey';
  }
};

/** --------------------------------------------------
 *  Function to check if EndTime is within 12 hours
 * --------------------------------------------------
 */
function isWithin12Hours(endTimeStr) {
  if (!endTimeStr) return false;
  const now = new Date();
  const endTime = new Date(endTimeStr);
  const diffHours = (endTime - now) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= 12;
}

/** -------------------------------
 *  Important Task Item Component
 * -------------------------------
 * Renders tasks that are nearing their deadline (EndTime in next 12 hours).
 */
const ImportantTaskItem = ({ taskName, taskDetails, myStatus, myCategory }) => {
  return (
    <View style={styles.upcomingTaskContainer}>
      {/* Row: Task Name (left) + Category Circle (right) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.taskName}>{taskName}</Text>
        <View
          style={[
            styles.categoryCircle,
            { backgroundColor: getCategoryColor(myCategory) },
          ]}
        />
      </View>

      {/* Middle: Details */}
      <Text style={styles.taskDetails}>{taskDetails}</Text>

      {/* Status */}
      <Text style={styles.taskDetails}>Status: {myStatus}</Text>

      {/* Status Bar */}
      <View style={styles.statusBarContainer}>
        <View
          style={[
            styles.statusBar,
            { backgroundColor: getStatusColor(myStatus), width: '100%' },
          ]}
        />
      </View>
    </View>
  );
};

/** -------------------------------
 *  All Task Item Component
 * -------------------------------
 */
const CustomTaskItem = ({ taskName, taskDetails, myStatus, myCategory }) => {
  return (
    <View style={styles.allTaskContainer}>
      {/* Left color bar matches category */}
      <View
        style={[
          styles.leftColorBar,
          { backgroundColor: getCategoryColor(myCategory) },
        ]}
      />
      {/* Main content */}
      <View style={styles.allTaskContent}>
        {/* Top row: Task Name (left) + Status (right) */}
        <View style={styles.topRow}>
          <Text style={styles.taskName}>{taskName}</Text>
          <Text style={styles.taskStatus}>Status: {myStatus}</Text>
        </View>
        {/* Task Details */}
        <Text style={styles.taskDetails}>{taskDetails}</Text>

        {/* Status Bar */}
        <View style={styles.statusBarContainer}>
          <View
            style={[
              styles.statusBar,
              { backgroundColor: getStatusColor(myStatus), width: '100%' },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

/** -------------------------------
 *  Main Home Component
 * -------------------------------
 */
export default function Home({ navigation }) {
  // State for tasks from the backend
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  // Adjust to your environment/IP
  const API_URL = 'http://10.0.2.2:3000';

  /** Fetch tasks from your backend API */
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /** Filter tasks based on status */
  const filterTasks = (status) => {
    let filtered;
    if (status === 'All') {
      filtered = tasks;
    } else if (status === 'Pending' || status === 'In Progress' || status === 'Done') {
      filtered = tasks.filter((task) => task.myStatus === status);
    } else {
      filtered = [];
    }
    setFilteredTasks(filtered);
    setActiveTab(status);
  };

  /** Important tasks: EndTime in next 12h & not Done */
  const importantTasks = tasks.filter((task) => {
    if (task.myStatus === 'Done') return false; // exclude completed tasks
    return isWithin12Hours(task.EndTime);       // only tasks that end within 12h
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.profileSection}>
          <Image source={UserProfile} style={styles.userProfileImg} />
          <View style={styles.profileText}>
            <Text style={styles.profileTitle}>Profile Details</Text>
            <Text style={styles.profileName}>Quach Khoa Hien</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Image source={notificationImg} style={styles.notiImg} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Today Completion */}
          <View style={styles.todayCompletionCard}>
            <Text style={styles.todayCompletionTitle}>Today completion</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarOuter}>
                <View style={[styles.progressBarFill, { width: '50%' }]} />
              </View>
              <Text style={styles.percentLabel}>50%</Text>
            </View>
          </View>

          {/* Important (deadline < 12h) */}
          <View style={styles.upComings}>
            <Text style={styles.upcoingText}>Important</Text>
            <FlatList
              data={importantTasks}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ImportantTaskItem
                  taskName={item.taskName}
                  taskDetails={item.taskDetails}
                  myStatus={item.myStatus}
                  myCategory={item.myCategory}
                />
              )}
            />
          </View>

          {/* All Tasks */}
          <View style={styles.taskListView}>
            <Text style={styles.upcoingText}>All Task</Text>

            {/* Filter row (horizontal scroll) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
            >
              <View style={styles.filterContainer}>
                {['All', 'Pending', 'In Progress', 'Done', '5', '6', '7', '8'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => filterTasks(status)}
                    style={[
                      styles.filterButton,
                      activeTab === status && styles.activeFilterButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        activeTab === status && styles.activeFilterText,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Render filtered tasks */}
            {filteredTasks.map((item) => (
              <CustomTaskItem
                key={item.id}
                taskName={item.taskName}
                taskDetails={item.taskDetails}
                myStatus={item.myStatus}
                myCategory={item.myCategory}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
