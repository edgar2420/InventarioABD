import { useEffect, useState } from 'react'
import { PlusCircle, Pencil, Trash2, Users } from 'lucide-react'
import { obtenerTecnicos, eliminarTecnico } from '../../../src/services/Tecnicos'
import TecnicoFormModal from './TecnicoFormModal'
import './Tecnicos.css'

const Tecnicos = () => {
  const [tecnicos, setTecnicos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [mostrarModal, setMostrarModal] = useState(false)
  const [tecnicoEditar, setTecnicoEditar] = useState(null)

  const cargarTecnicos = async () => {
    try {
      const data = await obtenerTecnicos()
      setTecnicos(data)
    } catch (error) {
      console.error('Error al cargar técnicos', error)
    }
  }

  useEffect(() => {
    cargarTecnicos()
  }, [])

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar técnico?')) return
    try {
      await eliminarTecnico(id)
      setTecnicos(tecnicos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error al eliminar técnico', error)
    }
  }

  const filtrados = tecnicos.filter((t) =>
    t.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    t.apellido?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="lista-componentes-container">
      <div className="lista-componentes-content">
        <div className="lista-componentes-header">
          <h2 className="lista-componentes-title">
            <Users size={24} /> Técnicos
          </h2>
          <div className="lista-componentes-actions">
            <button
              className="lista-btn lista-btn-crear"
              onClick={() => {
                setTecnicoEditar(null)
                setMostrarModal(true)
              }}
            >
              <PlusCircle size={16} /> Crear Técnico
            </button>
          </div>
        </div>

        <div className="lista-componentes-search">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="lista-componentes-search-input"
          />
        </div>

        <div className="lista-componentes-table-wrapper">
          <table className="lista-componentes-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((t) => (
                  <tr key={t.id}>
                    <td>{t.nombre}</td>
                    <td>
                      <div className="lista-componentes-actions-cell">
                        <button
                          className="lista-componentes-action-btn lista-componentes-edit-btn"
                          onClick={() => {
                            setTecnicoEditar(t)
                            setMostrarModal(true)
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="lista-componentes-action-btn lista-componentes-delete-btn"
                          onClick={() => handleEliminar(t.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="lista-componentes-no-data">No hay técnicos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TecnicoFormModal
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onGuardado={cargarTecnicos}
        tecnicoEditar={tecnicoEditar}
      />
    </div>
  )
}

export default Tecnicos
