import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import Preloader from './Espera'; 

const UsuarioInfo = () => {
  const { state } = useLocation();
  const { usuario } = state;

  const [carnetFrontalURL, setCarnetFrontalURL] = useState(null);
  const [carnetTraseroURL, setCarnetTraseroURL] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga

  const obtenerArchivoURL = async (id) => {
    const token = localStorage.getItem('token'); 
    try {
      const response = await fetch(`http://localhost:5000/api/obtener_archivo/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        console.error(`Error ${response.status} al obtener archivo: ${id}`);
        return null;
      }

      const blob = await response.blob();  
      return URL.createObjectURL(blob);  
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      return null;
    }
  };

  useEffect(() => {
    const cargarArchivos = async () => {
      const frontal = await obtenerArchivoURL(usuario.carnet_frontal_id);
      const trasero = await obtenerArchivoURL(usuario.carnet_trasero_id);
      const pdf = await obtenerArchivoURL(usuario.pdf_id);

      setCarnetFrontalURL(frontal);
      setCarnetTraseroURL(trasero);
      setPdfURL(pdf);
      setIsLoading(false); // Terminar la carga cuando se hayan obtenido los archivos
    };

    cargarArchivos();
  }, [usuario]);

  const handlePdfClick = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/obtener_archivo/${usuario.pdf_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`Error ${response.status} al obtener PDF: ${usuario.pdf_id}`);
        return;
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl);
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  };
  // Mostrar el preloader mientras se están cargando los datos
  if (isLoading) {
    return <Preloader />;
  }
  return (
    <div className="min-h-screen bg-gray-100 py-10" style={{ backgroundImage: 'url("/img/fondo.jpg")' }}>
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Información del Usuario
          </h1>

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
            <div className="bg-gray-200 p-1 rounded-md text-center">
              <div className="w-128 h-40"> {/* Ancho y alto */}
                {carnetFrontalURL ? (
                  <img src={carnetFrontalURL} alt="Carnet Frontal" className="w-full h-full object-fill rounded-md" />
                ) : (
                  <p>No disponible</p>
                )}
              </div>
            </div>
            <div className="bg-gray-200 p-1 rounded-md text-center">
              <div className="w-128 h-40"> {/* Ancho y alto */}
                {carnetTraseroURL ? (
                  <img src={carnetTraseroURL} alt="Carnet Trasero" className="w-full h-full object-fill rounded-md" />
                ) : (
                  <p>No disponible</p>
                )}
              </div>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-md flex items-center justify-center flex-col">
              <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-5xl mb-4" />
              <button
                onClick={handlePdfClick}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg shadow hover:shadow-lg transition duration-300"
              >
                Ver PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioInfo;
