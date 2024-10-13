import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <nav className="flex justify-between items-center bg-[#d6e2e5] p-4 shadow-md">
      <div className="flex items-center">
        <img src="/img/logo_muni.jpg" alt="muni logo" className="w-15 h-10 mr-5" />
        <span className="text-2xl font-bold text-[#005baa]">Agenda Senior</span>
      </div>
      <div className="flex space-x-6">
        <Link to="" className="text-[#005baa] font-medium hover:text-[#00cfff]">Inicio</Link>
        <Link to="crear-citas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Crear Citas</Link>
        <Link to="historial-citas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Historial de Citas</Link>
        <Link to="Horas-agendadas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Horas Agendadas</Link>
      </div>
      <div className="flex space-x-4">
        <button className="px-5 py-2 bg-[#005baa] text-white rounded-full hover:opacity-90">Cerrar Sesión</button>
      </div>
    </nav>
  );
}

export default Menu;