// TaskItem.js
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Style/TaskStyle';

const TaskItem = React.memo(({ item }) => {
  return (
    <View style={styles.taskPillContainer}>
      {/* Right Section: Task Details */}
      <View style={styles.taskContentContainer}>
        <Text style={styles.taskTitle}>{item.name}</Text>
        <Text style={styles.taskDescription}>{item.task}</Text>
        {item.subGoals && item.subGoals.length > 0 }
      </View>

      {/* subgoal */}
      <View style={styles.subGoalsContainer}>
            {item.subGoals.map((sub, index) => (
              <Text key={index} style={styles.subGoalText}>
                - {sub.name}
              </Text>
            ))}
        </View>

      {/* Left Bottom Section: Time and Date */}
      <View style={styles.taskInfoContainer}>
        <Text style={styles.taskDate}>Due: {item.dueDate}</Text>
        <Text style={styles.taskTime}>{item.time}</Text>
      </View>
    </View>
  );
});

export default TaskItem;
