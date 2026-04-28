import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Inventario from './pages/Inventario'
import Clientes from './pages/Clientes'
import Instalaciones from './pages/Instalaciones'
import Gastos from './pages/Gastos'
import Reportes from './pages/Reportes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/instalaciones" element={<Instalaciones />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App