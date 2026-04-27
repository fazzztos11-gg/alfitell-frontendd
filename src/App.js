import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Inventario from './pages/Inventario'
import Clientes from './pages/Clientes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App