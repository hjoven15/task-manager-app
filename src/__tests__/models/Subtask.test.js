import Subtask from "../../models/Subtask";

describe("Subtask", () => {
  it("debería crear una subtask con los valores correctos", () => {
    const subtask = new Subtask("1", "Configurar API", "Detalles aquí", "User1", "Abierta");

    expect(subtask.IdSubtask).toBe("1");
    expect(subtask.NameSubtask).toBe("Configurar API");
    expect(subtask.DetailSubtask).toBe("Detalles aquí");
    expect(subtask.AssignedUser).toBe("User1");
    expect(subtask.StateSubtask).toBe("Abierta");
  });
});
