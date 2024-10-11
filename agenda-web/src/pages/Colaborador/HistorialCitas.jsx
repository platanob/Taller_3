// HistorialCitas.js
import React, { useState } from 'react';

function HistorialCitas() {
  const [citas] = useState([
    { fecha: '2024-09-17', cliente: 'Rodrigo Caro', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '10:00 AM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-18', cliente: 'María Pérez', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '12:00 PM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-19', cliente: 'Juan García', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '3:00 PM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-20', cliente: 'Carla Silva', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '9:00 AM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-21', cliente: 'Pedro López', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '11:00 AM', colaborador: 'Francisca Peluca' },
    { fecha: '2024-09-22', cliente: 'Ana Torres', servicio: 'Peluquería', locacion: 'Peluquería Unisex', hora: '2:00 PM', colaborador: 'Francisca Peluca' }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 py-10"
    style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
      }}>
    <div className="max-w-5xl mx-auto bg-blue-200 shadow-md rounded-lg p-6">
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">Historial de Citas</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="w-full bg-blue-200 shadow-md rounded-lg p-6 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Fecha</th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-left">Servicio</th>
              <th className="py-3 px-6 text-left">Locación</th>
              <th className="py-3 px-6 text-left">Hora</th>
              <th className="py-3 px-6 text-left">Colaborador</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {citas.map((cita, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{cita.fecha}</td>
                <td className="py-3 px-6 text-left">{cita.cliente}</td>
                <td className="py-3 px-6 text-left">{cita.servicio}</td>
                <td className="py-3 px-6 text-left">{cita.locacion}</td>
                <td className="py-3 px-6 text-left">{cita.hora}</td>
                <td className="py-3 px-6 text-left">{cita.colaborador}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  </div>  
  );
}

export default HistorialCitas;

