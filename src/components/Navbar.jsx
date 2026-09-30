import React, { useState } from 'react'
import { useDarkMode } from '../hooks/useDarkMode'

function Sidebar() {
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const rutaActual = window.location.pathname
  const [collapsed, setCollapsed] = useState(false)
  const [submenuAbierto, setSubmenuAbierto] = useState('')
  const [darkMode, setDarkMode] = useDarkMode()

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('permisos')
    window.location.href = '/'
  }

  const toggleCollapse = () => {
    const nuevoEstado = !collapsed
    setCollapsed(nuevoEstado)
    const contenido = document.getElementById('contenido-principal')
    if (contenido) {
      contenido.style.marginLeft = nuevoEstado ? '70px' : '240px'
    }
  }

  const permisos = JSON.parse(localStorage.getItem('permisos') || '{}')

  const enlaces = [
    { label: 'Inventario', icono: '📦', rol: ['admin'], permiso: 'ver_inventario', ruta: '/inventario' },
    { label: 'Clientes', icono: '👥', rol: ['admin'], permiso: 'ver_clientes', ruta: '/clientes' },
    { label: 'Instalaciones', icono: '🔧', rol: ['admin'], permiso: 'registrar_instalaciones', ruta: '/instalaciones' },
    {
      label: 'Finanzas', icono: '💰', rol: ['admin'], permiso: 'ver_gastos',
      submenu: [
        { label: 'Gastos', ruta: '/gastos' },
        { label: 'Pagos', ruta: '/gastos' },
      ]
    },
    { label: 'Reportes', icono: '📊', rol: ['admin'], permiso: 'ver_reportes', ruta: '/reportes' },
    { label: 'Usuarios', icono: '👤', rol: ['admin'], ruta: '/usuarios' },
  ]

  return (
    <div style={{
      width: collapsed ? '70px' : '240px',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'fixed',
      top: 0, left: 0, zIndex: 100,
      overflowX: 'hidden',
      borderRight: '1px solid rgba(255,255,255,0.08)'
    }}>

      {/* Header */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {!collapsed && (
          <div>
            <p style={{ color: 'white', fontWeight: '700', fontSize: '18px', margin: 0, letterSpacing: '1px' }}>ALFITELL</p>
            <div style={{ height: '2px', backgroundColor: 'var(--color-acento)', borderRadius: '2px', marginTop: '4px' }}></div>
          </div>
        )}
        <button onClick={toggleCollapse} style={{
          backgroundColor: 'transparent', border: 'none',
          color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '18px', padding: '4px'
        }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Usuario */}
      {!collapsed && (
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: 'var(--color-acento)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', flexShrink: 0
          }}>
            {usuario?.nombre?.charAt(0)}
          </div>
          <div>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: '600', margin: 0 }}>{usuario?.nombre}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: 0, textTransform: 'capitalize' }}>{usuario?.rol}</p>
          </div>
        </div>
      )}

      {/* Enlaces */}
      <div style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {enlaces
          .filter(e => {
            if (usuario?.rol === 'admin') return true
            if (e.rol?.includes('admin') && usuario?.rol !== 'admin') {
              return e.permiso && permisos[e.permiso] === true
            }
            return false
          })
          .map((e, i) => (
            <div key={i}>
              {e.submenu ? (
                <>
                  <button
                    onClick={() => setSubmenuAbierto(submenuAbierto === e.label ? '' : e.label)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', padding: '10px 12px',
                      borderRadius: 'var(--radio-sm)', border: 'none',
                      backgroundColor: 'transparent', color: 'rgba(255,255,255,0.8)',
                      cursor: 'pointer', fontSize: '14px', marginBottom: '2px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{e.icono}</span>
                      {!collapsed && <span>{e.label}</span>}
                    </div>
                    {!collapsed && <span style={{ fontSize: '12px' }}>{submenuAbierto === e.label ? '▾' : '▸'}</span>}
                  </button>
                  {submenuAbierto === e.label && !collapsed && (
                    <div style={{ paddingLeft: '16px', marginBottom: '4px' }}>
                      {e.submenu.map((sub, j) => (
                        <a key={j} href={sub.ruta} style={{
                          display: 'block', padding: '8px 12px',
                          borderRadius: 'var(--radio-sm)',
                          color: rutaActual === sub.ruta ? 'white' : 'rgba(255,255,255,0.6)',
                          backgroundColor: rutaActual === sub.ruta ? 'var(--color-acento)' : 'transparent',
                          textDecoration: 'none', fontSize: '13px', marginBottom: '2px'
                        }}>
                          • {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a href={e.ruta} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: 'var(--radio-sm)',
                  color: rutaActual === e.ruta ? 'white' : 'rgba(255,255,255,0.7)',
                  backgroundColor: rutaActual === e.ruta ? 'var(--color-acento)' : 'transparent',
                  textDecoration: 'none', fontSize: '14px', marginBottom: '2px',
                  transition: 'var(--transicion)'
                }}>
                  <span>{e.icono}</span>
                  {!collapsed && <span>{e.label}</span>}
                </a>
              )}
            </div>
          ))}
      </div>

      {/* Modo oscuro y cerrar sesión */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => setDarkMode(!darkMode)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: 'var(--radio-sm)', border: 'none',
          backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer', fontSize: '14px', marginBottom: '4px'
        }}>
          <span>{darkMode ? '☀️' : '🌙'}</span>
          {!collapsed && <span>{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>}
        </button>

        <button onClick={cerrarSesion} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: 'var(--radio-sm)', border: 'none',
          backgroundColor: 'transparent', color: '#f87171',
          cursor: 'pointer', fontSize: '14px'
        }}>
          <span>🚪</span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar