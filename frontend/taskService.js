import { openRealm } from './realmSchema';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
// import { scheduleTaskNotifications } from './NotificationService';

dayjs.extend(utc);
dayjs.extend(timezone);

// Helper to convert a given date (or now) to device local time
const getLocalDate = (dateInput) => {
  return dayjs(dateInput || undefined).tz(dayjs.tz.guess()).toDate();
};

const TaskService = {
  getAllTasks: async () => {
    const realm = await openRealm();
    try {
      const realmTasks = realm.objects('Task');
      const tasks = [];
      // Iterate through each Realm task and build a plain object
      for (const task of realmTasks) {
        tasks.push({
          id: task.id,
          title: task.title,
          description: task.description,
          priorityLevel: task.priorityLevel,
          dueDate: new Date(task.dueDate),
          startDate: new Date(task.startDate),
          notificationType: task.notificationType,
          notificationOffset: task.notificationOffset,
          enableRecurringReminder: task.enableRecurringReminder,
          recurringFrequency: task.recurringFrequency,
          subGoals: task.subGoals.map((sg) => ({
            subGoalId: sg.subGoalId,
            name: sg.name,
            isCompleted: sg.isCompleted,
          })),
          createdAt: new Date(task.createdAt),
          notificationIds: [...task.notificationIds],
          finishedStatus: task.finishedStatus,
        });
      }
      return tasks;
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      return [];
    } finally {
      realm.close();
      console.log('Closed realm after getting all tasks');
    }
  },

  getTaskById: async (id) => {
    const realm = await openRealm();
    try {
      const task = realm.objectForPrimaryKey('Task', id);
      if (!task) return null;
      // Build a copy of the task with all needed fields
      const taskCopy = {
        id: task.id,
        title: task.title,
        description: task.description,
        priorityLevel: task.priorityLevel,
        dueDate: new Date(task.dueDate),
        startDate: new Date(task.startDate),
        notificationType: task.notificationType,
        notificationOffset: task.notificationOffset,
        enableRecurringReminder: task.enableRecurringReminder,
        recurringFrequency: task.recurringFrequency,
        subGoals: task.subGoals.map((sg) => ({
          subGoalId: sg.subGoalId,
          name: sg.name,
          isCompleted: sg.isCompleted,
        })),
        createdAt: new Date(task.createdAt),
        notificationIds: [...task.notificationIds],
        finishedStatus: task.finishedStatus,
      };
      return taskCopy;
    } catch (error) {
      console.error('Error retrieving task by ID:', error);
      return null;
    } finally {
      realm.close();
    }
  },

  addTask: async (task) => {
    const realm = await openRealm();
    let newTask;
    try {
      realm.write(() => {
        newTask = realm.create('Task', {
          id: task.id || uuidv4(),
          title: task.title || '',
          description: task.description || '',
          priorityLevel: task.priorityLevel || 'Green',
          dueDate: getLocalDate(task.dueDate),
          startDate: getLocalDate(task.startDate),
          notificationType: task.notificationType || '',
          notificationOffset: task.notificationOffset || '1-hour',
          enableRecurringReminder: task.enableRecurringReminder || false,
          recurringFrequency: task.recurringFrequency || '',
          subGoals: (task.subGoals || []).map((sg) => ({
            subGoalId: sg.subGoalId || uuidv4(),
            name: sg.name,
            isCompleted: sg.isCompleted || false,
          })),
          createdAt: getLocalDate(),
          notificationIds: [],
          finishedStatus: 'not-started',
        });
      });
      // Convert newTask to plain object if necessary:
      const plainTask = {
        id: newTask.id,
        title: newTask.title,
        dueDate: newTask.dueDate,
        notificationOffset: newTask.notificationOffset,
        enableRecurringReminder: newTask.enableRecurringReminder,
        recurringFrequency: newTask.recurringFrequency,
        // Include any other properties needed by your notification service.
      };
  
      // Now schedule notifications for this task.
      // await scheduleTaskNotifications(plainTask);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    } finally {
      realm.close();
      console.log('Task added:', task);
      console.log('Closed Realm after adding task');
    }
  },

  updateTask: async (id, updatedFields) => {
    const realm = await openRealm();
    try {
      realm.write(() => {
        const task = realm.objectForPrimaryKey('Task', id);
        if (task) {
          if (updatedFields.dueDate) {
            updatedFields.dueDate = getLocalDate(updatedFields.dueDate);
          }
          if (updatedFields.startDate) {
            updatedFields.startDate = getLocalDate(updatedFields.startDate);
          }
          if (updatedFields.createdAt) {
            updatedFields.createdAt = getLocalDate(updatedFields.createdAt);
          }
          // Handle subGoals if provided
          if (updatedFields.subGoals) {
            task.subGoals = updatedFields.subGoals.map((sg, index) => ({
              subGoalId: sg.subGoalId || Math.floor(Date.now()) + index,
              name: sg.name,
              isCompleted: sg.isCompleted || false,
            }));
            delete updatedFields.subGoals;
          }
          Object.assign(task, updatedFields);
        }
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    } finally {
      realm.close();
    }
  },
  

  updateSubGoal: async (taskId, subGoalId) => {
    const realm = await openRealm();
    try {
      realm.write(() => {
        const task = realm.objectForPrimaryKey('Task', taskId);
        if (!task) {
          throw new Error('Task not found');
        }
        const subGoal = task.subGoals.filtered(`subGoalId == "${subGoalId}"`)[0];
        if (!subGoal) {
          throw new Error('SubGoal not found');
        }
        // Toggle the subgoal's completed status
        subGoal.isCompleted = !subGoal.isCompleted;
        // Update the overall task status based on sub-goals
        const allCompleted = task.subGoals.every((sg) => sg.isCompleted);
        task.finishedStatus = allCompleted ? 'done' : 'in-progress';
      });
    } catch (error) {
      console.error('Error updating subgoal:', error);
      throw error;
    } finally {
      realm.close();
      console.log('Closed Realm after updating subgoal');
    }
  },

  deleteTask: async (id) => {
    const realm = await openRealm();
    try {
      const task = realm.objectForPrimaryKey('Task', id);
      if (task) {
        realm.write(() => {
          realm.delete(task);
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    } finally {
      realm.close();
    }
  },
};

export default TaskService;
