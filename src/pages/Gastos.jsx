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
        marginLeft: '240px', flex: 1, minHeight: '100vh',
        backgroundColor: 'var(--bg-principal)',
        padding: '30px', transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--texto-primario)', fontWeight: '700', fontSize: '24px', margin: 0 }}>
            Finanzas
          </h2>
          <p style={{ color: 'var(--texto-secundario)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Control de gastos y pagos del negocio
          </p>
        </div>

        {/* Tarjetas resumen */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total gastos', valor: `S/ ${totalGastos.toFixed(2)}`, color: 'var(--color-acento)' },
            { label: 'Total pagos recibidos', valor: `S/ ${totalPagos.toFixed(2)}`, color: 'var(--color-exito)' },
            { label: 'Balance', valor: `S/ ${(totalPagos - totalGastos).toFixed(2)}`, color: 'var(--color-primario)' },
          ].map((t, i) => (
            <div key={i} style={{
              backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
              padding: '20px', flex: 1, minWidth: '150px',
              boxShadow: 'var(--sombra-md)', borderLeft: `4px solid ${t.color}`,
              border: '1px solid var(--borde)'
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

        {/* Sección Gastos */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px'
          }}>
            <h3 style={{ color: 'var(--texto-primario)', margin: 0, fontSize: '18px', fontWeight: '600' }}>Gastos</h3>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              style={{
                backgroundColor: 'var(--color-primario)', color: 'white',
                border: 'none', padding: '10px 20px', borderRadius: 'var(--radio-md)',
                cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}
            >
              {mostrarFormulario ? '✕ Cancelar' : '+ Registrar gasto'}
            </button>
          </div>

          {mostrarFormulario && (
            <div style={{
              backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
              padding: '24px', marginBottom: '16px', boxShadow: 'var(--sombra-md)',
              border: '1px solid var(--borde)'
            }}>
              <h4 style={{ color: 'var(--texto-primario)', margin: '0 0 16px 0' }}>Nuevo gasto</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  placeholder="Descripción del gasto"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  style={{
                    flex: 2, minWidth: '200px', padding: '10px 14px',
                    borderRadius: 'var(--radio-md)', border: '1px solid var(--borde)',
                    backgroundColor: 'var(--bg-input)', color: 'var(--texto-primario)',
                    fontSize: '14px', outline: 'none'
                  }}
                />
                <input
                  placeholder="Monto"
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  style={{
                    flex: 1, minWidth: '120px', padding: '10px 14px',
                    borderRadius: 'var(--radio-md)', border: '1px solid var(--borde)',
                    backgroundColor: 'var(--bg-input)', color: 'var(--texto-primario)',
                    fontSize: '14px', outline: 'none'
                  }}
                />
                <button onClick={agregarGasto} style={{
                  backgroundColor: 'var(--color-acento)', color: 'white',
                  border: 'none', padding: '10px 20px', borderRadius: 'var(--radio-md)',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                }}>
                  Guardar
                </button>
              </div>
            </div>
          )}

          <div style={{
            backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
            boxShadow: 'var(--sombra-md)', overflow: 'hidden',
            border: '1px solid var(--borde)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primario)' }}>
                  {['Descripción', 'Monto', 'Fecha', 'Acción'].map((h, i) => (
                    <th key={i} style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gastos.map((gasto) => (
                  <tr key={gasto.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-primario)' }}>{gasto.descripcion}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--color-acento)' }}>
                      S/ {gasto.monto}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>
                      {new Date(gasto.fecha).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => eliminarGasto(gasto.id)}
                        style={{
                          backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)',
                          border: 'none', padding: '6px 12px', borderRadius: 'var(--radio-sm)',
                          cursor: 'pointer', fontSize: '12px', fontWeight: '500'
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

        {/* Sección Pagos */}
        <div>
          <h3 style={{ color: 'var(--texto-primario)', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
            Pagos recibidos
          </h3>
          <div style={{
            backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
            boxShadow: 'var(--sombra-md)', overflow: 'hidden',
            border: '1px solid var(--borde)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primario)' }}>
                  {['Cliente', 'Equipo', 'Monto', 'Fecha'].map((h, i) => (
                    <th key={i} style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-primario)' }}>{pago.cliente}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>{pago.modelo}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--color-exito)' }}>
                      S/ {pago.monto}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>
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