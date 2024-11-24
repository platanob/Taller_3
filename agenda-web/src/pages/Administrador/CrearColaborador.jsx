import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CrearColaborador = () => {
  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    especialidad: '',
    nuevaEspecialidad: '', 
  });
  const [especialidades, setEspecialidades] = useState([]); 

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEspecialidadChange = (e) => {
    setForm({ ...form, especialidad: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de los campos a ingresar

    if (form.contrasena !== form.confirmarContrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
      });
      return;
    }

    const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/;
    if (!rutRegex.test(form.rut)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El RUT no tiene un formato válido',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.correo)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, ingresa un correo válido',
        });
        return;
      }

    const nuevoColaborador = {
      nombre: form.nombre,
      rut: form.rut,
      correo: form.correo,
      contrasena: form.contrasena,
      especialidad: form.especialidad === "Otro" ? form.nuevaEspecialidad : form.especialidad, 
    };

    try {
      const response = await fetch('https://taller-3.onrender.com/api/crear_colaborador', {
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

  useEffect(() => {
    // Obtener las especialidades existentes desde la API (puedes adaptar esta parte según tu estructura)
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch('https://taller-3.onrender.com/api/usuarios_por_especialidad', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setEspecialidades(Object.keys(data)); // Asumiendo que las especialidades son las claves
      } catch (error) {
        console.error("Error al obtener especialidades", error);
      }
    };
    fetchEspecialidades();
  }, []);

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
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="text"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className="mt-1 text-gray-700 bg-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Correo Electronico"
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
            <select
              name="especialidad"
              value={form.especialidad}
              onChange={handleEspecialidadChange}
              className="mt-1 text-gray-700 bg-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione una especialidad</option>
              {especialidades.map((especialidad, index) => (
                <option key={index} value={especialidad}>{especialidad}</option>
              ))}
              <option value="Otro">Otro</option>
            </select>
          </div>

          {form.especialidad === "Otro" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ingrese la nueva especialidad
              </label>
              <input
                type="text"
                name="nuevaEspecialidad"
                value={form.nuevaEspecialidad}
                onChange={handleChange}
                className="mt-1 text-gray-700 bg-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nueva Especialidad"
              />
            </div>
          )}

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
