import React, { useState } from 'react'
import API from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      const respuesta = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', respuesta.data.token)
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario))
      window.location.href = '/inventario'
    } catch (err) {
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.caja}>
        <h2 style={estilos.titulo}>ALFITELL</h2>
        <p style={estilos.subtitulo}>Inicia sesión para continuar</p>

        {error && <p style={estilos.error}>{error}</p>}

        <input
          style={estilos.input}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={estilos.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={estilos.boton} onClick={handleLogin}>
          Iniciar sesión
        </button>
      </div>
    </div>
  )
}

const estilos = {
  contenedor: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  caja: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '350px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  titulo: {
    textAlign: 'center',
    color: '#2E4057',
    margin: 0
  },
  subtitulo: {
    textAlign: 'center',
    color: '#666',
    margin: 0
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  boton: {
    padding: '12px',
    backgroundColor: '#2E4057',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 0
  }
}

export default Login