import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import App from "../App"

// 👇 Mockeamos SweetAlert2 para que no explote en los tests
beforeEach(() => {
  window.Swal = {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true })
  }
})

describe("App.jsx", () => {
  test("renderiza el título principal", () => {
    render(<App />)
    expect(screen.getByText(/GESTIÓN DE TAREAS/i)).toBeInTheDocument()
  })

  test("permite crear una nueva tarea", async () => {
    render(<App />)

    const newTaskButton = screen.getByRole("button", { name: /nueva tarea/i })
    fireEvent.click(newTaskButton)

    // Debería aparecer el modal de tarea
    expect(await screen.findByText(/guardar/i)).toBeInTheDocument()
  })

  test("permite filtrar tareas por texto", () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/buscar por nombre/i)
    fireEvent.change(input, { target: { value: "Implementar 1" } })

    expect(screen.getByText(/HU Implementar 1/i)).toBeInTheDocument()
  })

  test("permite eliminar una tarea", async () => {
    render(<App />)

    // Buscar tarea existente
    const tarea = await screen.findByText(/HU Implementar 1/i)
    expect(tarea).toBeInTheDocument()

    // Simular click en eliminar
    const deleteButton = screen.getAllByRole("button", { name: /eliminar/i })[0]
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(window.Swal.fire).toHaveBeenCalled()
    })
  })
})
