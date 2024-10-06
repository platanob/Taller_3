import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import InicioColaborador from "./pages/InicioColab.jsx";
import InicioAdmin from "./pages/Inicioadm.jsx";

function App() {
  const [role, setRole] = useState(null); 

  if (role === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Selecciona el inicio a mostrar</h1>
        <div className="space-x-4">
          <button 
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={() => setRole('admin')}>
            Inicio Admin
          </button>
          <button 
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={() => setRole('colaborador')}>
            Inicio Colaborador
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {role === 'admin' ? <InicioAdmin /> : <InicioColaborador />}
    </div>
  );
}

export default App;
