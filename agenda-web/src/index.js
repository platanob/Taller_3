// index.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import InicioColaborador from './InicioColab';
import reportWebVitals from './reportWebVitals';
import InicioAdmin from './Inicioadm';

function App() {
  const [role, setRole] = useState(null); 

  if (role === null) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Selecciona El inicio a mostrar</h1>
        <button onClick={() => setRole('admin')}>Inicio Admin</button>
        <button onClick={() => setRole('colaborador')}>Inicio Colaborador</button>
      </div>
    );
  }


  return (
    <div>
      {role === 'admin' ? <InicioAdmin /> : <InicioColaborador />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
