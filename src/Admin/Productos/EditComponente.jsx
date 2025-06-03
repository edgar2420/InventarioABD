import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { editarComponente, obtenerComponentePorCodigo } from '../../../src/services/Componente'
import { subirImagen } from '../../../src/services/SupabaseUpload'
import { toast } from 'react-toastify'
import { Upload, Trash2 } from 'lucide-react'
import './editComponente.css'

const EditComponente = () => {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    modelo: '',
    marca: '',
    cantidad: '',
    imagen_url: '',
    clase_id: '',
    tipo_id: ''
  })

  const [imagenFile, setImagenFile] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerComponentePorCodigo(codigo)
        if (data) {
          setFormulario({
            nombre: data.nombre || '',
            descripcion: data.descripcion || '',
            modelo: data.modelo || '',
            marca: data.marca || '',
            cantidad: data.cantidad || '',
            imagen_url: data.imagen_url || '',
            clase_id: data.clase_id || data.clase?.clase_id || '',
            tipo_id: data.tipo_id || data.tipo?.tipo_id || ''
          })
          setImagenPreview(data.imagen_url || null)
        } else {
          toast.error('Componente no encontrado')
        }
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
    if (file) {
      setImagenFile(file)
      setImagenPreview(URL.createObjectURL(file))
    }
  }

  const borrarImagen = () => {
    setImagenFile(null)
    setImagenPreview(null)
    setFormulario(prev => ({ ...prev, imagen_url: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let imagen_url = formulario.imagen_url

      if (imagenFile) {
        const nuevaUrl = await subirImagen(codigo, imagenFile)
        if (!nuevaUrl) return toast.error('Error al subir imagen')
        imagen_url = nuevaUrl
      }

      const actualizado = {
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        modelo: formulario.modelo,
        marca: formulario.marca,
        cantidad: formulario.cantidad,
        imagen_url: imagen_url,
        clase_id: formulario.clase_id,
        tipo_id: formulario.tipo_id
      }

      await editarComponente(codigo, actualizado)
      toast.success('✅ Componente actualizado correctamente')
      navigate('/componentes')
    } catch (err) {
      console.error(err)
      toast.error('❌ Error al actualizar componente')
    }
  }

  return (
    <div className="producto-container">
      <div className="form-box">
        <h2 className="titulo-lista">✏️ Editar Componente</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <input name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre" required />
          <input name="descripcion" value={formulario.descripcion} onChange={handleChange} placeholder="Descripción" />
          <input name="modelo" value={formulario.modelo} onChange={handleChange} placeholder="Modelo" />
          <input name="marca" value={formulario.marca} onChange={handleChange} placeholder="Marca" />

          <input
            type="number"
            name="cantidad"
            value={formulario.cantidad}
            readOnly
            placeholder="Cantidad"
            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
          />

          <div className="col-span-full">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Imagen del componente</label>
            <div className="flex gap-4 flex-wrap items-center">
              <div className="w-24 h-24 border-2 border-dashed bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {imagenPreview ? (
                  <img src={imagenPreview} alt="preview" className="object-contain w-full h-full" />
                ) : <span className="text-gray-400 text-sm">Vista previa</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="btn btn-subir cursor-pointer flex items-center gap-2">
                  <Upload size={18} /> Subir imagen
                  <input type="file" accept="image/*" onChange={handleImagen} className="hidden" />
                </label>

                {imagenPreview && (
                  <button type="button" onClick={borrarImagen} className="btn-borrar flex items-center gap-2">
                    <Trash2 size={18} /> Borrar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-buttons col-span-full">
            <button type="submit" className="btn btn-guardar">Guardar Cambios</button>
            <button type="button" className="btn btn-cancelar" onClick={() => navigate('/componentes')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditComponente
