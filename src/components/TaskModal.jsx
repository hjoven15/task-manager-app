// TaskModal.jsx
// Modal para crear/editar una tarea y gestionar sus subtareas.
// Props:
// - task: objeto de la tarea actual (puede incluir subtareas)
// - onClose: callback para cerrar el modal
// - onSave: callback para guardar cambios en la tarea
// - onSubtaskAdd: callback para añadir una subtarea
// - onSubtaskDelete: callback para eliminar una subtarea
// - users: lista de usuarios disponibles para asignar

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
  // Copia local de la tarea para edición controlada
  const [localTask, setLocalTask] = useState({ ...task });

  // Estado para nueva subtarea temporal
  const [newSubtaskName, setNewSubtaskName] = useState("");

  // Referencia al input de subtarea (para capturar "Enter")
  const inputRef = useRef(null);

  // Flag para inicialización de datos (evita repetir cálculos en cada render)
  const hasInitialized = useRef(false);

  // Efecto que sincroniza la tarea local con la lista de usuarios
  useEffect(() => {
    if (hasInitialized.current || !users || users.length === 0) return;

    const taskCopy = { ...task };

    // Normaliza el usuario asignado a la tarea (con objeto completo)
    if (taskCopy.AssignedUser?.IdUser) {
      const userFull = users.find(
        (u) => String(u.IdUser) === String(taskCopy.AssignedUser.IdUser)
      );
      taskCopy.AssignedUser = userFull || null;
    } else {
      taskCopy.AssignedUser = null;
    }

    // Normaliza usuarios de cada subtarea
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

  // Crea una nueva subtarea y la agrega a la tarea actual
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

  // Permite crear subtarea presionando Enter en el input
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target === inputRef.current) {
      e.preventDefault();
      handleSubtaskCreation(e);
    }
  };

  // Actualiza campos de una subtarea específica (nombre, detalle, usuario, etc.)
  const handleSubtaskFieldChange = (subtaskId, field, value) => {
    const updated = localTask.Subtasks.map((s) =>
      s.IdSubtask === subtaskId ? { ...s, [field]: value } : s
    );
    setLocalTask({ ...localTask, Subtasks: updated });
  };

  // Cambia estado de subtarea (Abierta ↔ Cerrada)
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

  // Guarda cambios en la tarea y cierra modal
  const handleSave = async (e) => {
    e.preventDefault();
    await onSave(localTask);
    onClose();
  };

  return (
    <>
      {/* Overlay oscuro del modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Encabezado */}
            <div className="modal-header">
              <h5 className="modal-title">Tarea</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Formulario principal */}
            <form
              onSubmit={handleSave}
              onKeyDown={(e) => {
                // Evita que Enter en inputs normales dispare submit
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
                {/* Nombre de tarea */}
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

                {/* Detalle */}
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

                {/* Usuario asignado */}
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

                {/* Estado */}
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

                {/* Subtareas */}
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

                {/* Lista de subtareas */}
                <div className="list-group mb-4">
                  {localTask.Subtasks.map((sub) => (
                    <div
                      key={sub.IdSubtask}
                      className="list-group-item d-flex flex-column gap-2"
                    >
                      <div className="d-flex align-items-center">
                        {/* Checkbox estado */}
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={sub.StateSubtask === "Cerrada"}
                          onChange={() =>
                            handleSubtaskStateChange(sub.IdSubtask)
                          }
                        />

                        {/* Nombre subtarea */}
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

                        {/* Detalle subtarea */}
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

                        {/* Usuario asignado */}
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

                        {/* Botón eliminar subtarea */}
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

              {/* Footer botones */}
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
