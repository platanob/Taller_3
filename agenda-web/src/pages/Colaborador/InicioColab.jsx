// Inicio.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './Menucolab';
import Crearcitascolab from './CrearCitasColab';
import HistorialCitas from './HistorialCitas';
import HorasAgendadas from './Horasagendadas';
import CitasRealizadas from './CitasRealizadas';
import Aceptarcitas from './AceptarCitas';

function InicioColaborador() {
  return (
      <div>
        <Menu />
        <Routes>
          <Route path="/" element={<HorasAgendadas />} /> 
          <Route path="/Aceptar-Citas" element={<Aceptarcitas />} />
          <Route path="/crear-citas" element={<Crearcitascolab />} />
          <Route path="/historial-citas" element={<HistorialCitas />} />
          <Route path="/citas-realizadas" element={<CitasRealizadas />} />
        </Routes>
      </div>
  );
}

export default InicioColaborador;
