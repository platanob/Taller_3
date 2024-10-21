import React, { useState } from 'react';

const CrearCitasAdm = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [locacion, setLocacion] = useState('');
  const [servicio, setServicio] = useState('');
  const [colaborador, setColaborador] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaCita = {
      fecha,
      hora,
      locacion,
      servicio,
      colaborador
    };

    try {
      const response = await fetch('http://localhost:5000/api/nuevashoras_admin', {  // Cambia la URL si usas otro puerto
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas JWT para autenticar
        },
        body: JSON.stringify(nuevaCita)
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje('Cita creada con éxito!');
        // Limpia el formulario después de enviar la cita con éxito
        setFecha('');
        setHora('');
        setLocacion('');
        setServicio('');
        setColaborador('');
      } else {
        setMensaje(data.error || 'Error al crear la cita');
      }
    } catch (error) {
      setMensaje('Error al conectar con el servidor');
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
              type="text"
              placeholder='Ej: 2024-09-16'
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">HORA</label>
            <input
              type="text"
              placeholder='Ej: 11:00 AM'
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">LOCACIÓN</label>
            <input
              type="text"
              placeholder="Ej: Oficina 3A"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={locacion}
              onChange={(e) => setLocacion(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SERVICIO</label>
            <input
              type="text"
              placeholder="Ej: Consulta Médica"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NOMBRE DEL COLABORADOR</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={colaborador}
              onChange={(e) => setColaborador(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md shadow hover:bg-blue-800 transition duration-200">
            Crear cita
          </button>
        </form>

        {mensaje && (
          <div className="mt-4 text-center text-red-500">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearCitasAdm;
