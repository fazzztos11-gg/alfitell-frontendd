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

  if (!reporte) return <p style={{ padding: '30px' }}>Cargando reporte...</p>

  return (
    <div style={estilos.contenedor}>
      <Navbar />

      <div style={estilos.contenido}>
        <h3>Resumen general</h3>

        <div style={estilos.tarjetas}>
          <div style={{ ...estilos.tarjeta, borderTop: '4px solid #2E4057' }}>
            <p style={estilos.tarjetaTitulo}>Total ingresos</p>
            <p style={estilos.tarjetaValor}>S/ {reporte.resumen.total_ingresos}</p>
          </div>
          <div style={{ ...estilos.tarjeta, borderTop: '4px solid #dc3545' }}>
            <p style={estilos.tarjetaTitulo}>Total gastos</p>
            <p style={estilos.tarjetaValor}>S/ {reporte.resumen.total_gastos}</p>
          </div>
          <div style={{ ...estilos.tarjeta, borderTop: '4px solid #048A81' }}>
            <p style={estilos.tarjetaTitulo}>Ganancias</p>
            <p style={estilos.tarjetaValor}>S/ {reporte.resumen.ganancias}</p>
          </div>
          <div style={{ ...estilos.tarjeta, borderTop: '4px solid #f0a500' }}>
            <p style={estilos.tarjetaTitulo}>Instalaciones</p>
            <p style={estilos.tarjetaValor}>{reporte.resumen.total_instalaciones}</p>
          </div>
        </div>

        <h3>Equipos por estado</h3>
        <table style={estilos.tabla}>
          <thead>
            <tr style={estilos.thead}>
              <th style={estilos.th}>Estado</th>
              <th style={estilos.th}>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {reporte.equipos_por_estado.map((e, i) => (
              <tr key={i} style={estilos.tr}>
                <td style={estilos.td}>{e.estado}</td>
                <td style={estilos.td}>{e.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Instalaciones por técnico</h3>
        <table style={estilos.tabla}>
          <thead>
            <tr style={estilos.thead}>
              <th style={estilos.th}>Técnico</th>
              <th style={estilos.th}>Instalaciones</th>
              <th style={estilos.th}>Ingresos generados</th>
            </tr>
          </thead>
          <tbody>
            {reporte.instalaciones_por_tecnico.map((t, i) => (
              <tr key={i} style={estilos.tr}>
                <td style={estilos.td}>{t.tecnico}</td>
                <td style={estilos.td}>{t.total_instalaciones}</td>
                <td style={estilos.td}>S/ {t.ingresos_generados}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Últimas instalaciones</h3>
        <table style={estilos.tabla}>
          <thead>
            <tr style={estilos.thead}>
              <th style={estilos.th}>Fecha</th>
              <th style={estilos.th}>Serie</th>
              <th style={estilos.th}>Modelo</th>
              <th style={estilos.th}>Cliente</th>
              <th style={estilos.th}>Técnico</th>
              <th style={estilos.th}>Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {reporte.ultimas_instalaciones.map((i, idx) => (
              <tr key={idx} style={estilos.tr}>
                <td style={estilos.td}>{new Date(i.fecha).toLocaleDateString()}</td>
                <td style={estilos.td}>{i.numero_serie}</td>
                <td style={estilos.td}>{i.modelo}</td>
                <td style={estilos.td}>{i.cliente}</td>
                <td style={estilos.td}>{i.tecnico}</td>
                <td style={estilos.td}>S/ {i.ingreso_generado}</td>
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
  tarjetas: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  tarjeta: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minWidth: '180px',
    flex: 1
  },
  tarjetaTitulo: { color: '#666', margin: '0 0 8px 0', fontSize: '14px' },
  tarjetaValor: { color: '#2E4057', margin: 0, fontSize: '28px', fontWeight: 'bold' },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', marginBottom: '30px' },
  thead: { backgroundColor: '#2E4057' },
  th: { color: 'white', padding: '12px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' }
}

export default Reportes