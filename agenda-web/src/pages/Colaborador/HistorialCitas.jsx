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

        const response = await axios.get('http://localhost:5000/api/citas_colab', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCitas(response.data.citas);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al obtener las citas.');
      }
    };

    fetchCitas();
  }, []);

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
