import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { crearTecnico, editarTecnico } from '../../../src/services/Tecnicos'
import './Tecnicos.css'

const TecnicoFormModal = ({ visible, onClose, onGuardado, tecnicoEditar }) => {
    const [formulario, setFormulario] = useState({
        nombre: '',
    })

    useEffect(() => {
        if (tecnicoEditar) {
            setFormulario(tecnicoEditar)
        } else {
            setFormulario({
                nombre: ''
            })
        }
    }, [tecnicoEditar])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormulario((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (tecnicoEditar) {
                await editarTecnico(tecnicoEditar.id, formulario)
                toast.success('Técnico actualizado ✅')
            } else {
                await crearTecnico(formulario)
                toast.success('Técnico creado ✅')
            }
            onGuardado()
            onClose()
        } catch (error) {
            toast.error('Error al guardar técnico')
            console.error(error)
        }
    }

    if (!visible) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">{tecnicoEditar ? 'Editar Técnico' : 'Crear Técnico'}</h3>

                <form onSubmit={handleSubmit} className="modal-form">
                    <input
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        required
                    />
                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-guardar">
                            Guardar
                        </button>
                        <button type="button" className="btn btn-cancelar" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TecnicoFormModal
