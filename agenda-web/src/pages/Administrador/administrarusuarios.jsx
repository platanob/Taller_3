
import React, { useState } from 'react';

const AdminUsers = () => {
  // Estado para manejar los usuarios
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', rut: '12.345.678-9' },
    { id: 2, name: 'María González', rut: '98.765.432-1' },
    { id: 3, name: 'Pedro Sánchez', rut: '11.223.344-5' },
  ]);

  // Función para borrar un usuario
  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  // Función para mostrar información del usuario
  const handleInfo = (id) => {
    const user = users.find((user) => user.id === id);
    alert(`Información del usuario:\nNombre: ${user.name}\nRUT: ${user.rut}`);
  };

  // Función para editar un usuario (no confirmada aún)
  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);
    const newName = prompt(`Editar usuario:\n\nNombre actual: ${user.name}\n\nIngresa el nuevo nombre:`, user.name);
    const newRut = prompt(`Editar RUT:\n\nRUT actual: ${user.rut}\n\nIngresa el nuevo RUT:`, user.rut);
    if (newName && newRut) {
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, name: newName, rut: newRut } : user
      );
      setUsers(updatedUsers);
    }
  };

  return (
    <div
    className="min-h-screen bg-gray-100 flex flex-col items-center p-10"
    style={{
      backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url("/img/fondo.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
      <h2 className="text-3xl font-bold bg-gray-200 bg-opacity-50 p-4 rounded-md mb-10">Administrar Usuarios</h2>

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
    </div>
  );
};

export default AdminUsers;
