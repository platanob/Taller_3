from flask import Flask, jsonify, request
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Configuración de Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

# Conexión a MongoDB
client = MongoClient('mongodb+srv://benja:benja@cluster0.qzervft.mongodb.net/')  # Cambia esto si usas una URL de MongoDB en la nube
db = client['APP']  # Nombre de la base de datos
users_collection = db['usuarios']  # Colección donde se almacenan los usuarios

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

# Ejecutar la aplicación
if __name__ == '__main__':
    app.run(debug=True)
