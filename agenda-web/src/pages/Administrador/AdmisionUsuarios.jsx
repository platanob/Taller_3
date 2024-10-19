import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Preloader from './Espera';
import Swal from 'sweetalert2';

const AdmisionUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/obtener_usuarios_nuevos', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar usuarios. Inténtalo de nuevo más tarde.');
    } finally {
      setCargando(false); 
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const aceptarUsuario = async (usuarioId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas aceptar a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/aceptar_usuario/${usuarioId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          cargarUsuarios();
          Swal.fire({
            icon: 'success',
            title: 'Usuario aceptado',
            text: 'El usuario ha sido aceptado correctamente.',
            confirmButtonColor: '#3085d6',
          });
        } catch (error) {
          console.error('Error al aceptar usuario:', error);
          setError('Error al aceptar el usuario. Inténtalo de nuevo más tarde.');

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al aceptar el usuario.',
          });
        }
      }
    });
  };

  const eliminarUsuario = async (usuarioId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/eliminar_usuario_nuevo/${usuarioId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          cargarUsuarios();
          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            text: 'El usuario ha sido eliminado correctamente.',
            confirmButtonColor: '#3085d6',
          });
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          setError('Error al eliminar el usuario. Inténtalo de nuevo más tarde.');

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el usuario.',
          });
        }
      }
    });
  };

  const InfoClick = (usuario) => {
    navigate('/admin/admision-usuarios/usuario-info', {
      state: { usuario },
    });
  };

  if (cargando) {
    return <Preloader />;
  }

  return (
    <div
      className="min-h-screen bg-gray-100 py-10"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-5xl mx-auto bg-blue-200 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Admisión de Usuarios Nuevos</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">RUT</th>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Correo</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.rut} className="border-t text-gray-800">
                  <td className="py-2 px-4">{usuario.rut}</td>
                  <td className="py-2 px-4">{usuario.nombre}</td>
                  <td className="py-2 px-4">{usuario.correo}</td>
                  <td className="py-2 px-4 flex justify-center space-x-2">
                    <button
                      onClick={() => InfoClick(usuario)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                    >
                      Información
                    </button>
                    <button
                      onClick={() => aceptarUsuario(usuario._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => eliminarUsuario(usuario._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
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
    </div>
  );
};

export default AdmisionUsuarios;
