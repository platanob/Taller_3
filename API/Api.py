from flask import Flask, jsonify, request, send_file
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from functools import wraps
import gridfs
from datetime import datetime, timedelta
from io import BytesIO  # Para manejar archivos en memoria
import calendar
import os 

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Cambia esto por una clave secreta más segura en producción
# Configuración de CORS
# Configuración de CORS para permitir solicitudes desde tu frontend web y móvil (Expo)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:8081/",
            "http://localhost:19006",  # Expo Web
            "http://127.0.0.1:19006",  # Variación de Expo Web
            "http://localhost:3000",  # Frontend en React o similar
            "http://127.0.0.1:3000",  # Variación de localhost para React
            "http://localhost:5000",  # Backend local
            "http://127.0.0.1:5000",  # Variación para el backend local
            "https://agendasenior-z6ii.onrender.com",  # Frontend desplegado
        ],
        "methods": ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
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

# Obtener el puerto desde la variable de entorno PORT (por defecto es 5000)
port = int(os.environ.get("PORT", 5000))
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
        localidad = data.get('localidad')
        fechaNacimiento = data.get('fechaNacimiento')  # Cambié 'edad' por 'fecha_nacimiento'
        password = data.get('contrasena')
        discapacidad = data.get('discapacidad') == 'true'  # Convertir a booleano
        carnet_discapacidad = None

        # Verificar que los campos de texto están presentes
        if not nombre or not rut or not correo or not password:
            return jsonify({"error": "Todos los campos (nombre, rut, correo, contraseña) son requeridos"}), 400

        # Verificar que no exista un usuario con el mismo correo o rut
        if users_collection.find_one({"correo": correo}):
            return jsonify({"error": "El correo ya está registrado"}), 400
        
        if usuarios_nuevos.find_one({"correo": correo}):
            return jsonify({"error": "El correo ya está registrado"}), 400

        if users_collection.find_one({"rut": rut}):
            return jsonify({"error": "El RUT ya existe en la base de datos"}), 400
        
        if usuarios_nuevos.find_one({"rut": rut}):
            return jsonify({"error": "El RUT ya existe en la base de datos"}), 400

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

        # Verificar que las imágenes sean válidas
        if carnet_frontal.filename == '' or not carnet_frontal.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            return jsonify({"error": "Debes subir una imagen válida para el carnet frontal"}), 400

        if carnet_trasero.filename == '' or not carnet_trasero.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            return jsonify({"error": "Debes subir una imagen válida para el carnet trasero"}), 400

        # Guardar las imágenes en GridFS
        carnet_frontal_id = fs.put(carnet_frontal, filename=carnet_frontal.filename)
        carnet_trasero_id = fs.put(carnet_trasero, filename=carnet_trasero.filename)

        # Verificar si se sube el carnet de discapacidad
        if discapacidad:
            if 'carnet_discapacidad' not in request.files:
                return jsonify({"error": "El archivo de carnet de discapacidad es requerido"}), 400
            
            carnet_discapacidad = request.files['carnet_discapacidad']
            if carnet_discapacidad.filename == '' or not carnet_discapacidad.filename.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg')):
                return jsonify({"error": "Debes subir un archivo válido para el carnet de discapacidad"}), 400
            
            # Guardar el carnet de discapacidad en GridFS
            carnet_discapacidad_id = fs.put(carnet_discapacidad, filename=carnet_discapacidad.filename)

        # Hashear la contraseña
        hashed_password = generate_password_hash(password)

        # Insertar los datos del nuevo usuario en la base de datos
        usuario_data = {
            "rut": rut,
            "password": hashed_password,
            "nombre": nombre,
            "correo": correo,
            "localidad": localidad,
            "fechaNacimiento": fechaNacimiento,
            "pdf_id": pdf_id,  # ID del archivo PDF en GridFS
            "carnet_frontal_id": carnet_frontal_id,  # ID de la imagen de carnet frontal
            "carnet_trasero_id": carnet_trasero_id,   # ID de la imagen de carnet trasero
        }

        if discapacidad:
            usuario_data["discapacidad"] = True
            usuario_data["carnet_discapacidad_id"] = carnet_discapacidad_id  # ID del carnet de discapacidad
        else:
            usuario_data["discapacidad"] = False

        usuarios_nuevos.insert_one(usuario_data)

        return jsonify({"message": "Usuario registrado con éxito"}), 201
    
    except Exception as e:
        return jsonify

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


@app.route('/api/citas_disponibles', methods=['GET'])
def citas_disponibles():
    try:
        citas = citas_collection.find({'disponible': True})
        citas_list = []
        
        for cita in citas:
            cita['_id'] = str(cita['_id'])
            colaborador = cuentas_admin.find_one({'_id': ObjectId(cita['colaborador'])}, {'nombre': 1})
            
            if colaborador:
                cita['colaborador'] = colaborador['nombre']
            else:
                cita['colaborador'] = 'Colaborador no encontrado'
            
            citas_list.append(cita)

        return jsonify({'citas_disponibles': citas_list}), 200

    except Exception as e:
        return jsonify({'error': f'Error al obtener citas disponibles: {str(e)}'}), 500

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
        # Convertir el _id a string
        cita['_id'] = str(cita['_id'])
        
        # Obtener el nombre del colaborador por su ID
        colaborador = cuentas_admin.find_one({'_id': cita['colaborador']})
        if colaborador:
            cita['colaborador'] = colaborador['nombre']  # Cambia el ID por el nombre

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
@jwt_required()
@admin_required
def agregar_cuenta():
    data = request.get_json()
    
    nombre = data.get('nombre')
    rut = data.get('rut')
    password = data.get('password')
    admin = data.get('admin', True)
    especialidad = data.get('especialidad', '')  
    
    if not nombre or not rut or not password:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400
    
    if len(rut) < 8 or not rut.replace('.', '').replace('-', '').isdigit():
        return jsonify({'error': 'RUT inválido'}), 400
    
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

@app.route('/api/crear_colaborador', methods=['POST'])
@jwt_required()
@admin_required
def crear_colaborador():
    data = request.get_json()

    nombre = data.get('nombre')
    rut = data.get('rut')
    correo = data.get('correo')
    password = data.get('contrasena')
    especialidad = data.get('especialidad')

    if not nombre or not rut or not password:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    if len(rut) < 8 or not rut.replace('.', '').replace('-', '').isdigit():
        return jsonify({'error': 'RUT inválido'}), 400

    password_hash = generate_password_hash(password)

    colaborador = {
        "nombre": nombre,
        "rut": rut,
        "correo": correo,
        "password": password_hash,
        "admin": False,  
        "especialidad": especialidad,
    }

    # Insertar en la base de datos
    cuentas_admin.insert_one(colaborador)

    return jsonify({'mensaje': 'Colaborador creado exitosamente'}), 201


@app.route('/api/login_web', methods=['POST'])
def iniciar_sesion():
    data = request.get_json()
    rut = data.get('rut')
    password = data.get('password')

    if not rut or not password:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    cuenta = cuentas_admin.find_one({"rut": rut})

    if not cuenta:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    if not check_password_hash(cuenta['password'], password):
        return jsonify({'error': 'Contraseña incorrecta'}), 401

    # Incluir el `_id` en el token
    access_token = create_access_token(identity={
        'rut': rut,
        'admin': cuenta['admin'],
        'id': str(cuenta['_id'])  # Convertir `_id` a cadena
    })

    return jsonify({
        'mensaje': 'Inicio de sesión exitoso',
        'token': access_token,
        'admin': cuenta['admin']
    }), 200

@app.route('/api/nuevashoras_colab', methods=['POST'])
@jwt_required()
def nuevas_horas():
    try:
        data = request.get_json()
        required_fields = ['fecha', 'hora_inicio', 'hora_fin', 'intervalo', 'locacion', 'servicio']

        # Validar que todos los campos necesarios estén presentes
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Faltan datos necesarios'}), 400

        # Obtener el ID del colaborador desde el JWT
        identity = get_jwt_identity()
        colaborador_id = identity['id']

        # Verificar si el colaborador existe en la base de datos
        colaborador = cuentas_admin.find_one({'_id': ObjectId(colaborador_id)})
        if not colaborador:
            return jsonify({'error': 'Colaborador no encontrado'}), 404
        
        # Obtener la especialidad del colaborador
        especialidad = colaborador.get('especialidad', None)
        if not especialidad:
            return jsonify({'error': 'El colaborador no tiene una especialidad asignada'}), 400

        # Convertir las horas y el intervalo
        fecha = data['fecha']
        try:
            hora_inicio = datetime.strptime(f"{fecha} {data['hora_inicio']}", "%Y-%m-%d %H:%M")
            hora_fin = datetime.strptime(f"{fecha} {data['hora_fin']}", "%Y-%m-%d %H:%M")
            intervalo = timedelta(minutes=int(data['intervalo']))
        except ValueError:
            return jsonify({'error': 'Formato incorrecto de fecha u hora'}), 400

        # Validar que la hora de inicio sea menor a la hora de fin
        if hora_inicio >= hora_fin:
            return jsonify({'error': 'La hora de inicio debe ser anterior a la hora de fin'}), 400

        # Crear citas en intervalos
        citas_creadas = []
        hora_actual = hora_inicio

        while hora_actual < hora_fin:
            # Verificar si ya existe una cita para este horario
            cita_existente = citas_collection.find_one({
                'fecha': fecha,
                'hora': hora_actual.time().strftime("%H:%M"),
                'colaborador': ObjectId(colaborador_id)
            })

            if not cita_existente:
                # Crear una nueva cita, incluyendo la especialidad
                nueva_cita = {
                    'fecha': fecha,
                    'hora': hora_actual.time().strftime("%H:%M"),
                    'locacion': data['locacion'],
                    'servicio': especialidad,
                    'colaborador': ObjectId(colaborador_id),
                    'disponible': True
                }
                result = citas_collection.insert_one(nueva_cita)
                citas_creadas.append(str(result.inserted_id))
            else:
                # Opcional: manejar lógica si ya existe una cita (por ejemplo, ignorar o notificar)
                continue

            # Avanzar al siguiente intervalo
            hora_actual += intervalo

        return jsonify({
            'mensaje': f'Se crearon {len(citas_creadas)} nuevas citas.',
            'citas_creadas': citas_creadas
        }), 201

    except Exception as e:
        return jsonify({'error': f'Error al crear nuevas horas: {str(e)}'}), 500

@app.route('/api/nuevashoras_admin', methods=['POST'])
@jwt_required()
def nuevashoras():
    data = request.get_json()
    required_fields = ['fecha', 'hora_inicio', 'hora_fin', 'intervalo', 'locacion', 'servicio', 'colaborador']

    # Verificar si faltan datos requeridos
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan datos necesarios'}), 400

    rut_colaborador = data['colaborador']
    colaborador = cuentas_admin.find_one({'rut': rut_colaborador})

    # Verificar si el colaborador existe
    if not colaborador:
        return jsonify({'error': 'Colaborador no encontrado con el RUT proporcionado'}), 404

    # Verificar si el colaborador no es un administrador
    if colaborador.get('admin', True):  # Si el campo 'admin' no existe, asume que es True (es admin)
        return jsonify({'error': 'El colaborador proporcionado es un administrador, no se pueden asignar citas'}), 403

    # Convertir las horas y el intervalo
    fecha = data['fecha']
    hora_inicio = datetime.strptime(f"{fecha} {data['hora_inicio']}", "%Y-%m-%d %H:%M")
    hora_fin = datetime.strptime(f"{fecha} {data['hora_fin']}", "%Y-%m-%d %H:%M")
    intervalo = timedelta(minutes=int(data['intervalo']))

    # Verificar que la hora de inicio es menor que la hora de fin
    if hora_inicio >= hora_fin:
        return jsonify({'error': 'La hora de inicio debe ser anterior a la hora de fin'}), 400

    # Crear citas en intervalos
    citas_creadas = []
    hora_actual = hora_inicio
    while hora_actual <= hora_fin:
        cita = {
            'fecha': fecha,
            'hora': hora_actual.time().strftime("%H:%M"),
            'locacion': data['locacion'],
            'servicio': data['servicio'],
            'colaborador': colaborador['_id'],
            'disponible': True
        }
        result = citas_collection.insert_one(cita)
        citas_creadas.append(str(result.inserted_id))
        hora_actual += intervalo

    return jsonify({'citas_creadas': citas_creadas}), 201


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
    



"""
░█████╗░██╗░░░██╗███████╗███╗░░██╗████████╗░█████╗░░██████╗  ░█████╗░██████╗░███╗░░░███╗██╗███╗░░██╗
██╔══██╗██║░░░██║██╔════╝████╗░██║╚══██╔══╝██╔══██╗██╔════╝  ██╔══██╗██╔══██╗████╗░████║██║████╗░██║
██║░░╚═╝██║░░░██║█████╗░░██╔██╗██║░░░██║░░░███████║╚█████╗░  ███████║██║░░██║██╔████╔██║██║██╔██╗██║
██║░░██╗██║░░░██║██╔══╝░░██║╚████║░░░██║░░░██╔══██║░╚═══██╗  ██╔══██║██║░░██║██║╚██╔╝██║██║██║╚████║
╚█████╔╝╚██████╔╝███████╗██║░╚███║░░░██║░░░██║░░██║██████╔╝  ██║░░██║██████╔╝██║░╚═╝░██║██║██║░╚███║
░╚════╝░░╚═════╝░╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░  ╚═╝░░╚═╝╚═════╝░╚═╝░░░░░╚═╝╚═╝╚═╝░░╚══╝"""
@app.route('/api/obtener_cuentas', methods=['GET'])
@jwt_required()
@admin_required
def obtener_cuentas():
    try:
        cuentas = list(cuentas_admin.find({}, {'nombre': 1, 'rut': 1, 'correo': 1, 'admin': 1, 'especialidad': 1}))
        
        for cuenta in cuentas:
            cuenta['_id'] = str(cuenta['_id'])
        
        if not cuentas:
            return jsonify({'mensaje': 'No se encontraron cuentas'}), 404

        return jsonify({'cuentas': cuentas}), 200
    
    except Exception as e:
        return jsonify({'error': f'Error al obtener cuentas: {str(e)}'}), 500
    
@app.route('/api/obtener_cuenta_actual', methods=['GET'])
@jwt_required()
def obtener_cuenta_actual():
    try:
        identidad = get_jwt_identity()  # Obtiene la identidad del token
        cuenta = cuentas_admin.find_one({'_id': ObjectId(identidad['id'])}, {'nombre': 1, 'rut': 1, 'correo': 1})

        if not cuenta:
            return jsonify({'mensaje': 'Cuenta no encontrada'}), 404

        cuenta['_id'] = str(cuenta['_id'])
        return jsonify({'cuenta': cuenta}), 200
    except Exception as e:
        return jsonify({'error': f'Error al obtener cuenta: {str(e)}'}), 500

@app.route('/api/editar_cuenta/<id>', methods=['PUT'])
@jwt_required()
@admin_required
def editar_cuenta(id):
    try:
        cuenta_id = ObjectId(id)
        
        data = request.get_json()
        
        actualizacion = {}
        if 'nombre' in data:
            actualizacion['nombre'] = data['nombre']
        if 'rut' in data:
            actualizacion['rut'] = data['rut']
        if 'password' in data:
            actualizacion['password'] = generate_password_hash(data['password'])  
        if 'admin' in data:
            actualizacion['admin'] = data['admin']
        if 'especialidad' in data:
            actualizacion['especialidad'] = data['especialidad']
        
        if not actualizacion:
            return jsonify({'error': 'No se enviaron campos para actualizar'}), 400

        resultado = cuentas_admin.update_one({'_id': cuenta_id}, {'$set': actualizacion})
        
        if resultado.matched_count == 0:
            return jsonify({'error': 'No se encontró la cuenta con el ID proporcionado'}), 404
        
        return jsonify({'mensaje': 'Cuenta actualizada exitosamente'}), 200
    
    except Exception as e:
        return jsonify({'error': f'Error al actualizar cuenta: {str(e)}'}), 500

@app.route('/api/eliminar_cuenta/<id>', methods=['DELETE'])
@jwt_required()
@admin_required
def eliminar_cuenta(id):
    try:
        cuenta_id = ObjectId(id)
        
        resultado = cuentas_admin.delete_one({'_id': cuenta_id})
        
        if resultado.deleted_count == 0:
            return jsonify({'error': 'No se encontró la cuenta con el ID proporcionado'}), 404
        
        return jsonify({'mensaje': 'Cuenta eliminada exitosamente'}), 200
    
    except Exception as e:
        return jsonify({'error': f'Error al eliminar cuenta: {str(e)}'}), 500

@app.route('/api/usuarios_por_especialidad', methods=['GET'])
@jwt_required()
def usuarios_por_especialidad():
    try:
        # Consulta a la base de datos para obtener usuarios que no son admin
        usuarios_no_admin = list(cuentas_admin.find({'admin': False}))
        
        # Agrupamos los usuarios por especialidad
        agrupados_por_especialidad = {}
        for usuario in usuarios_no_admin:
            especialidad = usuario.get('especialidad', 'Sin Especialidad')
            if especialidad not in agrupados_por_especialidad:
                agrupados_por_especialidad[especialidad] = []
            agrupados_por_especialidad[especialidad].append({
                'nombre': usuario.get('nombre'),
                'rut': usuario.get('rut'),
                '_id': str(usuario['_id'])
            })
        
        return jsonify(agrupados_por_especialidad), 200
    
    except Exception as e:
        return jsonify({'error': f'Error al obtener usuarios por especialidad: {str(e)}'}), 500

"""
░█████╗░██╗░░░██╗███████╗███╗░░██╗████████╗░█████╗░░██████╗
██╔══██╗██║░░░██║██╔════╝████╗░██║╚══██╔══╝██╔══██╗██╔════╝
██║░░╚═╝██║░░░██║█████╗░░██╔██╗██║░░░██║░░░███████║╚█████╗░
██║░░██╗██║░░░██║██╔══╝░░██║╚████║░░░██║░░░██╔══██║░╚═══██╗
╚█████╔╝╚██████╔╝███████╗██║░╚███║░░░██║░░░██║░░██║██████╔╝
░╚════╝░░╚═════╝░╚══════╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░

██╗░░░██╗░██████╗██╗░░░██╗░█████╗░██████╗░██╗░█████╗░░██████╗
██║░░░██║██╔════╝██║░░░██║██╔══██╗██╔══██╗██║██╔══██╗██╔════╝
██║░░░██║╚█████╗░██║░░░██║███████║██████╔╝██║██║░░██║╚█████╗░
██║░░░██║░╚═══██╗██║░░░██║██╔══██║██╔══██╗██║██║░░██║░╚═══██╗
╚██████╔╝██████╔╝╚██████╔╝██║░░██║██║░░██║██║╚█████╔╝██████╔╝
░╚═════╝░╚═════╝░░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░╚════╝░╚═════╝░"""


@app.route('/api/obtener_usuarios', methods=['GET'])
@jwt_required()
@admin_required
def obtener_usuarios():
    try:
        
        usuarios = list(users_collection.find({}, {'rut': 1, 'nombre': 1, 'correo': 1, 'discapacidad': 1, 'localidad': 1, 'fechaNacimiento': 1, '_id': 1}))

        # Convertir ObjectId a string
        for usuario in usuarios:
            usuario['_id'] = str(usuario['_id'])

        if not usuarios:
            return jsonify({'mensaje': 'No se encontraron usuarios'}), 404

        return jsonify({'usuarios': usuarios}), 200
    
    except Exception as e:
        return jsonify({'error': f'Error al obtener usuarios: {str(e)}'}), 500

@app.route('/api/editar_usuario/<id>', methods=['PUT'])
@jwt_required()
@admin_required
def editar_usuario(id):
    try:
        usuario_id = ObjectId(id)
        
        data = request.get_json()


        actualizacion = {}
        if 'nombre' in data:
            actualizacion['nombre'] = data['nombre']
        if 'rut' in data:
            actualizacion['rut'] = data['rut']
        if 'localidad' in data:
            actualizacion['localidad'] = data['localidad']
        if 'password' in data:
            actualizacion['password'] = generate_password_hash(data['password'])  


        if not actualizacion:
            return jsonify({'error': 'No se enviaron campos para actualizar'}), 400


        resultado = users_collection.update_one({'_id': usuario_id}, {'$set': actualizacion})
        
        if resultado.matched_count == 0:
            return jsonify({'error': 'No se encontró el usuario con el ID proporcionado'}), 404
        
        return jsonify({'mensaje': 'Usuario actualizado exitosamente'}), 200
    
    except Exception as e:
        return jsonify({'error': f'Error al actualizar usuario: {str(e)}'}), 500

@app.route('/api/eliminar_usuario/<id>', methods=['DELETE'])
@jwt_required()
@admin_required
def eliminar_usuario(id):
    try:
        usuario_id = ObjectId(id)

        resultado = users_collection.delete_one({'_id': usuario_id})
        
        if resultado.deleted_count == 0:
            return jsonify({'error': 'No se encontró el usuario con el ID proporcionado'}), 404
        
        return jsonify({'mensaje': 'Usuario eliminado exitosamente'}), 200
    
    except Exception as e:
        return jsonify({'error': f'Error al eliminar usuario: {str(e)}'}), 500


@app.route('/api/obtener_usuarios_nuevos', methods=['GET'])
@jwt_required()
@admin_required
def obtener_usuarios_nuevos():
    try:
        usuarios = list(usuarios_nuevos.find({}, {
            'nombre': 1,
            'rut': 1,
            'correo': 1,
            'pdf_id': 1,
            'carnet_frontal_id': 1,
            'carnet_trasero_id': 1,
            'fechaNacimiento': 1,
            'localidad': 1,
            'discapacidad': 1,
            'carnet_discapacidad_id': 1,
            '_id': 1
        }))
        
        for usuario in usuarios:
            usuario['_id'] = str(usuario['_id'])
            usuario['pdf_id'] = str(usuario.get('pdf_id', ''))
            usuario['carnet_frontal_id'] = str(usuario.get('carnet_frontal_id', ''))
            usuario['carnet_trasero_id'] = str(usuario.get('carnet_trasero_id', ''))
            usuario['carnet_discapacidad_id'] = str(usuario.get('carnet_discapacidad_id', ''))  # Convertir a string si existe

        if not usuarios:
            return jsonify({'mensaje': 'No se encontraron usuarios'}), 404

        return jsonify({'usuarios': usuarios}), 200

    except Exception as e:
        return jsonify({'error': f'Error al obtener los usuarios: {str(e)}'}), 500

@app.route('/api/obtener_archivo/<id>', methods=['GET'])
@jwt_required()
@admin_required
def obtener_archivo(id):
    try:
        # Recuperar el archivo de GridFS usando el ID
        file_data = fs.get(ObjectId(id))

        # Devolver el archivo
        return send_file(BytesIO(file_data.read()), download_name=file_data.filename, as_attachment=True)

    except Exception as e:
        return jsonify({"error": f"Error al obtener el archivo: {str(e)}"}), 404

@app.route('/api/aceptar_usuario/<usuario_id>', methods=['POST'])
@jwt_required()
@admin_required
def aceptar_usuario(usuario_id):
    try:
        usuario_nuevo = usuarios_nuevos.find_one({'_id': ObjectId(usuario_id)}, {
            'nombre': 1,
            'rut': 1,
            'correo': 1,
            'password': 1,
            'pdf_id': 1,
            'carnet_frontal_id': 1,
            'carnet_trasero_id': 1,
            'fechaNacimiento': 1,
            'localidad': 1,
            'discapacidad': 1,
            'carnet_discapacidad_id': 1
        })

        if not usuario_nuevo:
            return jsonify({'mensaje': 'Usuario no encontrado en usuarios_nuevos'}), 404
        
        # Filtrar los campos que se van a insertar en users_collection
        usuario_filtrado = {
            'nombre': usuario_nuevo['nombre'],
            'rut': usuario_nuevo['rut'],
            'correo': usuario_nuevo['correo'],
            'password': usuario_nuevo['password'],
            'fechaNacimiento': usuario_nuevo.get('fechaNacimiento'),  # Agregar edad
            'localidad': usuario_nuevo.get('localidad'),  # Agregar sector
            'discapacidad': usuario_nuevo.get('discapacidad'),  # Agregar discapacidad 
        }

        # Insertar el usuario en la colección de usuarios
        result = users_collection.insert_one(usuario_filtrado)

        # Eliminar archivos de GridFS
        if 'pdf_id' in usuario_nuevo:
            fs.delete(ObjectId(usuario_nuevo['pdf_id']))
        if 'carnet_frontal_id' in usuario_nuevo:
            fs.delete(ObjectId(usuario_nuevo['carnet_frontal_id']))
        if 'carnet_trasero_id' in usuario_nuevo:
            fs.delete(ObjectId(usuario_nuevo['carnet_trasero_id']))
        if 'carnet_discapacidad_id' in usuario_nuevo:  # También eliminar el carnet de discapacidad
            fs.delete(ObjectId(usuario_nuevo['carnet_discapacidad_id']))

        # Eliminar el usuario de la colección de usuarios nuevos
        usuarios_nuevos.delete_one({'_id': ObjectId(usuario_id)})

        return jsonify({
            'mensaje': 'Usuario aceptado, transferido a users_collection y archivos eliminados',
            'usuario_id': str(result.inserted_id)
        }), 200

    except Exception as e:
        return jsonify({'error': f'Error al aceptar el usuario: {str(e)}'}), 500

@app.route('/api/eliminar_usuario_nuevo/<usuario_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def eliminar_usuario_nuevo(usuario_id):
    try:
        usuario_nuevo = usuarios_nuevos.find_one({'_id': ObjectId(usuario_id)}, {
            'pdf_id': 1,
            'carnet_frontal_id': 1,
            'carnet_trasero_id': 1
        })

        if not usuario_nuevo:
            return jsonify({'mensaje': 'Usuario no encontrado en usuarios_nuevos'}), 404

        if 'pdf_id' in usuario_nuevo:
            fs.delete(ObjectId(usuario_nuevo['pdf_id']))
        if 'carnet_frontal_id' in usuario_nuevo:
            fs.delete(ObjectId(usuario_nuevo['carnet_frontal_id']))
        if 'carnet_trasero_id' in usuario_nuevo:
            fs.delete(ObjectId(usuario_nuevo['carnet_trasero_id']))
            
        usuarios_nuevos.delete_one({'_id': ObjectId(usuario_id)})

        return jsonify({'mensaje': 'Usuario y archivos eliminados correctamente'}), 200

    except Exception as e:
        return jsonify({'error': f'Error al eliminar el usuario: {str(e)}'}), 500
    
@app.route('/api/colaborador_info', methods=['GET'])
@jwt_required()
def obtener_colaborador():
    identidad = get_jwt_identity()
    rut = identidad.get('rut')

    colaborador = cuentas_admin.find_one({"rut": rut}, {"_id": 1, "nombre": 1, "rut": 1, "correo": 1, "especialidad": 1})

    if not colaborador:
        return jsonify({'error': 'Colaborador no encontrado'}), 404

    colaborador['_id'] = str(colaborador['_id'])

    return jsonify(colaborador), 200

@app.route('/api/asistencia_cita', methods=['POST'])
@jwt_required()
def asistencia_cita():
    try:
        # Obtener los datos enviados en la solicitud
        data = request.get_json()
        cita_id = data.get('cita_id')

        if not cita_id:
            return jsonify({'error': 'El campo cita_id es obligatorio'}), 400

        # Buscar la cita por su ID
        cita = citas_collection.find_one({'_id': ObjectId(cita_id)})
        if not cita:
            return jsonify({'error': 'Cita no encontrada'}), 404

        # Obtener los IDs del usuario y del colaborador relacionados con la cita
        usuario_id = cita.get('usuario')
        colaborador_id = cita.get('colaborador')

        if not usuario_id or not colaborador_id:
            return jsonify({'error': 'Faltan datos en la cita para procesar la asistencia'}), 400

        # Preparar el registro de la cita para agregar al historial
        registro_historial = {
            'cita_id': cita_id,
            'fecha': cita.get('fecha'),
            'hora': cita.get('hora'),
            'locacion': cita.get('locacion'),
            'servicio': cita.get('servicio')
        }

        # Agregar la cita al historial del usuario
        users_collection.update_one(
            {'_id': ObjectId(usuario_id)},
            {'$push': {'historial_de_citas': registro_historial}}
        )

        # Agregar la cita al historial del colaborador
        cuentas_admin.update_one(
            {'_id': ObjectId(colaborador_id)},
            {'$push': {'historial_de_citas': registro_historial}}
        )

        # Eliminar la cita de la colección
        citas_collection.delete_one({'_id': ObjectId(cita_id)})

        return jsonify({'mensaje': 'La cita ha sido registrada en el historial y eliminada de la colección'}), 200

    except Exception as e:
        return jsonify({'error': f'Error al procesar la asistencia de la cita: {str(e)}'}), 500

@app.route('/api/citas_colaborador', methods=['GET'])
@jwt_required()
def obtener_citas_colaborador():
    try:
        # Obtener la fecha y el colaborador desde los parámetros de la solicitud
        fecha = request.args.get('fecha')
        identity = get_jwt_identity()  # ID del colaborador obtenido del JWT
        colaborador_id = identity['id']

        if not fecha:
            return jsonify({'error': 'La fecha es obligatoria'}), 400

        # Verificar el formato de la fecha
        try:
            fecha_obj = datetime.strptime(fecha, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({'error': 'El formato de la fecha debe ser YYYY-MM-DD'}), 400

        # Buscar las citas del colaborador para la fecha específica
        citas = list(citas_collection.find(
            {'colaborador': ObjectId(colaborador_id), 'fecha': fecha},
            {'_id': 1, 'hora': 1, 'locacion': 1, 'servicio': 1, 'usuario_id': 1, 'disponible': 1}  # Campos relevantes
        ))

        if not citas:
            return jsonify({'mensaje': 'No se encontraron citas para la fecha especificada'}), 404

        # Convertir ObjectId a string y preparar la respuesta
        for cita in citas:
            cita['_id'] = str(cita['_id'])  # Convertir _id a string para JSON
            cita['usuario_id'] = cita.get('usuario_id', None)  # Asegurar consistencia de usuario_id
            cita['disponible'] = cita.get('disponible', True)  # Asegurar que disponible tenga un valor

        return jsonify({'citas': citas}), 200

    except Exception as e:
        return jsonify({'error': f'Error al obtener las citas: {str(e)}'}), 500

@app.route('/api/citas_por_dia', methods=['POST'])
@jwt_required()
@admin_required
def obtener_citas_por_dia():
    try:
        # Obtener los datos desde el cuerpo de la solicitud
        data = request.get_json()
        if not data or 'mes' not in data:
            return jsonify({'error': 'El mes es obligatorio y debe ser enviado en el cuerpo (formato JSON, clave: "mes")'}), 400

        mes = data['mes']  # Ejemplo: "2024-11"

        # Verificar el formato del mes
        try:
            fecha_obj = datetime.strptime(mes, "%Y-%m")  # Convierte a un objeto datetime
        except ValueError:
            return jsonify({'error': 'El formato del mes debe ser YYYY-MM'}), 400

        # Definir el rango de fechas para el mes solicitado
        inicio_mes = fecha_obj.replace(day=1)
        _, ultimo_dia = calendar.monthrange(fecha_obj.year, fecha_obj.month)  # Último día del mes
        fin_mes = fecha_obj.replace(day=ultimo_dia)

        # Consultar citas en MongoDB dentro del rango de fechas
        citas = list(citas_collection.find(
            {
                'fecha': {'$gte': inicio_mes.strftime("%Y-%m-%d"), '$lte': fin_mes.strftime("%Y-%m-%d")}
            },
            {'_id': 1, 'fecha': 1, 'disponible': 1}  # Solo traemos estos campos relevantes
        ))

        if not citas:
            return jsonify({'mensaje': 'No se encontraron citas para el mes especificado'}), 404

        # Crear un diccionario para contar citas por día
        resumen_citas = {}
        for dia in range(1, ultimo_dia + 1):
            fecha_actual = fecha_obj.replace(day=dia).strftime("%Y-%m-%d")
            resumen_citas[fecha_actual] = {'disponibles': 0, 'tomadas': 0}

        # Contar las citas disponibles y tomadas por día
        for cita in citas:
            fecha_cita = cita['fecha']
            if fecha_cita in resumen_citas:
                if cita.get('disponible', False):
                    resumen_citas[fecha_cita]['disponibles'] += 1
                else:
                    resumen_citas[fecha_cita]['tomadas'] += 1

        # Preparar la respuesta
        return jsonify({'resumen': resumen_citas}), 200

    except Exception as e:
        return jsonify({'error': f'Error al obtener las citas: {str(e)}'}), 500

@app.route('/api/citas_por_servicio', methods=['POST'])
@jwt_required()
@admin_required
def obtener_citas_por_servicio():
    try:
        # Obtener los datos desde el cuerpo de la solicitud
        data = request.get_json()
        if not data or 'fecha' not in data:
            return jsonify({'error': 'La fecha es obligatoria (formato YYYY-MM-DD)'}), 400

        fecha = data['fecha']  # Ejemplo: "2024-11-22"

        # Verificar el formato de la fecha
        try:
            fecha_obj = datetime.strptime(fecha, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({'error': 'El formato de la fecha debe ser YYYY-MM-DD'}), 400

        # Consultar todas las citas en MongoDB para la fecha específica
        citas = list(citas_collection.find(
            {
                'fecha': fecha
            },
            {'_id': 1, 'hora': 1, 'servicio': 1, 'usuario': 1, 'disponible': 1}  # Campos relevantes
        ))

        if not citas:
            return jsonify({'mensaje': 'No se encontraron citas para la fecha especificada'}), 404

        # Agrupar las citas por servicio
        citas_por_servicio = {}
        for cita in citas:
            servicio = cita.get('servicio', 'Sin servicio')  # Manejar el caso de servicios no definidos
            if servicio not in citas_por_servicio:
                citas_por_servicio[servicio] = []
            # Agregar detalles de la cita al servicio correspondiente
            citas_por_servicio[servicio].append({
                'id': str(cita['_id']),
                'hora': cita['hora'],
                'usuario': str(cita['usuario']) if 'usuario' in cita else None,
                'disponible': cita.get('disponible', False)
            })

        # Preparar la respuesta
        return jsonify({'citas_por_servicio': citas_por_servicio}), 200

    except Exception as e:
        return jsonify({'error': f'Error al obtener las citas: {str(e)}'}), 500

@app.route('/api/citas_todas', methods=['GET'])
@jwt_required()
def citas_colab():
    identidad = get_jwt_identity()
    usuario_id = identidad.get('id')  # Extraer el _id del colaborador desde el token

    if not usuario_id:
        return jsonify({'error': 'No se encontró el ID del colaborador'}), 400

    # Convertir el ID a ObjectId
    usuario_obj_id = ObjectId(usuario_id)

    # Obtener las citas asociadas al colaborador
    citas = citas_collection.find({'colaborador': usuario_obj_id})
    citas_list = []

    for cita in citas:
        cita['_id'] = str(cita['_id'])  # Convertir el _id de la cita a string
        colaborador = cuentas_admin.find_one({'_id': ObjectId(cita['colaborador'])})

        if colaborador:
            cita['colaborador'] = colaborador['nombre']  # Reemplazar ID por el nombre del colaborador

        citas_list.append(cita)

    return jsonify({'citas': citas_list}), 200

@app.route('/api/registrar_asistencia', methods=['POST'])
@jwt_required()
def registrar_asistencia():
    data = request.get_json()
    if 'cita_id' not in data or 'asistencia' not in data:
        return jsonify({'error': 'Se requieren el ID de la cita y el estado de asistencia'}), 400

    cita_id = data['cita_id']
    asistencia = data['asistencia'] 
    
    try:
        cita_object_id = ObjectId(cita_id)
    except:
        return jsonify({'error': 'ID de cita no válido'}), 400

    cita = citas_collection.find_one({'_id': cita_object_id})
    if not cita:
        return jsonify({'error': 'Cita no encontrada'}), 404

    update_result = citas_collection.update_one(
        {'_id': cita_object_id},
        {'$set': {'asistencia': asistencia}}
    )

    if update_result.modified_count == 1:
        return jsonify({'message': 'Asistencia registrada correctamente'}), 200
    else:
        return jsonify({'error': 'No se pudo registrar la asistencia'}), 500
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port)
