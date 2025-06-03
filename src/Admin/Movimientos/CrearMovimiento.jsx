import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Select from 'react-select'
import { registrarMovimiento } from '../../../src/services/Movimiento'
import { obtenerComponentes } from '../../services/Componente'
import { obtenerTecnicos } from '../../services/Tecnicos'
import './movimientos.css'

const CrearMovimiento = () => {
  const navigate = useNavigate()
  const [componentes, setComponentes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [cantidadDisponible, setCantidadDisponible] = useState(null)

  const [form, setForm] = useState({
    componente_codigo: '',
    tipo: 'entrada',
    cantidad: '',
    persona: '',
    orden_trabajo: '',
    motivo: ''
  })

  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [componentesData, tecnicosData] = await Promise.all([
          obtenerComponentes(),
          obtenerTecnicos()
        ])
        setComponentes(componentesData)
        setTecnicos(tecnicosData)
      } catch (err) {
        console.error('Error al cargar datos:', err)
      }
    }
    cargar()
  }, [])

  const opcionesComponentes = componentes.map(c => ({
    value: c.codigo,
    label: `${c.codigo} - ${c.nombre}`
  }))

  const opcionesTecnicos = tecnicos.map(t => ({
    value: t.nombre,
    label: t.nombre
  }))

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#fff',
      borderColor: '#d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      padding: '1px',
      boxShadow: 'none',
      '&:hover': { borderColor: '#2563eb' }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10
    })
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)

    try {
      await registrarMovimiento(form)
      alert('Movimiento registrado correctamente')
      navigate('/componentes')
    } catch (err) {
      console.error(err)
      alert('Error al registrar movimiento')
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
          <button
            type="button"
            onClick={() => navigate('/componentes')}
            className="btn-navegacion"
          >
            <ArrowLeft size={18} /> Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Select
            styles={customSelectStyles}
            options={opcionesComponentes}
            placeholder="Seleccionar Componente"
            value={form.componente_codigo ? opcionesComponentes.find(o => o.value === form.componente_codigo) : null}
            onChange={(opcion) => {
              const codigo = opcion?.value || ''
              const seleccionado = componentes.find(c => c.codigo === codigo)
              setForm({ ...form, componente_codigo: codigo })
              setCantidadDisponible(seleccionado?.cantidad || 0)
            }}
          />

          {cantidadDisponible !== null && (
            <div className="text-sm text-gray-600 sm:col-span-2">
              💼 <strong>Cantidad actual:</strong> {cantidadDisponible} unidad{cantidadDisponible === 1 ? '' : 'es'}
            </div>
          )}

          <Select
            styles={customSelectStyles}
            options={[{ value: 'entrada', label: 'Entrada' }, { value: 'salida', label: 'Salida' }]}
            value={{ value: form.tipo, label: form.tipo.charAt(0).toUpperCase() + form.tipo.slice(1) }}
            onChange={(op) => setForm({ ...form, tipo: op.value })}
          />

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

          <Select
            styles={customSelectStyles}
            options={opcionesTecnicos}
            placeholder="Persona Responsable"
            value={form.persona ? opcionesTecnicos.find(t => t.value === form.persona) : null}
            onChange={(op) => setForm({ ...form, persona: op?.value || '' })}
          />

          <input
            name="orden_trabajo"
            value={form.orden_trabajo}
            onChange={handleChange}
            placeholder="Orden de Trabajo (opcional)"
            className="input"
          />

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
            {cargando ? 'Guardando...' : <><CheckCircle2 size={18} /> Guardar Movimiento</>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CrearMovimiento
