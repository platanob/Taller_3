import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No estás autenticado.');
          return;
        }

        const response = await axios.get('https://taller-3.onrender.com/api/colaborador_info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(response.data);
      } catch (err) {
        console.error(err.response);
        setError(err.response?.data?.error || 'Error al obtener la información del usuario.');
      }
    };

    fetchUsuario();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  }

  if (!usuario) {
    return <div className="text-center text-gray-700 mt-6">Cargando...</div>;
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
      <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-800 p-6 text-white text-center">
          <h1 className="text-4xl font-bold">Perfil del Usuario</h1>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <img
                src="https://via.placeholder.com/150"
                alt="User Avatar"
                className="rounded-full"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{usuario.nombre}</h2>
              <p className="text-sm text-gray-500">{usuario._id}</p>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-4 space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">RUT:</span> {usuario.rut}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Correo:</span> {usuario.correo}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Especialidad:</span> {usuario.especialidad}
            </p>
          </div>
        </div>
        <div className="bg-gray-100 p-4 text-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => alert('oficinas del coalaborador próximamente')}
          >
            Mis Oficinas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
