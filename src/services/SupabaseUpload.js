import axios from 'axios'

export const subirImagen = async (file) => {
  const formData = new FormData()
  formData.append('imagen', file)

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/subir-imagen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data.url
  } catch (err) {
    console.error('Error al subir imagen:', err)
    return null
  }
}
