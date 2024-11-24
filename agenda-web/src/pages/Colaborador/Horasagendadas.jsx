import React, { useState, useEffect } from 'react';

function HorasAgendadas() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const [selectedDay, setSelectedDay] = useState(null); // Día seleccionado en "YYYY-MM-DD"
    const [colaborador, setColaborador] = useState({ nombre: "", id: "" });
    const [appointments, setAppointments] = useState([]);

    // Función para cargar la información del colaborador
    const loadColaborador = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("https://taller-3.onrender.com/api/colaborador_info", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setColaborador({ nombre: data.nombre, id: data._id });
            } else {
                console.error("Error al obtener información del colaborador:", response.status);
            }
        } catch (error) {
            console.error("Error al cargar el colaborador:", error);
        }
    };

    // Función para cargar las citas según el colaborador y la fecha seleccionada
    const loadAppointments = async () => {
        if (!selectedDay) return; // No cargar si no hay fecha seleccionada

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://taller-3.onrender.com/api/citas_colaborador?fecha=${selectedDay}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAppointments(data.citas || []);
            } else {
                console.error("Error al obtener citas:", response.status);
                setAppointments([]);
            }
        } catch (error) {
            console.error("Error al cargar citas:", error);
            setAppointments([]);
        }
    };

    // Cargar citas al cambiar la fecha seleccionada
    useEffect(() => {
        loadAppointments();
    }, [selectedDay]);

    // Cargar la información del colaborador al montar el componente
    useEffect(() => {
        loadColaborador();
    }, []);

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const prevMonth = () => setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    const nextMonth = () => setMonth((prev) => (prev === 11 ? 0 : prev + 1));

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Manejo de selección de día en formato "YYYY-MM-DD"
    const selectDay = (day) => {
        const formattedDay = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        setSelectedDay(formattedDay);
    };

    return (
        <div
        className="min-h-screen bg-gray-100 py-10"
        style={{
          backgroundImage: 'url("/img/fondo.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex">
            {/* Selector de Año y Mes */}
            <div className="w-1/3 p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
                    Calendario colaborador: {colaborador.nombre}
                </h2>
                <div className="mb-4">
                    <label className="text-sm text-black font-semibold">Año:</label>
                    <div className="text-black py-2 px-4 flex justify-between items-center mt-1">
                        <button onClick={() => setYear(year > 2020 ? year - 1 : year)}>&lt;</button>
                        <span className="text-black py-2 px-4 font-semibold text-center">{year}</span>
                        <button onClick={() => setYear(year < 2030 ? year + 1 : year)}>&gt;</button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-sm text-black font-semibold">Mes:</label>
                    <div className="text-black py-2 px-4 flex justify-between items-center mt-1">
                        <button onClick={prevMonth}>&lt;</button>
                        <span className="text-black py-2 px-4 font-semibold text-center">{meses[month]}</span>
                        <button onClick={nextMonth}>&gt;</button>
                    </div>
                </div>

                {/* Tabla mensual de días */}
                <div className="grid grid-cols-7 gap-1 mt-4">
                    {[...Array(daysInMonth)].map((_, day) => (
                        <div
                            key={day}
                            onClick={() => selectDay(day + 1)}
                            className={`text-black flex justify-center items-center p-2 border rounded-lg cursor-pointer ${
                                selectedDay === `${year}-${String(month + 1).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-blue-200"
                            }`}
                        >
                            {day + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* Panel de Citas */}
            <div className="w-2/3 p-4 bg-white shadow-md rounded-lg ml-4">
                <h2 className="text-3xl font-bold text-blue-800 mb-6">
                    Citas 
                    {selectedDay && <span> para el día: {selectedDay}</span>}
                </h2>
                <div id="appointments-grid" className="grid grid-cols-1 gap-4">
                    {appointments.length > 0 ? (
                        appointments.map((appointment, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg shadow-md ${
                                    appointment.disponible ? "bg-green-200" : "bg-sky-200"
                                }`}
                            >
                                <p className="font-semibold text-blue-800">{appointment.servicio}</p>
                                <p className="text-sm text-black">{appointment.hora}</p>
                                <p className="text-sm text-black">{appointment.locacion}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-black-500">No hay citas para este dia.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}

export default HorasAgendadas;