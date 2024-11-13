import React, { useState } from 'react';

const CrearCitasAdm = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [locacion, setLocacion] = useState('');
  const [servicio, setServicio] = useState('');
  const [colaborador, setColaborador] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [servicios] = useState(['Psicología', 'Peluquería', 'Consulta Médica']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaCita = { fecha, hora, locacion, servicio, colaborador };

    try {
      const response = await fetch('http://localhost:5000/api/nuevashoras_admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(nuevaCita)
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje('Cita creada con éxito!');
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
    <div className="min-h-screen bg-gray-100 py-10" style={{
      backgroundImage: 'url("/img/fondo.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="max-w-3xl mx-auto bg-blue-200 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">CREAR UNA NUEVA CITA</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Selector de fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">FECHA</label>
            <input
              type="date"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          {/* Selector de hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700">HORA</label>
            <select
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            >
              <option value="">Selecciona una hora</option>
              {Array.from({ length: 24 }, (_, i) => i).flatMap(hour => (
                ['00', '30'].map(minute => (
                  <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
                    {`${hour.toString().padStart(2, '0')}:${minute}`}
                  </option>
                ))
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">LOCACIÓN</label>
            <input
              type="text"
              placeholder="Ej: Oficina 3A"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              value={locacion}
              onChange={(e) => setLocacion(e.target.value)}
            />
          </div>

          {/* Selector de servicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">SERVICIO</label>
            <select
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((srv, index) => (
                <option key={index} value={srv}>{srv}</option>
              ))}
            </select>
          </div>

          {/* Campo de texto para colaborador */}
          <div>
            <label className="block text-sm font-medium text-gray-700">NOMBRE DEL COLABORADOR</label>
            <input
              type="text"
              placeholder="Ingresa el nombre del colaborador"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
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
