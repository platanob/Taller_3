// Inicio.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Menu';

import CrearCitas from './assets/pages/Crearcitas';
import HistorialCitas from './assets/pages/HistorialCitas';
import HorasAgendadas from './assets/pages/Horasagendadas';

function InicioColaborador() {
  return (
    <Router>
      <div>
        <Menu />
        <Routes>
          <Route path="/" element={<h1>Bienvenido a la página de inicio</h1>} />
          <Route path="/crear-citas" element={<CrearCitas />} />
          <Route path="/historial-citas" element={<HistorialCitas />} />
          <Route path="/Horas-agendadas" element={<HorasAgendadas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default InicioColaborador;
