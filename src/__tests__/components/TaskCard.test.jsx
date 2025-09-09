import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "../../components/TaskCard";
import User from "../../models/User";
import Subtask from "../../models/Subtask";
import Task from "../../models/Task";

describe("TaskCard", () => {
  // Datos base para las pruebas
  const user = new User("1", "Haminton Joven");
  const subtasks = [
    new Subtask("s1", "Sub 1", "Detalle 1", user, "Cerrada"),
    new Subtask("s2", "Sub 2", "Detalle 2", user, "Abierta"),
  ];
  const task = new Task("t1", "Tarea Test", "Detalle de prueba", user, "Abierta", subtasks);

  /**
   * Verifica que el componente renderice correctamente
   * los datos principales de una tarea: nombre, detalle,
   * usuario asignado y estado.
   */
  test("renderiza correctamente los datos principales", () => {
    render(<TaskCard task={task} />);
    expect(screen.getByText("Tarea Test")).toBeInTheDocument();
    expect(screen.getByText("Detalle de prueba")).toBeInTheDocument();
    expect(screen.getByText("Haminton Joven")).toBeInTheDocument();
    expect(screen.getByText("Abierta")).toBeInTheDocument();
  });

  /**
   * Verifica que se muestre el progreso correcto
   * de subtareas (cantidad completada / total y el %).
   */
  test("muestra el progreso de subtareas", () => {
    render(<TaskCard task={task} />);
    expect(screen.getByText(/1\/2 \(50%\)/)).toBeInTheDocument();
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 50%");
  });

  /**
   * Valida que al hacer clic sobre la tarjeta de tarea,
   * se ejecute la función onUpdateTask con la tarea actual.
   */
  test("ejecuta onUpdateTask al hacer clic en la tarjeta", () => {
    const onUpdateTask = vi.fn();
    render(<TaskCard task={task} onUpdateTask={onUpdateTask} />);
    fireEvent.click(screen.getByText("Tarea Test"));
    expect(onUpdateTask).toHaveBeenCalledWith(task);
  });

  /**
   * Valida que al hacer clic en el botón "Eliminar",
   * se ejecute la función onDeleteTask con el id de la tarea.
   */
  test("ejecuta onDeleteTask al hacer clic en eliminar", () => {
    const onDeleteTask = vi.fn();
    render(<TaskCard task={task} onDeleteTask={onDeleteTask} />);
    fireEvent.click(screen.getByRole("button", { name: /Eliminar/i }));
    expect(onDeleteTask).toHaveBeenCalledWith("t1");
  });

  /**
   * Verifica que, en caso de que la tarea no tenga un usuario asignado,
   * se muestre el texto "Sin asignar" en la interfaz.
   */
  test("muestra 'Sin asignar' si no tiene usuario asignado", () => {
    const taskWithoutUser = new Task("t2", "Tarea sin user", "Detalle", null, "Nueva");
    render(<TaskCard task={taskWithoutUser} />);
    expect(screen.getByText("Sin asignar")).toBeInTheDocument();
  });
});
