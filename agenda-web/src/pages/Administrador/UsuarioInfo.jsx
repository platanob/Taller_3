import React from 'react';
import { useParams } from 'react-router-dom';

const UsuarioInfo = () => {
  const { rut, nombre, correo } = useParams(); 

  const usuario = {
    rut: rut,
    nombre: nombre,
    correo: correo,
    archivos: [
      { tipo: 'imagen', nombre: 'imagen1.jpg', url: '/path/to/imagen1.jpg' },
      { tipo: 'imagen', nombre: 'imagen2.jpg', url: '/path/to/imagen2.jpg' },
      { tipo: 'pdf', nombre: 'documento.pdf', url: '/path/to/documento.pdf' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Información del Usuario</h1>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">RUT</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Correo</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t text-gray-800">
              <td className="py-2 px-4">{usuario.rut}</td>
              <td className="py-2 px-4">{usuario.nombre}</td>
              <td className="py-2 px-4">{usuario.correo}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-bold text-blue-800 mt-6">Archivos del Usuario</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {usuario.archivos.map((archivo, index) => (
            <div key={index} className="bg-gray-200 p-4 rounded-md text-center">
              <p className="text-lg">{archivo.nombre}</p>
              {archivo.tipo === 'imagen' ? (
                <img src={archivo.url} alt={archivo.nombre} className="w-full h-32 object-cover" />
              ) : (
                <div>
                  <a href={archivo.url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    Ver PDF
                  </a>
                  <br />
                  <a href={archivo.url} download="nombre_personalizado.pdf" className="text-blue-500 underline">
                    Descargar PDF
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsuarioInfo;
