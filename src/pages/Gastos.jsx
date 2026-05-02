import React, { useState, useEffect } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'

function Gastos() {
  const [gastos, setGastos] = useState([])
  const [pagos, setPagos] = useState([])
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

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
      setMostrarFormulario(false)
      cargarGastos()
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      setMensaje('Error al registrar gasto')
    }
  }

  const eliminarGasto = async (id) => {
    try {
      await API.delete(`/finanzas/gastos/${id}`)
      setMensaje('Gasto eliminado correctamente')
      cargarGastos()
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      setMensaje('Error al eliminar gasto')
    }
  }

  const totalGastos = gastos.reduce((acc, g) => acc + parseFloat(g.monto || 0), 0)
  const totalPagos = pagos.reduce((acc, p) => acc + parseFloat(p.monto || 0), 0)

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
            Finanzas
          </h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>
            Control de gastos y pagos del negocio
          </p>
        </div>

        {/* Tarjetas resumen */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #E8320A'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Total gastos</p>
            <p style={{ color: '#E8320A', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>S/ {totalGastos.toFixed(2)}</p>
          </div>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #16a34a'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Total pagos recibidos</p>
            <p style={{ color: '#16a34a', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>S/ {totalPagos.toFixed(2)}</p>
          </div>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #1B2F6E'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Balance</p>
            <p style={{ color: '#1B2F6E', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              S/ {(totalPagos - totalGastos).toFixed(2)}
            </p>
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

        {/* Gastos */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#1B2F6E', margin: 0, fontSize: '18px' }}>Gastos</h3>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              style={{
                backgroundColor: '#1B2F6E', color: 'white', border: 'none',
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '600'
              }}
            >
              {mostrarFormulario ? '✕ Cancelar' : '+ Registrar gasto'}
            </button>
          </div>

          {mostrarFormulario && (
            <div style={{
              backgroundColor: 'white', borderRadius: '12px', padding: '24px',
              marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}>
              <h4 style={{ color: '#1B2F6E', margin: '0 0 16px 0' }}>Nuevo gasto</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  placeholder="Descripción del gasto"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  style={{
                    flex: 2, minWidth: '200px', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                  }}
                />
                <input
                  placeholder="Monto"
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  style={{
                    flex: 1, minWidth: '120px', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                  }}
                />
                <button
                  onClick={agregarGasto}
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

          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1B2F6E' }}>
                  <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Descripción</th>
                  <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Monto</th>
                  <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Fecha</th>
                  <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((gasto) => (
                  <tr key={gasto.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>{gasto.descripcion}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#E8320A' }}>
                      S/ {gasto.monto}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>
                      {new Date(gasto.fecha).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => eliminarGasto(gasto.id)}
                        style={{
                          backgroundColor: '#fee2e2', color: '#991b1b', border: 'none',
                          padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagos */}
        <div>
          <h3 style={{ color: '#1B2F6E', margin: '0 0 16px 0', fontSize: '18px' }}>Pagos recibidos</h3>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1B2F6E' }}>
                  <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Cliente</th>
                  <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Equipo</th>
                  <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Monto</th>
                  <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>{pago.cliente}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{pago.modelo}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                      S/ {pago.monto}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>
                      {new Date(pago.fecha).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gastos