import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerComponentes, eliminarComponente } from '../../../src/services/Componente';
import ComponenteFormModal from './ComponenteFormModal';
import { Pencil, Trash2, PackageSearch, PlusCircle, Repeat } from 'lucide-react';
import './listaComponentes.css';

const ListaComponentes = () => {
  const [componentes, setComponentes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  const cargarDatos = async () => {
    try {
      const data = await obtenerComponentes();
      setComponentes(data);
    } catch (err) {
      console.error('Error al cargar componentes', err);
    }
  };

  const handleEliminar = async (codigo, e) => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar componente ${codigo}?`)) return;
    try {
      await eliminarComponente(codigo);
      setComponentes(componentes.filter((c) => c.codigo !== codigo));
    } catch (err) {
      console.error('Error al eliminar', err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const filtrados = componentes.filter((c) =>
    c.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.codigo?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="lista-componentes-container">
      <div className="lista-componentes-content">
        <div className="lista-componentes-header">
          <h2 className="lista-componentes-title">
            <PackageSearch size={24} /> Componentes Registrados
          </h2>

          <div className="lista-componentes-actions">
            <button onClick={() => setMostrarModal(true)} className="lista-btn lista-btn-crear">
              <PlusCircle size={16} /> Crear Componente
            </button>
            <button onClick={() => navigate('/crear-clase')} className="lista-btn lista-btn-clase">
              <PlusCircle size={16} /> Crear Clase y Tipo
            </button>
            <button onClick={() => navigate('/crear-movimiento')} className="lista-btn lista-btn-movimiento">
              <Repeat size={16} /> Movimiento
            </button>
          </div>
        </div>

        <div className="lista-componentes-search">
          <input
            type="text"
            placeholder="Buscar por nombre o código"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="lista-componentes-search-input"
          />
        </div>

        <div className="lista-componentes-table-wrapper">
          <table className="lista-componentes-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Código</th>
                <th>Cantidad</th>
                <th>Modelo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((c) => (
                  <tr
                    key={c.codigo}
                    onClick={() => navigate(`/detalle-componente/${c.codigo}`)}
                    className="lista-componentes-row"
                  >
                    <td>
                      {c.imagen_url ? (
                        <img
                          src={c.imagen_url}
                          alt="Imagen"
                          className="lista-componentes-image"
                        />
                      ) : (
                        <span className="lista-componentes-no-image">Sin imagen</span>
                      )}
                    </td>
                    <td>{c.nombre}</td>
                    <td>{c.codigo}</td>
                    <td>{c.cantidad}</td>
                    <td>{c.modelo}</td>
                    <td>
                      <div className="lista-componentes-actions-cell">
                        <button
                          className="lista-componentes-action-btn lista-componentes-edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editar-componente/${c.codigo}`);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="lista-componentes-action-btn lista-componentes-delete-btn"
                          onClick={(e) => handleEliminar(c.codigo, e)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="lista-componentes-no-data">
                    No hay componentes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ComponenteFormModal
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onGuardado={cargarDatos}
      />
    </div>
  );
};

export default ListaComponentes;
