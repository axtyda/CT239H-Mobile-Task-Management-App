const Realm = require("realm");

// Define the Task schema with updated fields:
// - Renamed: "time" is now "StartTime"
// - New: "EndTime" (deadline)
// - Also includes notifyTime and notifyPriority
const TaskSchema = {
  name: "Task",
  primaryKey: "id",
  properties: {
    id: "int",
    taskName: "string",
    taskDetails: "string",
    myStatus: "string",      // e.g., "Pending", "In Progress", "Done"
    myCategory: "string",    // e.g., "Do First", "May Do Later", etc.
    StartTime: "date",       // Renamed from "time": task start date and time
    EndTime: "date",         // Deadline for the task
    notifyTime: "date",      // Notification time
    notifyPriority: "string" // Notification priority, e.g., "High", "Medium", "Low"
  },
};

// Create the Realm instance with migration support
const realm = new Realm({
  schema: [TaskSchema],
  schemaVersion: 3, // Incremented schema version
  migration: (oldRealm, newRealm) => {
    // Run migration if the old schema version is less than 3
    if (oldRealm.schemaVersion < 3) {
      const oldTasks = oldRealm.objects("Task");
      const newTasks = newRealm.objects("Task");
      
      // For each existing Task object, update the new fields:
      for (let i = 0; i < oldTasks.length; i++) {
        // If the old schema had a "time" field, copy its value; otherwise, use the current date
        newTasks[i].StartTime = oldTasks[i].time ? oldTasks[i].time : new Date();
        // Set a default EndTime; you can adjust this default as needed (here, it's set to the current date)
        newTasks[i].EndTime = new Date();
        // Ensure notifyTime and notifyPriority have default values
        newTasks[i].notifyTime = new Date();
        newTasks[i].notifyPriority = "Low";
      }
    }
  }
});

module.exports = realm;
