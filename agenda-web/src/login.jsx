import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const formatRut = (rut) => {
    
    let cleanedRut = rut.replace(/[^0-9kK]/g, '');
  
    if (cleanedRut.length > 1) {
      cleanedRut = cleanedRut.replace(/^(\d{1,2})(\d{3})(\d{3})(\d{1,1})$/, '$1.$2.$3-$4');
    } else if (cleanedRut.length > 4) {
      cleanedRut = cleanedRut.replace(/^(\d{1,2})(\d{3})(\d{1,1})$/, '$1.$2-$3');
    } else if (cleanedRut.length > 1) {
      cleanedRut = cleanedRut.replace(/^(\d{1,2})(\d{1,1})$/, '$1.$2');
    }
  
    return cleanedRut;
  };

  const login = async () => {
    if (!rut || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa tu RUT y contraseña.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    try {
      const response = await fetch('https://taller-3.onrender.com/api/login_web', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rut, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        localStorage.setItem('token', data.token);  
  
        if (data.admin) {
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido Administrador',
            text: 'Éxito: Bienvenido Administrador',
            confirmButtonText: 'Continuar'
          }).then(() => {
            navigate('/admin');  // Redirige a la página de administrador
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido Colaborador',
            text: 'Éxito: Bienvenido Colaborador',
            confirmButtonText: 'Continuar'
          }).then(() => {
            navigate('/colaborador');  // Redirige a la página de colaborador
          });
        }
      } else {
        const errorData = await response.json(); 
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.message || 'Error al iniciar sesión',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema con la conexión.',
        confirmButtonText: 'Aceptar'
      });
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('/img/fondo.jpg')" }}>
      <div className="bg-yellow-200 bg-opacity-90 p-8 rounded-lg w-4/5 md:w-1/2 lg:w-1/3" style={{ backgroundColor: 'rgba(240, 205, 117, 0.9)' }}>
        <img src="/img/logo_muni.jpg" alt="Logo" className="w-40 h-40 object-contain mb-6 mx-auto" />
        <h1 className="text-3xl font-bold text-center mb-6 text-black">Inicio de Sesión</h1>

        <label className="block text-lg font-semibold mb-2 text-black">RUT</label>
        <input
          type="text"
          placeholder="RUT"
          value={rut}
          onChange={(e) => setRut(formatRut(e.target.value))}
          className="w-full text-black p-2 mb-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-lg font-semibold mb-2 text-black">CONTRASEÑA</label>
        <input
          type="password"
          placeholder="CONTRASEÑA"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-black w-full p-2 mb-6 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={login}
          className="w-full bg-blue-400 text-black font-bold py-2 rounded-lg hover:bg-blue-500 transition duration-300 mb-4"
        >
          INGRESAR
        </button>
      </div>
    </div>
  );
};

export default Login;
