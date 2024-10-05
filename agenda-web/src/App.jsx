import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/login.jsx'
import CrearCitasAdm from "./pages/CrearCitasAdmin.jsx";
import HorasDisponibles from "./pages/HorasDispo.jsx";

function App() {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CrearCitasAdm />} />
          </Routes>
        </BrowserRouter>
    );
  }
  export default App;
  