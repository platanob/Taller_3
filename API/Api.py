from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Cambia esto por una clave secreta más segura en producción

# Configuración de CORS
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:8081",  
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True  # Permite el envío de credenciales
    }
})

# Configuración de Flask-JWT-Extended
app.config['JWT_SECRET_KEY'] = 'supersecretjwtkey'  # Cambia esto por una clave secreta más segura en producción
jwt = JWTManager(app)

# Conexión a MongoDB
client = MongoClient('mongodb+srv://benja:benja@cluster0.qzervft.mongodb.net/')
db = client['APP']
users_collection = db['usuarios']
citas_collection = db['citas']

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    rut = data.get('rut')
    password = data.get('contraseña')
    name = data.get('nombre')

    if not rut or not password or not name:
        return jsonify({"error": "RUT, nombre y contraseña son requeridos"}), 400

    if users_collection.find_one({"rut": rut}):
        return jsonify({"error": "El usuario ya existe"}), 400

    hashed_password = generate_password_hash(password)
    users_collection.insert_one({
        "rut": rut,
        "password": hashed_password,
        "name": name
    })

    return jsonify({"message": "Usuario registrado con éxito"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    rut = data.get('rut')
    password = data.get('contraseña')

    if not rut or not password:
        return jsonify({"error": "RUT y contraseña son requeridos"}), 400

    user_data = users_collection.find_one({"rut": rut})
    if user_data and check_password_hash(user_data["password"], password):
        access_token = create_access_token(identity=user_data["rut"])
        return jsonify({"message": "Inicio de sesión exitoso", "access_token": access_token}), 200
    else:
        return jsonify({"error": "RUT o contraseña incorrectos"}), 401

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({"message": "Has cerrado sesión con éxito."}), 200

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_rut = get_jwt_identity()
    user_data = users_collection.find_one({"rut": current_user_rut})
    if user_data:
        return jsonify({"message": f"Acceso permitido. Bienvenido, {user_data['name']}!"}), 200
    else:
        return jsonify({"error": "Usuario no encontrado"}), 404

@app.route('/api/nuevashoras', methods=['POST'])
@jwt_required()
def nuevashoras():
    data = request.get_json()
    required_fields = ['fecha', 'hora', 'locacion', 'servicio', 'colaborador', 'disponible']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan datos necesarios'}), 400

    cita = {
        'fecha': data['fecha'],
        'hora': data['hora'],
        'locacion': data['locacion'],
        'servicio': data['servicio'],
        'colaborador': data['colaborador'],
        'disponible': True
    }

    result = citas_collection.insert_one(cita)
    return jsonify({'cita_id': str(result.inserted_id)}), 201

@app.route('/api/citas_disponibles', methods=['GET'])
@jwt_required()
def citas_disponibles():
    citas = citas_collection.find({'disponible': True})
    citas_list = []
    for cita in citas:
        cita['_id'] = str(cita['_id'])
        citas_list.append(cita)
    return jsonify({'citas_disponibles': citas_list}), 200

@app.route('/api/agendar', methods=['POST'])
@jwt_required()
def agendar_cita():
    data = request.get_json()
    if 'cita_id' not in data:
        return jsonify({'error': 'Se requiere el ID de la cita'}), 400

    cita_id = data['cita_id']
    try:
        cita_object_id = ObjectId(cita_id)
    except:
        return jsonify({'error': 'ID de cita no válido'}), 400

    cita = citas_collection.find_one({'_id': cita_object_id})
    if not cita:
        return jsonify({'error': 'Cita no encontrada'}), 404

    if not cita.get('disponible', True):
        return jsonify({'error': 'La cita ya está agendada'}), 400

    update_result = citas_collection.update_one(
        {'_id': cita_object_id},
        {
            '$set': {
                'disponible': False,
                'usuario_id': get_jwt_identity()
            }
        }
    )

    if update_result.modified_count == 1:
        return jsonify({'message': 'Cita agendada correctamente', 'cita_id': cita_id, 'usuario_id': get_jwt_identity()}), 200
    else:
        return jsonify({'error': 'No se pudo agendar la cita'}), 500

@app.route('/api/mis_citas', methods=['GET'])
@jwt_required()
def mis_citas():
    usuario_rut = get_jwt_identity()
    citas = citas_collection.find({'usuario_id': usuario_rut})
    citas_list = []
    for cita in citas:
        cita['_id'] = str(cita['_id'])
        citas_list.append(cita)
    return jsonify({'citas': citas_list}), 200

if __name__ == '__main__':
    app.run(debug=True)
