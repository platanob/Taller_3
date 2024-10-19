from flask import Flask, jsonify, request, send_file
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from functools import wraps
import gridfs
from io import BytesIO  # Para manejar archivos en memoria

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Cambia esto por una clave secreta más segura en producción

# Configuración de CORS
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  
        "methods": ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
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
@app.route('/api/nuevashoras_colab', methods=['POST'])
@jwt_required()
def nuevas_horas():
    data = request.get_json()
    required_fields = ['fecha', 'hora', 'locacion', 'servicio']

    # Verificar que todos los campos requeridos están presentes
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan datos necesarios'}), 400

    # Obtener el ID del colaborador desde el JWT
    colaborador_id = get_jwt_identity()  # Se asume que aquí tienes el ID del colaborador en lugar del RUT

    # Verificar si el colaborador existe en la base de datos
    colaborador = cuentas_admin.find_one({'_id': ObjectId(colaborador_id)})

    if not colaborador:
        return jsonify({'error': 'Colaborador no encontrado'}), 404

    cita = {
        'fecha': data['fecha'],
        'hora': data['hora'],
        'locacion': data['locacion'],
        'servicio': data['servicio'],
        'colaborador': colaborador['_id'],
        'disponible': True
    }

    result = citas_collection.insert_one(cita)
    return jsonify({'cita_id': str(result.inserted_id)}), 201

@app.route('/api/nuevashoras_admin', methods=['POST'])
@jwt_required()
def nuevashoras():
    data = request.get_json()
    required_fields = ['fecha', 'hora', 'locacion', 'servicio', 'colaborador']

    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan datos necesarios'}), 400

    rut_colaborador = data['colaborador']
    colaborador = cuentas_admin.find_one({'rut': rut_colaborador})

    if not colaborador:
        return jsonify({'error': 'Colaborador no encontrado con el RUT proporcionado'}), 404

    cita = {
        'fecha': data['fecha'],
        'hora': data['hora'],
        'locacion': data['locacion'],
        'servicio': data['servicio'],
        'colaborador': colaborador['_id'], 
        'disponible': True
    }

    result = citas_collection.insert_one(cita)
    return jsonify({'cita_id': str(result.inserted_id)}), 201

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
        cuentas = list(cuentas_admin.find({}, {'nombre': 1, 'rut': 1, 'admin': 1, 'especialidad': 1}))
        
        for cuenta in cuentas:
            cuenta['_id'] = str(cuenta['_id'])
        
        if not cuentas:
            return jsonify({'mensaje': 'No se encontraron cuentas'}), 404

        return jsonify({'cuentas': cuentas}), 200
    
    except Exception as e:
        return jsonify({'error': f'Error al obtener cuentas: {str(e)}'}), 500

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
        
        usuarios = list(users_collection.find({}, {'rut': 1, 'nombre': 1, 'correo': 1, '_id': 1}))

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
        if 'correo' in data:
            actualizacion['correo'] = data['correo']
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
            '_id': 1
        }))
        
    
        for usuario in usuarios:
            usuario['_id'] = str(usuario['_id'])
            usuario['pdf_id'] = str(usuario.get('pdf_id', ''))
            usuario['carnet_frontal_id'] = str(usuario.get('carnet_frontal_id', ''))
            usuario['carnet_trasero_id'] = str(usuario.get('carnet_trasero_id', ''))

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
            'carnet_trasero_id': 1
        })

        if not usuario_nuevo:
            return jsonify({'mensaje': 'Usuario no encontrado en usuarios_nuevos'}), 404
        usuario_filtrado = {
            'nombre': usuario_nuevo['nombre'],
            'rut': usuario_nuevo['rut'],
            'correo': usuario_nuevo['correo'],
            'password': usuario_nuevo['password']
        }

        result = users_collection.insert_one(usuario_filtrado)


        if 'pdf_id' in usuario_nuevo:
            fs.delete(ObjectId(usuario_nuevo['pdf_id']))
        if 'carnet_frontal_id' in usuario_nuevo:
            fs.delete(ObjectId(usuario_nuevo['carnet_frontal_id']))
        if 'carnet_trasero_id' in usuario_nuevo:
            fs.delete(ObjectId(usuario_nuevo['carnet_trasero_id']))


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

if __name__ == '__main__':
    app.run(debug=True)
