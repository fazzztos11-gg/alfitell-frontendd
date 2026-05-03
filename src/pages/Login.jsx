import React, { useState } from 'react'
import API from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    setCargando(true)
    try {
      const respuesta = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', respuesta.data.token)
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario))
      localStorage.setItem('permisos', JSON.stringify(respuesta.data.permisos))
      window.location.href = '/inventario'    } catch (err) {
      setError('Email o contraseña incorrectos')
      setCargando(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f4f6fb' }}>

      {/* Panel izquierdo */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12"
        style={{ background: 'linear-gradient(135deg, #1B2F6E 0%, #0f1d47 100%)' }}>
        <div className="text-center">
          <div className="mb-6">
            <span className="text-8xl font-bold text-white">A</span>
            <div className="w-16 h-1 mx-auto mt-2 rounded"
              style={{ backgroundColor: '#E8320A' }}></div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">ALFITELL</h1>
          <p className="text-blue-200 text-lg">Conectando Emociones</p>
          <div className="mt-12 space-y-4">
            {['Control de inventario', 'Gestión de instalaciones', 'Reportes en tiempo real'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E8320A' }}></div>
                <p className="text-blue-100 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#1B2F6E' }}>ALFITELL</h1>
            <div className="w-12 h-1 mx-auto mt-2 rounded" style={{ backgroundColor: '#E8320A' }}></div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#1B2F6E' }}>
              Bienvenido
            </h2>
            <p className="text-gray-400 text-sm mb-8">Ingresa tus credenciales para continuar</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm text-white"
                style={{ backgroundColor: '#E8320A' }}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="admin@alfitell.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-sm"
                  style={{ focusRingColor: '#1B2F6E' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-sm"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={cargando}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: cargando ? '#999' : '#1B2F6E' }}
              >
                {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-400">
                  Sistema de gestión — <span style={{ color: '#E8320A' }}>ALFITELL</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login