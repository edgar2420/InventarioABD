import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import './index.css'

//toast
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'


// Layout
import Layout from './components/Layout'

// Vistas
import HomePage from './Admin/Dashboard/Home'
import CrearProducto from './Admin/Productos/ComponenteFormModal'
import ListaComponentes from './Admin/Productos/ListaComponentes'
import DetalleComponente from './Admin/Productos/DetalleComponente'
import CrearMovimiento from './Admin/Movimientos/CrearMovimiento'
import ListaMovimientos from './Admin/Movimientos/MovimientosList'
import CrearClase from './Admin/Clase/Clase'
import UnidadProceso from './Admin/UnidadProceso/UnidadProceso'
import EditComponente from './Admin/Productos/EditComponente'
import Tecnicos from './Admin/Tecnicos/Tecnicos'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Outlet /></Layout>,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'componentes', element: <ListaComponentes /> },
      { path: 'crear-producto', element: <CrearProducto /> },
      { path: 'detalle-componente/:codigo', element: <DetalleComponente /> },
      { path: 'crear-movimiento', element: <CrearMovimiento /> },
      { path: 'movimientos', element: <ListaMovimientos /> },
      { path: 'crear-clase', element: <CrearClase /> },
      { path: 'unidad-proceso', element: <UnidadProceso /> },
      { path: 'editar-componente/:codigo', element: <EditComponente /> },
      { path: 'tecnicos', element: <Tecnicos /> }
    ]
  }
])

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  </StrictMode>
)
