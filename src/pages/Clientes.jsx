import React, { useState, useEffect } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    cargarClientes()
  }, [])

  const cargarClientes = async () => {
    try {
      const respuesta = await API.get('/clientes')
      setClientes(respuesta.data)
    } catch (error) {
      console.error(error)
    }
  }

  const agregarCliente = async () => {
    try {
      await API.post('/clientes', { nombre, telefono, direccion })
      setMensaje('Cliente agregado correctamente')
      setNombre('')
      setTelefono('')
      setDireccion('')
      setMostrarFormulario(false)
      cargarClientes()
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      setMensaje('Error al agregar cliente')
    }
  }

  const buscarCliente = async () => {
    try {
      const respuesta = await API.get(`/clientes/buscar?nombre=${busqueda}`)
      setClientes(respuesta.data)
    } catch (error) {
      console.error(error)
    }
  }

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
            Clientes
          </h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>
            Registro y gestión de clientes
          </p>
        </div>

        {/* Tarjeta resumen */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #1B2F6E'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Total clientes</p>
            <p style={{ color: '#1B2F6E', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{clientes.length}</p>
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

        {/* Barra de acciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: '8px',
                border: '1px solid #e5e7eb', fontSize: '14px', width: '220px'
              }}
            />
            <button
              onClick={buscarCliente}
              style={{
                backgroundColor: '#1B2F6E', color: 'white', border: 'none',
                padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
              }}
            >
              Buscar
            </button>
            <button
              onClick={cargarClientes}
              style={{
                backgroundColor: 'white', color: '#1B2F6E', border: '1px solid #1B2F6E',
                padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
              }}
            >
              Ver todos
            </button>
          </div>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            style={{
              backgroundColor: '#1B2F6E', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '14px', fontWeight: '600'
            }}
          >
            {mostrarFormulario ? '✕ Cancelar' : '+ Agregar cliente'}
          </button>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '24px',
            marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}>
            <h4 style={{ color: '#1B2F6E', margin: '0 0 16px 0' }}>Nuevo cliente</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  flex: 1, minWidth: '180px', padding: '10px 14px',
                  borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                }}
              />
              <input
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                style={{
                  flex: 1, minWidth: '140px', padding: '10px 14px',
                  borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                }}
              />
              <input
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                style={{
                  flex: 2, minWidth: '200px', padding: '10px 14px',
                  borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                }}
              />
              <button
                onClick={agregarCliente}
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
                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Nombre</th>
                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Teléfono</th>
                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Dirección</th>
                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Registrado</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: '#1B2F6E', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold'
                      }}>
                        {cliente.nombre?.charAt(0)}
                      </div>
                      {cliente.nombre}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{cliente.telefono}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{cliente.direccion}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(cliente.creado_en).toLocaleDateString()}
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

export default Clientes