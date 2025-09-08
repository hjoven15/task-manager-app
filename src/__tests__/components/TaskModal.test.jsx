import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest"; // 👈 importamos vi
import TaskModal from "../../components/TaskModal";

describe("TaskModal", () => {
  const defaultProps = {
    task: {
      IdTask: "1",
      NameTask: "Tarea de prueba",
      DetailTask: "Detalle de prueba",
      AssignedUser: null,
      StateTask: "Nueva",
      Subtasks: [],
    },
    onClose: vi.fn(),
    onSave: vi.fn(),
    onSubtaskAdd: vi.fn(),
    onSubtaskDelete: vi.fn(),
    users: [{ IdUser: "1", NameUser: "Usuario 1" }],
  };

  beforeEach(() => {
    vi.clearAllMocks(); // limpia mocks entre tests
  });

  test("ejecuta onClose al hacer clic en botón Cancelar", () => {
    render(<TaskModal {...defaultProps} />);
    const cancelBtn = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test("ejecuta onSave al guardar", () => {
    render(<TaskModal {...defaultProps} />);
    const saveBtn = screen.getByRole("button", { name: /guardar/i });
    fireEvent.click(saveBtn);
    expect(defaultProps.onSave).toHaveBeenCalled();
  });
});
