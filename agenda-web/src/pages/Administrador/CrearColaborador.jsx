import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CrearColaborador = () => {
  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    contrasena: '',
    confirmarContrasena: '',
    especialidad: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (form.contrasena !== form.confirmarContrasena) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    const nuevoColaborador = {
      nombre: form.nombre,
      rut: form.rut,
      contrasena: form.contrasena,
      especialidad: form.especialidad,
    };

    try {
      const response = await fetch('http://localhost:5000/api/crear_colaborador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(nuevoColaborador),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('Éxito', '¡Cuenta creada con éxito!', 'success');
        navigate('/admin/administrar-colaboradores'); 
      } else {
        Swal.fire('Error', data.error || 'Error al crear el colaborador', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al conectar con el servidor', 'error');
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 py-10"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-lg mx-auto bg-blue-200 shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Crear Cuenta Colaborador
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="mt-1 text-gray-700 bg-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre Completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">RUT</label>
            <input
              type="text"
              name="rut"
              value={form.rut}
              onChange={handleChange}
              className="mt-1 text-gray-700 bg-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 11.234.234-5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              className="mt-1 text-gray-700 bg-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contraseña"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmarContrasena"
              value={form.confirmarContrasena}
              onChange={handleChange}
              className="mt-1 text-gray-700 bg-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirmar Contraseña"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Especialidad
            </label>
            <input
              type="text"
              name="especialidad"
              value={form.especialidad}
              onChange={handleChange}
              className="mt-1 text-gray-700 bg-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Especialidad"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/administrar-colaboradores')}
              className="px-4 text-white py-2 bg-blue-500 rounded-lg hover:bg-blue-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Crear Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearColaborador;
