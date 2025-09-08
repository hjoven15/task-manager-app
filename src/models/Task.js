import User from "./User";
import Subtask from "./Subtask";

export default class Task {

  constructor(id, name, detail, assignedUser, state, subtasks = []) {
    this.IdTask = id;
    this.NameTask = name;
    this.DetailTask = detail;
    this.AssignedUser = assignedUser;
    this.StateTask = state;
    this.Subtasks = subtasks;
  }

  addSubtask(subtask) {
    this.Subtasks.push(subtask);
  }

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
