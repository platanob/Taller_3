import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaInfoCircle, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Espera from './Espera';

const AdministradorColab = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://taller-3.onrender.com/api/obtener_cuentas', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.cuentas) {
          const colaboradoresConEspecialidad = data.cuentas.filter(user => user.especialidad);
          setUsers(colaboradoresConEspecialidad);
        } else {
          console.error('Error al obtener cuentas:', data.mensaje || data.error);
        }
      })
      .catch((error) => console.error('Error al conectar con la API:', error))
      .finally(() => setLoading(false)); // Finaliza la carga
  }, []);

  const handleInfo = (id) => {
    const user = users.find((user) => user._id === id);
    Swal.fire({
      title: 'Información del Usuario',
      html: `
        <p><strong>Nombre:</strong> ${user.nombre}</p>
        <p><strong>RUT:</strong> ${user.rut}</p>
        <p><strong>Correo Electronico:</strong> ${user.correo}</p>
        <p><strong>Especialidad:</strong> ${user.especialidad}</p>
        
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
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre" value="${user.nombre}" />
        <input type="text" id="rut" class="swal2-input" placeholder="RUT" value="${user.rut}" />
        <input type="text" id="especialidad" class="swal2-input" placeholder="Especialidad" value="${user.especialidad}" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombre: document.getElementById('nombre').value,
          rut: document.getElementById('rut').value,
          especialidad: document.getElementById('especialidad').value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://taller-3.onrender.com/api/editar_cuenta/${user._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(result.value),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.mensaje) {
              const updatedUsers = users.map((u) =>
                u._id === user._id ? { ...user, ...result.value } : u
              );
              setUsers(updatedUsers);
              Swal.fire('Editado', 'El usuario ha sido editado exitosamente', 'success');
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
        fetch(`https://taller-3.onrender.com/api/eliminar_cuenta/${user._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.mensaje) {
              setUsers(users.filter((u) => u._id !== user._id));
              Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
            } else {
              console.error('Error al eliminar usuario:', data.error);
            }
          })
          .catch((error) => console.error('Error al conectar con la API:', error));
      }
    });
  };

  if (loading) {
    return <Espera />; // Muestra el preloader mientras carga
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10"
      style={{ backgroundImage: 'url("/img/fondo.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-5xl mx-auto bg-blue-200 shadow-xl rounded-lg p-8">
        <h2 className="text-4xl font-bold text-blue-800 mb-6 text-center">Administrar Colaboradores</h2>
        
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className='bg-blue-600 text-white'>
              <tr>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">RUT</th>
                <th className="py-3 px-4 text-left">Especialidad</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-100 transition">
                    <td className="py-3 px-4 text-black">{user.nombre}</td>
                    <td className="py-3 px-4 text-black">{user.rut}</td>
                    <td className="py-3 px-4 text-black">{user.especialidad}</td>
                    <td className="py-3 px-4 flex justify-center space-x-3">
                      <button
                        onClick={() => handleInfo(user._id)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      >
                        <FaInfoCircle /> <span>Info</span>
                      </button>
                      <button
                        onClick={() => handleEdit(user._id)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      >
                        <FaEdit /> <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                      >
                        <FaTrash /> <span>Borrar</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            className="flex items-center space-x-2 bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
            onClick={() => navigate('/admin/administrar-colaboradores/crear-colaborador')} 
          >
            <FaUserPlus /> <span>Añadir colaborador</span> 
          </button>
          <button
            className="flex items-center space-x-2 bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
            onClick={() => navigate('/admin/administrar-colaboradores/crear-administrador')}
          >
            <FaUserPlus /> <span>Añadir administrador</span> 
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdministradorColab;