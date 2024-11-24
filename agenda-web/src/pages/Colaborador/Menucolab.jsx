import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRightFromBracket } from 'react-icons/fa6';

function Menu() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('https://taller-3.onrender.com/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        credentials: 'include' 
      });

      if (response.ok) {
        localStorage.removeItem('token'); 
        alert('Has cerrado sesión con éxito.');
        navigate('/'); 
      } else {
        const errorData = await response.json();
        alert(`Error al cerrar sesión: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un error al cerrar sesión.');
    }
  };

  return (
    <nav className="flex justify-between items-center bg-[#d6e2e5] p-4 shadow-md">
      <div className="flex items-center">
        <img src="/img/logo_muni.jpg" alt="muni logo" className="w-15 h-10 mr-5" />
        <span className="text-2xl font-bold text-[#005baa]">Agenda Senior</span>
      </div>
      <div className="flex space-x-6">
        <Link to="" className="text-[#005baa] font-medium hover:text-[#00cfff]">Calendario</Link>
        <Link to="crear-citas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Crear Citas</Link>
        <Link to="Aceptar-Citas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Aceptar citas</Link>
        <Link to="Citas-realizadas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Citas Realizadas</Link>
        <Link to="Historial-citas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Historial</Link>

      </div>
      <div className="flex space-x-4">
      <button 
          className="flex items-center space-x-2 bg-[#005baa] text-white px-5 py-2 rounded-full hover:opacity-90"
          onClick={handleLogout}
        >
          <FaArrowRightFromBracket /> <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
}

export default Menu;
