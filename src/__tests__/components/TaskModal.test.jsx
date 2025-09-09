import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest"; // 👈 importamos vi para mocks
import TaskModal from "../../components/TaskModal";

describe("TaskModal", () => {
  // Props por defecto que se pasan al componente
  const defaultProps = {
    task: {
      IdTask: "1",
      NameTask: "Tarea de prueba",
      DetailTask: "Detalle de prueba",
      AssignedUser: null,
      StateTask: "Nueva",
      Subtasks: [],
    },
    onClose: vi.fn(),         // Función mock para cerrar el modal
    onSave: vi.fn(),          // Función mock para guardar la tarea
    onSubtaskAdd: vi.fn(),    // Función mock para agregar subtarea
    onSubtaskDelete: vi.fn(), // Función mock para eliminar subtarea
    users: [{ IdUser: "1", NameUser: "Usuario 1" }],
  };

  // Limpiamos todos los mocks antes de cada test para evitar interferencias
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Verifica que al hacer clic en el botón "Cancelar"
   * se ejecute la función onClose pasada como prop.
   */
  test("ejecuta onClose al hacer clic en botón Cancelar", () => {
    render(<TaskModal {...defaultProps} />);
    const cancelBtn = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  /**
   * Verifica que al hacer clic en el botón "Guardar"
   * se ejecute la función onSave pasada como prop.
   */
  test("ejecuta onSave al guardar", () => {
    render(<TaskModal {...defaultProps} />);
    const saveBtn = screen.getByRole("button", { name: /guardar/i });
    fireEvent.click(saveBtn);
    expect(defaultProps.onSave).toHaveBeenCalled();
  });
});
