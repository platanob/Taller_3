// Inicio.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Menucolab';

import Crearcitascolab from './CrearCitasColab';
import HistorialCitas from './HistorialCitas';
import HorasAgendadas from './Horasagendadas';

function InicioColaborador() {
  return (
    <Router>
      <div>
        <Menu />
        <Routes>
          <Route path="/" element={<h1>Bienvenido a la página de inicio</h1>} />
          <Route path="/crear-citas" element={<Crearcitascolab />} />
          <Route path="/historial-citas" element={<HistorialCitas />} />
          <Route path="/Horas-agendadas" element={<HorasAgendadas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default InicioColaborador;
