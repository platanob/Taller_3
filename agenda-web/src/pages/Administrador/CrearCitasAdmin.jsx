import React from 'react';

const CrearCitasAdm = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10"
    style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
      }}>
      <div className="max-w-3xl mx-auto bg-blue-200 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 ">CREAR UNA NUEVA CITA</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">FECHA</label>
            <input type="text" placeholder='Ej: 2024-09-16' className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">HORA</label>
            <input type="text" placeholder='Ej: 11:00 AM' className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LOCACIÓN</label>
            <input type="text" placeholder="Ej: Oficina 3A" className="mt-1 bg-white block text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SERVICIO</label>
            <input type="text" placeholder="Ej: Consulta Medica" className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NOMBRE DEL COLABORADOR</label>
            <input type="text" placeholder="Ej: Juan Pérez" className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
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
