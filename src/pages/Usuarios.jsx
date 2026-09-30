import React, { useState, useEffect } from 'react'
import API from '../services/api'
import Navbar from '../components/Navbar'

function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [editandoPermisos, setEditandoPermisos] = useState(null)

    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rol, setRol] = useState('tecnico')
    const [permisos, setPermisos] = useState({
        ver_inventario: false,
        agregar_equipos: false,
        ver_clientes: false,
        agregar_clientes: false,
        registrar_instalaciones: false,
        ver_gastos: false,
        ver_reportes: false
    })

    useEffect(() => {
        cargarUsuarios()
    }, [])

    const cargarUsuarios = async () => {
        try {
            const respuesta = await API.get('/usuarios')
            setUsuarios(respuesta.data)
        } catch (error) {
            console.error(error)
        }
    }

    const togglePermiso = (permiso) => {
        setPermisos(prev => ({ ...prev, [permiso]: !prev[permiso] }))
    }

    const crearUsuario = async () => {
        try {
            await API.post('/usuarios', { nombre, email, password, rol, ...permisos })
            setMensaje('Usuario creado correctamente')
            setNombre('')
            setEmail('')
            setPassword('')
            setRol('tecnico')
            setPermisos({
                ver_inventario: false, agregar_equipos: false,
                ver_clientes: false, agregar_clientes: false,
                registrar_instalaciones: false, ver_gastos: false, ver_reportes: false
            })
            setMostrarFormulario(false)
            cargarUsuarios()
            setTimeout(() => setMensaje(''), 3000)
        } catch (error) {
            setMensaje(error.response?.data?.error || 'Error al crear usuario')
        }
    }

    const guardarPermisos = async (id, permisosActualizados) => {
        try {
            await API.put(`/usuarios/${id}/permisos`, permisosActualizados)
            setMensaje('Permisos actualizados correctamente')
            setEditandoPermisos(null)
            cargarUsuarios()
            setTimeout(() => setMensaje(''), 3000)
        } catch (error) {
            setMensaje('Error al actualizar permisos')
        }
    }

    const eliminarUsuario = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return
        try {
            await API.delete(`/usuarios/${id}`)
            setMensaje('Usuario eliminado correctamente')
            cargarUsuarios()
            setTimeout(() => setMensaje(''), 3000)
        } catch (error) {
            setMensaje('Error al eliminar usuario')
        }
    }

    const listaPermisos = [
        { key: 'ver_inventario', label: 'Ver inventario' },
        { key: 'agregar_equipos', label: 'Agregar equipos' },
        { key: 'ver_clientes', label: 'Ver clientes' },
        { key: 'agregar_clientes', label: 'Agregar clientes' },
        { key: 'registrar_instalaciones', label: 'Registrar instalaciones' },
        { key: 'ver_gastos', label: 'Ver gastos' },
        { key: 'ver_reportes', label: 'Ver reportes' },
    ]

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
                        Gestión de Usuarios
                    </h2>
                    <p style={{ color: 'var(--texto-secundario)', margin: '4px 0 0 0', fontSize: '14px' }}>
                        Administra los usuarios y sus permisos del sistema
                    </p>
                </div>

                {/* Tarjetas resumen */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Total usuarios', valor: usuarios.length, color: 'var(--color-primario)' },
                        { label: 'Técnicos', valor: usuarios.filter(u => u.rol === 'tecnico').length, color: 'var(--color-acento)' },
                        { label: 'Administradores', valor: usuarios.filter(u => u.rol === 'admin').length, color: 'var(--color-exito)' },
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

                {/* Botón agregar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        style={{
                            backgroundColor: 'var(--color-primario)', color: 'white',
                            border: 'none', padding: '10px 20px', borderRadius: 'var(--radio-md)',
                            cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                        }}
                    >
                        {mostrarFormulario ? '✕ Cancelar' : '+ Agregar usuario'}
                    </button>
                </div>

                {/* Formulario */}
                {mostrarFormulario && (
                    <div style={{
                        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
                        padding: '24px', marginBottom: '20px', boxShadow: 'var(--sombra-md)',
                        border: '1px solid var(--borde)'
                    }}>
                        <h4 style={{ color: 'var(--texto-primario)', margin: '0 0 16px 0' }}>Nuevo usuario</h4>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {[
                                { placeholder: 'Nombre completo', value: nombre, onChange: setNombre, type: 'text' },
                                { placeholder: 'Correo electrónico', value: email, onChange: setEmail, type: 'email' },
                                { placeholder: 'Contraseña', value: password, onChange: setPassword, type: 'password' },
                            ].map((input, i) => (
                                <input
                                    key={i}
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    value={input.value}
                                    onChange={(e) => input.onChange(e.target.value)}
                                    style={{
                                        flex: 1, minWidth: '180px', padding: '10px 14px',
                                        borderRadius: 'var(--radio-md)', border: '1px solid var(--borde)',
                                        backgroundColor: 'var(--bg-input)', color: 'var(--texto-primario)',
                                        fontSize: '14px', outline: 'none'
                                    }}
                                />
                            ))}
                            <select
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                style={{
                                    padding: '10px 14px', borderRadius: 'var(--radio-md)',
                                    border: '1px solid var(--borde)', fontSize: '14px',
                                    backgroundColor: 'var(--bg-input)', color: 'var(--texto-primario)',
                                    outline: 'none'
                                }}
                            >
                                <option value="tecnico">Técnico</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        {/* Permisos */}
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ color: 'var(--texto-primario)', fontWeight: '600', fontSize: '14px', margin: '0 0 12px 0' }}>
                                Permisos específicos
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {listaPermisos.map(p => (
                                    <label key={p.key} style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '8px 14px', borderRadius: 'var(--radio-md)', cursor: 'pointer',
                                        backgroundColor: permisos[p.key] ? 'rgba(27,47,110,0.1)' : 'var(--bg-input)',
                                        border: `1px solid ${permisos[p.key] ? 'var(--color-primario)' : 'var(--borde)'}`,
                                        fontSize: '13px',
                                        color: permisos[p.key] ? 'var(--color-primario)' : 'var(--texto-secundario)'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={permisos[p.key]}
                                            onChange={() => togglePermiso(p.key)}
                                            style={{ accentColor: 'var(--color-primario)' }}
                                        />
                                        {p.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button onClick={crearUsuario} style={{
                            backgroundColor: 'var(--color-acento)', color: 'white',
                            border: 'none', padding: '10px 24px', borderRadius: 'var(--radio-md)',
                            cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                        }}>
                            Crear usuario
                        </button>
                    </div>
                )}

                {/* Lista de usuarios */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {usuarios.map((usuario) => (
                        <div key={usuario.id} style={{
                            backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radio-lg)',
                            padding: '20px', boxShadow: 'var(--sombra-md)',
                            border: '1px solid var(--borde)'
                        }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', flexWrap: 'wrap', gap: '10px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        backgroundColor: usuario.rol === 'admin' ? 'var(--color-primario)' : 'var(--color-acento)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontWeight: 'bold', fontSize: '16px'
                                    }}>
                                        {usuario.nombre?.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', color: 'var(--texto-primario)', fontSize: '15px' }}>
                                            {usuario.nombre}
                                        </p>
                                        <p style={{ margin: 0, color: 'var(--texto-secundario)', fontSize: '13px' }}>{usuario.email}</p>
                                    </div>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                        backgroundColor: usuario.rol === 'admin' ? 'rgba(27,47,110,0.1)' : 'var(--color-warning-bg)',
                                        color: usuario.rol === 'admin' ? 'var(--color-primario)' : 'var(--color-warning)'
                                    }}>
                                        {usuario.rol}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setEditandoPermisos(editandoPermisos === usuario.id ? null : usuario.id)}
                                        style={{
                                            backgroundColor: 'rgba(27,47,110,0.1)', color: 'var(--color-primario)',
                                            border: 'none', padding: '8px 14px', borderRadius: 'var(--radio-md)',
                                            cursor: 'pointer', fontSize: '13px', fontWeight: '500'
                                        }}
                                    >
                                        {editandoPermisos === usuario.id ? 'Cerrar' : 'Editar permisos'}
                                    </button>
                                    <button
                                        onClick={() => eliminarUsuario(usuario.id)}
                                        style={{
                                            backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)',
                                            border: 'none', padding: '8px 14px', borderRadius: 'var(--radio-md)',
                                            cursor: 'pointer', fontSize: '13px', fontWeight: '500'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {/* Permisos actuales */}
                            {usuario.rol === 'tecnico' && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--borde)' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {listaPermisos.map(p => (
                                            <span key={p.key} style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                                                backgroundColor: usuario[p.key] ? 'var(--color-exito-bg)' : 'var(--bg-hover)',
                                                color: usuario[p.key] ? 'var(--color-exito)' : 'var(--texto-terciario)'
                                            }}>
                                                {usuario[p.key] ? '✓' : '✗'} {p.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Editor de permisos */}
                            {editandoPermisos === usuario.id && (
                                <EditarPermisos
                                    usuario={usuario}
                                    listaPermisos={listaPermisos}
                                    onGuardar={guardarPermisos}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function EditarPermisos({ usuario, listaPermisos, onGuardar }) {
    const [permisosLocales, setPermisosLocales] = useState({
        ver_inventario: usuario.ver_inventario || false,
        agregar_equipos: usuario.agregar_equipos || false,
        ver_clientes: usuario.ver_clientes || false,
        agregar_clientes: usuario.agregar_clientes || false,
        registrar_instalaciones: usuario.registrar_instalaciones || false,
        ver_gastos: usuario.ver_gastos || false,
        ver_reportes: usuario.ver_reportes || false,
    })

    const toggle = (key) => {
        setPermisosLocales(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div style={{
            marginTop: '16px', padding: '16px', borderRadius: 'var(--radio-md)',
            backgroundColor: 'var(--bg-hover)', border: '1px solid var(--borde)'
        }}>
            <p style={{ color: 'var(--texto-primario)', fontWeight: '600', fontSize: '14px', margin: '0 0 12px 0' }}>
                Editar permisos de {usuario.nombre}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                {listaPermisos.map(p => (
                    <label key={p.key} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 14px', borderRadius: 'var(--radio-md)', cursor: 'pointer',
                        backgroundColor: permisosLocales[p.key] ? 'rgba(27,47,110,0.1)' : 'var(--bg-card)',
                        border: `1px solid ${permisosLocales[p.key] ? 'var(--color-primario)' : 'var(--borde)'}`,
                        fontSize: '13px',
                        color: permisosLocales[p.key] ? 'var(--color-primario)' : 'var(--texto-secundario)'
                    }}>
                        <input
                            type="checkbox"
                            checked={permisosLocales[p.key]}
                            onChange={() => toggle(p.key)}
                            style={{ accentColor: 'var(--color-primario)' }}
                        />
                        {p.label}
                    </label>
                ))}
            </div>
            <button
                onClick={() => onGuardar(usuario.id, permisosLocales)}
                style={{
                    backgroundColor: 'var(--color-primario)', color: 'white',
                    border: 'none', padding: '10px 20px', borderRadius: 'var(--radio-md)',
                    cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                }}
            >
                Guardar permisos
            </button>
        </div>
    )
}

export default Usuarios