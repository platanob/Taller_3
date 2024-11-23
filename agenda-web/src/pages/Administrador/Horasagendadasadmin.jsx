import React, { useState, useEffect } from 'react';

function HorasAgendadasAdmin() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const [selectedDay, setSelectedDay] = useState(null);
    const [monthAppointments, setMonthAppointments] = useState({});
    const [dayAppointments, setDayAppointments] = useState([]);
    const [adminName, setAdminName] = useState('');
    const [selectedService, setSelectedService] = useState(null);

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    useEffect(() => {
        const today = new Date();
        setYear(today.getFullYear());
        setMonth(today.getMonth());
        setSelectedDay(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    }, []);

    const fetchAdminDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/obtener_cuenta_actual', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                setAdminName(data.cuenta.nombre); // Establece el nombre del administrador autenticado
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    };    

    const fetchMonthAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
            
            const response = await fetch('http://localhost:5000/api/citas_por_dia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mes: monthStr })
            });

            if (response.ok) {
                const data = await response.json();
                setMonthAppointments(data.resumen);
            }
        } catch (error) {
            console.error('Error fetching month appointments:', error);
        }
    };

    const fetchDayAppointments = async (date) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:5000/api/citas_por_servicio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fecha: date })
            });
    
            if (response.ok) {
                const data = await response.json();
    
                if (Object.keys(data.citas_por_servicio).length > 0) {
                    setDayAppointments(data.citas_por_servicio);
                    
                    // Set first service as default selected service
                    const services = Object.keys(data.citas_por_servicio);
                    setSelectedService(services[0]);
                } else {
                    // No appointments for this day
                    setDayAppointments({});
                    setSelectedService(null);
                }
            } else {
                console.error('Failed to fetch day appointments');
                setDayAppointments({});
                setSelectedService(null);
            }
        } catch (error) {
            console.error('Error fetching day appointments:', error);
            setDayAppointments({});
            setSelectedService(null);
        }
    };
    

    useEffect(() => {
        fetchAdminDetails();
        fetchMonthAppointments();
    }, [year, month]);

    const prevMonth = () => {
        if (month === 0) {
            setYear(year - 1);
            setMonth(11);
        } else {
            setMonth(month - 1);
        }
    };

    const nextMonth = () => {
        if (month === 11) {
            setYear(year + 1);
            setMonth(0);
        } else {
            setMonth(month + 1);
        }
    };

    const selectDay = (day) => {
        const formattedDay = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        setSelectedDay(formattedDay);
        fetchDayAppointments(formattedDay);
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
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
                        Calendario Administrador: {adminName}
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
                        {[...Array(daysInMonth)].map((_, day) => {
                            const formattedDay = `${year}-${String(month + 1).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;
                            const dayData = monthAppointments[formattedDay] || { disponibles: 0, tomadas: 0 };
                            
                            return (
                                <div
                                    key={day}
                                    onClick={() => selectDay(day + 1)}
                                    className={`text-black flex flex-col justify-center items-center p-2 border rounded-lg cursor-pointer ${
                                        selectedDay === formattedDay
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-blue-200"
                                    }`}
                                >
                                    <span>{day + 1}</span>
                                    <span className="text-xs text-green-600">Disp: {dayData.disponibles}</span>
                                    <span className="text-xs text-red-600">Tomadas: {dayData.tomadas}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="w-2/3 p-4 bg-white shadow-md rounded-lg ml-4">
    <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Citas 
        {selectedDay && <span> para el día: {selectedDay}</span>}
    </h2>
    
    {/* Service Tabs */}
    {Object.keys(dayAppointments).length > 0 ? (
        <div>
            <div className="flex border-b mb-4">
                {Object.keys(dayAppointments).map((service) => (
                    <button
                        key={service}
                        onClick={() => setSelectedService(service)}
                        className={`px-4 py-2 ${
                            selectedService === service 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-black'
                        }`}
                    >
                        {service}
                    </button>
                ))}
            </div>

            {/* Appointments for Selected Service */}
            {selectedService && dayAppointments[selectedService] ? (
                <div className="grid grid-cols-1 gap-4">
                    {dayAppointments[selectedService].map((appointment, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg shadow-md ${
                                appointment.disponible ? "bg-green-200" : "bg-sky-200"
                            }`}
                        >
                            <p className="text-sm text-black">{appointment.hora}</p>
                            <p className="text-sm text-black">
                                Estado: {appointment.disponible ? 'Disponible' : 'Tomada'}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-black-500">No hay citas para el servicio seleccionado.</p>
            )}
        </div>
    ) : (
        <p className="text-black-500">No hay citas para este día.</p>
    )}
</div>

            </div>
        </div>
    );
}

export default HorasAgendadasAdmin;