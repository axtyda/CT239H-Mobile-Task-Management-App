import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Style/TaskStyle';
import TaskService from '../../taskService';

const TaskItem = React.memo(({ item, onRefresh }) => {
  const toggleSubGoal = async (taskId, subGoalId) => {
    try {
      await TaskService.updateSubGoal(taskId, subGoalId);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating subgoal:", error);
    }
  };

  // Get background color based on priority level
  const getPriorityColor = (priorityLevel) => {
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

  // Check if startDate and dueDate are the same (using string comparison as formatted in formatTasks)
  const isSameDate = item.startDate === item.dueDate;

  return (
    <View style={styles.taskPillContainer}>
      {/* Task Details */}
      <View style={styles.taskContentContainer}>
        <Text 
          style={[styles.taskTitle, { backgroundColor: getPriorityColor(item.priorityLevel) }]}
        >
          {item.name}
        </Text>
        <Text style={styles.taskDescription}>{item.task}</Text>
        {item.subGoals && item.subGoals.length > 0 && (
          <View>
            {item.subGoals.map((sub, index) => (
              <View key={index} style={styles.subGoalContainer}>
                <Text style={styles.subGoalText}>{sub.name}</Text>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleSubGoal(item.id, sub.subGoalId)}
                >
                  {sub.isCompleted && <View style={styles.checkboxTick} />}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
      
      {/* Task Info */}
      <View style={styles.taskInfoContainer}>
        {isSameDate ? (
          // If the dates are the same, show only Due date aligned to the right
          <View style={[styles.dateRow, { justifyContent: 'flex-end' }]}>
            <Text style={styles.taskDate}>Due: {item.dueDate}</Text>
          </View>
        ) : (
          // Otherwise, show both Start and Due dates
          <View style={styles.dateRow}>
            <Text style={styles.taskDate}>Start: {item.startDate}</Text>
            <Text style={styles.dateSeparator}> | </Text>
            <Text style={styles.taskDate}>Due: {item.dueDate}</Text>
          </View>
        )}
        {/* Time always at the right edge */}
        <View style={styles.timeRow}>
          <Text style={styles.taskTime}>{item.time}</Text>
        </View>
      </View>
    </View>
  );
});

export default TaskItem;
