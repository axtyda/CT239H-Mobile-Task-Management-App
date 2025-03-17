const express = require("express");
const bodyParser = require("body-parser");
const realm = require("./realmConfig");

const app = express();
app.use(bodyParser.json());

// GET endpoint: Retrieve all tasks
app.get("/tasks", (req, res) => {
    const tasks = realm.objects("Task");
    res.json(tasks);
});

// POST endpoint: Add a new task (now includes time, notifyTime, and notifyPriority)
app.post("/tasks", (req, res) => {
    const {
        id,
        taskName,
        taskDetails,
        myStatus,
        myCategory,
        StartTime,
        EndTime,
        notifyTime,
        notifyPriority
    } = req.body;

    realm.write(() => {
        realm.create("Task", {
            id,
            taskName,
            taskDetails,
            myStatus,
            myCategory,
            StartTime: new Date(StartTime),   // convert the string to a Date object
            EndTime: new Date(EndTime),
            notifyTime: new Date(notifyTime),
            notifyPriority
        });
    });

    res.json({ message: "Task added!" });
});

// PUT endpoint: Update an existing task's status (for example)
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { myStatus } = req.body;

    realm.write(() => {
        let task = realm.objectForPrimaryKey("Task", parseInt(id));
        if (task) {
            task.myStatus = myStatus;
            res.json({ message: "Task updated!" });
        } else {
            res.status(404).json({ error: "Task not found!" });
        }
    });
});

// DELETE endpoint: Remove a task
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;

    realm.write(() => {
        let task = realm.objectForPrimaryKey("Task", parseInt(id));
        if (task) {
            realm.delete(task);
            res.json({ message: "Task deleted!" });
        } else {
            res.status(404).json({ error: "Task not found!" });
        }
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});