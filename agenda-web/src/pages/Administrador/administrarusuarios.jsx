import React, { useState } from 'react';

const AdminUsers = () => {
  // Estado para manejar los usuarios
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', rut: '12.345.678-9' },
    { id: 2, name: 'María González', rut: '98.765.432-1' },
    { id: 3, name: 'Pedro Sánchez', rut: '11.223.344-5' },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // Función para mostrar información del usuario
  const handleInfo = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
    document.getElementById('info_modal').showModal();
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    setIsDeleteMode(false);
    document.getElementById('info_modal').close();
  };

  // Función para editar un usuario
  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
    setIsEditMode(true);
    document.getElementById('info_modal').showModal();
  };

  const handleEditSubmit = () => {
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? selectedUser : user
    );
    setUsers(updatedUsers);
    closeModal();
  };

  // Función para eliminar un usuario
  const handleDelete = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
    setIsDeleteMode(true);
    document.getElementById('info_modal').showModal();
  };

  const handleDeleteConfirm = () => {
    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    closeModal();
  };

  return (
    <div
    className="min-h-screen bg-gray-100 flex flex-col items-center p-10"
    style={{
      backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url("/img/fondo.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >   <div className="bg-black bg-opacity-50 p-4 rounded-md mb-10">
      <h2 className="text-3xl font-bold text-white drop-shadow-lg">Administrar Usuarios</h2>
      </div>
      <table className="table-auto bg-gray-200 border border-black shadow-lg rounded-lg w-full max-w-4xl ">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left ">Nombre</th>
            <th className="px-4 py-2 text-left">RUT</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="border-t border border-black">
                <td className="px-4 py-2 text-gray-700">{user.name}</td>
                <td className="px-4 py-2 text-gray-700">{user.rut}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleInfo(user.id)}
                    className="bg-white border border-black py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Ver Información
                  </button>
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="bg-white border border-black py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-white border border-black py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-2 text-center text-gray-600">
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <dialog id="info_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          {selectedUser && !isEditMode && !isDeleteMode && (
            <>
              <h3 className="font-bold text-lg">Información del Usuario</h3>
              <p className="py-4">Nombre: {selectedUser.name}</p>
              <p className="py-4">RUT: {selectedUser.rut}</p>
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
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="RUT"
                value={selectedUser.rut}
                onChange={(e) => setSelectedUser({ ...selectedUser, rut: e.target.value })}
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
              <p className="py-4">¿Estás seguro que deseas eliminar a {selectedUser.name}?</p>
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
