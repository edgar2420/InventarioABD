import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerComponentePorCodigo } from '../../../src/services/Componente'
import { obtenerMovimientosPorComponente } from '../../../src/services/Movimiento'
import { PackageOpen, ArrowLeftCircle } from 'lucide-react'
import './detalleComponente.css'

const DetalleComponente = () => {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const [componente, setComponente] = useState(null)
  const [movimientos, setMovimientos] = useState([])

  useEffect(() => {
    const cargar = async () => {
      try {
        const [dataComp, dataMovs] = await Promise.all([
          obtenerComponentePorCodigo(codigo),
          obtenerMovimientosPorComponente(codigo)
        ])
        setComponente(dataComp)
        setMovimientos(dataMovs)
      } catch (err) {
        console.error('Error al cargar datos:', err)
        setComponente(null)
      }
    }

    cargar()
  }, [codigo])

  if (!componente) return <p className="text-center mt-10">Cargando...</p>

  return (
    <div className="producto-container">
      <div className="form-box">
        <div className="flex items-center justify-between mb-6">
          <h2 className="titulo-lista">
            <PackageOpen size={24} /> Detalle del Componente
          </h2>
          <button
            className="btn btn-subir flex items-center gap-2"
            onClick={() => navigate('/componentes')}
          >
            <ArrowLeftCircle size={18} /> Volver
          </button>
        </div>

        {/* Datos del componente y la imagen */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
          {componente.imagen_url && (
            <div className="flex-shrink-0 self-center md:self-start">
              <img
                src={componente.imagen_url}
                alt="Imagen del componente"
                className="rounded-lg shadow-md w-60 h-60 object-contain border border-gray-200"
              />
            </div>
          )}

          <div className="flex-1 space-y-3 bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Código:</strong> {componente.codigo}</p>
              <p><strong>Nombre:</strong> {componente.nombre}</p>
              <p><strong>Clase:</strong> {componente.clase?.nombre || '-'}</p>
              <p><strong>Tipo:</strong> {componente.tipo?.nombre || '-'}</p>
              <p><strong>Modelo:</strong> {componente.modelo}</p>
              <p><strong>Marca:</strong> {componente.marca}</p>
              <p><strong>Cantidad:</strong> {componente.cantidad}</p>
            </div>

            <div>
              <p className="font-semibold mt-2 mb-1">Descripción:</p>
              <p className="bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-700 text-justify">
                {componente.descripcion || 'Sin descripción'}
              </p>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <h3 className="text-lg font-semibold text-blue-600 mb-3">Historial de Movimientos</h3>

        <div className="tabla-wrapper overflow-x-auto">
          <table className="tabla min-w-full">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Persona</th>
                <th>Unidad Proceso</th>
                <th>Orden Trabajo</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length > 0 ? (
                movimientos.map((m) => (
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
                    <td>{m.cantidad}</td>
                    <td>
                      {m.tipo === 'entrada'
                        ? m.persona_entrega || '-'
                        : m.persona_responsable || '-'}
                    </td>
                    <td>{m.unidad_proceso || '-'}</td>
                    <td>{m.orden_trabajo || '-'}</td>
                    <td>{m.observaciones || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-datos">Este componente no tiene movimientos aún</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DetalleComponente
