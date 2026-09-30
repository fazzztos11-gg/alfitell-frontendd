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
                decoder: { readers: ['code_128_reader', 'ean_reader', 'code_39_reader'] }
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
        return () => { if (escaneando) Quagga.stop() }
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
                telefono, direccion
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

    const totalIngresos = instalaciones.reduce((acc, i) => acc + parseFloat(i.ingreso_generado || 0), 0)

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
                        Instalaciones
                    </h2>
                    <p style={{ color: 'var(--texto-secundario)', margin: '4px 0 0 0', fontSize: '14px' }}>
                        Registro de instalaciones realizadas por técnicos
                    </p>
                </div>

                {/* Tarjetas resumen */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Total instalaciones', valor: instalaciones.length, color: 'var(--color-primario)' },
                        { label: 'Ingresos generados', valor: `S/ ${totalIngresos.toFixed(2)}`, color: 'var(--color-exito)' },
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

                {/* Botón registrar */}
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        style={{
                            backgroundColor: 'var(--color-primario)', color: 'white',
                            border: 'none', padding: '10px 20px', borderRadius: 'var(--radio-md)',
                            cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                        }}
                    >
                        {mostrarFormulario ? '✕ Cancelar' : '+ Registrar instalación'}
                    </button>
                </div>

                {/* Formulario */}
                {mostrarFormulario && (
                    <div style={{
                        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
                        padding: '24px', marginBottom: '20px', boxShadow: 'var(--sombra-md)',
                        border: '1px solid var(--borde)'
                    }}>
                        <h4 style={{ color: 'var(--texto-primario)', margin: '0 0 16px 0' }}>Nueva instalación</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    placeholder="Número de serie"
                                    value={numeroSerie}
                                    onChange={(e) => setNumeroSerie(e.target.value)}
                                    style={{
                                        flex: 1, padding: '10px 14px', borderRadius: 'var(--radio-md)',
                                        border: '1px solid var(--borde)', backgroundColor: 'var(--bg-input)',
                                        color: 'var(--texto-primario)', fontSize: '14px', outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={() => setEscaneando(!escaneando)}
                                    style={{
                                        backgroundColor: 'var(--color-acento)', color: 'white',
                                        border: 'none', padding: '10px 16px', borderRadius: 'var(--radio-md)',
                                        cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap'
                                    }}
                                >
                                    {escaneando ? 'Cancelar' : '📷 Escanear'}
                                </button>
                            </div>

                            {escaneando && (
                                <div style={{ border: '2px solid var(--color-acento)', borderRadius: 'var(--radio-md)', overflow: 'hidden' }}>
                                    <div ref={scannerRef} style={{ width: '100%', height: '200px' }} />
                                    <p style={{ textAlign: 'center', color: 'var(--color-acento)', margin: '8px 0', fontSize: '13px' }}>
                                        Apunta la cámara al código de barras
                                    </p>
                                </div>
                            )}

                            {[
                                { placeholder: 'Nombre del cliente', value: nombreCliente, onChange: setNombreCliente },
                                { placeholder: 'Teléfono', value: telefono, onChange: setTelefono },
                                { placeholder: 'Dirección', value: direccion, onChange: setDireccion },
                            ].map((input, i) => (
                                <input
                                    key={i}
                                    placeholder={input.placeholder}
                                    value={input.value}
                                    onChange={(e) => input.onChange(e.target.value)}
                                    style={{
                                        padding: '10px 14px', borderRadius: 'var(--radio-md)',
                                        border: '1px solid var(--borde)', backgroundColor: 'var(--bg-input)',
                                        color: 'var(--texto-primario)', fontSize: '14px', outline: 'none'
                                    }}
                                />
                            ))}

                            <button onClick={registrarInstalacion} style={{
                                backgroundColor: 'var(--color-primario)', color: 'white',
                                border: 'none', padding: '12px', borderRadius: 'var(--radio-md)',
                                cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                            }}>
                                Registrar instalación
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabla */}
                <div style={{
                    backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
                    boxShadow: 'var(--sombra-md)', overflow: 'hidden',
                    border: '1px solid var(--borde)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-primario)' }}>
                                {['Fecha', 'Serie', 'Modelo', 'Cliente', 'Técnico', 'Ingreso'].map((h, i) => (
                                    <th key={i} style={{ color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {instalaciones.map((inst) => (
                                <tr key={inst.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>
                                        {new Date(inst.fecha).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500', color: 'var(--texto-primario)' }}>{inst.numero_serie}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>{inst.modelo}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-primario)' }}>{inst.cliente}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--texto-secundario)' }}>{inst.tecnico}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--color-exito)' }}>
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

export default Instalaciones