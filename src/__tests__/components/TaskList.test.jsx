import { render, screen, within } from "@testing-library/react"; 
import TaskList from "../../components/TaskList";

describe("TaskList", () => {
  // Datos de prueba con diferentes estados y subtareas
  const tasks = [
    {
      IdTask: "2",
      NameTask: "Tarea B",
      DetailTask: "Detalle B",
      StateTask: "Nueva",
      AssignedUser: { IdUser: "1", NameUser: "Usuario 1" },
      Subtasks: [],
    },
    {
      IdTask: "1",
      NameTask: "Tarea A",
      DetailTask: "Detalle A",
      StateTask: "Nueva",
      AssignedUser: { IdUser: "2", NameUser: "Usuario 2" },
      Subtasks: [],
    },
    {
      IdTask: "3",
      NameTask: "Tarea C",
      DetailTask: "Detalle C",
      StateTask: "Abierta",
      AssignedUser: null,
      Subtasks: [
        {
          IdSubtask: "s1",
          NameSubtask: "Subtarea 1",
          DetailSubtask: "Detalle s1",
          AssignedUser: null,
          StateSubtask: "Cerrada",
        },
        {
          IdSubtask: "s2",
          NameSubtask: "Subtarea 2",
          DetailSubtask: "Detalle s2",
          AssignedUser: null,
          StateSubtask: "Abierta",
        },
      ],
    },
  ];

  /**
   * Verifica que el componente renderice correctamente
   * todas las columnas de estado definidas: 
   * "Nueva", "Abierta", "Proceso" y "Cerrada".
   */
  test("renderiza todas las columnas de estados", () => {
    render(<TaskList tasks={tasks} />);
    expect(screen.getByRole("heading", { name: "Nueva" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Abierta" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Proceso" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cerrada" })).toBeInTheDocument();
  });

  /**
   * Comprueba que cada tarea se muestre
   * en la columna que corresponde a su estado.
   */
  test("muestra las tareas en la columna correspondiente", () => {
    render(<TaskList tasks={tasks} />);
    expect(screen.getByText("Tarea A")).toBeInTheDocument();
    expect(screen.getByText("Tarea B")).toBeInTheDocument();
    expect(screen.getByText("Tarea C")).toBeInTheDocument();
  });

  /**
   * Valida que dentro de cada columna, las tareas 
   * se ordenen por el campo IdTask en orden ascendente.
   */
  test("ordena las tareas en cada columna por IdTask", () => {
    render(<TaskList tasks={tasks} />);
    const nuevaColumn = screen.getByRole("heading", { name: "Nueva" }).parentElement;
    const taskTitles = within(nuevaColumn).getAllByRole("heading", { level: 3 });
    const titlesText = taskTitles.map((el) => el.textContent);
    expect(titlesText).toEqual(["Tarea A", "Tarea B"]);
  });

  /**
   * Verifica que el progreso de subtareas de una tarea
   * se muestre en formato "completadas/total (porcentaje)".
   */
  test("muestra el progreso de subtareas correctamente", () => {
    render(<TaskList tasks={tasks} />);
    const tareaC = screen.getByText("Tarea C").closest(".card");
    expect(within(tareaC).getByText("1/2 (50%)")).toBeInTheDocument();
  });

  /**
   * Valida que la barra de progreso tenga aplicado
   * el porcentaje correspondiente en su estilo CSS.
   */
  test("barra de progreso refleja correctamente el porcentaje", () => {
    render(<TaskList tasks={tasks} />);
    const tareaC = screen.getByText("Tarea C").closest(".card");
    const progressBar = within(tareaC).getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 50%");
  });
});
