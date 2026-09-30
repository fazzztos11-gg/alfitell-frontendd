import React, { useState, useEffect } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'

function Inventario() {
  const [equipos, setEquipos] = useState([])
  const [numeroSerie, setNumeroSerie] = useState('')
  const [modelo, setModelo] = useState('')
  const [precio, setPrecio] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    cargarEquipos()
  }, [])

  const cargarEquipos = async () => {
    try {
      const respuesta = await API.get('/equipos')
      setEquipos(respuesta.data)
    } catch (error) {
      console.error(error)
    }
  }

  const agregarEquipo = async () => {
    try {
      await API.post('/equipos', {
        numero_serie: numeroSerie,
        modelo: modelo,
        precio: parseFloat(precio)
      })
      setMensaje('Equipo agregado correctamente')
      setNumeroSerie('')
      setModelo('')
      setPrecio('')
      setMostrarFormulario(false)
      cargarEquipos()
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      setMensaje('Error al agregar equipo')
    }
  }

  const disponibles = equipos.filter(e => e.estado === 'disponible').length
  const usados = equipos.filter(e => e.estado === 'usado').length

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div id="contenido-principal" style={{
        marginLeft: '240px', flex: 1, minHeight: '100vh',
        backgroundColor: 'var(--bg-principal)',
        padding: '30px', transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--texto-primario)', fontWeight: '700', fontSize: '24px', margin: 0 }}>
            Inventario de Equipos
          </h2>
          <p style={{ color: 'var(--texto-secundario)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Gestión y control de equipos por número de serie
          </p>
        </div>

        {/* Tarjetas resumen */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total equipos', valor: equipos.length, color: 'var(--color-primario)' },
            { label: 'Disponibles', valor: disponibles, color: 'var(--color-exito)' },
            { label: 'Usados', valor: usados, color: 'var(--color-acento)' },
          ].map((t, i) => (
            <div key={i} style={{
              backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
              padding: '20px', flex: 1, minWidth: '150px',
              boxShadow: 'var(--sombra-md)', borderLeft: `4px solid ${t.color}`
            }}>
              <p style={{ color: 'var(--texto-secundario)', fontSize: '13px', margin: '0 0 4px 0' }}>{t.label}</p>
              <p style={{ color: t.color, fontSize: '28px', fontWeight: '700', margin: 0 }}>{t.valor}</p>
            </div>
          ))}
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div style={{
            backgroundColor: mensaje.includes('Error') ? 'var(--color-error-bg)' : 'var(--color-exito-bg)',
            color: mensaje.includes('Error') ? 'var(--color-error)' : 'var(--color-exito)',
            padding: '12px 16px', borderRadius: 'var(--radio-md)',
            marginBottom: '16px', fontSize: '14px'
          }}>
            {mensaje}
          </div>
        )}

        {/* Botón agregar */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            style={{
              backgroundColor: 'var(--color-primario)', color: 'white',
              border: 'none', padding: '10px 20px', borderRadius: 'var(--radio-md)',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600'
            }}
          >
            {mostrarFormulario ? '✕ Cancelar' : '+ Agregar equipo'}
          </button>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div style={{
            backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
            padding: '24px', marginBottom: '20px', boxShadow: 'var(--sombra-md)',
            border: '1px solid var(--borde)'
          }}>
            <h4 style={{ color: 'var(--texto-primario)', margin: '0 0 16px 0' }}>Nuevo equipo</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { placeholder: 'Número de serie', value: numeroSerie, onChange: setNumeroSerie },
                { placeholder: 'Modelo', value: modelo, onChange: setModelo },
                { placeholder: 'Precio', value: precio, onChange: setPrecio, type: 'number' },
              ].map((input, i) => (
                <input
                  key={i}
                  type={input.type || 'text'}
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={(e) => input.onChange(e.target.value)}
                  style={{
                    flex: 1, minWidth: '150px', padding: '10px 14px',
                    borderRadius: 'var(--radio-md)', border: '1px solid var(--borde)',
                    backgroundColor: 'var(--bg-input)', color: 'var(--texto-primario)',
                    fontSize: '14px', outline: 'none'
                  }}
                />
              ))}
              <button onClick={agregarEquipo} style={{
                backgroundColor: 'var(--color-acento)', color: 'white',
                border: 'none', padding: '10px 20px', borderRadius: 'var(--radio-md)',
                cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}>
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div style={{
          backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
          boxShadow: 'var(--sombra-md)', overflow: 'hidden',
          border: '1px solid var(--borde)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primario)' }}>
                {['Serie', 'Modelo', 'Precio', 'Estado'].map((h, i) => (
                  <th key={i} style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {equipos.map((equipo) => (
                <tr key={equipo.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500', color: 'var(--texto-primario)' }}>{equipo.numero_serie}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>{equipo.modelo}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-primario)' }}>S/ {equipo.precio}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      backgroundColor: equipo.estado === 'disponible' ? 'var(--color-exito-bg)' : 'var(--color-error-bg)',
                      color: equipo.estado === 'disponible' ? 'var(--color-exito)' : 'var(--color-error)'
                    }}>
                      {equipo.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Inventario