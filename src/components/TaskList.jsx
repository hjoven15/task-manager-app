import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
  const states = ["Nueva", "Abierta", "Proceso", "Cerrada"];

  return (
    <div className="task-list">
      {states.map((state) => (
        <div key={state} className="task-column">
          <h2>{state}</h2>
          {tasks
            .filter((task) => task.StateTask === state)
            .sort((a, b) => a.IdTask.localeCompare(b.IdTask))
            .map((task) => (
              <TaskCard
                key={`task-${task.IdTask}`}
                task={task}
                onUpdateTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
