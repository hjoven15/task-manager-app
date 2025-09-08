import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "../../components/TaskCard";
import User from "../../models/User";
import Subtask from "../../models/Subtask";
import Task from "../../models/Task";

describe("TaskCard", () => {
  const user = new User("1", "Haminton Joven");
  const subtasks = [
    new Subtask("s1", "Sub 1", "Detalle 1", user, "Cerrada"),
    new Subtask("s2", "Sub 2", "Detalle 2", user, "Abierta"),
  ];
  const task = new Task("t1", "Tarea Test", "Detalle de prueba", user, "Abierta", subtasks);

  test("renderiza correctamente los datos principales", () => {
    render(<TaskCard task={task} />);
    expect(screen.getByText("Tarea Test")).toBeInTheDocument();
    expect(screen.getByText("Detalle de prueba")).toBeInTheDocument();
    expect(screen.getByText("Haminton Joven")).toBeInTheDocument();
    expect(screen.getByText("Abierta")).toBeInTheDocument();
  });

  test("muestra el progreso de subtareas", () => {
    render(<TaskCard task={task} />);
    expect(screen.getByText(/1\/2 \(50%\)/)).toBeInTheDocument();
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 50%");
  });

  test("ejecuta onUpdateTask al hacer clic en la tarjeta", () => {
    const onUpdateTask = vi.fn();
    render(<TaskCard task={task} onUpdateTask={onUpdateTask} />);
    fireEvent.click(screen.getByText("Tarea Test"));
    expect(onUpdateTask).toHaveBeenCalledWith(task);
  });

  test("ejecuta onDeleteTask al hacer clic en eliminar", () => {
    const onDeleteTask = vi.fn();
    render(<TaskCard task={task} onDeleteTask={onDeleteTask} />);
    fireEvent.click(screen.getByRole("button", { name: /Eliminar/i }));
    expect(onDeleteTask).toHaveBeenCalledWith("t1");
  });

  test("muestra 'Sin asignar' si no tiene usuario asignado", () => {
    const taskWithoutUser = new Task("t2", "Tarea sin user", "Detalle", null, "Nueva");
    render(<TaskCard task={taskWithoutUser} />);
    expect(screen.getByText("Sin asignar")).toBeInTheDocument();
  });
});
