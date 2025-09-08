import Task from "../../models/Task";
import Subtask from "../../models/Subtask";
import User from "../../models/User";

describe("Task", () => {
  let user;
  let task;

  beforeEach(() => {
    user = new User("1", "Haminton Joven");
    task = new Task("t1", "Test Task", "Detalles de la tarea", user, "Abierta");
  });

  it("debería crear una tarea correctamente", () => {
    expect(task.IdTask).toBe("t1");
    expect(task.NameTask).toBe("Test Task");
    expect(task.DetailTask).toBe("Detalles de la tarea");
    expect(task.AssignedUser).toBe(user);
    expect(task.StateTask).toBe("Abierta");
    expect(task.Subtasks).toEqual([]);
  });

  it("debería agregar una subtask", () => {
    const subtask = new Subtask("s1", "Configurar API", "Hacer endpoints", user, "Abierta");
    task.addSubtask(subtask);

    expect(task.Subtasks.length).toBe(1);
    expect(task.Subtasks[0]).toBe(subtask);
  });

  it("debería alternar el estado de una subtask", () => {
    const subtask = new Subtask("s1", "Doc API", "Swagger", user, "Abierta");
    task.addSubtask(subtask);

    task.toggleSubtaskState("s1");

    expect(task.Subtasks[0].StateSubtask).toBe("Cerrada");

    task.toggleSubtaskState("s1");

    expect(task.Subtasks[0].StateSubtask).toBe("Abierta");
  });

  it("debería reconstruir una Task desde un objeto plano", () => {
    const plainObject = {
      IdTask: "t2",
      NameTask: "Reconstruida",
      DetailTask: "Desde objeto plano",
      AssignedUser: { IdUser: "2", NameUser: "Sofía" },
      StateTask: "Proceso",
      Subtasks: [
        {
          IdSubtask: "s2",
          NameSubtask: "Doc API",
          DetailSubtask: "Swagger",
          AssignedUser: { IdUser: "3", NameUser: "Carlos" },
          StateSubtask: "Abierta"
        }
      ]
    };

    const rebuilt = Task.fromPlainObject(plainObject);

    expect(rebuilt.IdTask).toBe("t2");
    expect(rebuilt.AssignedUser).toBeInstanceOf(User);
    expect(rebuilt.Subtasks[0]).toBeInstanceOf(Subtask);
    expect(rebuilt.Subtasks[0].AssignedUser).toBeInstanceOf(User);
  });
});
