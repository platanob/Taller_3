import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de haber instalado este paquete

const MenuInicio = () => {
  const navigation = useNavigation();
const handleLogout = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token'); // Obtén el token almacenado

    const response = await fetch('http://127.0.0.1:5000/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado
      },
      credentials: 'include', 
    });

    const data = await response.json();
    if (response.ok) {
      Alert.alert('Éxito', 'Has cerrado sesión exitosamente');
      await AsyncStorage.removeItem('access_token'); // Elimina el token del almacenamiento local
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', data.message || 'Error al cerrar sesión');
    }
  } catch (error) {
    Alert.alert('Error', 'Hubo un problema con la conexión.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/img/logo_muni.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Menu de Inicio</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HorariosDisponibles')} 
      >
        <Text style={styles.buttonText}>Horarios Disponibles</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HorasAgendadas')}
      >
        <Text style={styles.buttonText}>Horas Agendadas</Text>
      </TouchableOpacity>

      {/* Botón para cerrar sesión */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#55A9F9',
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#260e86',
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
    zIndex: 1,
  },
  logo: {
    width: 100,
    height: 80,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#81C3FF', 
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default MenuInicio;
