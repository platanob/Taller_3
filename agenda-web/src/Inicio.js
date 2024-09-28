// Inicio.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Menu';
import CrearCitas from './Crearcitas';
import VerHorasDisponibles from './VerHorasDisponibles';
import HistorialCitas from './HistorialCitas';

function Inicio() {
  return (
    <Router>
      <div>
        <Menu />
        <Routes>
          <Route path="/" element={<h1>Bienvenido a la página de inicio</h1>} />
          <Route path="/crear-citas" element={<CrearCitas />} />
          <Route path="/ver-horas-disponibles" element={<VerHorasDisponibles />} />
          <Route path="/historial-citas" element={<HistorialCitas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Inicio;
