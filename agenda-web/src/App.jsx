import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Inicioadm from './pages/Administrador/Inicioadm';
import InicioColaborador from './pages/Colaborador/InicioColab';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<Inicioadm />} />
        <Route path="/colaborador/*" element={<InicioColaborador />} />
      </Routes>
    </Router>
  );
}

export default App;
