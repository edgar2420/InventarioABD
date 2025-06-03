import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

// Obtener Clase
export const obtenerClases = async () => {
  const res = await axios.get(`${API_BASE}/clase/obtener`)
  return res.data
}

// Crear Clase con tipo
export const crearClaseConTipos = async (payload) => {
  const res = await axios.post(`${API_BASE}/clase/agregar-con-tipos`, payload)
  return res.data
}


// Editar Clase
export const editarClase = async (id, clase) => {
  const res = await axios.put(`${API_BASE}/clase/editar/${id}`, clase)
  return res.data
}
// Eliminar Clase
export const eliminarClase = async (id) => {
  const res = await axios.delete(`${API_BASE}/clase/eliminar/${id}`)
  return res.data
}


