import React, { useState, useEffect } from 'react';

function HorasAgendadas() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const [selectedDay, setSelectedDay] = useState(null);
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
        if (!selectedDay) return;

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

    useEffect(() => {
        loadAppointments();
    }, [selectedDay]);

    useEffect(() => {
        loadColaborador();
    }, []);

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const prevMonth = () => setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    const nextMonth = () => setMonth((prev) => (prev === 11 ? 0 : prev + 1));

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const selectDay = (day) => {
        const formattedDay = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        setSelectedDay(formattedDay);
    };

    const handleYesAsist = (index) => {
        console.log(`Cita ${index} - Si Asistió`);
    };

    const handleNoAsist = (index) => {
        console.log(`Cita ${index} - No Asistió`);
    };

    const handleCancel = (index) => {
        console.log(`Cita ${index} - Cancelada`);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10" style={{ backgroundImage: 'url("/img/fondo.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="flex">
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

                <div className="w-2/3 p-4 bg-white shadow-md rounded-lg ml-4">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6">
                        Citas {selectedDay && <span> para el día: {selectedDay}</span>}
                    </h2>
                    <div id="appointments-grid" className="grid grid-cols-1 gap-4">
                        {appointments.length > 0 ? (
                            appointments.map((appointment, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
                                        appointment.disponible ? "bg-yellow-200" : "bg-cyan-200"
                                    }`}
                                >
                                    <div>
                                        <p className="font-semibold text-blue-800">{appointment.servicio}</p>
                                        <p className="text-sm text-black">{appointment.hora}</p>
                                        <p className="text-sm text-black">{appointment.locacion}</p>
                                        {!appointment.disponible && appointment.usuario_id && (
                                            <p className="text-sm text-black">Usuario ID: {appointment.usuario_id}</p>
                                        )}
                                    </div>

                                    {/* Mostrar botones solo si la cita no está disponible */}
                                    {!appointment.disponible && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleYesAsist(index)}
                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                            >
                                                Si Asistió
                                            </button>
                                            <button
                                                onClick={() => handleNoAsist(index)}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                                            >
                                                No Asistió
                                            </button>
                                            <button
                                                onClick={() => handleCancel(index)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-black-500">No hay citas para este día.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HorasAgendadas;
