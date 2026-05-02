import React, { useState } from 'react'

function Sidebar() {
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const rutaActual = window.location.pathname
  const [collapsed, setCollapsed] = useState(false)
  const [submenuAbierto, setSubmenuAbierto] = useState('')

  const toggleCollapse = () => {
    const nuevoEstado = !collapsed
    setCollapsed(nuevoEstado)
    const contenido = document.getElementById('contenido-principal')
    if (contenido) {
      contenido.style.marginLeft = nuevoEstado ? '70px' : '240px'
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/'
  }

  const enlaces = [
    {
      label: 'Inventario',
      icono: '📦',
      rol: ['admin', 'tecnico'],
      ruta: '/inventario'
    },
    {
      label: 'Clientes',
      icono: '👥',
      rol: ['admin', 'tecnico'],
      ruta: '/clientes'
    },
    {
      label: 'Instalaciones',
      icono: '🔧',
      rol: ['admin', 'tecnico'],
      ruta: '/instalaciones'
    },
    {
      label: 'Finanzas',
      icono: '💰',
      rol: ['admin'],
      submenu: [
        { label: 'Gastos', ruta: '/gastos' },
        { label: 'Pagos', ruta: '/gastos' },
      ]
    },
    {
      label: 'Reportes',
      icono: '📊',
      rol: ['admin'],
      ruta: '/reportes'
    },
  ]

  return (
    <div style={{
      width: collapsed ? '70px' : '240px',
      minHeight: '100vh',
      backgroundColor: '#1B2F6E',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      overflowX: 'hidden'
    }}>

      {/* Header sidebar */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {!collapsed && (
          <div>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>ALFITELL</p>
            <div style={{ height: '2px', backgroundColor: '#E8320A', borderRadius: '2px', marginTop: '4px' }}></div>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px'
          }}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Usuario */}
      {!collapsed && (
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#E8320A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {usuario?.nombre?.charAt(0)}
          </div>
          <div>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: '600', margin: 0 }}>{usuario?.nombre}</p>
            <p style={{ color: '#93c5fd', fontSize: '11px', margin: 0, textTransform: 'capitalize' }}>{usuario?.rol}</p>
          </div>
        </div>
      )}

      {/* Enlaces */}
      <div style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {enlaces
          .filter(e => e.rol.includes(usuario?.rol))
          .map((e, i) => (
            <div key={i}>
              {e.submenu ? (
                <>
                  <button
                    onClick={() => setSubmenuAbierto(submenuAbierto === e.label ? '' : e.label)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginBottom: '2px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{e.icono}</span>
                      {!collapsed && <span>{e.label}</span>}
                    </div>
                    {!collapsed && <span>{submenuAbierto === e.label ? '▾' : '▸'}</span>}
                  </button>

                  {submenuAbierto === e.label && !collapsed && (
                    <div style={{ paddingLeft: '16px', marginBottom: '4px' }}>
                      {e.submenu.map((sub, j) => (
                        
                          <a key={j}
                          href={sub.ruta}
                          style={{
                            display: 'block',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: rutaActual === sub.ruta ? 'white' : '#93c5fd',
                            backgroundColor: rutaActual === sub.ruta ? '#E8320A' : 'transparent',
                            textDecoration: 'none',
                            fontSize: '13px',
                            marginBottom: '2px'
                          }}
                        >
                          • {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                
                  <a href={e.ruta}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: 'white',
                    backgroundColor: rutaActual === e.ruta ? '#E8320A' : 'transparent',
                    textDecoration: 'none',
                    fontSize: '14px',
                    marginBottom: '2px'
                  }}
                >
                  <span>{e.icono}</span>
                  {!collapsed && <span>{e.label}</span>}
                </a>
              )}
            </div>
          ))}
      </div>

      {/* Cerrar sesión */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={cerrarSesion}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          <span>🚪</span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar