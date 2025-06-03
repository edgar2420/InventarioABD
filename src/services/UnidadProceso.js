import axios from 'axios'

const API_BASE = 'https://backendinventario-dlaq.onrender.com/api'

// Obtener todas las unidades de proceso
export const obtenerUnidadesProceso = async () => {
  const res = await axios.get(`${API_BASE}/unidad-proceso/obtener`)
  return res.data
}

// Crear una nueva unidad de proceso
export const crearUnidadProceso = async (unidadProceso) => {
  const res = await axios.post(`${API_BASE}/unidad-proceso/agregar`, unidadProceso)
  return res.data
}

// Editar una unidad de proceso existente
export const editarUnidadProceso = async (id, unidadProceso) => {
  const res = await axios.put(`${API_BASE}/unidad-proceso/editar/${id}`, unidadProceso)
  return res.data
}

// Eliminar una unidad de proceso
export const eliminarUnidadProceso = async (id) => {
  const res = await axios.delete(`${API_BASE}/unidad-proceso/eliminar/${id}`)
  return res.data
}