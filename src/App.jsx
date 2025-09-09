import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import Task from "./models/Task";
import Subtask from "./models/Subtask";
import User from "./models/User";
import "./App.css";

function App() {
  // IDs fijos para usuarios iniciales
  const idHaminton = crypto.randomUUID();
  const idSofia = crypto.randomUUID();

  // Usuarios estáticos predefinidos
  const staticUsers = [
    new User(idHaminton, "Haminton Joven"),
    new User(idSofia, "Sofía Ocampo"),
  ];

  // Estado global de usuarios
  const [users, setUsers] = useState(staticUsers);

  // Estado global de tareas iniciales
  const [tasks, setTasks] = useState(() => {
    const findUserByName = (name) =>
      staticUsers.find(
        (user) => user.NameUser.toLowerCase() === name.toLowerCase()
      ) || null;

    return [
      // Ejemplo con subtareas
      new Task(
        crypto.randomUUID(),
        "HU Implementar 1",
        "Se desea implementar una API",
        findUserByName("Sofía Ocampo"),
        "Abierta",
        [
          new Subtask(
            crypto.randomUUID(),
            "Configurar endpoints",
            "Crear endpoints básicos",
            findUserByName("Sofía Ocampo"),
            "Abierta"
          ),
          new Subtask(
            crypto.randomUUID(),
            "Documentar API",
            "Generar documentación Swagger",
            findUserByName("Haminton Joven"),
            "Abierta"
          ),
        ]
      ),
      // Más ejemplos
      new Task(
        crypto.randomUUID(),
        "HU Implementar 2",
        "Se desea implementar un Worker",
        findUserByName("Haminton Joven"),
        "Proceso"
      ),
      new Task(
        crypto.randomUUID(),
        "HU Implementar 5",
        "Adicional",
        findUserByName("Haminton Joven"),
        "Nueva"
      ),
      new Task(
        crypto.randomUUID(),
        "HU Implementar 3",
        "Se desea implementar una App",
        findUserByName("Sofía Ocampo"),
        "Cerrada"
      ),
      new Task(
        crypto.randomUUID(),
        "HU Implementar 4",
        "Se desea implementar una DB",
        null,
        "Abierta"
      ),
    ];
  });

  // Estados de carga y error al obtener usuarios de la API
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  // Efecto: trae usuarios externos de JSONPlaceholder
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) throw new Error("Error al obtener usuarios");

        const data = await response.json();

        // Limitar y mapear a modelo User
        const limited = data
          .slice(0, 10)
          .map((user) => new User(user.id, user.name));

        // Combinar usuarios estáticos + externos
        const combined = [...users, ...limited];

        // Eliminar duplicados (según nombre en minúsculas)
        const uniqueUsers = combined.filter(
          (user, index, self) =>
            index ===
            self.findIndex(
              (u) => u.NameUser.toLowerCase() === user.NameUser.toLowerCase()
            )
        );

        // Ordenar alfabéticamente
        uniqueUsers.sort((a, b) => a.NameUser.localeCompare(b.NameUser));

        setUsers(uniqueUsers);
      } catch (err) {
        setErrorUsers(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Estado: tarea seleccionada para editar o crear
  const [selectedTask, setSelectedTask] = useState(null);
  // Estado: texto de búsqueda
  const [searchText, setSearchText] = useState("");

  /**
   * Crear o actualizar una tarea
   */
  const handleUpdateTask = (updatedTask) => {
    const fixedTask = Task.fromPlainObject(updatedTask);

    const isNew = !tasks.some((task) => task.IdTask === fixedTask.IdTask);

    if (isNew) {
      // Nueva tarea
      setTasks((prev) => [...prev, fixedTask]);
      window.Swal.fire({
        icon: "success",
        title: "Tarea creada",
        text: "La nueva tarea fue agregada exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      // Actualizar tarea existente
      setTasks((prev) =>
        prev.map((task) =>
          task.IdTask === fixedTask.IdTask ? fixedTask : task
        )
      );
      window.Swal.fire({
        icon: "success",
        title: "Tarea actualizada",
        text: "Los cambios se guardaron correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    setSelectedTask(null); // Cerrar modal
  };

  /**
   * Eliminar una tarea con confirmación
   */
  const handleDeleteTask = (taskId) => {
    window.Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la tarea y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks((prev) => prev.filter((task) => task.IdTask !== taskId));
      }
    });
  };

  /**
   * Agregar subtarea a una tarea
   */
  const handleSubtaskAdd = (taskId, newSubtask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.IdTask === taskId
          ? { ...task, Subtasks: [...task.Subtasks, newSubtask] }
          : task
      )
    );
  };

  /**
   * Eliminar subtarea de una tarea
   */
  const handleSubtaskDelete = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.IdTask === taskId
          ? {
              ...task,
              Subtasks: task.Subtasks.filter(
                (sub) => sub.IdSubtask !== subtaskId
              ),
            }
          : task
      )
    );
  };

  /**
   * Inicializar nueva tarea vacía
   */
  const handleNewTask = () => {
    const emptyTask = new Task(crypto.randomUUID(), "", "", null, "Nueva", []);
    setSelectedTask(emptyTask);
  };

  /**
   * Filtrar tareas por nombre, usuario asignado o estado
   * (sin importar mayúsculas, minúsculas o tildes)
   */
  const filteredTasks = tasks.filter((task) => {
    const normalize = (str) =>
      str
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const query = normalize(searchText);

    const taskName = normalize(task.NameTask);
    const assignedName = task.AssignedUser
      ? normalize(task.AssignedUser.NameUser)
      : "sin asignar";
    const state = normalize(task.StateTask);

    return (
      taskName.includes(query) ||
      assignedName.includes(query) ||
      state.includes(query)
    );
  });

  return (
    <div className="App">
      {/* Barra superior */}
      <div className="full-width-bar">
        <h1 className="title-text">GESTIÓN DE TAREAS</h1>
      </div>

      {/* Botón nueva tarea + buscador */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <button className="btn btn-primary" onClick={handleNewTask}>
          <i className="bi bi-plus-lg me-2"></i>Nueva Tarea
        </button>

        <div className="input-group" style={{ maxWidth: "400px" }}>
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre, asignado o estado..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de tareas */}
      <TaskList
        tasks={filteredTasks}
        onEditTask={setSelectedTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Modal de tarea (crear/editar) */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleUpdateTask}
          onSubtaskAdd={handleSubtaskAdd}
          onSubtaskDelete={handleSubtaskDelete}
          users={users}
        />
      )}
    </div>
  );
}

export default App;
