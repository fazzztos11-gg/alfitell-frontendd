import React, { useState, useEffect } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'

function Gastos() {
  const [gastos, setGastos] = useState([])
  const [pagos, setPagos] = useState([])
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    cargarGastos()
    cargarPagos()
  }, [])

  const cargarGastos = async () => {
    try {
      const respuesta = await API.get('/finanzas/gastos')
      setGastos(respuesta.data)
    } catch (error) {
      console.error(error)
    }
  }

  const cargarPagos = async () => {
    try {
      const respuesta = await API.get('/finanzas/pagos')
      setPagos(respuesta.data)
    } catch (error) {
      console.error(error)
    }
  }

  const agregarGasto = async () => {
    try {
      await API.post('/finanzas/gastos', { descripcion, monto: parseFloat(monto) })
      setMensaje('Gasto registrado correctamente')
      setDescripcion('')
      setMonto('')
      cargarGastos()
    } catch (error) {
      setMensaje('Error al registrar gasto')
    }
  }

  const eliminarGasto = async (id) => {
    try {
      await API.delete(`/finanzas/gastos/${id}`)
      setMensaje('Gasto eliminado correctamente')
      cargarGastos()
    } catch (error) {
      setMensaje('Error al eliminar gasto')
    }
  }

  return (
    <div style={estilos.contenedor}>
      <Navbar />

      <div style={estilos.contenido}>
        <h3>Registrar gasto</h3>

        {mensaje && <p style={estilos.mensaje}>{mensaje}</p>}

        <div style={estilos.formulario}>
          <input
            style={estilos.input}
            placeholder="Descripción del gasto"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <input
            style={estilos.input}
            placeholder="Monto"
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
          <button style={estilos.boton} onClick={agregarGasto}>
            Registrar gasto
          </button>
        </div>

        <h3>Lista de gastos</h3>
        <table style={estilos.tabla}>
          <thead>
            <tr style={estilos.thead}>
              <th style={estilos.th}>Descripción</th>
              <th style={estilos.th}>Monto</th>
              <th style={estilos.th}>Fecha</th>
              <th style={estilos.th}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto) => (
              <tr key={gasto.id} style={estilos.tr}>
                <td style={estilos.td}>{gasto.descripcion}</td>
                <td style={estilos.td}>S/ {gasto.monto}</td>
                <td style={estilos.td}>{new Date(gasto.fecha).toLocaleDateString()}</td>
                <td style={estilos.td}>
                  <button
                    style={estilos.btnEliminar}
                    onClick={() => eliminarGasto(gasto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Pagos recibidos</h3>
        <table style={estilos.tabla}>
          <thead>
            <tr style={estilos.thead}>
              <th style={estilos.th}>Cliente</th>
              <th style={estilos.th}>Equipo</th>
              <th style={estilos.th}>Monto</th>
              <th style={estilos.th}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id} style={estilos.tr}>
                <td style={estilos.td}>{pago.cliente}</td>
                <td style={estilos.td}>{pago.modelo}</td>
                <td style={estilos.td}>S/ {pago.monto}</td>
                <td style={estilos.td}>{new Date(pago.fecha).toLocaleDateString()}</td>
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
  btnNav: {
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
  btnEliminar: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  mensaje: { color: 'green', fontWeight: 'bold' },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', marginBottom: '30px' },
  thead: { backgroundColor: '#2E4057' },
  th: { color: 'white', padding: '12px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' }
}

export default Gastos