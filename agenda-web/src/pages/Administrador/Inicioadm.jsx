import React from 'react';
import Menu2 from './Menuadm';
import { Routes, Route } from 'react-router-dom';
import Adminusers from './administrarusuarios';
import Admincolab from './AdministrarColab';
import CrearCitasAdm from './CrearCitasAdmin';
import HorasDisponibles from './HorasDispo';
import VisualizarGraficos from './Graficos';
import AdmisionUsuarios from './AdmisionUsuarios';
import UsuarioInfo from './UsuarioInfo';

const InicioAdmin = () => {
  return (
    <div>
      <Menu2 />
      <Routes>
        <Route path="/admin" element={<HorasDisponibles />} /> 
        <Route path="/admin/administrar-usuarios" element={<Adminusers />} />
        <Route path="/admin/administrar-colaboradores" element={<Admincolab />} />
        <Route path="/admin/crear-citas-administradores" element={<CrearCitasAdm />} />
        <Route path="/admin/visualizar-graficos" element={<VisualizarGraficos />} />
        <Route path="/admin/admision-usuarios" element={<AdmisionUsuarios />} />
        <Route path="/admin/usuario/:rut/:nombre/:correo" element={<UsuarioInfo />} />
      </Routes>
    </div>
  );
}

export default InicioAdmin;
