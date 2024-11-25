import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearCitasColab = () => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [formData, setFormData] = useState({
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    intervalo: '',
    locacion: '',
    servicio: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) {
      setError('No se pudo obtener los datos del colaborador.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://taller-3.onrender.com/api/nuevashoras_colab', {
        ...formData,
        colaborador: usuario._id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensaje('Citas creadas exitosamente');
    } catch (err) {
      console.error(err.response);
      setMensaje(err.response?.data?.error || 'Error al crear las citas.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="max-w-3xl mx-auto bg-blue-200 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">CREAR UNA NUEVA CITA</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">FECHA</label>
            <input
              type="date"
              name="fecha"
              className="mt-1 bg-gray-700 text-white px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">HORA INICIO</label>
            <input
              type="time"
              name="hora_inicio"
              className="mt-1 bg-gray-700 text-white px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.hora_inicio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">HORA FIN</label>
            <input
              type="time"
              name="hora_fin"
              className="mt-1 bg-gray-700 text-white px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.hora_fin}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">INTERVALO (minutos)</label>
            <select
              name="intervalo"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.intervalo}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Selecciona un intervalo</option>
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">60 minutos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LOCACIÓN</label>
            <input
              type="text"
              name="locacion"
              placeholder="Ej: Oficina 3A"
              className="mt-1 bg-white block text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.locacion}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md shadow hover:bg-blue-800 transition duration-200"
          >
            Crear cita
          </button>
        </form>
        {mensaje && (
          <div className={`mt-4 p-2 rounded ${mensaje.includes('exitosamente') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default CrearCitasColab;
