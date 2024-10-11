from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from functools import wraps
import gridfs

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Cambia esto por una clave secreta más segura en producción

# Configuración de CORS
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  
        "methods": ["GET", "POST", "PUT", "OPTIONS"],
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
usuarios_nuevos = db['usuarios_nuevos']
cuentas_admin = db['cuentas_admin']
fs = gridfs.GridFS(db)

"""

██████╗░░█████╗░██████╗░████████╗███████╗  ███╗░░░███╗░█████╗░██╗░░░██╗██╗██╗░░░░░
██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝  ████╗░████║██╔══██╗██║░░░██║██║██║░░░░░
██████╔╝███████║██████╔╝░░░██║░░░█████╗░░  ██╔████╔██║██║░░██║╚██╗░██╔╝██║██║░░░░░
██╔═══╝░██╔══██║██╔══██╗░░░██║░░░██╔══╝░░  ██║╚██╔╝██║██║░░██║░╚████╔╝░██║██║░░░░░
██║░░░░░██║░░██║██║░░██║░░░██║░░░███████╗  ██║░╚═╝░██║╚█████╔╝░░╚██╔╝░░██║███████╗
╚═╝░░░░░╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝  ╚═╝░░░░░╚═╝░╚════╝░░░░╚═╝░░░╚═╝╚══════╝
"""


@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.form  
        nombre = data.get('nombre')
        rut = data.get('rut')
        correo = data.get('correo')
        password = data.get('contrasena')

        # Verificar que los campos de texto están presentes
        if not nombre or not rut or not correo or not password:
            return jsonify({"error": "Todos los campos (nombre, rut, correo, contraseña) son requeridos"}), 400

        # Verificar que no exista un usuario con el mismo correo o rut
        if users_collection.find_one({"correo": correo}):
            return jsonify({"error": "El correo ya está registrado"}), 400

        if users_collection.find_one({"rut": rut}):
            return jsonify({"error": "El usuario ya existe"}), 400

        # Verificar que se haya subido el archivo PDF
        if 'archivo' not in request.files:
            return jsonify({"error": "El archivo PDF es requerido"}), 400

        archivo_pdf = request.files['archivo']

        # Verificar el archivo PDF
        if archivo_pdf.filename == '' or not archivo_pdf.filename.endswith('.pdf'):
            return jsonify({"error": "Debes subir un archivo PDF válido"}), 400

        # Guardar el archivo PDF en GridFS
        pdf_id = fs.put(archivo_pdf, filename=archivo_pdf.filename)

        # Verificar que se suban las imágenes
        if 'carnet_frontal' not in request.files or 'carnet_trasero' not in request.files:
            return jsonify({"error": "Las imágenes de carnet frontal y carnet trasero son requeridas"}), 400

        carnet_frontal = request.files['carnet_frontal']
        carnet_trasero = request.files['carnet_trasero']

        # Verificar que las imágenes sean válidas (puedes agregar más validaciones si es necesario)
        if carnet_frontal.filename == '' or not carnet_frontal.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            return jsonify({"error": "Debes subir una imagen válida para el carnet frontal"}), 400

        if carnet_trasero.filename == '' or not carnet_trasero.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            return jsonify({"error": "Debes subir una imagen válida para el carnet trasero"}), 400

        # Guardar las imágenes en GridFS
        carnet_frontal_id = fs.put(carnet_frontal, filename=carnet_frontal.filename)
        carnet_trasero_id = fs.put(carnet_trasero, filename=carnet_trasero.filename)

        # Hashear la contraseña
        hashed_password = generate_password_hash(password)

        # Insertar los datos del nuevo usuario en la base de datos
        usuarios_nuevos.insert_one({
            "rut": rut,
            "password": hashed_password,
            "nombre": nombre,
            "correo": correo,
            "pdf_id": pdf_id,  # ID del archivo PDF en GridFS
            "carnet_frontal_id": carnet_frontal_id,  # ID de la imagen de carnet frontal
            "carnet_trasero_id": carnet_trasero_id   # ID de la imagen de carnet trasero
        })

        return jsonify({"message": "Usuario registrado con éxito"}), 201
    
    except Exception as e:
        return jsonify({"error": f"Se produjo un error: {str(e)}"}), 500

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

@app.route('/api/cancelar_cita/<cita_id>', methods=['PUT'])
@jwt_required()
def cancelar_cita(cita_id):
    usuario_rut = get_jwt_identity()
    
    # Busca la cita por su ID y verifica que el usuario esté asociado a ella
    cita = citas_collection.find_one({'_id': ObjectId(cita_id), 'usuario_id': usuario_rut})
    
    if not cita:
        return jsonify({'error': 'Cita no encontrada o el usuario no está asociado a la cita'}), 404

    # Actualiza la cita, eliminando el usuario_id para dejarla disponible
    result = citas_collection.update_one(
        {'_id': ObjectId(cita_id)},
        {'$unset': {'usuario_id': ""}, '$set': {'disponible': True}} 
    )
    
    if result.modified_count == 1:
        return jsonify({'message': 'Cita cancelada y ahora está disponible'}), 200
    else:
        return jsonify({'error': 'No se pudo cancelar la cita'}), 500


"""
██████╗░░█████╗░██████╗░████████╗███████╗  ░██╗░░░░░░░██╗███████╗██████╗░
██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝  ░██║░░██╗░░██║██╔════╝██╔══██╗
██████╔╝███████║██████╔╝░░░██║░░░█████╗░░  ░╚██╗████╗██╔╝█████╗░░██████╦╝
██╔═══╝░██╔══██║██╔══██╗░░░██║░░░██╔══╝░░  ░░████╔═████║░██╔══╝░░██╔══██╗
██║░░░░░██║░░██║██║░░██║░░░██║░░░███████╗  ░░╚██╔╝░╚██╔╝░███████╗██████╦╝
╚═╝░░░░░╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝  ░░░╚═╝░░░╚═╝░░╚══════╝╚═════╝░
"""
def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        cuenta = get_jwt_identity()
        # Verifica si el usuario es admin
        if not cuenta['admin']:
            return jsonify({'mensaje': 'No tienes permiso para acceder a esta ruta'}), 403
        return fn(*args, **kwargs)
    return wrapper

@app.route('/api/agregar_web', methods=['POST'])
def agregar_cuenta():
    data = request.get_json()
    
    nombre = data.get('nombre')
    rut = data.get('rut')
    password = data.get('password')
    admin = data.get('admin')
    especialidad = data.get('especialidad', '')  
    
    if not nombre or not rut or not password:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400
    

    password_hash = generate_password_hash(password)

    cuenta = {
        "nombre": nombre,
        "rut": rut,
        "password": password_hash,
        "admin": admin,
        "especialidad": especialidad
    }
    
    cuentas_admin.insert_one(cuenta)
    
    return jsonify({'mensaje': 'Cuenta agregada exitosamente'}), 201


# Ruta para iniciar sesión
@app.route('/api/login_web', methods=['POST'])
def iniciar_sesion():
    data = request.get_json()
    print(data)
    rut = data.get('rut')
    password = data.get('password')
    print(password)
    if not rut or not password:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    cuenta = cuentas_admin.find_one({"rut": rut})

    if not cuenta:
        return jsonify({'error': 'Usuario no encontrado'}), 404


    if not check_password_hash(cuenta['password'], password):
        return jsonify({'error': 'Contraseña incorrecta'}), 401

    access_token = create_access_token(identity={'rut': rut, 'admin': cuenta['admin']})

    return jsonify({
        'mensaje': 'Inicio de sesión exitoso',
        'token': access_token,
        'admin': cuenta['admin']
    }), 200

@app.route('/api/prueba', methods=['POST'])
@jwt_required()
@admin_required  # Este decorador valida si el usuario es admin
def prueba():
    return jsonify({'mensaje': 'Es ADMIN'})

@app.route('/api/editarcita/<cita_id>', methods=['PUT'])
@jwt_required()
@admin_required
def editarcita(cita_id):
    data = request.get_json()

    # Buscar la cita por su ID
    cita_existente = citas_collection.find_one({'_id': ObjectId(cita_id)})

    if not cita_existente:
        return jsonify({'error': 'Cita no encontrada'}), 404

    # Crear un diccionario para actualizar solo los campos que se pasen en data
    campos_a_actualizar = {}

    if 'fecha' in data:
        campos_a_actualizar['fecha'] = data['fecha']
    if 'hora' in data:
        campos_a_actualizar['hora'] = data['hora']
    if 'locacion' in data:
        campos_a_actualizar['locacion'] = data['locacion']
    if 'servicio' in data:
        campos_a_actualizar['servicio'] = data['servicio']
    if 'colaborador' in data:
        campos_a_actualizar['colaborador'] = data['colaborador']
    if 'disponible' in data:
        campos_a_actualizar['disponible'] = data['disponible']

    # Verificar si hay campos para actualizar
    if not campos_a_actualizar:
        return jsonify({'error': 'No se proporcionaron datos para actualizar'}), 400

    # Actualizar la cita solo con los campos presentes
    citas_collection.update_one({'_id': ObjectId(cita_id)}, {'$set': campos_a_actualizar})

    return jsonify({'mensaje': 'Cita actualizada correctamente'}), 200

@app.route('/api/borrarcita/<cita_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def borrar_cita(cita_id):
    try:
        # Intentar convertir cita_id a ObjectId
        cita_obj_id = ObjectId(cita_id)
    except:
        return jsonify({'error': 'ID de cita inválido'}), 400

    # Buscar la cita por su ID
    cita_existente = citas_collection.find_one({'_id': cita_obj_id})

    if not cita_existente:
        return jsonify({'error': 'Cita no encontrada'}), 404

    # Borrar la cita
    result = citas_collection.delete_one({'_id': cita_obj_id})

    if result.deleted_count == 1:
        return jsonify({'mensaje': 'Cita borrada correctamente'}), 200
    else:
        return jsonify({'error': 'Error al borrar la cita'}), 500

if __name__ == '__main__':
    app.run(debug=True)
