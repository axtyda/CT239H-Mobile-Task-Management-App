import Realm from 'realm';
import { SubGoalSchema, TaskSchema } from './realmSchema';

const realmConfig = {
  schema: [SubGoalSchema, TaskSchema],
  schemaVersion: 5,
  path: 'myCustomRealm.realm',
};

const openRealm = async () => {
  const realm = await Realm.open(realmConfig);
  console.log('Realm file path:', realm.path);
  return realm;
};

const TaskService = {
  // Get all tasks
  getAllTasks: async () => {
    const realm = await openRealm();
    return realm.objects('Task');
  },

  // Get a single task by ID
  getTaskById: async (id) => {
    const realm = await openRealm();
    return realm.objectForPrimaryKey('Task', id);
  },

  // Add a new task
  addTask: async (task) => {
    const realm = await openRealm();

    // Convert subGoals array (if any) into SubGoal objects
    const subGoalsList = (task.subGoals || []).map((sg, index) => ({
      subGoalId: sg.subGoalId || Date.now() + index,
      name: sg.name,
      isCompleted: sg.isCompleted || false,
    }));

    realm.write(() => {
      realm.create('Task', {
        id: task.id || Date.now(),
        title: task.title || '',
        description: task.description || '',
        priorityLevel: task.priorityLevel || 'Green', // Default to Green
        dueDate: task.dueDate || new Date(),
        notificationType: task.notificationType || '',
        subGoals: subGoalsList,
        createdAt: new Date(),
      });
    });
  },

  // Update an existing task
  updateTask: async (id, updatedFields) => {
    const realm = await openRealm();
    realm.write(() => {
      let task = realm.objectForPrimaryKey('Task', id);
      if (task) {
        // If updating subGoals, handle them carefully
        if (updatedFields.subGoals) {
          task.subGoals.clear();
          updatedFields.subGoals.forEach((sg, index) => {
            task.subGoals.push({
              subGoalId: sg.subGoalId || Date.now() + index,
              name: sg.name,
              isCompleted: sg.isCompleted || false,
            });
          });
          delete updatedFields.subGoals;
        }
        // For other fields
        Object.keys(updatedFields).forEach((key) => {
          task[key] = updatedFields[key];
        });
      }
    });
  },

  // Delete a task
  deleteTask: async (id) => {
    const realm = await openRealm();
    realm.write(() => {
      let task = realm.objectForPrimaryKey('Task', id);
      if (task) realm.delete(task);
    });
  },
};

export default TaskService;
