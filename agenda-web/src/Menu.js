// Menu.js
import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <nav>
      <ul>
        <li><Link to="/crear-citas">Crear citas</Link></li>
        <li><Link to="/ver-horas-disponibles">Ver horas disponibles</Link></li>
        <li><Link to="/historial-citas">Historial de citas</Link></li>
      </ul>
    </nav>
  );
}

export default Menu;