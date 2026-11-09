const TaskStatus = Object.freeze({
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
});

const TaskStatusList = Object.keys(TaskStatus);

module.exports = { TaskStatus, TaskStatusList };
