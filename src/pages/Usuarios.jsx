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
            await API.post('/usuarios', {
                nombre, email, password, rol, ...permisos
            })
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
                backgroundColor: '#f4f6fb', padding: '30px',
                transition: 'margin-left 0.3s ease'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ color: '#1B2F6E', fontWeight: 'bold', fontSize: '24px', margin: 0 }}>
                        Gestión de Usuarios
                    </h2>
                    <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>
                        Administra los usuarios y sus permisos del sistema
                    </p>
                </div>

                {/* Tarjeta resumen */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '20px',
                        flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        borderLeft: '4px solid #1B2F6E'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Total usuarios</p>
                        <p style={{ color: '#1B2F6E', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{usuarios.length}</p>
                    </div>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '20px',
                        flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        borderLeft: '4px solid #E8320A'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Técnicos</p>
                        <p style={{ color: '#E8320A', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                            {usuarios.filter(u => u.rol === 'tecnico').length}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '20px',
                        flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        borderLeft: '4px solid #16a34a'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>Administradores</p>
                        <p style={{ color: '#16a34a', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                            {usuarios.filter(u => u.rol === 'admin').length}
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

                {/* Botón agregar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        style={{
                            backgroundColor: '#1B2F6E', color: 'white', border: 'none',
                            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '14px', fontWeight: '600'
                        }}
                    >
                        {mostrarFormulario ? '✕ Cancelar' : '+ Agregar usuario'}
                    </button>
                </div>

                {/* Formulario nuevo usuario */}
                {mostrarFormulario && (
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '24px',
                        marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                    }}>
                        <h4 style={{ color: '#1B2F6E', margin: '0 0 16px 0' }}>Nuevo usuario</h4>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            <input
                                placeholder="Nombre completo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                style={{
                                    flex: 1, minWidth: '180px', padding: '10px 14px',
                                    borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                                }}
                            />
                            <input
                                placeholder="Correo electrónico"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    flex: 1, minWidth: '180px', padding: '10px 14px',
                                    borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                                }}
                            />
                            <input
                                placeholder="Contraseña"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    flex: 1, minWidth: '150px', padding: '10px 14px',
                                    borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'
                                }}
                            />
                            <select
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                style={{
                                    padding: '10px 14px', borderRadius: '8px',
                                    border: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: 'white'
                                }}
                            >
                                <option value="tecnico">Técnico</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        {/* Permisos */}
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ color: '#1B2F6E', fontWeight: '600', fontSize: '14px', margin: '0 0 12px 0' }}>
                                Permisos específicos
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {listaPermisos.map(p => (
                                    <label key={p.key} style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                                        backgroundColor: permisos[p.key] ? '#dbeafe' : '#f9fafb',
                                        border: `1px solid ${permisos[p.key] ? '#1B2F6E' : '#e5e7eb'}`,
                                        fontSize: '13px', color: permisos[p.key] ? '#1B2F6E' : '#6b7280'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={permisos[p.key]}
                                            onChange={() => togglePermiso(p.key)}
                                            style={{ accentColor: '#1B2F6E' }}
                                        />
                                        {p.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={crearUsuario}
                            style={{
                                backgroundColor: '#E8320A', color: 'white', border: 'none',
                                padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                                fontSize: '14px', fontWeight: '600'
                            }}
                        >
                            Crear usuario
                        </button>
                    </div>
                )}

                {/* Lista de usuarios */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {usuarios.map((usuario) => (
                        <div key={usuario.id} style={{
                            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        backgroundColor: usuario.rol === 'admin' ? '#1B2F6E' : '#E8320A',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontWeight: 'bold', fontSize: '16px'
                                    }}>
                                        {usuario.nombre?.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', color: '#1a1a2e', fontSize: '15px' }}>{usuario.nombre}</p>
                                        <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{usuario.email}</p>
                                    </div>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                        backgroundColor: usuario.rol === 'admin' ? '#dbeafe' : '#fef3c7',
                                        color: usuario.rol === 'admin' ? '#1B2F6E' : '#92400e'
                                    }}>
                                        {usuario.rol}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setEditandoPermisos(editandoPermisos === usuario.id ? null : usuario.id)}
                                        style={{
                                            backgroundColor: '#dbeafe', color: '#1B2F6E', border: 'none',
                                            padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
                                        }}
                                    >
                                        {editandoPermisos === usuario.id ? 'Cerrar' : 'Editar permisos'}
                                    </button>
                                    <button
                                        onClick={() => eliminarUsuario(usuario.id)}
                                        style={{
                                            backgroundColor: '#fee2e2', color: '#991b1b', border: 'none',
                                            padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {/* Permisos actuales */}
                            {usuario.rol === 'tecnico' && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {listaPermisos.map(p => (
                                            <span key={p.key} style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                                                backgroundColor: usuario[p.key] ? '#dcfce7' : '#f3f4f6',
                                                color: usuario[p.key] ? '#166534' : '#9ca3af'
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
            marginTop: '16px', padding: '16px', borderRadius: '10px',
            backgroundColor: '#f8fafc', border: '1px solid #e5e7eb'
        }}>
            <p style={{ color: '#1B2F6E', fontWeight: '600', fontSize: '14px', margin: '0 0 12px 0' }}>
                Editar permisos de {usuario.nombre}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                {listaPermisos.map(p => (
                    <label key={p.key} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: permisosLocales[p.key] ? '#dbeafe' : 'white',
                        border: `1px solid ${permisosLocales[p.key] ? '#1B2F6E' : '#e5e7eb'}`,
                        fontSize: '13px', color: permisosLocales[p.key] ? '#1B2F6E' : '#6b7280'
                    }}>
                        <input
                            type="checkbox"
                            checked={permisosLocales[p.key]}
                            onChange={() => toggle(p.key)}
                            style={{ accentColor: '#1B2F6E' }}
                        />
                        {p.label}
                    </label>
                ))}
            </div>
            <button
                onClick={() => onGuardar(usuario.id, permisosLocales)}
                style={{
                    backgroundColor: '#1B2F6E', color: 'white', border: 'none',
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '600'
                }}
            >
                Guardar permisos
            </button>
        </div>
    )
}

export default Usuarios