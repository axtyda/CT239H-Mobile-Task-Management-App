import Realm from 'realm';

/** SubGoal Schema (unchanged) */
export const SubGoalSchema = {
  name: 'SubGoal',
  primaryKey: 'subGoalId',
  properties: {
    subGoalId: 'int',
    name: 'string',
    isCompleted: { type: 'bool', default: false },
  },
};

/** 
 * Task Schema updated to include a startDate field.
 * Note: The startDate field is added with a default value of new Date().
 */
export const TaskSchema = {
  name: 'Task',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string',
    description: 'string',
    priorityLevel: 'string', // "Red", "Yellow", "Blue", "Green"
    dueDate: 'date',
    startDate: 'date', // New field added
    notificationType: 'string?',
    subGoals: { type: 'list', objectType: 'SubGoal' },
    createdAt: { type: 'date', default: new Date() },
  },
};

/** 
 * Open Realm in React Native 
 * - Schema version is bumped to 6.
 * - A migration function is added to update existing Task objects.
 */
export const openRealm = async () => {
  return await Realm.open({
    schema: [SubGoalSchema, TaskSchema],
    schemaVersion: 7, // Bump schema version to 6
    path: 'myCustomRealm.realm',
    migration: (oldRealm, newRealm) => {
      // Perform migration only if upgrading from a version less than 6.
      if (oldRealm.schemaVersion < 6) {
        const oldObjects = oldRealm.objects('Task');
        const newObjects = newRealm.objects('Task');
        // For each Task object, set the new startDate property if not already set.
        for (let i = 0; i < oldObjects.length; i++) {
          if (!newObjects[i].startDate) {
            // Use the createdAt value as a fallback default, or new Date() if needed.
            newObjects[i].startDate = oldObjects[i].createdAt || new Date();
          }
        }
      }
    },
  });
};
