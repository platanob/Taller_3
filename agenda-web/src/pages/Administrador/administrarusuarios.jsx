import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaInfoCircle, FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';
import Espera from './Espera';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento || typeof fechaNacimiento !== 'string') {
      return 'No disponible'; 
    }
    const [dia, mes, año] = fechaNacimiento.split('-').map(Number);
    const fechaNacimientoDate = new Date(año, mes - 1, dia);
    const hoy = new Date();
    let edadCalculada = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNacimientoDate.getMonth();
    if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimientoDate.getDate())) {
      edadCalculada--;
    }
    return edadCalculada;
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/obtener_usuarios', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.usuarios) {
          setUsers(data.usuarios);
        } else {
          console.error('Error al obtener usuarios:', data.mensaje || data.error);
        }
      })
      .catch((error) => console.error('Error al conectar con la API:', error))
      .finally(() => setLoading(false)); // Finaliza la carga
  }, []);
  
  const handleInfo = (id) => {
    const user = users.find((user) => user._id === id);
    const edad = calcularEdad(user.fechaNacimiento);

    Swal.fire({
      title: 'Información del Usuario',
      html: `
        <p><strong>Nombre:</strong> ${user.nombre}</p>
        <p><strong>RUT:</strong> ${user.rut}</p>
        <p><strong>Correo:</strong> ${user.correo}</p>
        <p><strong>Localidad:</strong> ${user.localidad}</p>
        <p><strong>Discapacidad:</strong> ${user.discapacidad ? 'Sí' : 'No'}</p>
        <p><strong>Edad:</strong> ${edad} años</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  };

  const handleEdit = (id) => {
    const user = users.find((user) => user._id === id);
    setSelectedUser(user);

    Swal.fire({
      title: 'Editar Usuario',
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${user.nombre}">
        <input id="rut" class="swal2-input" placeholder="RUT" value="${user.rut}">
        <input id="localidad" class="swal2-input" placeholder="Localidad" value="${user.localidad}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = document.getElementById('nombre').value;
        const rut = document.getElementById('rut').value;
        const localidad = document.getElementById('localidad').value;

        return { nombre, rut, localidad };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombre, rut, localidad } = result.value;

        fetch(`http://localhost:5000/api/editar_usuario/${user._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ nombre, rut, localidad }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.mensaje) {
              const updatedUsers = users.map((u) =>
                u._id === user._id ? { ...user, nombre, rut, localidad } : u
              );
              setUsers(updatedUsers);
            } else {
              console.error('Error al editar usuario:', data.error);
            }
          })
          .catch((error) => console.error('Error al conectar con la API:', error));
      }
    });
  };

  const handleDelete = (id) => {
    const user = users.find((user) => user._id === id);

    Swal.fire({
      title: 'Confirmar Eliminación',
      text: `¿Estás seguro que deseas eliminar a ${user.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/api/eliminar_usuario/${user._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.mensaje) {
              const updatedUsers = users.filter((u) => u._id !== user._id);
              setUsers(updatedUsers);
              Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
            } else {
              console.error('Error al eliminar usuario:', data.error);
            }
          })
          .catch((error) => console.error('Error al conectar con la API:', error));
      }
    });
  };

  if (loading) {
    return <Espera />; 
  }

  const handleViewHistory = (id) => {
    const user = users.find((user) => user._id === id);
    Swal.fire({
      title: 'Historial del Usuario',
      html: `
        <p><strong>Nombre:</strong> ${user.nombre}</p>
        <p><strong>RUT:</strong> ${user.rut}</p>
        <p><strong>Correo:</strong> ${user.correo}</p>
        <p><strong>Citas Agendadas:</strong></p>
        <p><strong>Cantidad de citas agendadas (Año):</strong></p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  };

  

  return (
    <div className="min-h-screen bg-gray-100 py-10"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-5xl mx-auto bg-blue-200 shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Administrar Usuarios</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className='bg-blue-600 text-white'>
              <tr>
                <th className="py-2 px-2 text-left">Nombre</th>
                <th className="py-2 px-2 text-left">RUT</th>
                <th className="py-2 px-4 text-left">Discapacidad</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-t text-gray-800">
                    <td className="py-2 px-2">{user.nombre}</td>
                    <td className="py-2 px-2">{user.rut}</td>
                    <td className="py-2 px-4 text-center">{user.discapacidad ? 'Sí' : 'No'}</td>
                    <td className="py-2 px-4 flex justify-center space-x-2">
                      <button
                        onClick={() => handleInfo(user._id)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      >
                        <FaInfoCircle /> <span className='text-sm'>Info</span>
                      </button>
                      <button
                        onClick={() => handleViewHistory(user._id)}
                        className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
                      >
                        <FaFileAlt className="" /> <span className="text-sm">Historial Citas</span>
                      </button>
                      <button
                        onClick={() => handleEdit(user._id)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                      >
                        <FaEdit /> <span className='text-sm'>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                      >
                        <FaTrash /> <span className='text-sm'>Borrar</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center text-gray-600">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
