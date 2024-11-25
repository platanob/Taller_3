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

        const response = await axios.get('http://localhost:5000/api/colaborador_info', {
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
    return <div className="text-center mt-6">Cargando...</div>;
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
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Perfil del Usuario</h1>
        <div className="space-y-4">
          <p><strong>ID:</strong> {usuario._id}</p>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>RUT:</strong> {usuario.rut}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Especialidad:</strong> {usuario.especialidad}</p>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
