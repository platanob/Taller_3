// Inicio.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './Menucolab';
import Crearcitascolab from './CrearCitasColab';
import HistorialCitas from './HistorialCitas';
import HorasAgendadas from './Horasagendadas';

function InicioColaborador() {
  return (
      <div>
        <Menu />
        <Routes>
          <Route path="/" element={<HorasAgendadas />} /> 
          <Route path="/na" element={<HorasAgendadas />} />
          <Route path="/crear-citas" element={<Crearcitascolab />} />
          <Route path="/historial-citas" element={<HistorialCitas />} />
        </Routes>
      </div>
  );
}

export default InicioColaborador;
