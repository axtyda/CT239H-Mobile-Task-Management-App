import Realm from 'realm';
import { v4 as uuidv4 } from 'uuid'; // Optional: if you prefer UUIDs

export const SubGoalSchema = {
  name: 'SubGoal',
  primaryKey: 'subGoalId',
  properties: {
    subGoalId: 'string',
    name: 'string',
    isCompleted: { type: 'bool', default: false },
  },
};

export const TaskSchema = {
  name: 'Task',
  primaryKey: 'id',
  properties: {
    id: 'string',
    title: 'string',
    description: 'string',
    priorityLevel: 'string',
    dueDate: 'date',
    startDate: 'date',
    notificationType: 'string?',
    notificationOffset: 'string?',
    enableRecurringReminder: { type: 'bool', default: false },
    recurringFrequency: 'string?',
    subGoals: { type: 'list', objectType: 'SubGoal' },
    createdAt: { type: 'date', default: () => new Date() },
    notificationIds: { type: 'list', objectType: 'string', default: [] },
    finishedStatus: { type: 'string', default: 'not-started' }, // Added
  },
};

export const openRealm = async () => {
  try {
    const realm = await Realm.open({
      schema: [SubGoalSchema, TaskSchema],
      schemaVersion: 1, // Increment schema version
      path: 'myCustomRealm.realm',
      migration: (oldRealm, newRealm) => {
        if (oldRealm.schemaVersion < 1) {
          console.log("Starting Realm migration...");
          const tasks = newRealm.objects('Task');
          
          tasks.forEach((task, index) => {
            // Generate UUID for Task ID if missing/empty
            if (!task.id || task.id.trim() === '') {
              task.id = uuidv4();
            }
            
            // Process SubGoals
            task.subGoals.forEach((subGoal, subIndex) => {
              // Always generate new UUID for subGoalId to ensure uniqueness
              subGoal.subGoalId = uuidv4();
            });
            
            // Set other defaults (unchanged)
            task.notificationIds = task.notificationIds || [];
            task.finishedStatus = task.finishedStatus || 'not-started';
            // ... (rest of the property checks)
          });
          
          console.log("Migration completed successfully.");
        }
      },
    });
    return realm;
  } catch (error) {
    console.error('Error opening Realm:', error);
    throw error;
  }
};

export const wipeRealmData = async () => {
  const realm = await openRealm();
  realm.write(() => {
    realm.deleteAll();
  });
  realm.close();
  console.log('Realm data wiped!');
};