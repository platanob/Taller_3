import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu2 from './Menuadm';

import Adminusers from './administrarusuarios';
import Admincolab from './AdministrarColab';
import CrearCitasAdm from './CrearCitasAdmin';


const InicioAdmin = () => {
  return (
    <Router>
      <div>
        <Menu2 />
        <Routes>
          <Route path="/" element={<h1>Bienvenido a la página de inicio</h1>} />
          <Route path="/administrar-usuarios" element={<Adminusers />} />
          <Route path="/administrar-colaboradores" element={<Admincolab />} />
          <Route path="/crear-citas-administradores" element={<CrearCitasAdm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default InicioAdmin;
