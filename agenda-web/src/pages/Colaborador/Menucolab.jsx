import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de tener el token almacenado en localStorage
        },
        credentials: 'include' // Esto permite que se envíen cookies si es necesario
      });

      if (response.ok) {
        localStorage.removeItem('token'); // Elimina el token del localStorage
        alert('Has cerrado sesión con éxito.');
        navigate('/'); // Redirige al usuario a la página de inicio
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
        <Link to="" className="text-[#005baa] font-medium hover:text-[#00cfff]">Inicio</Link>
        <Link to="crear-citas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Crear Citas</Link>
        <Link to="historial-citas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Historial de Citas</Link>
        <Link to="Horas-agendadas" className="text-[#005baa] font-medium hover:text-[#00cfff]">Horas Agendadas</Link>
      </div>
      <div className="flex space-x-4">
        <button 
          className="px-5 py-2 bg-[#005baa] text-white rounded-full hover:opacity-90"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Menu;
