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
          <Route path="/" element={<h1>Bienvenido a la página de inicio</h1>} />
          <Route path="/crear-citas" element={<Crearcitascolab />} />
          <Route path="/historial-citas" element={<HistorialCitas />} />
          <Route path="/Horas-agendadas" element={<HorasAgendadas />} />
        </Routes>
      </div>
  );
}

export default InicioColaborador;
