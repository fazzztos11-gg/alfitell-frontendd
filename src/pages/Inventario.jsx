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
        marginLeft: '240px',
        flex: 1,
        minHeight: '100vh',
        backgroundColor: '#f4f6fb',
        padding: '30px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#1B2F6E', fontWeight: 'bold', fontSize: '24px', margin: 0 }}>
            Inventario de Equipos
          </h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>
            Gestión y control de equipos por número de serie
          </p>
        </div>

        {/* Tarjetas resumen */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #1B2F6E'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Total equipos</p>
            <p style={{ color: '#1B2F6E', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{equipos.length}</p>
          </div>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #16a34a'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Disponibles</p>
            <p style={{ color: '#16a34a', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{disponibles}</p>
          </div>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #E8320A'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Usados</p>
            <p style={{ color: '#E8320A', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{usados}</p>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div style={{
            backgroundColor: mensaje.includes('Error') ? '#fee2e2' : '#dcfce7',
            color: mensaje.includes('Error') ? '#991b1b' : '#166534',
            padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
          }}>
            {mensaje}
          </div>
        )}

        {/* Botón agregar */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            style={{
              backgroundColor: '#1B2F6E', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '14px', fontWeight: '600'
            }}
          >
            {mostrarFormulario ? '✕ Cancelar' : '+ Agregar equipo'}
          </button>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '24px',
            marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}>
            <h4 style={{ color: '#1B2F6E', margin: '0 0 16px 0' }}>Nuevo equipo</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                placeholder="Número de serie"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                style={{
                  flex: 1, minWidth: '180px', padding: '10px 14px',
                  borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                }}
              />
              <input
                placeholder="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                style={{
                  flex: 1, minWidth: '180px', padding: '10px 14px',
                  borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                }}
              />
              <input
                placeholder="Precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                style={{
                  flex: 1, minWidth: '120px', padding: '10px 14px',
                  borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                }}
              />
              <button
                onClick={agregarEquipo}
                style={{
                  backgroundColor: '#E8320A', color: 'white', border: 'none',
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '600'
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1B2F6E' }}>
                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Serie</th>
                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Modelo</th>
                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Precio</th>
                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((equipo) => (
                <tr key={equipo.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500' }}>{equipo.numero_serie}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{equipo.modelo}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>S/ {equipo.precio}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      backgroundColor: equipo.estado === 'disponible' ? '#dcfce7' : '#fee2e2',
                      color: equipo.estado === 'disponible' ? '#166534' : '#991b1b'
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