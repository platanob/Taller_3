import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage para guardar el token

export default function Login() {
  const navigation = useNavigation();
  
  // Definir estado para rut y contraseña por separado
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!rut || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu RUT y contraseña.');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rut: rut,
          contraseña: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guarda el token en AsyncStorage
        await AsyncStorage.setItem('access_token', data.access_token);
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        navigation.navigate('MenuInicio');
      } else {
        Alert.alert('Error', data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con la conexión.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/fondo.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image
          source={require('../assets/img/logo_muni.jpg')}
          style={styles.logo}
        />

        <Text style={styles.title}>Inicio de Sesión</Text>

        <Text style={styles.label}>RUT</Text>
        <TextInput
          placeholder="RUT"
          placeholderTextColor="#000"
          style={styles.input}
          value={rut}
          onChangeText={setRut}  // Actualiza el estado con lo que escriba el usuario
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#000"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}  // Actualiza el estado con lo que escriba el usuario
        />

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Registro')}
        >
          <Text style={styles.buttonText}>REGISTRO</Text>
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
    fontFamily: 'Roboto',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    fontFamily: 'Roboto',
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
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
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});

