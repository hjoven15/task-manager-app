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
import Subtask from "../../models/Subtask";

describe("Subtask", () => {
  /**
   * Verifica que la clase Subtask se instancie correctamente
   * y que todas sus propiedades se asignen según los parámetros.
   */
  it("debería crear una subtask con los valores correctos", () => {
    const subtask = new Subtask(
      "1",                 // Id único de la subtarea
      "Configurar API",    // Nombre de la subtarea
      "Detalles aquí",     // Descripción de la subtarea
      "User1",             // Usuario asignado (puede ser un string o un objeto User)
      "Abierta"            // Estado inicial de la subtarea
    );

    // Validaciones de las propiedades
    expect(subtask.IdSubtask).toBe("1");
    expect(subtask.NameSubtask).toBe("Configurar API");
    expect(subtask.DetailSubtask).toBe("Detalles aquí");
    expect(subtask.AssignedUser).toBe("User1");
    expect(subtask.StateSubtask).toBe("Abierta");
  });
});
