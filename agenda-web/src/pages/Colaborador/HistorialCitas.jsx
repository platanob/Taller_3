import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No estás autenticado.');
          return;
        }

        const response = await axios.get('https://taller-3.onrender.com/api/citas_todas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCitas(response.data.citas);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al obtener las citas.');
      }
    };

    fetchCitas();
  }, []);

  const borrarCita = async (citaId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado.');
        return;
      }

      const response = await axios.delete(`https://taller-3.onrender.com/api/borrarcita/${citaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setCitas(citas.filter((cita) => cita._id !== citaId)); // Actualiza la lista eliminando la cita
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error al borrar la cita.');
    }
  };

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <div
      className="min-h-screen bg-gray-100 py-10"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-5xl mx-auto bg-blue-200 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Historial de Citas</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr className="w-full bg-blue-200 shadow-md rounded-lg p-6 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-2 px-4 text-left">Fecha</th>
                <th className="py-2 px-4 text-left">Hora</th>
                <th className="py-2 px-4 text-left">Cliente</th>
                <th className="py-2 px-4 text-left">Servicio</th>
                <th className="py-2 px-4 text-left">Locación</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {citas.length > 0 ? (
                citas.map((cita, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-2 px-4">{cita.fecha}</td>
                    <td className="py-2 px-4">{cita.hora}</td>
                    <td className="py-2 px-4">{cita.cliente}</td>
                    <td className="py-2 px-4">{cita.servicio}</td>
                    <td className="py-2 px-4">{cita.locacion}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => borrarCita(cita._id)}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No se encontraron citas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MisCitas;
