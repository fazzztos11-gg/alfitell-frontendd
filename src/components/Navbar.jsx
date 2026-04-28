import React from 'react'

function Navbar() {
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const rutaActual = window.location.pathname

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/'
  }

  const enlaces = [
    { ruta: '/inventario', label: 'Inventario', rol: ['admin', 'tecnico'] },
    { ruta: '/clientes', label: 'Clientes', rol: ['admin', 'tecnico'] },
    { ruta: '/instalaciones', label: 'Instalaciones', rol: ['admin', 'tecnico'] },
    { ruta: '/gastos', label: 'Gastos', rol: ['admin'] },
    { ruta: '/reportes', label: 'Reportes', rol: ['admin'] },
  ]

  return (
    <div style={estilos.navbar}>
      <h2 style={estilos.titulo}>ALFITELL</h2>
      <div style={estilos.enlaces}>
        {enlaces
          .filter(e => e.rol.includes(usuario?.rol))
          .map(e => (
            
              <a key={e.ruta}
              href={e.ruta}
              style={{
                ...estilos.enlace,
                backgroundColor: rutaActual === e.ruta ? 'rgba(255,255,255,0.2)' : 'transparent'
              }}
            >
              {e.label}
            </a>
          ))}
      </div>
      <div style={estilos.usuario}>
        <span style={estilos.nombreUsuario}>
          {usuario?.nombre} ({usuario?.rol})
        </span>
        <button style={estilos.btnCerrar} onClick={cerrarSesion}>
          Salir
        </button>
      </div>
    </div>
  )
}

const estilos = {
  navbar: {
    backgroundColor: '#2E4057',
    padding: '12px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  titulo: { color: 'white', margin: 0, fontSize: '20px' },
  enlaces: { display: 'flex', gap: '5px', flexWrap: 'wrap' },
  enlace: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '14px'
  },
  usuario: { display: 'flex', alignItems: 'center', gap: '10px' },
  nombreUsuario: { color: '#ccc', fontSize: '13px' },
  btnCerrar: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px'
  }
}

export default Navbar