import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu2 from './Menuadm';
import Adminusers from './administrarusuarios';
import Admincolab from './AdministrarColab';
import CrearCitasAdm from './CrearCitasAdmin';
import HorasDisponibles from './HorasDispo';
import VisualizarGraficos from './Graficos';
import AdmisionUsuarios from './AdmisionUsuarios';
import UsuarioInfo from './UsuarioInfo';

const InicioAdmin = () => {
  return (
    <Router>
      <div>
        <Menu2 />
        <Routes>
          <Route path="/" element={<HorasDisponibles/>} /> 
          <Route path="/administrar-usuarios" element={<Adminusers />} />
          <Route path="/administrar-colaboradores" element={<Admincolab />} />
          <Route path="/crear-citas-administradores" element={<CrearCitasAdm />} />
          <Route path="/visualizar-graficos" element={<VisualizarGraficos />} />
          <Route path="/admision-usuarios" element={<AdmisionUsuarios />} />
          <Route path="/usuario/:rut/:nombre/:correo" element={<UsuarioInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default InicioAdmin;
