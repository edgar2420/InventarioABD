import { useEffect, useState } from 'react'
import { PlusCircle, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import {
  obtenerClases,
  crearClaseConTipos,
  eliminarClase
} from '../../../src/services/Clase'
import {
  editarTipo,
  eliminarTipo,
  crearTipo
} from '../../../src/services/Tipo'
import 'react-toastify/dist/ReactToastify.css'
import './CrearClase.css'

const CrearClase = () => {
  const [nombre, setNombre] = useState('')
  const [tipos, setTipos] = useState([{ nombre: '' }])
  const [clases, setClases] = useState([])
  const [nuevoTipo, setNuevoTipo] = useState({})
  const [claseActiva, setClaseActiva] = useState(null)

  const cargarClases = async () => {
    try {
      const data = await obtenerClases()
      setClases(data.sort((a, b) => a.nombre.localeCompare(b.nombre)))
    } catch {
      toast.error('Error al cargar clases')
    }
  }

  useEffect(() => {
    cargarClases()
  }, [])

  const handleGuardar = async () => {
    if (!nombre.trim()) return toast.error('El nombre de la clase es obligatorio')
    const tiposValidos = tipos.filter(t => t.nombre.trim() !== '')
    if (tiposValidos.length === 0) return toast.error('Agrega al menos un tipo')

    try {
      await crearClaseConTipos({ nombre: nombre.trim(), tipos: tiposValidos })
      toast.success('Guardado exitoso')
      setNombre('')
      setTipos([{ nombre: '' }])
      cargarClases()
    } catch (err) {
      const mensaje = err.response?.data?.error || ''
      if (mensaje.includes('duplicate key value') && mensaje.includes('clase_nombre_key')) {
        toast.error('Ya existe una clase con ese nombre. Por favor elige otro.')
      } else {
        toast.error('Error al guardar la clase.')
      }
    }
  }

  const toggleClase = (id) => {
    setClaseActiva(claseActiva === id ? null : id)
  }

  const agregarTipo = () => setTipos([...tipos, { nombre: '' }])
  const eliminarTipoTemporal = (index) => {
    const nuevos = [...tipos]
    nuevos.splice(index, 1)
    setTipos(nuevos)
  }
  const actualizarTipo = (index, valor) => {
    const nuevos = [...tipos]
    nuevos[index].nombre = valor
    setTipos(nuevos)
  }

  const confirmarEliminarClase = async (clase) => {
    const result = await Swal.fire({
      title: '¿Eliminar clase?',
      text: `Se eliminará la clase "${clase.nombre}" y todos sus tipos.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    })

    if (result.isConfirmed) {
      try {
        await eliminarClase(clase.id)
        toast.success('Clase eliminada')
        cargarClases()
        setClaseActiva(null)
      } catch {
        toast.error('Error al eliminar clase')
      }
    }
  }

  const confirmarEliminarTipo = async (tipo) => {
    const result = await Swal.fire({
      title: '¿Eliminar tipo?',
      text: `Se eliminará el tipo "${tipo.nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    })

    if (result.isConfirmed) {
      try {
        await eliminarTipo(tipo.id)
        toast.success('Tipo eliminado')
        cargarClases()
      } catch {
        toast.error('Error al eliminar tipo')
      }
    }
  }

  return (
    <div className="clase-container">
      <div className="clase-box">
        <h2 className="clase-titulo">
          <PlusCircle size={24} /> Nueva Clase
        </h2>

        <div className="formulario-clase">
          <div className="clase-card nueva">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la clase"
              className="clase-input"
            />
            <div className="tipos-grid">
              {tipos.map((tipo, index) => (
                <div key={index} className="tipo-card">
                  <input
                    type="text"
                    value={tipo.nombre}
                    onChange={(e) => actualizarTipo(index, e.target.value)}
                    placeholder={`Tipo ${index + 1}`}
                    className="tipo-input"
                  />
                  <button
                    onClick={() => eliminarTipoTemporal(index)}
                    disabled={tipos.length === 1}
                    className="btn eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button onClick={agregarTipo} className="btn agregar">
                <PlusCircle size={16} /> Añadir Tipo
              </button>
            </div>

            <button onClick={handleGuardar} className="btn guardar">
              <PlusCircle size={16} /> Guardar Clase y Tipos
            </button>
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', fontWeight: '600', color: '#374151' }}>Clases Registradas</h3>

        <div className="lista-clases">
          {clases.map(clase => (
            <div key={clase.id} className="clase-card">
              <div
                className="clase-header"
                onClick={() => toggleClase(clase.id)}
              >
                <h3>{clase.nombre}</h3>
                <span>{claseActiva === clase.id ? '▲' : '▼'}</span>
              </div>

              {claseActiva === clase.id && (
                <>
                  <button
                    className="btn eliminar"
                    onClick={() => confirmarEliminarClase(clase)}
                  >
                    <Trash2 size={14} /> Eliminar Clase
                  </button>

                  <ul className="lista-tipos">
                    {clase.tipo.map((tipo) => (
                      <li key={tipo.id} className="item-tipo editable-tipo">
                        <input
                          type="text"
                          defaultValue={tipo.nombre}
                          className="tipo-input"
                          onBlur={async (e) => {
                            const nuevoNombre = e.target.value.trim()
                            if (nuevoNombre && nuevoNombre !== tipo.nombre) {
                              try {
                                await editarTipo(tipo.id, nuevoNombre)
                                toast.success('Tipo actualizado')
                                cargarClases()
                              } catch {
                                toast.error('Error al editar tipo')
                              }
                            }
                          }}
                        />
                        <button
                          className="btn eliminar"
                          onClick={() => confirmarEliminarTipo(tipo)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}

                    <li className="item-tipo agregar-nuevo">
                      <input
                        type="text"
                        placeholder="Nuevo tipo"
                        value={nuevoTipo[clase.id] || ''}
                        className="tipo-input"
                        onChange={(e) =>
                          setNuevoTipo({ ...nuevoTipo, [clase.id]: e.target.value })
                        }
                      />

                      <button
                        className="btn agregar"
                        onClick={async () => {
                          const nombreNuevo = nuevoTipo[clase.id]?.trim()
                          if (!nombreNuevo) return toast.error('Nombre requerido')
                          try {
                            await crearTipo({ nombre: nombreNuevo, clase_id: clase.id })
                            toast.success('Tipo agregado')
                            setNuevoTipo({ ...nuevoTipo, [clase.id]: '' })
                            cargarClases()
                          } catch {
                            toast.error('Error al agregar tipo')
                          }
                        }}
                      >
                        <PlusCircle size={14} />
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CrearClase

