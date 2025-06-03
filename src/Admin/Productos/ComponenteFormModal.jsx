import { useState, useEffect } from 'react'
import Select from 'react-select'
import { crearComponente, subirImagen } from '../../../src/services/Componente'
import { obtenerClases } from '../../../src/services/Clase'
import { obtenerTiposPorClase } from '../../../src/services/Tipo'
import { Upload, Trash2, ImagePlus, X } from 'lucide-react'
import { toast } from 'react-toastify'
import './productos.css'

const ComponenteFormModal = ({ visible, onClose, onGuardado }) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    modelo: '',
    marca: '',
    cantidad: '',
    imagen_url: '',
    clase_id: '',
    tipo_id: ''
  })

  const [clases, setClases] = useState([])
  const [tipos, setTipos] = useState([])
  const [imagenPreview, setImagenPreview] = useState(null)
  const [archivo, setArchivo] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const cargarClases = async () => {
      try {
        const clasesData = await obtenerClases()
        setClases(clasesData)
      } catch (err) {
        console.error('Error al cargar clases:', err)
      }
    }
    cargarClases()
  }, [])

  useEffect(() => {
    const cargarTipos = async () => {
      if (!form.clase_id) {
        setTipos([])
        setForm((f) => ({ ...f, tipo_id: '' }))
        return
      }
      try {
        const tiposData = await obtenerTiposPorClase(form.clase_id)
        setTipos(tiposData)
        setForm((f) => ({ ...f, tipo_id: '' }))
      } catch (err) {
        console.error('Error al cargar tipos por clase:', err)
        toast.error('Error al cargar tipos')
      }
    }
    cargarTipos()
  }, [form.clase_id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImagen = (e) => {
    const file = e.target.files[0]
    if (file) {
      setArchivo(file)
      setImagenPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    try {
      let imagenUrl = ''
      if (archivo) imagenUrl = await subirImagen(archivo)

      const nuevo = {
        ...form,
        cantidad: parseInt(form.cantidad) || 0,
        imagen_url: imagenUrl
      }

      await crearComponente(nuevo)
      toast.success('✅ Componente creado correctamente 🎉')
      onGuardado?.()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('❌ Error al guardar componente')
    } finally {
      setCargando(false)
    }
  }

  if (!visible) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>

        <h2 className="text-blue-600 text-xl font-bold mb-4 flex items-center gap-2">
          <ImagePlus size={20} /> Nuevo Componente
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="input" />
          <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="input" />

          <Select
            classNamePrefix="select"
            className="basic-select"
            options={clases.map(c => ({ value: c.id, label: c.nombre }))}
            placeholder="Seleccione una Clase"
            value={clases.find(c => c.id === form.clase_id) ? { value: form.clase_id, label: clases.find(c => c.id === form.clase_id)?.nombre } : null}
            onChange={(op) => setForm({ ...form, clase_id: op?.value || '' })}
          />

          <Select
            classNamePrefix="select"
            className="basic-select"
            options={tipos.map(t => ({ value: t.id, label: t.nombre }))}
            placeholder="Seleccione un Tipo"
            value={tipos.find(t => t.id === form.tipo_id) ? { value: form.tipo_id, label: tipos.find(t => t.id === form.tipo_id)?.nombre } : null}
            onChange={(op) => setForm({ ...form, tipo_id: op?.value || '' })}
            isDisabled={!form.clase_id}
          />

          <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" className="input" />
          <input name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" className="input" />

          <input
            type="number"
            name="cantidad"
            value={form.cantidad}
            placeholder="Cantidad"
            min="0"
            className="input"
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
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
                  <button type="button" onClick={() => { setArchivo(null); setImagenPreview(null) }} className="btn-borrar flex items-center gap-2">
                    <Trash2 size={18} /> Borrar
                  </button>
                )}
              </div>
            </div>
          </div>

          <button type="submit" disabled={cargando} className="col-span-full btn btn-guardar flex justify-center items-center gap-2">
            {cargando ? 'Guardando...' : 'Guardar Componente'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ComponenteFormModal
