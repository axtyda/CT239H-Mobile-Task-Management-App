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
 * Task Schema with `priorityLevel` 
 * (replacing `priorityColor`).
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
    notificationType: 'string?',
    subGoals: { type: 'list', objectType: 'SubGoal' },
    createdAt: { type: 'date', default: new Date() },
  },
};

/** 
 * Open Realm in React Native 
 * Bump schemaVersion if needed
 */
export const openRealm = async () => {
  return await Realm.open({
    schema: [SubGoalSchema, TaskSchema],
    schemaVersion: 5,
    path: 'myCustomRealm.realm',
  });
};
