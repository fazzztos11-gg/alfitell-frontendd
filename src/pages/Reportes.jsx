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
      <div style={{
        marginLeft: '240px', padding: '30px',
        backgroundColor: 'var(--bg-principal)', minHeight: '100vh', flex: 1
      }}>
        <p style={{ color: 'var(--texto-secundario)' }}>Cargando reporte...</p>
      </div>
    </div>
  )

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
            Reportes
          </h2>
          <p style={{ color: 'var(--texto-secundario)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Resumen financiero y operativo en tiempo real
          </p>
        </div>

        {/* Tarjetas resumen */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total ingresos', valor: `S/ ${reporte.resumen.total_ingresos}`, color: 'var(--color-exito)' },
            { label: 'Total gastos', valor: `S/ ${reporte.resumen.total_gastos}`, color: 'var(--color-acento)' },
            { label: 'Ganancias', valor: `S/ ${reporte.resumen.ganancias}`, color: 'var(--color-primario)' },
            { label: 'Instalaciones', valor: reporte.resumen.total_instalaciones, color: 'var(--color-warning)' },
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

        {/* Fila de tablas */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>

          {/* Equipos por estado */}
          <div style={{
            backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
            boxShadow: 'var(--sombra-md)', overflow: 'hidden',
            flex: 1, minWidth: '250px', border: '1px solid var(--borde)'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde)' }}>
              <h4 style={{ color: 'var(--texto-primario)', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                Equipos por estado
              </h4>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-hover)' }}>
                  {['Estado', 'Cantidad'].map((h, i) => (
                    <th key={i} style={{
                      color: 'var(--texto-secundario)', padding: '12px 16px',
                      textAlign: 'left', fontSize: '12px', fontWeight: '600'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reporte.equipos_por_estado.map((e, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--borde)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: e.estado === 'disponible' ? 'var(--color-exito-bg)' : 'var(--color-error-bg)',
                        color: e.estado === 'disponible' ? 'var(--color-exito)' : 'var(--color-error)'
                      }}>
                        {e.estado}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--texto-primario)' }}>
                      {e.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instalaciones por técnico */}
          <div style={{
            backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
            boxShadow: 'var(--sombra-md)', overflow: 'hidden',
            flex: 2, minWidth: '300px', border: '1px solid var(--borde)'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde)' }}>
              <h4 style={{ color: 'var(--texto-primario)', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                Instalaciones por técnico
              </h4>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-hover)' }}>
                  {['Técnico', 'Instalaciones', 'Ingresos'].map((h, i) => (
                    <th key={i} style={{
                      color: 'var(--texto-secundario)', padding: '12px 16px',
                      textAlign: 'left', fontSize: '12px', fontWeight: '600'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reporte.instalaciones_por_tecnico.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--borde)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          backgroundColor: 'var(--color-primario)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: '12px', fontWeight: 'bold'
                        }}>
                          {t.tecnico?.charAt(0)}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--texto-primario)' }}>
                          {t.tecnico}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>
                      {t.total_instalaciones}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--color-exito)' }}>
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
          backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
          boxShadow: 'var(--sombra-md)', overflow: 'hidden',
          border: '1px solid var(--borde)'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde)' }}>
            <h4 style={{ color: 'var(--texto-primario)', margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Últimas instalaciones
            </h4>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-hover)' }}>
                {['Fecha', 'Serie', 'Modelo', 'Cliente', 'Técnico', 'Ingreso'].map((h, i) => (
                  <th key={i} style={{
                    color: 'var(--texto-secundario)', padding: '12px 16px',
                    textAlign: 'left', fontSize: '12px', fontWeight: '600'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reporte.ultimas_instalaciones.map((inst, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--borde)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>
                    {new Date(inst.fecha).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: 'var(--texto-primario)' }}>
                    {inst.numero_serie}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>{inst.modelo}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--texto-primario)' }}>{inst.cliente}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>{inst.tecnico}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--color-exito)' }}>
                    S/ {inst.ingreso_generado}
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