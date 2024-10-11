import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const AdmisionUsuarios = () => {
  const navigate = useNavigate(); 
  const usuarios = [
    { rut: '12345678-9', nombre: 'Juan Pérez', correo: 'juan.perez@example.com' },
    { rut: '87654321-0', nombre: 'María González', correo: 'maria.gonzalez@example.com' },
    { rut: '12264772-4', nombre: 'Jose Martinez', correo: 'jose.martinez@example.com' },
  ];

  const InfoClick = (rut, nombre, correo) => {
    navigate(`/usuario/${rut}/${nombre}/${correo}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="max-w-5xl mx-auto bg-blue-200 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Admisión de Usuarios Nuevos</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">RUT</th>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Correo</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={index} className="border-t text-gray-800">
                  <td className="py-2 px-4 ">{usuario.rut}</td>
                  <td className="py-2 px-4">{usuario.nombre}</td>
                  <td className="py-2 px-4">{usuario.correo}</td>
                  <td className="py-2 px-4 flex justify-center space-x-2">
                    <button 
                      onClick={() => InfoClick(usuario.rut, usuario.nombre, usuario.correo)} 
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition">
                      Información
                    </button>
                    <button className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition">
                      Aceptar
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdmisionUsuarios;
