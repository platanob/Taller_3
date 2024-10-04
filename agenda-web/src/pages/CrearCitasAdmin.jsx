import React from 'react';

const CrearCitasAdm = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Crear nueva cita</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input type="date" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hora</label>
            <input type="time" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Locación</label>
            <input type="text" placeholder="Ej: Oficina 3A" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Servicio</label>
            <input type="text" placeholder="Ej: Consulta Medica" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del colaborador</label>
            <input type="text" placeholder="Ej: Juan Pérez" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded-md shadow hover:bg-blue-800 transition duration-200">
            Crear cita
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearCitasAdm;
