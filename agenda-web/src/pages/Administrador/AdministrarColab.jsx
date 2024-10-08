import React, { useState } from 'react';

const AdministradorColab = () => {
  // Estado para manejar los colaboradores
  const [colaboradores, setColaboradores] = useState([
    { id: 1, name: 'Carlos Rodríguez', rut: '12.345.678-9', especialidad: 'Terapia física' },
    { id: 2, name: 'Ana Martínez', rut: '98.765.432-1', especialidad: 'Podología' },
    { id: 3, name: 'Luis González', rut: '11.223.344-5', especialidad: 'Fisioterapia' },
  ]);

  // Función para borrar un colaborador
  const handleDelete = (id) => {
    const updatedColaboradores = colaboradores.filter((colaborador) => colaborador.id !== id);
    setColaboradores(updatedColaboradores);
  };

  // Función para mostrar información del colaborador
  const handleInfo = (id) => {
    const colaborador = colaboradores.find((colaborador) => colaborador.id === id);
    alert(`Información del colaborador:\nNombre: ${colaborador.name}\nRUT: ${colaborador.rut}\nEspecialidad: ${colaborador.especialidad}`);
  };

  // Función para editar un colaborador (no confirmada aún)
  const handleEdit = (id) => {
    const colaborador = colaboradores.find((colaborador) => colaborador.id === id);
    const newName = prompt(`Editar colaborador:\n\nNombre actual: ${colaborador.name}\n\nIngresa el nuevo nombre:`, colaborador.name);
    const newRut = prompt(`Editar RUT:\n\nRUT actual: ${colaborador.rut}\n\nIngresa el nuevo RUT:`, colaborador.rut);
    const newEspecialidad = prompt(`Editar Especialidad:\n\nEspecialidad actual: ${colaborador.especialidad}\n\nIngresa la nueva especialidad:`, colaborador.especialidad);

    if (newName && newRut && newEspecialidad) {
      const updatedColaboradores = colaboradores.map((colaborador) =>
        colaborador.id === id ? { ...colaborador, name: newName, rut: newRut, especialidad: newEspecialidad } : colaborador
      );
      setColaboradores(updatedColaboradores);
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
  >   <div className="bg-black bg-opacity-50 p-4 rounded-md mb-10">
      <h2 className="text-3xl font-bold text-white drop-shadow-lg">Administrar Colaboradores</h2>
      </div>
      <table className="table-auto bg-gray-200 shadow-lg rounded-lg w-full max-w-4xl">
        <thead>
          <tr className="bg-gray-200 border border-black">
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">RUT</th>
            <th className="px-4 py-2 text-left">Especialidad</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.length > 0 ? (
            colaboradores.map((colaborador) => (
              <tr key={colaborador.id} className="border-t border border-black">
                <td className="px-4 py-2 text-gray-700">{colaborador.name}</td>
                <td className="px-4 py-2 text-gray-700">{colaborador.rut}</td>
                <td className="px-4 py-2 text-gray-700">{colaborador.especialidad}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleInfo(colaborador.id)}
                    className="bg-white border border-black py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Ver Información
                  </button>
                  <button
                    onClick={() => handleEdit(colaborador.id)}
                    className="bg-white border border-black py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(colaborador.id)}
                    className="bg-white border border-black py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-2 text-center text-gray-600">
                No hay colaboradores registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdministradorColab;
