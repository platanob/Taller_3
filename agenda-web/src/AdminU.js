//Usuarios prueba
const usuarios = [
    { nombre: 'Juan Pérez', rut: '12345678-9' },
    { nombre: 'María López', rut: '98765432-1' },
    { nombre: 'Carlos Ramírez', rut: '87654321-0' },
];

// Carga los usuarios 
function Cargarusuarios() {
    const userTable = document.getElementById('userTable');
    userTable.innerHTML = ''; // Limpia la tabla antes de cargar los datos
    usuarios.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.nombre}</td>
            <td>${user.rut}</td>
            <td>
                <button onclick="viewUser(${index})">Ver</button>
                <button onclick="editUser(${index})">Editar</button>
                <button onclick="deleteUser(${index})">Borrar</button>
            </td>
        `;
        userTable.appendChild(row);
    });
}

// Ver info del Usuario
function viewUser(index) {
    const user = usuarios[index];
    alert(`Información de usuario:\n\nNombre: ${user.nombre}\nRUT: ${user.rut}`);
}

// Editar usuario (No implementada)
function editUser(index) {
    const user = usuarios[index];
    alert(`Función de editar no está implementada todavía para ${user.nombre}`);
}

//Borrar usuario
function deleteUser(index) {
    const confirmed = confirm('¿Estás seguro de que quieres borrar este usuario?');
    if (confirmed) {
        usuarios.splice(index, 1);
        Cargarusuarios(); // Recargar la tabla después de eliminar el usuario
    }
}

//Carga los usuarios al iniciar la página
window.onCargar = Cargarusuarios;
