import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { editarComponente, obtenerComponentePorCodigo } from '../../../src/services/Componente'
import { subirImagen } from '../../../src/services/SupabaseUpload'
import { toast } from 'react-toastify'
import './editComponente.css'

const EditComponente = () => {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    modelo: '',
    marca: '',
    fabricante: '',
    cantidad: '',
    imagen_url: ''
  })
  const [imagenFile, setImagenFile] = useState(null)
  const [imagenEliminada, setImagenEliminada] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerComponentePorCodigo(codigo)
        if (data) setFormulario(data)
        else toast.error('Componente no encontrado')
      } catch {
        toast.error('Error al cargar componente')
      }
    }
    cargarDatos()
  }, [codigo])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormulario(prev => ({ ...prev, [name]: value }))
  }

  const handleImagen = (e) => {
    const file = e.target.files[0]
    setImagenFile(file)
    setImagenEliminada(false)
  }

  const eliminarImagen = () => {
    setFormulario(prev => ({ ...prev, imagen_url: '' }))
    setImagenFile(null)
    setImagenEliminada(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let imagen_url = formulario.imagen_url

      if (imagenEliminada) imagen_url = ''
      if (imagenFile) {
        const nuevaUrl = await subirImagen(imagenFile, `componentes/${codigo}`)
        if (nuevaUrl) imagen_url = nuevaUrl
        else return toast.error('Error al subir imagen')
      }

      await editarComponente(codigo, { ...formulario, imagen_url })
      toast.success('Componente actualizado correctamente ✅')
      navigate('/componentes')
    } catch {
      toast.error('Error al actualizar componente')
    }
  }

  return (
    <div className="producto-container">
      <div className="form-box">
        <h2 className="titulo-lista">✏️ Editar Componente</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre" required />
          <input type="text" name="descripcion" value={formulario.descripcion} onChange={handleChange} placeholder="Descripción" />
          <input type="text" name="modelo" value={formulario.modelo} onChange={handleChange} placeholder="Modelo" />
          <input type="text" name="marca" value={formulario.marca} onChange={handleChange} placeholder="Marca" />
          <input type="text" name="fabricante" value={formulario.fabricante} onChange={handleChange} placeholder="Fabricante" />
          <input
            type="number"
            name="cantidad"
            value={formulario.cantidad}
            readOnly
            placeholder="Cantidad"
            min="0"
            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
          />


          <label className="text-sm font-medium mt-4">Imagen del Componente</label>
          {formulario.imagen_url && !imagenEliminada && (
            <div className="imagen-preview">
              <img src={formulario.imagen_url} alt="Vista previa" className="img-preview" />
              <button type="button" className="btn-borrar" onClick={eliminarImagen}>Quitar imagen</button>
            </div>
          )}

          <input type="file" accept="image/*" onChange={handleImagen} />

          <div className="form-buttons">
            <button type="submit" className="btn btn-guardar">Guardar Cambios</button>
            <button type="button" className="btn btn-cancelar" onClick={() => navigate('/componentes')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditComponente
