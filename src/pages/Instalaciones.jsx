import React, { useState, useEffect, useRef } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'
import Quagga from '@ericblade/quagga2'

function Instalaciones() {
    const [instalaciones, setInstalaciones] = useState([])
    const [numeroSerie, setNumeroSerie] = useState('')
    const [nombreCliente, setNombreCliente] = useState('')
    const [telefono, setTelefono] = useState('')
    const [direccion, setDireccion] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [escaneando, setEscaneando] = useState(false)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
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
                if (err) { console.error(err); return }
                Quagga.start()
            })

            Quagga.onDetected((result) => {
                const codigo = result.codeResult.code
                setNumeroSerie(codigo)
                setMensaje(`Código escaneado: ${codigo}`)
                Quagga.stop()
                setEscaneando(false)
            })
        }

        return () => {
            if (escaneando) Quagga.stop()
        }
    }, [escaneando])

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
            setMostrarFormulario(false)
            cargarInstalaciones()
            setTimeout(() => setMensaje(''), 3000)
        } catch (error) {
            setMensaje(error.response?.data?.error || 'Error al registrar instalación')
        }
    }

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
                        Instalaciones
                    </h2>
                    <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>
                        Registro de instalaciones realizadas por técnicos
                    </p>
                </div>

                {/* Tarjeta resumen */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '20px',
                        flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        borderLeft: '4px solid #1B2F6E'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Total instalaciones</p>
                        <p style={{ color: '#1B2F6E', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{instalaciones.length}</p>
                    </div>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '20px',
                        flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        borderLeft: '4px solid #16a34a'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Ingresos generados</p>
                        <p style={{ color: '#16a34a', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                            S/ {instalaciones.reduce((acc, i) => acc + parseFloat(i.ingreso_generado || 0), 0).toFixed(2)}
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

                {/* Botón registrar */}
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        style={{
                            backgroundColor: '#1B2F6E', color: 'white', border: 'none',
                            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '14px', fontWeight: '600'
                        }}
                    >
                        {mostrarFormulario ? '✕ Cancelar' : '+ Registrar instalación'}
                    </button>
                </div>

                {/* Formulario */}
                {mostrarFormulario && (
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '24px',
                        marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                    }}>
                        <h4 style={{ color: '#1B2F6E', margin: '0 0 16px 0' }}>Nueva instalación</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    placeholder="Número de serie"
                                    value={numeroSerie}
                                    onChange={(e) => setNumeroSerie(e.target.value)}
                                    style={{
                                        flex: 1, padding: '10px 14px',
                                        borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                                    }}
                                />
                                <button
                                    onClick={() => setEscaneando(!escaneando)}
                                    style={{
                                        backgroundColor: '#E8320A', color: 'white', border: 'none',
                                        padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                                        fontSize: '13px', whiteSpace: 'nowrap'
                                    }}
                                >
                                    {escaneando ? 'Cancelar' : '📷 Escanear'}
                                </button>
                            </div>

                            {escaneando && (
                                <div style={{ border: '2px solid #E8320A', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div ref={scannerRef} style={{ width: '100%', height: '200px' }} />
                                    <p style={{ textAlign: 'center', color: '#E8320A', margin: '8px 0', fontSize: '13px' }}>
                                        Apunta la cámara al código de barras
                                    </p>
                                </div>
                            )}

                            <input
                                placeholder="Nombre del cliente"
                                value={nombreCliente}
                                onChange={(e) => setNombreCliente(e.target.value)}
                                style={{
                                    padding: '10px 14px', borderRadius: '8px',
                                    border: '1px solid #e5e7eb', fontSize: '14px'
                                }}
                            />
                            <input
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                style={{
                                    padding: '10px 14px', borderRadius: '8px',
                                    border: '1px solid #e5e7eb', fontSize: '14px'
                                }}
                            />
                            <input
                                placeholder="Dirección"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                style={{
                                    padding: '10px 14px', borderRadius: '8px',
                                    border: '1px solid #e5e7eb', fontSize: '14px'
                                }}
                            />
                            <button
                                onClick={registrarInstalacion}
                                style={{
                                    backgroundColor: '#1B2F6E', color: 'white', border: 'none',
                                    padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: '600'
                                }}
                            >
                                Registrar instalación
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabla */}
                <div style={{
                    backgroundColor: 'white', borderRadius: '12px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1B2F6E' }}>
                                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Fecha</th>
                                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Serie</th>
                                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Modelo</th>
                                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Cliente</th>
                                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Técnico</th>
                                <th style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Ingreso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instalaciones.map((i) => (
                                <tr key={i.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>
                                        {new Date(i.fecha).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500' }}>{i.numero_serie}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{i.modelo}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>{i.cliente}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{i.tecnico}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
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

export default Instalaciones