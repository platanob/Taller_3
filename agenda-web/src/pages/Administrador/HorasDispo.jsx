import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Preloader from './Espera'; // Asegúrate de ajustar la ruta según tu estructura de archivos

function HorasDisponibles() {
    const [citas, setCitas] = useState([]);
    const [selectedCita, setSelectedCita] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    // Fetch para obtener las citas desde la API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/citas_disponibles', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.citas_disponibles) {
                    setCitas(data.citas_disponibles);
                }
            } catch (error) {
                console.error('Error al obtener las citas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    // Función para mostrar información de la cita
    const handleInfo = (index) => {
        const cita = citas[index];
        Swal.fire({
            title: 'Información de la Cita',
            html: `
                <p><strong>Fecha:</strong> ${cita.fecha}</p>
                <p><strong>Servicio:</strong> ${cita.servicio}</p>
                <p><strong>Locación:</strong> ${cita.locacion}</p>
                <p><strong>Hora:</strong> ${cita.hora}</p>
                <p><strong>Colaborador:</strong> ${cita.colaborador}</p>
            `,
            icon: 'info',
            confirmButtonText: 'Cerrar'
        });
    };

    // Función para editar una cita
    const handleEdit = (index) => {
        const cita = citas[index];
        setSelectedCita({ ...cita, index });
        
        Swal.fire({
            title: 'Editar Cita',
            html: `
                <input id="fecha" class="swal2-input" placeholder="Fecha" value="${cita.fecha}">
                <input id="servicio" class="swal2-input" placeholder="Servicio" value="${cita.servicio}">
                <input id="locacion" class="swal2-input" placeholder="Locación" value="${cita.locacion}">
                <input id="hora" class="swal2-input" placeholder="Hora" value="${cita.hora}">
                <input id="colaborador" class="swal2-input" placeholder="Colaborador" value="${cita.colaborador}">
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            preConfirm: () => {
                const fecha = document.getElementById('fecha').value;
                const servicio = document.getElementById('servicio').value;
                const locacion = document.getElementById('locacion').value;
                const hora = document.getElementById('hora').value;
                const colaborador = document.getElementById('colaborador').value;
                return { fecha, servicio, locacion, hora, colaborador };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { fecha, servicio, locacion, hora, colaborador } = result.value;
                const campos = { fecha, servicio, locacion, hora, colaborador };
                editSubmit(campos, index);
            }
        });
    };

    const editSubmit = (campos, index) => {
        const citaId = citas[index]._id;

        fetch(`http://localhost:5000/api/editarcita/${citaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(campos),
        })
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                const updatedCitas = citas.map((cita, i) =>
                    i === index ? { ...cita, ...campos } : cita
                );
                setCitas(updatedCitas);
                Swal.fire('Cita actualizada', '', 'success');
            } else {
                Swal.fire('Error al actualizar la cita', data.mensaje || '', 'error');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error.message);
            Swal.fire('Error', 'No se pudo actualizar la cita', 'error');
        });
    };

    // Función para confirmar eliminación
    const handleDelete = (index) => {
        const cita = citas[index];
        
        Swal.fire({
            title: 'Confirmar Eliminación',
            text: `¿Estás seguro que deseas eliminar la cita del ${cita.fecha} en ${cita.locacion} con el ${cita.colaborador}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
        }).then((result) => {
            if (result.isConfirmed) {
                deletConfirm(index);
            }
        });
    };

    const deletConfirm = (index) => {
        const citaId = citas[index]._id;

        fetch(`http://localhost:5000/api/borrarcita/${citaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje) {
                const updatedCitas = citas.filter((_, i) => i !== index);
                setCitas(updatedCitas);
                Swal.fire('Cita eliminada', '', 'success');
            } else {
                Swal.fire('Error al borrar la cita', data.error || '', 'error');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            Swal.fire('Error', 'No se pudo eliminar la cita', 'error');
        });
    };

    // Mostrar el preloader si loading es true
    if (loading) {
        return <Preloader />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10"
             style={{
                 backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url("/img/fondo.jpg")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
             }}
        >
            <div className="bg-black bg-opacity-50 p-4 rounded-md mb-10">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">Citas Disponibles</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {citas.map((cita, index) => (
                    <div key={index} className="bg-blue-200 rounded-lg p-5 w-64 shadow-md flex flex-col">
                        <div className="flex justify-between w-full mb-2">
                            <p className="text-sm font-bold text-black">{cita.fecha}</p>
                            <p className="text-red-500 font-semibold truncate max-w-[8rem] text-right">
                                {cita.locacion}
                            </p>
                        </div>
                        <p className="text-md text-black mb-1">{cita.servicio}</p>

                        <div className="mt-4 flex flex-col space-y-2 w-full">
                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition" onClick={() => handleInfo(index)}>
                                Información
                            </button>
                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition" onClick={() => handleEdit(index)}>
                                Editar
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition" onClick={() => handleDelete(index)}>
                                Borrar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HorasDisponibles;
