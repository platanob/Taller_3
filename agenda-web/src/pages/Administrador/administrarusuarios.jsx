import React, { useState, useEffect } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

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
      .catch((error) => console.error('Error al conectar con la API:', error));
  }, []);

  const handleInfo = (id) => {
    const user = users.find((user) => user._id === id);
    setSelectedUser(user);
    document.getElementById('info_modal').showModal();
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    setIsDeleteMode(false);
    document.getElementById('info_modal').close();
  };

  const handleEdit = (id) => {
    const user = users.find((user) => user._id === id);
    setSelectedUser(user);
    setIsEditMode(true);
    document.getElementById('info_modal').showModal();
  };

  const handleEditSubmit = () => {
    fetch(`http://localhost:5000/api/editar_usuario/${selectedUser._id}`, {
      method: 'PUT',  
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        nombre: selectedUser.nombre,
        rut: selectedUser.rut,
        correo: selectedUser.correo, 
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then((data) => {
        if (data.mensaje) {
          const updatedUsers = users.map((user) =>
            user._id === selectedUser._id ? selectedUser : user
          );
          setUsers(updatedUsers);
          closeModal();
        } else {
          console.error('Error al editar usuario:', data.error);
        }
      })
      .catch((error) => console.error('Error al conectar con la API:', error));
  };

  const handleDelete = (id) => {
    const user = users.find((user) => user._id === id);
    setSelectedUser(user);
    setIsDeleteMode(true);
    document.getElementById('info_modal').showModal();
  };

  const handleDeleteConfirm = () => {
    fetch(`http://localhost:5000/api/eliminar_usuario/${selectedUser._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.mensaje) {
          const updatedUsers = users.filter((user) => user._id !== selectedUser._id);
          setUsers(updatedUsers);
          closeModal();
        } else {
          console.error('Error al eliminar usuario:', data.error);
        }
      })
      .catch((error) => console.error('Error al conectar con la API:', error));
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
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">RUT</th>
                <th className="py-2 px-4 text-left">Correo</th> 
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-t text-gray-800">
                    <td className="py-2 px-4 ">{user.nombre}</td>
                    <td className="py-2 px-4 ">{user.rut}</td>
                    <td className="py-2 px-4 ">{user.correo}</td> 
                    <td className="py-2 px-4 flex justify-center space-x-2">
                      <button
                        onClick={() => handleInfo(user._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                      >
                        Ver Información
                      </button>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                      >
                        Ver Historial
                      </button>
                      <button
                        onClick={() => handleEdit(user._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        Borrar
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

      {/* Modal */}
      <dialog id="info_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          {selectedUser && !isEditMode && !isDeleteMode && (
            <>
              <h3 className="font-bold text-lg">Información del Usuario</h3>
              <p className="py-4">Nombre: {selectedUser.nombre}</p>
              <p className="py-4">RUT: {selectedUser.rut}</p>
              <p className="py-4">Correo: {selectedUser.correo}</p> {/* Mostrar correo */}
              <div className="modal-action">
                <button className="btn btn-outline" onClick={closeModal}>Cerrar</button>
              </div>
            </>
          )}

          {selectedUser && isEditMode && (
            <>
              <h3 className="font-bold text-lg">Editar Usuario</h3>
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="Nombre"
                value={selectedUser.nombre}
                onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="RUT"
                value={selectedUser.rut}
                onChange={(e) => setSelectedUser({ ...selectedUser, rut: e.target.value })}
              />
              <input
                type="email"
                className="input input-bordered w-full my-2"
                placeholder="Correo"
                value={selectedUser.correo}  // Agregar campo de correo en la edición
                onChange={(e) => setSelectedUser({ ...selectedUser, correo: e.target.value })}
              />
              <div className="modal-action">
                <button className="btn btn-outline" onClick={handleEditSubmit}>Guardar</button>
                <button className="btn btn-outline" onClick={closeModal}>Cancelar</button>
              </div>
            </>
          )}

          {selectedUser && isDeleteMode && (
            <>
              <h3 className="font-bold text-lg">Confirmar Eliminación</h3>
              <p className="py-4">¿Estás seguro que deseas eliminar a {selectedUser.nombre}?</p>
              <div className="modal-action">
                <button className="btn btn-outline" onClick={handleDeleteConfirm}>Eliminar</button>
                <button className="btn btn-outline" onClick={closeModal}>Cancelar</button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default AdminUsers;
