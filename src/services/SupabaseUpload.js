import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://backendinventario-v0gb.onrender.com'

export const subirImagen = async (codigo, imagenFile) => {
  try {
    const formData = new FormData()
    formData.append('imagen', imagenFile)

    const res = await axios.post(`${API_URL}/api/componente/${codigo}/subir-imagen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data.url
  } catch (error) {
    console.error('Error al subir imagen:', error)
    return null
  }
}

