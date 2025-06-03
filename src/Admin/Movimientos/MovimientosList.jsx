import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerMovimientos } from '../../../src/services/Movimiento'
import { History } from 'lucide-react'
import './movimientos.css'

const ListaMovimientos = () => {
  const [movimientos, setMovimientos] = useState([])
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroFecha, setFiltroFecha] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerMovimientos()
        setMovimientos(data)
      } catch (err) {
        console.error('Error al cargar movimientos:', err)
      }
    }
    cargar()
  }, [])

  const movimientosFiltrados = movimientos.filter(m => {
    const coincideTipo =
      filtroTipo === 'todos' || m.tipo?.toLowerCase() === filtroTipo

    const coincideFecha = filtroFecha
      ? new Date(m.fecha + 'Z').toISOString().slice(0, 10) === filtroFecha
      : true

    return coincideTipo && coincideFecha
  })

  return (
    <div className="producto-container">
      <div className="form-box">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-blue-600 text-2xl font-bold flex items-center gap-2">
            <History size={24} /> Historial de Entradas y Salidas
          </h2>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="input"
          >
            <option value="todos">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="salida">Salidas</option>
          </select>

          <input
            type="date"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            className="input"
          />
        </div>

        {/* Tabla de movimientos */}
        <div className="tabla-wrapper overflow-x-auto">
          <table className="tabla min-w-full">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Código</th>
                <th>Componente</th>
                <th>Cantidad</th>
                <th>Persona</th>
                <th>Orden Trabajo</th>
                <th>Observaciones</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.length > 0 ? (
                movimientosFiltrados.map((m) => (
                  <tr key={m.id}>
                    <td>
                      {new Date(m.fecha + 'Z').toLocaleString('es-BO', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        timeZone: 'America/La_Paz'
                      })}
                    </td>
                    <td className={m.tipo === 'entrada' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}
                    </td>
                    <td>{m.componente_codigo}</td>
                    <td>{m.nombre_componente || '-'}</td>
                    <td>{m.cantidad}</td>
                    <td>
                      {m.tipo === 'entrada'
                        ? m.persona_entrega || '-'
                        : m.persona_responsable || '-'}
                    </td>
                    <td>{m.orden_trabajo || '-'}</td>
                    <td>{m.observaciones || '-'}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/detalle-componente/${m.componente_codigo}`)}
                        className="btn btn-subir text-sm px-3 py-1"
                      >
                        Ver Componente
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-datos text-center py-4 text-gray-500">
                    No hay movimientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ListaMovimientos
