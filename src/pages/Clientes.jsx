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
        marginLeft: '240px', flex: 1, minHeight: '100vh',
        backgroundColor: 'var(--bg-principal)',
        padding: '30px', transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--texto-primario)', fontWeight: '700', fontSize: '24px', margin: 0 }}>
            Clientes
          </h2>
          <p style={{ color: 'var(--texto-secundario)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Registro y gestión de clientes
          </p>
        </div>

        {/* Tarjeta resumen */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
            padding: '20px', flex: 1, boxShadow: 'var(--sombra-md)',
            borderLeft: '4px solid var(--color-primario)',
            border: '1px solid var(--borde)'
          }}>
            <p style={{ color: 'var(--texto-secundario)', fontSize: '13px', margin: '0 0 4px 0' }}>Total clientes</p>
            <p style={{ color: 'var(--color-primario)', fontSize: '28px', fontWeight: '700', margin: 0 }}>{clientes.length}</p>
          </div>
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

        {/* Barra de acciones */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: 'var(--radio-md)',
                border: '1px solid var(--borde)', fontSize: '14px',
                width: '220px', backgroundColor: 'var(--bg-input)',
                color: 'var(--texto-primario)', outline: 'none'
              }}
            />
            <button onClick={buscarCliente} style={{
              backgroundColor: 'var(--color-primario)', color: 'white',
              border: 'none', padding: '10px 16px',
              borderRadius: 'var(--radio-md)', cursor: 'pointer', fontSize: '14px'
            }}>
              Buscar
            </button>
            <button onClick={cargarClientes} style={{
              backgroundColor: 'var(--bg-card)', color: 'var(--color-primario)',
              border: '1px solid var(--color-primario)', padding: '10px 16px',
              borderRadius: 'var(--radio-md)', cursor: 'pointer', fontSize: '14px'
            }}>
              Ver todos
            </button>
          </div>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            style={{
              backgroundColor: 'var(--color-primario)', color: 'white',
              border: 'none', padding: '10px 20px', borderRadius: 'var(--radio-md)',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600'
            }}
          >
            {mostrarFormulario ? '✕ Cancelar' : '+ Agregar cliente'}
          </button>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div style={{
            backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
            padding: '24px', marginBottom: '20px', boxShadow: 'var(--sombra-md)',
            border: '1px solid var(--borde)'
          }}>
            <h4 style={{ color: 'var(--texto-primario)', margin: '0 0 16px 0' }}>Nuevo cliente</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { placeholder: 'Nombre completo', value: nombre, onChange: setNombre },
                { placeholder: 'Teléfono', value: telefono, onChange: setTelefono },
                { placeholder: 'Dirección', value: direccion, onChange: setDireccion },
              ].map((input, i) => (
                <input
                  key={i}
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={(e) => input.onChange(e.target.value)}
                  style={{
                    flex: 1, minWidth: '180px', padding: '10px 14px',
                    borderRadius: 'var(--radio-md)', border: '1px solid var(--borde)',
                    backgroundColor: 'var(--bg-input)', color: 'var(--texto-primario)',
                    fontSize: '14px', outline: 'none'
                  }}
                />
              ))}
              <button onClick={agregarCliente} style={{
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
                {['Nombre', 'Teléfono', 'Dirección', 'Registrado'].map((h, i) => (
                  <th key={i} style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-primario)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: 'var(--color-primario)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '12px', fontWeight: 'bold'
                      }}>
                        {cliente.nombre?.charAt(0)}
                      </div>
                      {cliente.nombre}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>{cliente.telefono}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>{cliente.direccion}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>
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