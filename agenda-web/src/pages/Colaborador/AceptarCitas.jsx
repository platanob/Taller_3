import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Aceptarcitas = () => {
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
        console.error(err.response); // Registra el error completo en la consola
        setError(err.response?.data?.error || 'Error al obtener la información del usuario.');
      }
    };

    fetchUsuario();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Perfil del Usuario</h1>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>RUT:</strong> {usuario.rut}</p>
      <p><strong>ID: </strong> {usuario._id} </p>
    </div>
  );
};

export default Aceptarcitas;
