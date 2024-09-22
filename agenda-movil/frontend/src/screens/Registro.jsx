import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Registro() {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Validar que todos los campos estén llenos
    if (!nombre || !rut || !correo || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Aquí puedes agregar validaciones adicionales, como formato de correo, formato de RUT, etc.

    // Realizar la petición de registro al servidor
    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: nombre,
        rut: rut,
        correo: correo,
        contraseña: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          // Mostrar mensaje de error en caso de problemas con la API
          Alert.alert('Error', data.error);
        } else {
          // Registro exitoso
          Alert.alert('Éxito', 'Usuario registrado con éxito');
          navigation.navigate('Login'); // Redirigir al login después del registro
        }
      })
      .catch(error => {
        // En caso de error en la comunicación con el servidor
        Alert.alert('Error', 'No se pudo completar el registro. Inténtalo nuevamente más tarde.');
        console.error(error);
      });
  };

  return (
    <ImageBackground
      source={require('../assets/img/fondo.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Integración del logo */}
        <Image
          source={require('../assets/img/logo_muni.jpg')}
          style={styles.logo}
        />

        <Text style={styles.title}>Registro de Usuario</Text>

        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          placeholder="Nombre Completo"
          placeholderTextColor="#000"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>RUT</Text>
        <TextInput
          placeholder="RUT"
          placeholderTextColor="#000"
          style={styles.input}
          value={rut}
          onChangeText={setRut}
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          placeholder="Correo Electrónico"
          placeholderTextColor="#000"
          keyboardType="email-address"
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#000"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#000"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTRARME</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(240, 205, 117, 0.9)',
    width: '80%',
    alignItems: 'center',
  },
  logo: {
    width: 150, 
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20, 
  },
  title: {
    fontSize: 30,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  label: {
    fontSize: 18,
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#81C3FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});
