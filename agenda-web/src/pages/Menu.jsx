import React from 'react';
import { Link } from 'react-router-dom';
import './assets/css/Menu.css';

function Menu() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="./assets/img/logo_muni" alt="muni logo" className="logo-img" />
        <span className="logo-text">Agenda Senior</span>
      </div>
      <div className="menu-links">
        <Link to="/">Inicio</Link>
        <Link to="/crear-citas">Crear Citas</Link>
        <Link to="/historial-citas">Historial de Citas</Link>
        <Link to="/Horas-agendadas">Horas Agendadas</Link>
      </div>
      <div className="menu-actions">
        <button className="btn reservar-hora">Iniciar Session</button>
        <button className="btn solicitar-presupuesto">Registro</button>
      </div>
    </nav>
  );
}

export default Menu;
