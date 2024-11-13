// HistorialCitas.js
import React, { useState } from 'react';
import Swal from 'sweetalert2';

function CitasRealizadas() {
  const [citas] = useState([
    { fecha: '2024-09-18', cliente: 'Rodrigo Caro', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '10:00 AM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-18', cliente: 'María Pérez', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '12:00 PM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-18', cliente: 'Juan García', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '3:00 PM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-19', cliente: 'Carla Silva', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '9:00 AM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-19', cliente: 'Pedro López', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '11:00 AM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-19', cliente: 'Ana Torres', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '2:00 PM', colaborador: 'Francisca Peluca' }
  ]);

  const [activeDate, setActiveDate] = useState(null);

  const handleToggle = (fecha) => {
    setActiveDate((prevFecha) => (prevFecha === fecha ? null : fecha));
  };

  const handleYesAsist = (index) => {
    Swal.fire({
      icon: 'success',
      title: 'Asistencia Confirmada',
      text: `La cita con ${citas[index].cliente} fue confirmada.`,
      confirmButtonColor: '#3085d6'
    });
  };

  const handleNoAsist = (index) => {
    Swal.fire({
      icon: 'warning',
      title: 'No asistió',
      text: `El cliente ${citas[index].cliente} no asistió a su cita.`,
      confirmButtonColor: '#FFA500'
    });
  };

  const handleCancel = (index) => {
    Swal.fire({
      icon: 'error',
      title: 'Cita Cancelada',
      text: `La cita con ${citas[index].cliente} ha sido cancelada.`,
      confirmButtonColor: '#d33'
    });
  };

  const citasPorFecha = citas.reduce((acc, cita) => {
    acc[cita.fecha] = acc[cita.fecha] || [];
    acc[cita.fecha].push(cita);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 py-10"
    style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
      }}>
      <div className="max-w-5xl mx-auto bg-blue-200 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Citas Realizadas</h1>
        {Object.keys(citasPorFecha).map((fecha) => (
          <div key={fecha} className="collapse bg-base-200 mb-4">
            <input
              type="radio"
              name="accordion"
              checked={activeDate === fecha}
              onChange={() => handleToggle(fecha)}
            />
            <div className="collapse-title text-xl font-medium cursor-pointer">
              {fecha}
            </div>
            {activeDate === fecha && (
              <div className="collapse-content overflow-x-auto bg-white border border-gray-200 rounded-md mt-2">
                <table className="min-w-full">
                  <thead className='bg-blue-600 text-white'>
                    <tr className="text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-2 px-4 text-left">Cliente</th>
                      <th className="py-2 px-4 text-left">Servicio</th>
                      <th className="py-2 px-4 text-left">Locación</th>
                      <th className="py-2 px-4 text-left">Hora</th>
                      <th className="py-2 px-4 text-left">Colaborador</th>
                      <th className='py-2 px-4 text-left'>Asistencia</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {citasPorFecha[fecha].map((cita, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-2 px-4">{cita.cliente}</td>
                        <td className="py-2 px-4">{cita.servicio}</td>
                        <td className="py-2 px-4">{cita.locacion}</td>
                        <td className="py-2 px-4">{cita.hora}</td>
                        <td className="py-2 px-4">{cita.colaborador}</td>
                        <td className="py-2 px-4 flex space-x-2">
                          <button
                            onClick={() => handleYesAsist(index)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                          >
                            Si Asistió
                          </button>
                          <button
                            onClick={() => handleNoAsist(index)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                          >
                            No Asistió
                          </button>
                          <button
                            onClick={() => handleCancel(index)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                          >
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div> 
  );
}

export default CitasRealizadas;
