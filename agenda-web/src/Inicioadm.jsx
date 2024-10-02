import React from 'react';
import './assets/css/AdminU.css'; // Importa tu archivo de CSS
import Logo from './assets/img/logo_muni.jpg';

const InicioAdmin = () => {
  return (
    <div className="container">
      <header className="header">
        <img src= {Logo} alt="Logo" className="logo" />
        <div className="nav-buttons">
          <button>ADMINISTRAR COLABORADORES</button>
          <button>ADMINISTRAR USUARIOS</button>
          <button>VISUALIZAR GRÁFICOS</button>
          <button>CREAR CITAS</button>
          <button>VER HORAS DISPONIBLES</button>
          <button className="logout-button">CERRAR SESIÓN</button>
        </div>
      </header>
      <main>
        <h1>HORAS DISPONIBLES</h1>
        <div className="appointment-card">
          <div className="card">
            <p>2024-09-17</p>
            <p>Terapia física</p>
            <p className="clinic">Clínica norte</p>
            <button>Información</button>
            <button>Editar</button>
            <button>Borrar</button>
          </div>
          <div className="card">
            <p>2024-09-17</p>
            <p>Podología</p>
            <p className="clinic">Clínica norte</p>
            <button>Información</button>
            <button>Editar</button>
            <button>Borrar</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InicioAdmin;
