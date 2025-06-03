import axios from 'axios'

const API_BASE = 'https://backendinventario-dlaq.onrender.com/api'

// Registrar un nuevo movimiento
export const registrarMovimiento = async (datos) => {
  const res = await axios.post(`${API_BASE}/movimiento/crear`, datos)
  return res.data
}

// Obtener todos los componentes disponibles para seleccionar
export const obtenerComponentes = async () => {
  const res = await axios.get(`${API_BASE}/componente`)
  return res.data
}

// Obtener historial de movimientos
export const obtenerMovimientos = async () => {
  const res = await axios.get(`${API_BASE}/movimiento`)
  return res.data
}

// Obtener movimientos por componente
export const obtenerMovimientosPorComponente = async (codigo) => {
  const res = await axios.get(`${API_BASE}/movimiento/componente/${codigo}`)
  return res.data
}
