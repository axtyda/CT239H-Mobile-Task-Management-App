import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { styles } from './Style/HomeStyle';
import { notificationImg, UserProfile } from '../../theme/Images';
import TaskService from '../../taskService';
import Realm from 'realm';

/** -------------------------------
 *  Helper Functions
 * -------------------------------
 */

/**
 * Map the priorityLevel to a color code for the left bar.
 */
const getPriorityBarColor = (priorityLevel) => {
  switch (priorityLevel) {
    case 'Red':
      return '#FF0000'; // Urgent and Important
    case 'Yellow':
      return '#FFD700'; // Not Urgent but Important
    case 'Blue':
      return '#0000FF'; // Urgent but Not Important
    case 'Green':
    default:
      return '#008000'; // Not Urgent and Not Important
  }
};

/** 
 * If you want to highlight tasks that are due in the next 12 hours,
 * we check `dueDate`.
 */
const isWithin12Hours = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const end = new Date(dueDate);
  const diffHours = (end - now) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= 12;
};

/**
 * Wipe all data from Realm using your new schema.
 * If you have a separate SubGoal schema, include it here as well.
 */
const wipeRealmData = async () => {
  try {
    // Example new schema (Task + optional SubGoal). Adjust if needed.
    const SubGoalSchema = {
      name: 'SubGoal',
      primaryKey: 'subGoalId',
      properties: {
        subGoalId: 'int',
        name: 'string',
        isCompleted: { type: 'bool', default: false },
      },
    };

    const TaskSchema = {
      name: 'Task',
      primaryKey: 'id',
      properties: {
        id: 'int',
        title: 'string',
        description: 'string',
        priorityColor: 'string',
        dueDate: 'date',
        notificationType: 'string?',
        subGoals: { type: 'list', objectType: 'SubGoal' },
        createdAt: { type: 'date', default: new Date() },
      },
    };

    const realm = await Realm.open({
      schema: [SubGoalSchema, TaskSchema],
      schemaVersion: 4, // or higher if you already used 4
      path: 'myCustomRealm.realm',
    });
    realm.write(() => {
      realm.deleteAll();
    });
    realm.close();
    console.log('Realm data wiped!');
    Alert.alert('Data wiped!', 'All tasks have been deleted.');
  } catch (error) {
    console.error('Error wiping Realm data:', error);
    Alert.alert('Error', 'Could not wipe the data.');
  }
};

/** 
 * Important Task Item
 * We use a flex container with `justifyContent: 'space-between'`
 * and `minHeight` so the due date stays pinned at the bottom.
 */
const ImportantTaskItem = ({ title, description, priorityLevel, dueDate }) => {
  return (
    <View style={[styles.upcomingTaskContainer, { minHeight: 120 }]}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* TOP SECTION: Title, color circle, and description */}
        <View>
          <View
            style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
            }}
          >
            <Text style={styles.taskName}>{title}</Text>
            <View
              style={[
                styles.categoryCircle,
                { backgroundColor: getPriorityBarColor(priorityLevel) },
              ]}
            />
          </View>
          <Text style={styles.taskDetails}>{description}</Text>
        </View>

        {/* BOTTOM SECTION: Due date */}
        <Text style={styles.taskDetails}>
          Due: {new Date(dueDate).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

/**
 * Custom Task Item
 * For "All Tasks" list, shows a colored left bar (based on `priorityColor`)
 * plus the title, description, and due date.
 */
const CustomTaskItem = ({ title, description, priorityLevel, dueDate }) => {
  return (
    <View style={styles.allTaskContainer}>
      {/* Left color bar: map priorityLevel -> color */}
      <View
        style={[
          styles.leftColorBar,
          { backgroundColor: getPriorityBarColor(priorityLevel) },
        ]}
      />
      <View style={styles.allTaskContent}>
        {/* Top row: Title */}
        <View style={styles.topRow}>
          <Text style={styles.taskName}>{title}</Text>
        </View>
        <Text style={styles.taskDetails}>{description}</Text>
        <Text style={styles.taskDetails}>
          {/* Priority label if desired */}
        </Text>
        <Text style={styles.taskDetails}>
          Due: {new Date(dueDate).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

/** 
 * Main Home Component
 */
export default function Home({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  // Sample test data
  const addTestData = async () => {
    // 1st Task (due in 8 hours)
    await TaskService.addTask({
      title: 'Buy Groceries',
      description: 'Milk, Bread, Eggs, and Fruits',
      priorityLevel: 'Red',
      dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
      notificationType: 'push',
      subGoals: [
        { subGoalId: Date.now(), name: 'Buy milk', isCompleted: false },
      ],
    });
  };

  // Fetch tasks from Realm
  const fetchTasks = async () => {
    let allTasks = await TaskService.getAllTasks();

    // If no tasks exist, add test data
    if (allTasks.length === 0) {
      await addTestData();
      allTasks = await TaskService.getAllTasks();
    }

    // Convert to a plain array
    setTasks(Array.from(allTasks));
    setFilteredTasks(Array.from(allTasks));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks (dummy logic since no 'status' field in new schema)
  const filterTasks = (status) => {
    if (status === 'All') {
      setFilteredTasks([...tasks]);
    } else {
      Alert.alert('Note', 'No status field in the new schema—displaying all tasks.');
      setFilteredTasks([...tasks]);
    }
    setActiveTab(status);
  };

  // Important tasks: check if due in next 12h
  const importantTasks = tasks.filter(
    (task) => isWithin12Hours(task.dueDate)
  );

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

        {/* Buttons in the header */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={wipeRealmData} style={{ marginRight: 10 }}>
            <Text style={{ color: 'red' }}>Wipe Data</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchTasks} style={{ marginRight: 10 }}>
            <Text style={{ color: 'blue' }}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={notificationImg} style={styles.notiImg} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Important Tasks (due < 12h) */}
          <View style={styles.upComings}>
            <Text style={styles.upcoingText}>Important</Text>
            <FlatList
              data={importantTasks}
              horizontal
              showsHorizontalScrollIndicator={true}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ImportantTaskItem
                  title={item.title}
                  description={item.description}
                  priorityLevel={item.priorityLevel}
                  dueDate={item.dueDate}
                />
              )}
            />
          </View>

          {/* All Tasks */}
          <View style={styles.taskListView}>
            <Text style={styles.upcoingText}>All Tasks</Text>

            {/* Filter row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              style={styles.filterScrollView}
            >
              <View style={styles.filterContainer}>
                {['All', 'Pending', 'In Progress', 'Done'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => filterTasks(status)}
                    style={[styles.filterButton, activeTab === status && styles.activeFilterButton]}
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

            {/* Render filtered tasks using CustomTaskItem */}
            {filteredTasks.map((item) => (
              <CustomTaskItem
                key={item.id}
                title={item.title}
                description={item.description}
                priorityLevel={item.priorityLevel}
                dueDate={item.dueDate}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
