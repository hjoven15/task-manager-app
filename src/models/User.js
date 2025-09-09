/**
 * Representa un usuario dentro del sistema.
 */
export default class User {
  /**
   * @param {string|number} id - Identificador único del usuario
   * @param {string} name - Nombre del usuario
   */
  constructor(id, name) {
    this.IdUser = id;   // ID único del usuario
    this.NameUser = name; // Nombre del usuario
  }
}
