// TaskList.jsx
// Componente que organiza y renderiza las tareas agrupadas por estado.
// Props:
// - tasks: array de objetos tarea
// - onEditTask: callback para actualizar una tarea (se pasa a TaskCard)
// - onDeleteTask: callback para eliminar una tarea (se pasa a TaskCard)

import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
  // Estados posibles de las tareas → definen las columnas del tablero
  const states = ["Nueva", "Abierta", "Proceso", "Cerrada"];

  return (
    <div className="task-list">
      {/* Recorremos cada estado para generar una columna */}
      {states.map((state) => (
        <div key={state} className="task-column">
          <h2>{state}</h2>

          {/* Filtramos las tareas que pertenecen al estado actual */}
          {tasks
            .filter((task) => task.StateTask === state)

            // Ordenamos las tareas dentro de cada columna por IdTask
            .sort((a, b) => a.IdTask.localeCompare(b.IdTask))

            // Renderizamos una tarjeta por cada tarea
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
