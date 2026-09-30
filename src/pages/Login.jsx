import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../services/api'



function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const handleLogin = async () => {
    setCargando(true)
    setError('')
    try {
      const respuesta = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', respuesta.data.token)
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario))
      localStorage.setItem('permisos', JSON.stringify(respuesta.data.permisos))
      window.location.href = '/inventario'
    } catch (err) {
      setError('Email o contraseña incorrectos')
      setCargando(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e8eaf0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          backgroundColor: 'white',
          borderRadius: '28px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.12)',
          display: 'flex',
          width: '100%',
          maxWidth: '920px',
          minHeight: '580px',
          overflow: 'hidden'
        }}
      >
        {/* Panel izquierdo - Formulario */}
        <div style={{
          flex: '0 0 420px',
          padding: '55px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #f8f0e8 0%, #fdf6f0 100%)'
        }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ marginBottom: '40px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                backgroundColor: '#1B2F6E',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>A</span>
              </div>
              <span style={{ fontWeight: '700', fontSize: '18px', color: '#1B2F6E' }}>ALFITELL</span>
            </div>
          </motion.div>

          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 style={{
              fontSize: '30px', fontWeight: '700',
              color: '#1a1a2e', margin: '0 0 8px 0'
            }}>
              Iniciar sesión
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 36px 0' }}>
              Ingresa tus credenciales para acceder al sistema
            </p>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  backgroundColor: '#fee2e2', color: '#991b1b',
                  padding: '12px 16px', borderRadius: '12px',
                  marginBottom: '16px', fontSize: '14px'
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ marginBottom: '16px' }}
          >
            <label style={{
              display: 'block', fontSize: '13px', fontWeight: '500',
              color: '#6b7280', marginBottom: '8px'
            }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="admin@alfitell.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: '100%', padding: '14px 18px',
                borderRadius: '14px', border: '1.5px solid #e5e7eb',
                backgroundColor: 'white', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box',
                transition: 'all 0.2s', color: '#1a1a2e'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1B2F6E'
                e.target.style.boxShadow = '0 0 0 3px rgba(27,47,110,0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.boxShadow = 'none'
              }}
            />
          </motion.div>

          {/* Input password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ marginBottom: '28px' }}
          >
            <label style={{
              display: 'block', fontSize: '13px', fontWeight: '500',
              color: '#6b7280', marginBottom: '8px'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={mostrarPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%', padding: '14px 48px 14px 18px',
                  borderRadius: '14px', border: '1.5px solid #e5e7eb',
                  backgroundColor: 'white', fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'all 0.2s', color: '#1a1a2e'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1B2F6E'
                  e.target.style.boxShadow = '0 0 0 3px rgba(27,47,110,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: '16px',
                  color: '#9ca3af'
                }}
              >
                {mostrarPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </motion.div>

          {/* Botón */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            disabled={cargando}
            style={{
              width: '100%', padding: '15px',
              backgroundColor: cargando ? '#9ca3af' : '#1B2F6E',
              color: 'white', border: 'none', borderRadius: '14px',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(27,47,110,0.3)',
              transition: 'background 0.3s'
            }}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              textAlign: 'center', color: '#9ca3af',
              fontSize: '12px', marginTop: '24px'
            }}
          >
            Sistema de gestión — <span style={{ color: '#E8320A', fontWeight: '600' }}>ALFITELL</span>
          </motion.p>
        </div>

        {/* Panel derecho - Visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            flex: 1,
            background: 'linear-gradient(145deg, #1B2F6E 0%, #0f1d47 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Círculos decorativos */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: 200 + i * 100,
                height: 200 + i * 100,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.06)',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 20 + i * 10,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}

          {/* Logo grande */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ textAlign: 'center', zIndex: 1 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '120px', height: '120px', borderRadius: '28px',
                background: 'linear-gradient(135deg, #E8320A, #ff6b3d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 20px 50px rgba(232,50,10,0.4)'
              }}
            >
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '60px' }}>A</span>
            </motion.div>

            <h3 style={{
              color: 'white', fontSize: '28px', fontWeight: '700',
              margin: '0 0 8px 0', letterSpacing: '2px'
            }}>
              ALFITELL
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '0 0 40px 0' }}>
              Conectando Emociones
            </p>

            {/* Tarjetas flotantes decorativas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '240px' }}>
              {[
                { icono: '📦', texto: 'Control de inventario', delay: 0.7 },
                { icono: '🔧', texto: 'Gestión de instalaciones', delay: 0.9 },
                { icono: '📊', texto: 'Reportes en tiempo real', delay: 1.1 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'default'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{item.icono}</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                    {item.texto}
                  </span>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: '#4ade80', marginLeft: 'auto'
                  }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login