import React, { useState, useEffect } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'

function Reportes() {
  const [reporte, setReporte] = useState(null)

  useEffect(() => {
    cargarReporte()
  }, [])

  const cargarReporte = async () => {
    try {
      const respuesta = await API.get('/reportes')
      setReporte(respuesta.data)
    } catch (error) {
      console.error(error)
    }
  }

  if (!reporte) return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={{ marginLeft: '240px', padding: '30px' }}>
        <p style={{ color: '#6b7280' }}>Cargando reporte...</p>
      </div>
    </div>
  )

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
            Reportes
          </h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>
            Resumen financiero y operativo en tiempo real
          </p>
        </div>

        {/* Tarjetas resumen */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #16a34a'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Total ingresos</p>
            <p style={{ color: '#16a34a', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              S/ {reporte.resumen.total_ingresos}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #E8320A'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Total gastos</p>
            <p style={{ color: '#E8320A', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              S/ {reporte.resumen.total_gastos}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #1B2F6E'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Ganancias</p>
            <p style={{ color: '#1B2F6E', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              S/ {reporte.resumen.ganancias}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #f0a500'
          }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Instalaciones</p>
            <p style={{ color: '#f0a500', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {reporte.resumen.total_instalaciones}
            </p>
          </div>
        </div>

        {/* Fila de tablas */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>

          {/* Equipos por estado */}
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden', flex: 1, minWidth: '250px'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h4 style={{ color: '#1B2F6E', margin: 0, fontSize: '16px' }}>Equipos por estado</h4>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Estado</th>
                  <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {reporte.equipos_por_estado.map((e, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: e.estado === 'disponible' ? '#dcfce7' : '#fee2e2',
                        color: e.estado === 'disponible' ? '#166534' : '#991b1b'
                      }}>
                        {e.estado}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#1B2F6E' }}>
                      {e.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instalaciones por técnico */}
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden', flex: 2, minWidth: '300px'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h4 style={{ color: '#1B2F6E', margin: 0, fontSize: '16px' }}>Instalaciones por técnico</h4>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Técnico</th>
                  <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Instalaciones</th>
                  <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {reporte.instalaciones_por_tecnico.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          backgroundColor: '#1B2F6E', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold'
                        }}>
                          {t.tecnico?.charAt(0)}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{t.tecnico}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>
                      {t.total_instalaciones}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                      S/ {t.ingresos_generados}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Últimas instalaciones */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <h4 style={{ color: '#1B2F6E', margin: 0, fontSize: '16px' }}>Últimas instalaciones</h4>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Fecha</th>
                <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Serie</th>
                <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Modelo</th>
                <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Cliente</th>
                <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Técnico</th>
                <th style={{ color: '#6b7280', padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {reporte.ultimas_instalaciones.map((i, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(i.fecha).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{i.numero_serie}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{i.modelo}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{i.cliente}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{i.tecnico}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                    S/ {i.ingreso_generado}
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

export default Reportes