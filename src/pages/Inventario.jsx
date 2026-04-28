import React, { useState, useEffect } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'

function Inventario() {
  const [equipos, setEquipos] = useState([])
  const [numeroSerie, setNumeroSerie] = useState('')
  const [modelo, setModelo] = useState('')
  const [precio, setPrecio] = useState('')
  const [mensaje, setMensaje] = useState('')

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
      cargarEquipos()
    } catch (error) {
      setMensaje('Error al agregar equipo')
    }
  }

return (
    <div style={estilos.contenedor}>
      <Navbar />
      <div style={estilos.contenido}>
        <h3>Inventario de equipos</h3>

        {mensaje && <p style={estilos.mensaje}>{mensaje}</p>}

        <div style={estilos.formulario}>
          <input
            style={estilos.input}
            placeholder="Número de serie"
            value={numeroSerie}
            onChange={(e) => setNumeroSerie(e.target.value)}
          />
          <input
            style={estilos.input}
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />
          <input
            style={estilos.input}
            placeholder="Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <button style={estilos.boton} onClick={agregarEquipo}>
            Agregar equipo
          </button>
        </div>

        <table style={estilos.tabla}>
          <thead>
            <tr style={estilos.thead}>
              <th style={estilos.th}>Serie</th>
              <th style={estilos.th}>Modelo</th>
              <th style={estilos.th}>Precio</th>
              <th style={estilos.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((equipo) => (
              <tr key={equipo.id} style={estilos.tr}>
                <td style={estilos.td}>{equipo.numero_serie}</td>
                <td style={estilos.td}>{equipo.modelo}</td>
                <td style={estilos.td}>S/ {equipo.precio}</td>
                <td style={estilos.td}>
                  <span style={{
                    ...estilos.badge,
                    backgroundColor: equipo.estado === 'disponible' ? '#d4edda' : '#f8d7da',
                    color: equipo.estado === 'disponible' ? '#155724' : '#721c24'
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
  mensaje: { color: 'green', fontWeight: 'bold' },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px' },
  thead: { backgroundColor: '#2E4057' },
  th: { color: 'white', padding: '12px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }
}

export default Inventario