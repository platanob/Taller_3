import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload  } from '@fortawesome/free-solid-svg-icons';
import Preloader from './Espera';

const UsuarioInfo = () => {
  const { state } = useLocation();
  const { usuario } = state;
  const [carnetFrontalURL, setCarnetFrontalURL] = useState(null);
  const [carnetTraseroURL, setCarnetTraseroURL] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [discapacidadPDFURL, setDiscapacidadPDFURL] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [edad, setEdad] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [scale, setScale] = useState(1); 

  const calcularEdad = (fechaNacimiento) => {
    const [dia, mes, año] = fechaNacimiento.split('-').map(Number);
    const fechaNacimientoDate = new Date(año, mes - 1, dia);
    const hoy = new Date();
    let edadCalculada = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNacimientoDate.getMonth();
    if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimientoDate.getDate())) {
      edadCalculada--;
    }
    return edadCalculada;
  };

  const obtenerArchivoURL = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://taller-3.onrender.com/api/obtener_archivo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      if (usuario.discapacidad && usuario.carnet_discapacidad_id) {
        const discapacidadPDF = await obtenerArchivoURL(usuario.carnet_discapacidad_id);
        setDiscapacidadPDFURL(discapacidadPDF);
      }
      setIsLoading(false);
    };

    if (usuario.fechaNacimiento) {
      setEdad(calcularEdad(usuario.fechaNacimiento));
    }

    cargarArchivos();
  }, [usuario]);

  const handlePdfClick = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://taller-3.onrender.com/api/obtener_archivo/${usuario.pdf_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleDiscapacidadPdfClick = () => {
    if (discapacidadPDFURL) {
      window.open(discapacidadPDFURL);
    }
  };

  const openImageModal = (imageURL) => {
    setSelectedImage(imageURL);
    setScale(1);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setScale(1);
  };

  const increaseScale = () => {
    const maxScale = 2; 
    if (scale < maxScale) {
      setScale(scale + 0.5); 
    } else {
      setScale(1); 
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10" style={{ backgroundImage: 'url("/img/fondo.jpg")' }}>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Información del Usuario</h1>

        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">RUT</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Edad</th>
              <th className="py-2 px-4 text-left">Correo</th>
              <th className="py-2 px-4 text-left">Sector</th>
              <th className="py-2 px-4 text-center">Discapacidad</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t text-gray-800">
              <td className="py-2 px-2">{usuario.rut}</td>
              <td className="py-2 px-4">{usuario.nombre}</td>
              <td className="py-2 px-5 text-left">{edad}</td>
              <td className="py-2 px-4">{usuario.correo}</td>
              <td className="py-2 px-4">{usuario.localidad}</td>
              <td className="py-2 px-4 text-center">{usuario.discapacidad ? 'Sí' : 'No'}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-bold text-blue-800 mt-6 text-center">Archivos del Usuario</h2>
        <div className={`mt-3 grid ${usuario.discapacidad ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'} gap-4`}>
          <div
            className="bg-gray-200 p-1 rounded-md text-center cursor-pointer relative group" // Añadimos el grupo para el hover
            onClick={() => openImageModal(carnetFrontalURL)}
          >
            <div className="w-full h-40">
              {carnetFrontalURL ? (
                <img
                  src={carnetFrontalURL}
                  alt="Carnet Frontal"
                  className="w-full h-full object-fill rounded-md"
                />
              ) : (
                <p>No disponible</p>
              )}

              {/* Botón de descarga */}
              <a
                href={carnetFrontalURL}
                download
                className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <FontAwesomeIcon icon={faDownload} className="text-white text-xl" />
              </a>
            </div>
          </div>
          <div
            className="bg-gray-200 p-1 rounded-md text-center cursor-pointer relative group" // Añadimos el grupo para el hover
            onClick={() => openImageModal(carnetTraseroURL)}
          >
            <div className="w-full h-40">
              {carnetTraseroURL ? (
                <img
                  src={carnetTraseroURL}
                  alt="Carnet Frontal"
                  className="w-full h-full object-fill rounded-md"
                />
              ) : (
                <p>No disponible</p>
              )}

              {/* Botón de descarga */}
              <a
                href={carnetTraseroURL}
                download
                className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <FontAwesomeIcon icon={faDownload} className="text-white text-xl" />
              </a>
            </div>
          </div>

          <div className="bg-gray-200 p-6 rounded-lg shadow-md flex items-center justify-center flex-col">
            <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-5xl mb-4" />
            <button
              onClick={handlePdfClick}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg shadow hover:shadow-lg transition duration-300"
            >
              Ver Cartola Registro Social
            </button>
          </div>
          {usuario.discapacidad && discapacidadPDFURL && (
            <div className="bg-gray-200 p-6 rounded-lg shadow-md flex items-center justify-center flex-col">
              <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-5xl mb-4" />
              <button
                onClick={handleDiscapacidadPdfClick}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg shadow hover:shadow-lg transition duration-300"
              >
                Ver Documento de Discapacidad
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div
            className="transition-transform duration-300"
            style={{ transform: `scale(${scale})` }} 
            onClick={increaseScale} 
          >
            <img src={selectedImage} alt="Imagen ampliada" className="max-w-full max-h-screen rounded-md" />
          </div>
          <button
            className="absolute top-5 right-5 text-white bg-red-600 p-3 rounded-full shadow-md"
            onClick={closeImageModal}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default UsuarioInfo;
