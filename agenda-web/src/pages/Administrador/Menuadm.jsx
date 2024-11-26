import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function Menu2() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('https://taller-3.onrender.com/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('token');

        // SweetAlert2 para éxito
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión con éxito.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate('/'); // Navegar al inicio después de la alerta
        });
      } else {
        const errorData = await response.json();

        // SweetAlert2 para error del servidor
        Swal.fire({
          icon: 'error',
          title: 'Error al cerrar sesión',
          text: errorData.message || 'Algo salió mal.',
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);

      // SweetAlert2 para error general
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.',
      });
    }
  };

  return (
    <nav className="flex justify-between items-center bg-[#d6e2e5] p-4 shadow-md">
      <div className="flex items-center">
        <img src="/img/logo_muni.jpg" alt="muni logo" className="w-15 h-10 mr-5" />
      </div>
      <div className="flex space-x-6">
        <Link to="" className="text-[#005baa] font-medium hover:text-[#00cfff]">Calendario</Link>
        <Link to="administrar-colaboradores" className="text-[#005baa] font-medium hover:text-[#00cfff]">Administrar Colaboradores</Link>
        <Link to="administrar-usuarios" className="text-[#005baa] font-medium hover:text-[#00cfff]">Administrar Usuarios</Link>
        <Link to="admision-usuarios" className="text-[#005baa] font-medium hover:text-[#00cfff]">Admision Usuarios</Link>
        <Link to="crear-citas-administradores" className="text-[#005baa] font-medium hover:text-[#00cfff]">Crear Citas</Link> 
        <Link to="visualizar-graficos" className="text-[#005baa] font-medium hover:text-[#00cfff]">Visualizar Graficos</Link>
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

export default Menu2;
