import React from 'react';
import Menu2 from './Menuadm';
import { Routes, Route } from 'react-router-dom';
import Adminusers from './administrarusuarios';
import Admincolab from './AdministrarColab';
import CrearCitasAdm from './CrearCitasAdmin';
import HorasAgendadas from './Horasagendadasadmin';
import VisualizarGraficos from './Graficos';
import AdmisionUsuarios from './AdmisionUsuarios';
import UsuarioInfo from './UsuarioInfo';
import CrearColaborador from './CrearColaborador'
import CrearAdministrador from './CrearAdministrador';

const InicioAdmin = () => {
  return (
    <div>
      <Menu2 />
      <Routes>
        <Route path="/" element={<HorasAgendadas />} /> 
        <Route path="/administrar-usuarios" element={<Adminusers />} />
        <Route path="/administrar-colaboradores" element={<Admincolab />} />
        <Route path="/administrar-colaboradores/crear-colaborador" element={<CrearColaborador />} />
        <Route path="/administrar-colaboradores/crear-administrador" element={<CrearAdministrador />} />
        <Route path="/crear-citas-administradores" element={<CrearCitasAdm />} />
        <Route path="/visualizar-graficos" element={<VisualizarGraficos />} />
        <Route path="/admision-usuarios" element={<AdmisionUsuarios />} />
        <Route path="/admision-usuarios/usuario-info" element={<UsuarioInfo />} />
      </Routes>
    </div>
  );
}

export default InicioAdmin;
