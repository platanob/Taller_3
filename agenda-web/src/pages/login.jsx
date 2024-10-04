import React from 'react';

const Login = () => {

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('/img/fondo.jpg')" }}>
      <div className="bg-yellow-200 bg-opacity-90 p-8 rounded-lg w-4/5 md:w-1/2 lg:w-1/3" style={{ backgroundColor: 'rgba(240, 205, 117, 0.9)' }}>
        <img src="/img/logo_muni.jpg" alt="Logo" className="w-40 h-40 object-contain mb-6 mx-auto" />
        <h1 className="text-3xl font-bold text-center mb-6">Inicio de Sesión</h1>

        <label className="block text-lg font-semibold mb-2">RUT</label>
        <input
          type="text"
          placeholder="RUT"
          className="w-full p-2 mb-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>

        <label className="block text-lg font-semibold mb-2">CONTRASEÑA</label>
        <input
          type="password"
          placeholder="CONTRASEÑA"
          className="w-full p-2 mb-6 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>

        <button
          className="w-full bg-blue-400 text-black font-bold py-2 rounded-lg hover:bg-blue-500 transition duration-300 mb-4">
          INGRESAR
        </button>

        <button
          className="w-full bg-blue-400 text-black font-bold py-2 rounded-lg hover:bg-blue-500 transition duration-300">
          REGISTRO
        </button>
      </div>
    </div>
  );
};

export default Login;
