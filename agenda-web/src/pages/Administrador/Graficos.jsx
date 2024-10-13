import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Graficos = () => {
  // Datos de ejemplo para los gráficos
  const barData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'horas agendadas',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 3,
      },
    ],
  };

  const lineData1 = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'horas trabajadas',
        data: [5, 9, 6, 3, 7],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const lineData2 = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Asistencias',
        data: [3, 2, 1, 4, 5],
        borderColor: 'rgba(53, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div 
      className="p-8 min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: 'url("/img/fondo.jpg")' }}
    >
    <div className="flex justify-center">
      <div className="stats mb-8 md:w-1/3 rounded-md">
            <div className="stat place-items-center">
              <div className="stat-title">Horas Agendadas</div>
              <div className="stat-value">100</div>
              <div className="stat-desc">Desde Enero a Diciembre</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Horas trabajadas</div>
              <div className="stat-value">200</div>
              <div className="stat-desc">Desde Enero a Diciembre</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Asistencias</div>
              <div className="stat-value">200</div>
              <div className="stat-desc">Desde Enero a Diciembre</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Horas agendadas según categoría</h2>
          <Bar data={barData} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Horas trabajadas por colaborador</h2>
          <Line data={lineData1} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Asistencias</h2>
          <Line data={lineData2} />
        </div>
      </div>
    </div>
  );
};

export default Graficos;
