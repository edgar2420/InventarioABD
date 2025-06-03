import axios from 'axios'

const API_BASE = 'https://backendinventario-v0gb.onrender.com/api'

// 📦 Obtener todos los componentes
export const obtenerComponentes = async () => {
  const res = await axios.get(`${API_BASE}/componente/obtener`)
  return res.data
}

// 🔍 Obtener un componente por código
export const obtenerComponentePorCodigo = async (codigo) => {
  const res = await axios.get(`${API_BASE}/componente/obtener/${codigo}`)
  return res.data
}

// 🆕 Crear componente
export const crearComponente = async (componente) => {
  const res = await axios.post(`${API_BASE}/componente/agregar`, componente)
  return res.data
}

// ✏️ Editar componente
export const editarComponente = async (codigo, data) => {
  const res = await axios.put(`${API_BASE}/componente/editar/${codigo}`, data)
  return res.data
}

// ❌ Eliminar componente
export const eliminarComponente = async (codigo) => {
  const res = await axios.delete(`${API_BASE}/componente/eliminar/${codigo}`)
  return res.data
}

// 🖼 Subir imagen a Supabase (vía backend)
export const subirImagen = async (archivo) => {
  const formData = new FormData()
  formData.append('imagen', archivo)

  const res = await axios.post(`${API_BASE}/imagene/subir`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return res.data.url
}
