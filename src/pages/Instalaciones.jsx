import React, { useState, useEffect, useRef } from 'react'
import API from '../services/api'
import Quagga from '@ericblade/quagga2'
import Navbar from '../components/Navbar'

function Instalaciones() {
  const [instalaciones, setInstalaciones] = useState([])
  const [numeroSerie, setNumeroSerie] = useState('')
  const [nombreCliente, setNombreCliente] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [escaneando, setEscaneando] = useState(false)
  const scannerRef = useRef(null)

  useEffect(() => {
    cargarInstalaciones()
  }, [])

  useEffect(() => {
    if (escaneando) {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: { facingMode: 'environment' }
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'code_39_reader']
        }
      }, (err) => {
        if (err) {
          console.error(err)
          return
        }
        Quagga.start()
      })

      Quagga.onDetected((result) => {
        const codigo = result.codeResult.code
        setNumeroSerie(codigo)
        setMensaje(`Código escaneado: ${codigo}`)
        detenerEscaner()
      })
    }

    return () => {
      if (escaneando) {
        Quagga.stop()
      }
    }
  }, [escaneando])

  const detenerEscaner = () => {
    Quagga.stop()
    setEscaneando(false)
  }

  const cargarInstalaciones = async () => {
    try {
      const respuesta = await API.get('/instalaciones')
      setInstalaciones(respuesta.data)
    } catch (error) {
      console.error(error)
    }
  }

  const registrarInstalacion = async () => {
    try {
      await API.post('/instalaciones', {
        numero_serie: numeroSerie,
        nombre_cliente: nombreCliente,
        telefono,
        direccion
      })
      setMensaje('Instalación registrada correctamente')
      setNumeroSerie('')
      setNombreCliente('')
      setTelefono('')
      setDireccion('')
      cargarInstalaciones()
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al registrar instalación')
    }
  }

  return (
    <div style={estilos.contenedor}>
      <Navbar />

      <div style={estilos.contenido}>
        <h3>Registrar instalación</h3>

        {mensaje && (
          <p style={{
            ...estilos.mensaje,
            color: mensaje.includes('Error') ? 'red' : 'green'
          }}>
            {mensaje}
          </p>
        )}

        <div style={estilos.formulario}>
          <div style={estilos.grupoSerie}>
            <input
              style={estilos.input}
              placeholder="Número de serie"
              value={numeroSerie}
              onChange={(e) => setNumeroSerie(e.target.value)}
            />
            <button
              style={estilos.btnEscanear}
              onClick={() => setEscaneando(!escaneando)}
            >
              {escaneando ? 'Cancelar' : 'Escanear código'}
            </button>
          </div>

          {escaneando && (
            <div style={estilos.scanner}>
              <div ref={scannerRef} style={estilos.camara} />
              <p style={estilos.textoScanner}>Apunta la cámara al código de barras</p>
            </div>
          )}

          <input
            style={estilos.input}
            placeholder="Nombre del cliente"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
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
          <button style={estilos.boton} onClick={registrarInstalacion}>
            Registrar instalación
          </button>
        </div>

        <h3>Historial de instalaciones</h3>
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
            {instalaciones.map((i) => (
              <tr key={i.id} style={estilos.tr}>
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
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '500px',
    marginBottom: '30px'
  },
  grupoSerie: {
    display: 'flex',
    gap: '10px'
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
  btnEscanear: {
    padding: '10px 15px',
    backgroundColor: '#048A81',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  scanner: {
    border: '2px solid #048A81',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  camara: { width: '100%', height: '200px' },
  textoScanner: {
    textAlign: 'center',
    color: '#048A81',
    margin: '8px 0'
  },
  mensaje: { fontWeight: 'bold' },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px' },
  thead: { backgroundColor: '#2E4057' },
  th: { color: 'white', padding: '12px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' }
}

export default Instalaciones