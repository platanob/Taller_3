import React, { useState } from 'react';

function HorasDisponibles() {
  const [citas, setCitas] = useState([
    { fecha: '2024-09-17', servicio: 'Terapia física', locacion: 'Clínica norte', hora: '10:00 AM', colaborador: 'Dr. Perez' },
    { fecha: '2024-09-17', servicio: 'Podología', locacion: 'Clínica norte', hora: '10:00 AM', colaborador: 'Dr. Perez' },
    { fecha: '2024-09-18', servicio: 'Odontología', locacion: 'Clínica central', hora: '10:00 AM', colaborador: 'Dr. Perez' },
    { fecha: '2024-09-19', servicio: 'Psicología', locacion: 'Clínica este', hora: '10:00 AM', colaborador: 'Dr. Perez' },
    { fecha: '2024-09-20', servicio: 'Nutrición', locacion: 'Clínica sur', hora: '10:00 AM', colaborador: 'Dr. Perez' },
    { fecha: '2024-09-21', servicio: 'Control médico', locacion: 'Hospital Temuco', hora: '10:00 AM', colaborador: 'Dr. Perez' },
  ]);

  const [selectedCita, setSelectedCita] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // Función para mostrar información de la cita
  const handleInfo = (index) => {
    setSelectedCita(citas[index]);
    document.getElementById('info_modal').showModal();
  };

  // Función para editar una cita
  const handleEdit = (index) => {
    setSelectedCita({ ...citas[index], index });
    setIsEditMode(true);
    document.getElementById('info_modal').showModal();
  };

  const handleEditSubmit = () => {
    const updatedCitas = citas.map((cita, i) =>
      i === selectedCita.index ? { ...selectedCita } : cita
    );
    setCitas(updatedCitas);
    closeModal();
  };

  // Función para eliminar una cita
  const handleDelete = (index) => {
    setSelectedCita(citas[index]);
    setIsDeleteMode(true);
    document.getElementById('info_modal').showModal();
  };

  const handleDeleteConfirm = () => {
    const updatedCitas = citas.filter((_, i) => i !== selectedCita.index);
    setCitas(updatedCitas);
    closeModal();
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedCita(null);
    setIsEditMode(false);
    setIsDeleteMode(false);
    document.getElementById('info_modal').close();
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
      <div className="bg-black bg-opacity-50 p-4 rounded-md mb-10">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Citas Disponibles</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {citas.map((cita, index) => (
          <div
            key={index}
            className="bg-blue-200 rounded-lg p-5 w-64 shadow-md flex flex-col"
          >
            <div className="flex justify-between w-full mb-2">
              <p className="text-sm font-bold text-black">{cita.fecha}</p>
              <p className="text-red-500 font-semibold truncate max-w-[8rem] text-right">
                {cita.locacion}
              </p>
            </div>
            <p className="text-md text-black mb-1">{cita.servicio}</p>

            <div className="mt-4 flex flex-col space-y-2 w-full">
              <button
                className="bg-white text-black font-bold py-2 text-center shadow rounded-md"
                onClick={() => handleInfo(index)}
              >
                Información
              </button>
              <button
                className="bg-white text-black font-bold py-2 text-center shadow rounded-md"
                onClick={() => handleEdit(index)}
              >
                Editar
              </button>
              <button
                className="bg-white text-black font-bold py-2 text-center shadow rounded-md"
                onClick={() => handleDelete(index)}
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <dialog id="info_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          {selectedCita && !isEditMode && !isDeleteMode && (
            <>
              <h3 className="font-bold text-lg">Información de la Cita</h3>
              <p className="py-4">Fecha: {selectedCita.fecha}</p>
              <p className="py-4">Servicio: {selectedCita.servicio}</p>
              <p className="py-4">Locación: {selectedCita.locacion}</p>
              <p className="py-4">Hora: {selectedCita.hora}</p>
              <p className="py-4">Colaborador: {selectedCita.colaborador}</p>
              <div className="modal-action">
                <button className="btn btn-outline" onClick={closeModal}>Cerrar</button>
              </div>
            </>
          )}

          {selectedCita && isEditMode && (
            <>
              <h3 className="font-bold text-lg">Editar Cita</h3>
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="Fecha"
                value={selectedCita.fecha}
                onChange={(e) => setSelectedCita({ ...selectedCita, fecha: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="Servicio"
                value={selectedCita.servicio}
                onChange={(e) => setSelectedCita({ ...selectedCita, servicio: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="Locación"
                value={selectedCita.locacion}
                onChange={(e) => setSelectedCita({ ...selectedCita, locacion: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="Hora"
                value={selectedCita.hora}
                onChange={(e) => setSelectedCita({ ...selectedCita, hora: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full my-2"
                placeholder="Colaborador"
                value={selectedCita.colaborador}
                onChange={(e) => setSelectedCita({ ...selectedCita, colaborador: e.target.value })}
              />
              <div className="modal-action">
                <button className="btn btn-outline" onClick={handleEditSubmit}>Guardar</button>
                <button className="btn btn-outline" onClick={closeModal}>Cancelar</button>
              </div>
            </>
          )}

          {selectedCita && isDeleteMode && (
            <>
              <h3 className="font-bold text-lg">Confirmar Eliminación</h3>
              <p className="py-4">¿Estás seguro que deseas eliminar la cita del {selectedCita.fecha} en {selectedCita.locacion} con el {selectedCita.colaborador}?</p>
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
}

export default HorasDisponibles;
