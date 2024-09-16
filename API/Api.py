from flask import Flask, jsonify, request
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId


app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Configuración de Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

# Conexión a MongoDB
client = MongoClient('mongodb+srv://benja:benja@cluster0.qzervft.mongodb.net/')  # Cambia esto si usas una URL de MongoDB en la nube
db = client['APP']  # Nombre de la base de datos
users_collection = db['usuarios']  # Colección donde se almacenan los usuarios
citas_collection = db['citas']

# Clase de usuario con Flask-Login
class User(UserMixin):
    def __init__(self, user_id, name):
        self.id = user_id
        self.name = name

# Carga de usuario para Flask-Login
@login_manager.user_loader
def load_user(user_id):
    user_data = users_collection.find_one({"rut": user_id})
    if user_data:
        return User(user_id=user_data["rut"], name=user_data["name"])
    return None

# Ruta para registrar usuarios
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    rut = data.get('rut')
    password = data.get('contraseña')
    name = data.get('nombre')

    if not rut or not password or not name:
        return jsonify({"error": "RUT, nombre y contraseña son requeridos"}), 400

    # Verificar si el usuario ya existe
    if users_collection.find_one({"rut": rut}):
        return jsonify({"error": "El usuario ya existe"}), 400

    # Guardar el usuario en la base de datos con contraseña cifrada
    hashed_password = generate_password_hash(password)
    users_collection.insert_one({
        "rut": rut,
        "password": hashed_password,
        "name": name
    })

    return jsonify({"message": "Usuario registrado con éxito"}), 201

# Ruta para inicio de sesión
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    rut = data.get('rut')
    password = data.get('contraseña')

    if not rut or not password:
        return jsonify({"error": "RUT y contraseña son requeridos"}), 400

    # Buscar el usuario en la base de datos
    user_data = users_collection.find_one({"rut": rut})
    if user_data and check_password_hash(user_data["password"], password):
        user = User(user_id=user_data["rut"], name=user_data["name"])
        login_user(user)
        return jsonify({"message": f"Inicio de sesión exitoso. Bienvenido, {user.name}!"}), 200
    else:
        return jsonify({"error": "RUT o contraseña incorrectos"}), 401

# Ruta para cerrar sesión
@app.route('/api/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Has cerrado sesión con éxito."}), 200

# Ruta protegida (solo accesible si el usuario ha iniciado sesión)
@app.route('/api/protected')
@login_required
def protected():
    return jsonify({"message": f"Acceso permitido. Bienvenido, {current_user.name}!"}), 200


@app.route('/api/nuevashoras', methods=['POST'])
def nuevashoras():
    # Obtener los datos enviados en el cuerpo de la solicitud
    data = request.get_json()
    # Asegurar que se reciban todos los campos necesarios
    required_fields = ['fecha', 'hora', 'locacion', 'servicio', 'colaborador', 'disponible']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan datos necesarios'}), 400

    # Crear un objeto cita
    cita = {
        'fecha': data['fecha'],
        'hora': data['hora'],
        'locacion': data['locacion'],
        'servicio': data['servicio'],
        'colaborador': data['colaborador'],
        'disponible': True
    }

    # Insertar la cita en la colección de MongoDB
    result = citas_collection.insert_one(cita)

    # Retornar la información de la cita creada con el ID generado por MongoDB
    return jsonify({'cita_id': str(result.inserted_id)}), 201



@app.route('/api/agendar', methods=['POST'])
@login_required  # Requiere que el usuario haya iniciado sesión
def agendar_cita():
    data = request.get_json()

    # Aseguramos que el campo 'cita_id' esté presente en los datos
    if 'cita_id' not in data:
        return jsonify({'error': 'Se requiere el ID de la cita'}), 400

    # Convertimos el cita_id a ObjectId
    cita_id = data['cita_id']

    try:
        cita_object_id = ObjectId(cita_id)
    except:
        return jsonify({'error': 'ID de cita no válido'}), 400

    # Buscamos la cita en la base de datos
    cita = citas_collection.find_one({'_id': cita_object_id})

    if not cita:
        return jsonify({'error': 'Cita no encontrada'}), 404

    # Verificamos si la cita ya está agendada (no disponible)
    if not cita.get('disponible', True):
        return jsonify({'error': 'La cita ya está agendada'}), 400

    # Modificar el estado de la cita a 'no disponible' y agregar el ID del usuario que la agendó
    update_result = citas_collection.update_one(
        {'_id': cita_object_id},
        {
            '$set': {
                'disponible': False,
                'usuario_id': str(current_user.get_id())  # Asignar el ID del usuario que agendó la cita
            }
        }
    )

    # Verificamos si la actualización fue exitosa
    if update_result.modified_count == 1:
        return jsonify({'message': 'Cita agendada correctamente', 'cita_id': cita_id, 'usuario_id': str(current_user.get_id())}), 200
    else:
        return jsonify({'error': 'No se pudo agendar la cita'}), 500

@app.route('/api/mis_citas', methods=['GET'])
@login_required  # Requiere que el usuario haya iniciado sesión
def mis_citas():
    # Obtener el RUT del usuario autenticado
    usuario_rut = current_user.get_id()
    # Buscar citas en la base de datos que coincidan con el RUT del usuario
    citas = citas_collection.find({'usuario_id': usuario_rut})

    # Convertir los resultados a una lista de diccionarios
    citas_list = []
    for cita in citas:
        cita['_id'] = str(cita['_id'])  # Convertir ObjectId a string para JSON
        citas_list.append(cita)

    return jsonify({'citas': citas_list}), 200

# Ejecutar la aplicación
if __name__ == '__main__':
    app.run(debug=True)
