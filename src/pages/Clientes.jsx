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
      cargarClientes()
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
    <div style={estilos.contenedor}>
      <Navbar />

      <div style={estilos.contenido}>
        <h3>Clientes</h3>

        {mensaje && <p style={estilos.mensaje}>{mensaje}</p>}

        <div style={estilos.formulario}>
          <input
            style={estilos.input}
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            style={estilos.input}
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            style={estilos.input}
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <button style={estilos.boton} onClick={agregarCliente}>
            Agregar cliente
          </button>
        </div>

        <div style={estilos.busqueda}>
          <input
            style={estilos.input}
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button style={estilos.boton} onClick={buscarCliente}>
            Buscar
          </button>
          <button style={estilos.btnSecundario} onClick={cargarClientes}>
            Ver todos
          </button>
        </div>

        <table style={estilos.tabla}>
          <thead>
            <tr style={estilos.thead}>
              <th style={estilos.th}>Nombre</th>
              <th style={estilos.th}>Teléfono</th>
              <th style={estilos.th}>Dirección</th>
              <th style={estilos.th}>Registrado</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} style={estilos.tr}>
                <td style={estilos.td}>{cliente.nombre}</td>
                <td style={estilos.td}>{cliente.telefono}</td>
                <td style={estilos.td}>{cliente.direccion}</td>
                <td style={estilos.td}>
                  {new Date(cliente.creado_en).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const estilos = {
  contenedor: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    backgroundColor: '#2E4057',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navTitulo: { color: 'white', margin: 0 },
  btnCerrar: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  contenido: { padding: '30px' },
  formulario: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  busqueda: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  boton: {
    padding: '10px 20px',
    backgroundColor: '#2E4057',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  btnSecundario: {
    padding: '10px 20px',
    backgroundColor: '#048A81',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  mensaje: { color: 'green', fontWeight: 'bold' },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px' },
  thead: { backgroundColor: '#2E4057' },
  th: { color: 'white', padding: '12px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' }
}

export default Clientes