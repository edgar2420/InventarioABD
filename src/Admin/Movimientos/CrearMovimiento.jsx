import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { registrarMovimiento } from '../../../src/services/Movimiento'
import { obtenerComponentes } from '../../services/Componente'
import { obtenerTecnicos } from '../../services/Tecnicos'
import { obtenerUnidadesProceso } from '../../services/UnidadProceso'
import 'react-toastify/dist/ReactToastify.css'
import './movimientos.css'

const CrearMovimiento = () => {
  const navigate = useNavigate()
  const [componentes, setComponentes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [unidades, setUnidades] = useState([])
  const [cantidadDisponible, setCantidadDisponible] = useState(null)

  const [form, setForm] = useState({
    componente_codigo: '',
    tipo: '',
    cantidad: '',
    persona_entrada: '',
    persona_salida_id: '',
    orden_tipo: '',
    orden_numero: '',
    motivo: '',
    unidad_proceso_id: ''
  })

  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [componentesData, tecnicosData, unidadesData] = await Promise.all([
          obtenerComponentes(),
          obtenerTecnicos(),
          obtenerUnidadesProceso()
        ])
        setComponentes(componentesData)
        setTecnicos(tecnicosData)
        setUnidades(unidadesData)
      } catch (err) {
        console.error('Error al cargar datos:', err)
      }
    }
    cargar()
  }, [])

  const opcionesComponentes = componentes.map(c => ({ value: c.codigo, label: `${c.codigo} - ${c.nombre}` }))
  const opcionesTecnicos = tecnicos.map(t => ({ value: t.id, label: t.nombre }))
  const opcionesUnidades = unidades.map(u => ({ value: u.id, label: u.nombre }))

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    try {
      const payload = {
        componente_codigo: form.componente_codigo,
        tipo: form.tipo,
        cantidad: form.cantidad,
        motivo: form.motivo,
        orden_tipo: form.orden_tipo,
        orden_numero: form.orden_numero,
        unidad_proceso_id: form.unidad_proceso_id,
        persona_id: form.tipo === 'entrada' ? form.persona_entrada : form.persona_salida_id
      }

      await registrarMovimiento(payload)
      toast.success('✅ Movimiento registrado correctamente')
      navigate('/componentes')
    } catch (err) {
      console.error(err)
      toast.error('❌ Error al registrar movimiento')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="producto-container">
      <div className="form-box">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-blue-600 text-2xl font-bold flex items-center gap-2">
            <Upload size={24} /> Registrar Movimiento
          </h2>
          <button type="button" onClick={() => navigate('/componentes')} className="btn-navegacion">
            <ArrowLeft size={18} /> Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Select
            options={[{ value: 'entrada', label: 'Entrada' }, { value: 'salida', label: 'Salida' }]}
            placeholder="Selecciona el tipo de movimiento"
            value={form.tipo ? { value: form.tipo, label: form.tipo.charAt(0).toUpperCase() + form.tipo.slice(1) } : null}
            onChange={(op) => setForm({ ...form, tipo: op.value })}
          />

          {form.tipo && (
            <>
              <Select
                options={opcionesComponentes}
                placeholder="Seleccionar Componente"
                value={form.componente_codigo ? opcionesComponentes.find(o => o.value === form.componente_codigo) : null}
                onChange={(opcion) => {
                  const codigo = opcion?.value || ''
                  const seleccionado = componentes.find(c => c.codigo === codigo)
                  setForm({ ...form, componente_codigo: codigo })
                  setCantidadDisponible(seleccionado?.cantidad ?? null)
                }}
              />

              {cantidadDisponible !== null && (
                <div className="text-sm text-gray-600 sm:col-span-2">
                  💼 <strong>Cantidad actual:</strong> {cantidadDisponible} unidad{cantidadDisponible === 1 ? '' : 'es'}
                </div>
              )}

              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                placeholder="Cantidad"
                min="1"
                className="input"
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (!isNaN(val) && val >= 0) setForm({ ...form, cantidad: val })
                  else if (e.target.value === '') setForm({ ...form, cantidad: '' })
                }}
              />

              {form.tipo === 'entrada' && (
                <input
                  type="text"
                  name="persona_entrada"
                  value={form.persona_entrada}
                  onChange={handleChange}
                  placeholder="Nombre de la persona que entrega"
                  className="input"
                  required
                />
              )}

              {form.tipo === 'salida' && (
                <>
                  <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      options={[{ value: 'OTP', label: 'OTP (Preventivo)' }, { value: 'OTN', label: 'OTN (No Programado)' }]}
                      placeholder="Tipo de Orden"
                      value={form.orden_tipo ? { value: form.orden_tipo, label: form.orden_tipo } : null}
                      onChange={(op) => setForm({ ...form, orden_tipo: op?.value || '' })}
                    />

                    <input
                      type="text"
                      placeholder="Código de Orden"
                      className="input"
                      value={form.orden_numero}
                      onChange={(e) => setForm({ ...form, orden_numero: e.target.value })}
                    />
                  </div>

                  <Select
                    options={opcionesUnidades}
                    placeholder="Unidad de Proceso"
                    value={form.unidad_proceso_id ? opcionesUnidades.find(u => u.value === form.unidad_proceso_id) : null}
                    onChange={(op) => setForm({ ...form, unidad_proceso_id: op?.value || '' })}
                  />

                  <Select
                    options={opcionesTecnicos}
                    placeholder="Responsable"
                    value={form.persona_salida_id ? opcionesTecnicos.find(t => t.value === form.persona_salida_id) : null}
                    onChange={(op) => setForm({ ...form, persona_salida_id: op?.value || '' })}
                  />
                </>
              )}

              <textarea
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                placeholder="Motivo (opcional)"
                className="input sm:col-span-2"
                rows={3}
              />

              <button
                type="submit"
                disabled={cargando}
                className="col-span-full btn btn-guardar flex items-center justify-center gap-2"
              >
                {cargando
                  ? <><Loader2 size={18} className="animate-spin" /> Guardando...</>
                  : <><CheckCircle2 size={18} /> Guardar Movimiento</>}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default CrearMovimiento
