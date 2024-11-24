import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CrearCitasAdm = () => {
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [locacion, setLocacion] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [colaborador, setColaborador] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [colaboradores, setColaboradores] = useState({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchColaboradores();
  }, []);

  const fetchColaboradores = async () => {
    try {
      const response = await fetch('https://taller-3.onrender.com/api/usuarios_por_especialidad', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setColaboradores(data);
      setEspecialidades(Object.keys(data));
    } catch (error) {
      console.error('Error al obtener colaboradores:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaCita = {
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      intervalo,
      locacion,
      servicio: especialidad,
      colaborador,
    };

    try {
      const response = await fetch('https://taller-3.onrender.com/api/nuevashoras_admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(nuevaCita),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire('Éxito', 'Citas creadas con éxito!', 'success');
        setFecha('');
        setHoraInicio('');
        setHoraFin('');
        setIntervalo('');
        setLocacion('');
        setEspecialidad('');
        setColaborador('');
      } else {
        setMensaje(data.error || 'Error al crear las citas');
      }
    } catch (error) {
      setMensaje('Error al conectar con el servidor');
    }
  };

  const colaboradoresPorEspecialidad = especialidad ? colaboradores[especialidad] || [] : [];


  return (
    <div className="min-h-screen bg-gray-100 py-10" style={{
      backgroundImage: 'url("/img/fondo.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="max-w-3xl mx-auto bg-blue-200 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">CREAR NUEVAS CITAS</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">FECHA</label>
            <input
              type="date"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          {/* Hora de Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">HORA DE INICIO</label>
            <input
              type="time"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            />
          </div>

          {/* Hora de Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700">HORA DE FIN</label>
            <input
              type="time"
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
            />
          </div>

          {/* Intervalo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">INTERVALO (Minutos)</label>
            <select
              className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              value={intervalo}
              onChange={(e) => setIntervalo(e.target.value)}
            >
              <option value="">Selecciona un intervalo</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">60 minutos</option>
            </select>
          </div>


          {/* Locación */}
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

          {/* Servicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">SERVICIO</label>
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Selecciona una especialidad</option>
                {especialidades.map((esp, index) => (
                  <option key={index} value={esp}>{esp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">COLABORADOR</label>
              <select
                value={colaborador}
                onChange={(e) => setColaborador(e.target.value)}
                className="mt-1 bg-white text-black block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                disabled={!especialidad}
              >
                <option value="">Selecciona un colaborador</option>
                {colaboradoresPorEspecialidad.map((col, index) => (
                  <option key={index} value={col.rut}>{col.nombre}</option>
                ))}
              </select>
            </div>


          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md shadow hover:bg-blue-800 transition duration-200">
            Crear citas
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
