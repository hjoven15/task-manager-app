const TaskCard = ({ task, onUpdateTask, onDeleteTask }) => {
  const stateClass =
    {
      Nueva: "border-primary",
      Abierta: "border-warning",
      Proceso: "border-info",
      Cerrada: "border-success",
    }[task.StateTask] || "border-secondary";

  const stateBgClass =
    {
      Nueva: "bg-primary-light",
      Abierta: "bg-warning-light",
      Proceso: "bg-info-light",
      Cerrada: "bg-success-light",
    }[task.StateTask] || "";

  const completedSubtasks = task.Subtasks.filter(
    (sub) => sub.StateSubtask === "Cerrada"
  ).length;

  const progressPercentage =
    task.Subtasks.length > 0
      ? Math.round((completedSubtasks / task.Subtasks.length) * 100)
      : 0;

  const handleCardClick = () => {
    if (typeof onUpdateTask === "function") {
      onUpdateTask(task);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (typeof onDeleteTask === "function") {
      onDeleteTask(task.IdTask);
    }
  };

  return (
    <div
      className={`card ${stateClass} mb-3 ${stateBgClass}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h3 className="card-title h5 mb-2">{task.NameTask}</h3>
          <span
            className={`badge rounded-pill ${getStateBadgeClass(
              task.StateTask
            )}`}
          >
            {task.StateTask}
          </span>
        </div>

        <p className="card-text text-muted mb-2">{task.DetailTask}</p>

        <p className="card-text">
          <small className="text-muted">
            <strong>Asignado a:</strong>{" "}
            {task.AssignedUser?.NameUser || "Sin asignar"}
          </small>
        </p>

        {task.Subtasks.length > 0 && (
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-muted fw-semibold">
                Progreso de subtareas
              </small>
              <small className="text-muted">
                {completedSubtasks}/{task.Subtasks.length} ({progressPercentage}
                %)
              </small>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        )}

        <button
          className="btn btn-sm btn-outline-danger mt-3 w-100"
          onClick={handleDeleteClick}
        >
          <i class="bi bi-trash3"></i> Eliminar
        </button>
      </div>
    </div>
  );
};

const getStateBadgeClass = (state) => {
  const classes = {
    Nueva: "bg-primary",
    Abierta: "bg-warning",
    Proceso: "bg-info",
    Cerrada: "bg-success",
  };
  return classes[state] || "bg-secondary";
};

export default TaskCard;
