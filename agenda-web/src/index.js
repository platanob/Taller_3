// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/assets/css/index.css';
import Inicio from './Inicio';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Inicio />
  </React.StrictMode>
);

reportWebVitals();
