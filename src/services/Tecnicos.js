import axios from 'axios'

const API_BASE = 'https://backendinventario-v0gb.onrender.com/api'

// Obtener técnicos
export const obtenerTecnicos = async () => {
  const res = await axios.get(`${API_BASE}/persona/obtener`)
  return res.data
}

// Crear técnico
export const crearTecnico = async (tecnico) => {
  const res = await axios.post(`${API_BASE}/persona/agregar`, tecnico)
  return res.data
}

// Editar técnico
export const editarTecnico = async (id, tecnico) => {
  const res = await axios.put(`${API_BASE}/persona/editar/${id}`, tecnico)
  return res.data
}

// Eliminar técnico
export const eliminarTecnico = async (id) => {
  const res = await axios.delete(`${API_BASE}/persona/eliminar/${id}`)
  return res.data
}
