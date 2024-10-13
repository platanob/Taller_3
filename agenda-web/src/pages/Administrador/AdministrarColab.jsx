import React, { useState } from 'react';

const AdministradorColab = () => {
  const [colaboradores, setColaboradores] = useState([
    { id: 1, name: 'Carlos Rodríguez', rut: '12.345.678-9', especialidad: 'Terapia física'},
    { id: 2, name: 'Ana Martínez', rut: '98.765.432-1', especialidad: 'Podología'},
    { id: 3, name: 'Luis González', rut: '11.223.344-5', especialidad: 'Fisioterapia'},
  ]);

  const [selectedColaborador, setSelectedColaborador] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // Función para mostrar información del colaborador
  const handleInfo = (id) => {
    const colaborador = colaboradores.find((colaborador) => colaborador.id === id);
    setSelectedColaborador(colaborador);
    document.getElementById('info_modal').showModal();
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedColaborador(null);
    setIsEditMode(false);
    setIsDeleteMode(false);
    document.getElementById('info_modal').close();
  };

  // Función para editar un colaborador
  const handleEdit = (id) => {
    const colaborador = colaboradores.find((colaborador) => colaborador.id === id);
    setSelectedColaborador(colaborador);
    setIsEditMode(true);
    document.getElementById('info_modal').showModal();
  };

  const handleEditSubmit = () => {
    const updatedColaboradores = colaboradores.map((colaborador) =>
      colaborador.id === selectedColaborador.id ? selectedColaborador : colaborador
    );
    setColaboradores(updatedColaboradores);
    closeModal();
  };

  // Función para eliminar un colaborador
  const handleDelete = (id) => {
    const colaborador = colaboradores.find((colaborador) => colaborador.id === id);
    setSelectedColaborador(colaborador);
    setIsDeleteMode(true);
    document.getElementById('info_modal').showModal();
  };

  const handleDeleteConfirm = () => {
    const updatedColaboradores = colaboradores.filter((colaborador) => colaborador.id !== selectedColaborador.id);
    setColaboradores(updatedColaboradores);
    closeModal();
  };

  return (
    <div
    className="min-h-screen bg-gray-100 py-10"
    style={{
      backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}
  >   <div className="max-w-5xl mx-auto bg-blue-200 shadow-lg rounded-lg p-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Administrar Colaboradores</h2>
        <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className='bg-blue-600 text-white'>
          <tr>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">RUT</th>
            <th className="py-2 px-4 text-left">Especialidad</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.length > 0 ? (
            colaboradores.map((colaborador) => (
              <tr key={colaborador.id} className="border-t text-gray-800">
                <td className="py-2 px-4">{colaborador.name}</td>
                <td className="py-2 px-4">{colaborador.rut}</td>
                <td className="py-2 px-4">{colaborador.especialidad}</td>
                <td className="py-2 px-4 flex justify-center space-x-2">
                  <button
                    onClick={() => handleInfo(colaborador.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    Ver Información
                  </button>
                  <button
                    onClick={() => handleEdit(colaborador.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(colaborador.id)}
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
                No hay colaboradores registrados.
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
          {selectedColaborador && !isEditMode && !isDeleteMode && (
            <>
              <h3 className="font-bold text-lg">Información del Colaborador</h3>
              <p className="py-4">Nombre: {selectedColaborador.name}</p>
              <p className="py-4">RUT: {selectedColaborador.rut}</p>
              <p className="py-4">Especialidad: {selectedColaborador.especialidad}</p>
              <div className="modal-action">
                <button className="btn btn-outline" onClick={closeModal}>Cerrar</button>
              </div>
            </>
          )}

          {selectedColaborador && isEditMode && (
            <>
              <h3 className="font-bold text-lg">Editar Colaborador</h3>
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="Nombre"
                value={selectedColaborador.name}
                onChange={(e) => setSelectedColaborador({ ...selectedColaborador, name: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="RUT"
                value={selectedColaborador.rut}
                onChange={(e) => setSelectedColaborador({ ...selectedColaborador, rut: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="Especialidad"
                value={selectedColaborador.especialidad}
                onChange={(e) => setSelectedColaborador({ ...selectedColaborador, especialidad: e.target.value })}
              />
              <div className="modal-action">
                <button className="btn btn-outline" onClick={handleEditSubmit}>Guardar</button>
                <button className="btn btn-outline" onClick={closeModal}>Cancelar</button>
              </div>
            </>
          )}

          {selectedColaborador && isDeleteMode && (
            <>
              <h3 className="font-bold text-lg">Confirmar Eliminación</h3>
              <p className="py-4">¿Estás seguro que deseas eliminar a {selectedColaborador.name}?</p>
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

export default AdministradorColab;
