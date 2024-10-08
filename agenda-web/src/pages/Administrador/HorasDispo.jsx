import React from 'react';

function HorasDisponibles() {
  const citas = [
    { fecha: '2024-09-17', servicio: 'Terapia física', locacion: 'Clínica norte' },
    { fecha: '2024-09-17', servicio: 'Podología', locacion: 'Clínica norte' },
    { fecha: '2024-09-18', servicio: 'Odontología', locacion: 'Clínica central' },
    { fecha: '2024-09-19', servicio: 'Psicología', locacion: 'Clínica este' },
    { fecha: '2024-09-20', servicio: 'Nutrición', locacion: 'Clínica sur' },
    { fecha: '2024-09-21', servicio: 'Control médico', locacion: 'Hospital Temuco' },
  ];

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
              <button className="bg-white text-black font-bold py-2 text-center shadow rounded-md">Información</button>
              <button className="bg-white text-black font-bold py-2 text-center shadow rounded-md">Editar</button>
              <button className="bg-white text-black font-bold py-2 text-center shadow rounded-md">Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HorasDisponibles;
