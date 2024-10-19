import React from "react";

const Preloader = () => {
  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-cover bg-center" 
         style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url("/img/fondo.jpg")' }}>
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      
      <div className="z-10 text-center">
        <div className="mb-4">
          {/* Rueda giratoria */}
          <div className="border-t-4 border-b-4 border-t-blue-500 border-b-green-500 rounded-full w-16 h-16 animate-spin mx-auto"></div>
        </div>
        
        
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Preparando la mejor experiencia para ti
        </h1>
        <p className="text-lg lg:text-xl text-white opacity-80">
          Un momento, por favor... Estamos cargando la Información.
        </p>
      </div>
      
      {/* Optional Footer */}
      <div className="absolute bottom-4 text-center text-white text-sm lg:text-base opacity-75">
        <p>Agenda de Servicios Públicos para Adultos Mayores</p>
      </div>
    </div>
  );
};

export default Preloader;
