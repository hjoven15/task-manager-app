import { useState, useEffect, useRef } from "react";
import Subtask from "../models/Subtask";

const TaskModal = ({
  task,
  onClose,
  onSave,
  onSubtaskAdd,
  onSubtaskDelete,
  users,
}) => {
  const [localTask, setLocalTask] = useState({ ...task });
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const inputRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || !users || users.length === 0) return;

    const taskCopy = { ...task };

    if (taskCopy.AssignedUser?.IdUser) {
      const userFull = users.find(
        (u) => String(u.IdUser) === String(taskCopy.AssignedUser.IdUser)
      );
      taskCopy.AssignedUser = userFull || null;
    } else {
      taskCopy.AssignedUser = null;
    }

    if (taskCopy.Subtasks?.length) {
      taskCopy.Subtasks = taskCopy.Subtasks.map((sub) => {
        if (sub.AssignedUser?.IdUser) {
          const userFull = users.find(
            (u) => String(u.IdUser) === String(sub.AssignedUser.IdUser)
          );
          return { ...sub, AssignedUser: userFull || null };
        }
        return { ...sub, AssignedUser: null };
      });
    }

    setLocalTask(taskCopy);
    hasInitialized.current = true;
  }, [task, users]);

  const handleSubtaskCreation = (e) => {
    e?.preventDefault();
    const trimmedName = newSubtaskName.trim();
    if (!trimmedName) return;

    const newSubtask = new Subtask(
      crypto.randomUUID(),
      trimmedName,
      "",
      localTask.AssignedUser,
      "Abierta"
    );

    const updatedTask = {
      ...localTask,
      Subtasks: [...localTask.Subtasks, newSubtask],
    };

    setLocalTask(updatedTask);
    setNewSubtaskName("");

    if (typeof onSubtaskAdd === "function") {
      onSubtaskAdd(localTask.IdTask, newSubtask);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target === inputRef.current) {
      e.preventDefault();
      handleSubtaskCreation(e);
    }
  };

  const handleSubtaskFieldChange = (subtaskId, field, value) => {
    const updated = localTask.Subtasks.map((s) =>
      s.IdSubtask === subtaskId ? { ...s, [field]: value } : s
    );
    setLocalTask({ ...localTask, Subtasks: updated });
  };

  const handleSubtaskStateChange = (subtaskId) => {
    const updated = localTask.Subtasks.map((sub) =>
      sub.IdSubtask === subtaskId
        ? {
            ...sub,
            StateSubtask:
              sub.StateSubtask === "Abierta" ? "Cerrada" : "Abierta",
          }
        : sub
    );
    setLocalTask({ ...localTask, Subtasks: updated });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await onSave(localTask);
    onClose();
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Tarea</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <form
              onSubmit={handleSave}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  e.target.tagName === "INPUT" &&
                  e.target !== inputRef.current
                ) {
                  e.preventDefault();
                }
              }}
            >
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre:</label>
                  <input
                    className="form-control"
                    value={localTask.NameTask}
                    onChange={(e) =>
                      setLocalTask({ ...localTask, NameTask: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Detalle:</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={localTask.DetailTask}
                    onChange={(e) =>
                      setLocalTask({
                        ...localTask,
                        DetailTask: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Asignado a:</label>
                  <select
                    className="form-select"
                    value={localTask.AssignedUser?.IdUser || ""}
                    onChange={(e) => {
                      const selectedUser = users.find(
                        (u) => String(u.IdUser) === e.target.value
                      );
                      setLocalTask({
                        ...localTask,
                        AssignedUser: selectedUser || null,
                      });
                    }}
                  >
                    <option value="">-- Selecciona un usuario --</option>
                    {users.map((user) => (
                      <option key={user.IdUser} value={user.IdUser}>
                        {user.NameUser}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Estado:</label>
                  <select
                    className="form-select"
                    value={localTask.StateTask}
                    onChange={(e) =>
                      setLocalTask({
                        ...localTask,
                        StateTask: e.target.value,
                      })
                    }
                  >
                    <option value="Nueva">Nueva</option>
                    <option value="Abierta">Abierta</option>
                    <option value="Proceso">Proceso</option>
                    <option value="Cerrada">Cerrada</option>
                  </select>
                </div>

                <h4 className="mt-4 mb-3">Subtareas</h4>
                <div className="input-group mb-3">
                  <input
                    ref={inputRef}
                    className="form-control"
                    placeholder="Nueva subtarea"
                    value={newSubtaskName}
                    onChange={(e) => setNewSubtaskName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <span className="input-group-text">Presiona Enter</span>
                </div>

                <div className="list-group mb-4">
                  {localTask.Subtasks.map((sub) => (
                    <div
                      key={sub.IdSubtask}
                      className="list-group-item d-flex flex-column gap-2"
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={sub.StateSubtask === "Cerrada"}
                          onChange={() =>
                            handleSubtaskStateChange(sub.IdSubtask)
                          }
                        />
                        <input
                          type="text"
                          className="form-control form-control-sm me-2"
                          value={sub.NameSubtask}
                          onChange={(e) =>
                            handleSubtaskFieldChange(
                              sub.IdSubtask,
                              "NameSubtask",
                              e.target.value
                            )
                          }
                          placeholder="Nombre"
                        />
                        <input
                          type="text"
                          className="form-control form-control-sm me-2"
                          value={sub.DetailSubtask}
                          onChange={(e) =>
                            handleSubtaskFieldChange(
                              sub.IdSubtask,
                              "DetailSubtask",
                              e.target.value
                            )
                          }
                          placeholder="Detalle"
                        />
                        <select
                          className="form-select form-select-sm me-2"
                          value={sub.AssignedUser?.IdUser || ""}
                          onChange={(e) => {
                            const selectedUser = users.find(
                              (u) => String(u.IdUser) === e.target.value
                            );
                            handleSubtaskFieldChange(
                              sub.IdSubtask,
                              "AssignedUser",
                              selectedUser || null
                            );
                          }}
                        >
                          <option value="">-- Asignar a --</option>
                          {users.map((user) => (
                            <option key={user.IdUser} value={user.IdUser}>
                              {user.NameUser}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            window.Swal.fire({
                              title: "¿Eliminar subtarea?",
                              text: "Esta acción no se puede deshacer.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#6c757d",
                              confirmButtonText: "Sí, eliminar",
                              cancelButtonText: "Cancelar",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                const updated = localTask.Subtasks.filter(
                                  (s) => s.IdSubtask !== sub.IdSubtask
                                );
                                setLocalTask({
                                  ...localTask,
                                  Subtasks: updated,
                                });
                                if (typeof onSubtaskDelete === "function") {
                                  onSubtaskDelete(
                                    localTask.IdTask,
                                    sub.IdSubtask
                                  );
                                }
                              }
                            });
                          }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskModal;
