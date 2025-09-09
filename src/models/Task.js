import User from "./User";
import Subtask from "./Subtask";

/**
 * Representa una tarea dentro del sistema de gestión.
 * Cada tarea puede tener un usuario asignado y múltiples subtareas.
 */
export default class Task {
  /**
   * @param {string} id - Identificador único de la tarea
   * @param {string} name - Nombre o título de la tarea
   * @param {string} detail - Descripción detallada de la tarea
   * @param {User|null} assignedUser - Usuario asignado a la tarea (puede ser null)
   * @param {string} state - Estado actual de la tarea ("Nueva", "Abierta", "Proceso", "Cerrada")
   * @param {Subtask[]} [subtasks=[]] - Lista de subtareas asociadas a la tarea
   */
  constructor(id, name, detail, assignedUser, state, subtasks = []) {
    this.IdTask = id;
    this.NameTask = name;
    this.DetailTask = detail;
    this.AssignedUser = assignedUser;
    this.StateTask = state;
    this.Subtasks = subtasks;
  }

  /**
   * Agrega una nueva subtarea a la tarea.
   * @param {Subtask} subtask - Subtarea a agregar
   */
  addSubtask(subtask) {
    this.Subtasks.push(subtask);
  }

  /**
   * Cambia el estado de una subtarea entre "Abierta" y "Cerrada".
   * @param {string} subtaskId - ID de la subtarea a modificar
   */
  toggleSubtaskState(subtaskId) {
    this.Subtasks = this.Subtasks.map((sub) =>
      sub.IdSubtask === subtaskId
        ? {
            ...sub,
            StateSubtask:
              sub.StateSubtask === "Abierta" ? "Cerrada" : "Abierta",
          }
        : sub
    );
  }

  /**
   * Convierte un objeto plano en una instancia de `Task`,
   * incluyendo usuarios y subtareas correctamente instanciadas.
   * @param {Object} obj - Objeto plano que representa una tarea
   * @returns {Task} - Instancia de la clase `Task`
   */
  static fromPlainObject(obj) {
    return new Task(
      obj.IdTask,
      obj.NameTask,
      obj.DetailTask,
      obj.AssignedUser
        ? new User(obj.AssignedUser.IdUser, obj.AssignedUser.NameUser)
        : null,
      obj.StateTask,
      (obj.Subtasks || []).map(
        (s) =>
          new Subtask(
            s.IdSubtask,
            s.NameSubtask,
            s.DetailSubtask,
            s.AssignedUser
              ? new User(s.AssignedUser.IdUser, s.AssignedUser.NameUser)
              : null,
            s.StateSubtask
          )
      )
    );
  }
}
