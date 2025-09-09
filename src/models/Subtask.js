// Clase que representa una Subtarea dentro de una Tarea
export default class Subtask {
  /**
   * @param {string} id - Identificador único de la subtarea
   * @param {string} name - Nombre o título de la subtarea
   * @param {string} detail - Descripción detallada de la subtarea
   * @param {User|null} assignedUser - Usuario asignado a la subtarea (puede ser null si no está asignada)
   * @param {string} state - Estado de la subtarea (ej: "Nueva", "Abierta", "Proceso", "Cerrada")
   */
  constructor(id, name, detail, assignedUser, state) {
    this.IdSubtask = id;          // UUID único de la subtarea
    this.NameSubtask = name;      // Nombre de la subtarea
    this.DetailSubtask = detail;  // Descripción
    this.AssignedUser = assignedUser; // Usuario asignado
    this.StateSubtask = state;    // Estado actual
  }
}
