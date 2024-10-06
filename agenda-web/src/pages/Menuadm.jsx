import React from 'react';
import { Link } from 'react-router-dom';

function Menu2() {
  return (
    <nav className="flex justify-between items-center bg-[#d6e2e5] p-4 shadow-md">
      <div className="flex items-center">
        <img src="./assets/img/logo_muni" alt="muni logo" className="w-10 h-10 mr-2" />
        <span className="text-2xl font-bold text-[#005baa]">Agenda Senior</span>
      </div>
      <div className="flex space-x-6">
        <Link to="/" className="text-[#005baa] font-medium hover:text-[#00cfff]">Inicio</Link>
        <Link to="/administrar-colaboradores" className="text-[#005baa] font-medium hover:text-[#00cfff]">Administrar Colab</Link>
        <Link to="/administrar-usuarios" className="text-[#005baa] font-medium hover:text-[#00cfff]">Administrar Usuarios</Link>
        <Link to="/crear-citas-administradores" className="text-[#005baa] font-medium hover:text-[#00cfff]">Crear citas adm</Link> 
      </div>

      <div className="flex space-x-4">
        <button className="px-5 py-2 bg-[#005baa] text-white rounded-full hover:opacity-90">Iniciar Sesión</button>
        <button className="px-5 py-2 bg-[#00cfff] text-white rounded-full hover:opacity-90">Registro</button>
      </div>
    </nav>
  );
}

export default Menu2;
