import { useEffect, useState } from 'react'
import {
  obtenerUnidadesProceso,
  crearUnidadProceso,
  eliminarUnidadProceso,
  editarUnidadProceso
} from '../../../src/services/UnidadProceso'
import { PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './UnidadProceso.css'

const UnidadProceso = () => {
  const [nombre, setNombre] = useState('')
  const [filtro, setFiltro] = useState('')
  const [unidades, setUnidades] = useState([])
  const [error, setError] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')

  const cargarUnidades = async () => {
    try {
      const data = await obtenerUnidadesProceso()
      const ordenadas = data.sort((a, b) => a.nombre.localeCompare(b.nombre))
      setUnidades(ordenadas)
    } catch (err) {
      console.error('Error al obtener unidades de proceso:', err)
      setError('No se pudo cargar la lista')
    }
  }

  useEffect(() => {
    cargarUnidades()
  }, [])

  const handleAgregar = async () => {
    setError('')
    if (!nombre.trim()) return setError('El nombre es obligatorio')

    try {
      await crearUnidadProceso({ nombre: nombre.trim() })
      toast.success('Unidad creada')
      setNombre('')
      cargarUnidades()
    } catch (err) {
      console.error('Error al crear unidad:', err)
      setError(err.response?.data?.error || 'Error al guardar unidad')
      toast.error('No se pudo guardar')
    }
  }

  const confirmarEliminacion = (id, nombre) => {
    toast(
      () => (
        <div style={{ padding: '0.5rem' }}>
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            ¿Eliminar <span style={{ color: '#dc2626' }}>{nombre}</span>?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem' }}>
            <button
              onClick={async () => {
                try {
                  await eliminarUnidadProceso(id)
                  toast.dismiss()
                  toast.success('Eliminado')
                  cargarUnidades()
                } catch (err) {
                  console.error('Error al eliminar:', err)
                  toast.dismiss()
                  toast.error('No se pudo eliminar')
                }
              }}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600'
              }}
            >
              Eliminar
            </button>
            <button
              onClick={() => toast.dismiss()}
              style={{
                background: '#e5e7eb',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false
      }
    )
  }

  const handleGuardarEdicion = async (id) => {
    if (!nuevoNombre.trim()) return toast.error('El nombre no puede estar vacío')
    try {
      await editarUnidadProceso(id, { nombre: nuevoNombre.trim() })
      toast.success('Actualizado ✅')
      setEditandoId(null)
      cargarUnidades()
    } catch (err) {
      console.error('Error al editar:', err)
      toast.error('❌ No se pudo actualizar')
    }
  }

  const unidadesFiltradas = unidades.filter((u) =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="unidad-container">
      <div className="unidad-box">
        <h2 className="unidad-titulo">
          <PlusCircle size={24} /> Unidades de Proceso
        </h2>

        <div className="unidad-input-group">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="unidad-input"
            placeholder="Nombre de nueva unidad"
          />
          <button onClick={handleAgregar} className="unidad-btn agregar">
            <PlusCircle size={16} /> Agregar
          </button>
        </div>

        {error && <p className="unidad-error">{error}</p>}

        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar unidad..."
          className="unidad-input buscador"
        />

        <ul className="unidad-lista">
          {unidadesFiltradas.map((u) => (
            <li key={u.id} className="unidad-item">
              {editandoId === u.id ? (
                <input
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="unidad-edit-input"
                  autoFocus
                />
              ) : (
                <span>{u.nombre}</span>
              )}

              <div className="unidad-acciones">
                {editandoId === u.id ? (
                  <>
                    <button onClick={() => handleGuardarEdicion(u.id)} className="unidad-btn-icon edit">
                      <Check size={18} />
                    </button>
                    <button onClick={() => setEditandoId(null)} className="unidad-btn-icon delete">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditandoId(u.id)
                        setNuevoNombre(u.nombre)
                      }}
                      className="unidad-btn-icon edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => confirmarEliminacion(u.id, u.nombre)}
                      className="unidad-btn-icon delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UnidadProceso
