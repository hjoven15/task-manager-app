# Proyecto Final - Gestión de Tareas

Este proyecto es una aplicación web desarrollada con React que permite gestionar tareas y subtareas de manera intuitiva. Funciona como un sistema CRUD (Crear, Leer, Actualizar y Eliminar) para organizar y visualizar tareas divididas por estado (Nueva, Abierta, En Proceso, Cerrada).

## Funcionalidades

- Crear, editar y eliminar tareas.
- Asignar tareas y subtareas a distintos usuarios.
- Visualizar el progreso de subtareas por cada tarea.
- Filtrado de tareas por nombre, estado o usuario asignado.
- Almacenamiento local temporal (no persistente en base de datos).

## Vista previa

La interfaz está organizada por columnas que representan los estados de las tareas, e incluye una búsqueda en tiempo real y una ventana modal para editar/crear tareas.

## Instalación y ejecución

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

```bash
# Clona el repositorio o copia los archivos en tu máquina
cd proyecto-final

# Instala las dependencias
npm install

# Ejecuta la aplicación en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` o el puerto que indique tu terminal.

## API utilizada

Se utiliza una API pública para obtener una lista de usuarios simulados:

🔗 [https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)

Estos usuarios se combinan con algunos usuarios predefinidos para poder asignarlos a tareas y subtareas dentro de la aplicación.

## Tecnologías utilizadas

- React
- Bootstrap 5
- SweetAlert2
- JavaScript (ES6+)
- HTML5 + CSS3

## Estructura del proyecto

```
task-manager-app/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── TaskCard.jsx
│   │   ├── TaskList.jsx
│   │   └── TaskModal.jsx
│   ├── models/
│   │   ├── Task.js
│   │   ├── Subtask.js
│   │   └── User.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
└── index.html
```

## Créditos

Desarrollado por Haminton Joven y Sofía Ocampo.
