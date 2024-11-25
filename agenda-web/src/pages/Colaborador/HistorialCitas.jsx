import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No estás autenticado.");
          return;
        }

        const response = await axios.get("https://taller-3.onrender.com/api/citas_todas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCitas(response.data.citas);

        // Procesar datos para el gráfico
        const asistencias = response.data.citas.filter((cita) => cita.asistencia).length;
        const noAsistencias = response.data.citas.filter((cita) => !cita.asistencia).length;

        setChartData({
          labels: ["Asistencias", "No Asistencias"],
          datasets: [
            {
              label: "Citas",
              data: [asistencias, noAsistencias],
              backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
              borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
              borderWidth: 2,
            },
          ],
        });
      } catch (err) {
        setError(err.response?.data?.error || "Error al obtener las citas.");
      }
    };

    fetchCitas();
  }, []);

  const borrarCita = async (citaId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No estás autenticado.");
        return;
      }

      const response = await axios.delete(`https://taller-3.onrender.com/api/borrarcita/${citaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setCitas((prevCitas) => prevCitas.filter((cita) => cita._id !== citaId));
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error al borrar la cita.");
    }
  };

  const verComentarios = (citaId) => {
    // Implementa la lógica para redirigir a la página de comentarios
    console.log(`Ver comentarios de la cita con ID: ${citaId}`);
  };

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <div
      className="min-h-screen bg-gray-100 py-10"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-5xl mx-auto bg-blue-200 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Historial de Citas</h1>
        
        {/* Gráfico de asistencias */}
        {chartData && (
          <div className="mb-10 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Resumen de Asistencias</h2>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </div>
        )}
        
        {/* Tabla de citas */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Fecha</th>
                <th className="py-2 px-4 text-left">Hora</th>
                <th className="py-2 px-4 text-left">Cliente</th>
                <th className="py-2 px-4 text-left">Servicio</th>
                <th className="py-2 px-4 text-left">Locación</th>
                <th className="py-2 px-4 text-left">Asistencia</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {citas.length > 0 ? (
                citas.map((cita, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-2 px-4">{cita.fecha}</td>
                    <td className="py-2 px-4">{cita.hora}</td>
                    <td className="py-2 px-4">{cita.usuario_id}</td>
                    <td className="py-2 px-4">{cita.servicio}</td>
                    <td className="py-2 px-4">{cita.locacion}</td>
                    <td className="py-2 px-4">{cita.asistencia ? "Sí Asistió" : "No Asistió"}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => borrarCita(cita._id)}
                      >
                        Borrar
                      </button>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-700"
                        onClick={() => verComentarios(cita._id)}
                      >
                        Comentarios
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No se encontraron citas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MisCitas;