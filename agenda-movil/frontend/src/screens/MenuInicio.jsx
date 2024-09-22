import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { LinearGradient } from 'expo-linear-gradient'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 


const MenuInicio = () => {
  const navigation = useNavigation();

  const Logout = async () => {
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
    <LinearGradient
      colors={['#55A9F9', '#003B88']} // Degradado de fondo
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={['#260e86', '#003B88']} // Degradado para el header
          style={styles.header}
        >
          <Image
            source={require('../assets/img/logo_muni.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </LinearGradient>
        <Text style={styles.title}>Menu de Inicio</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HorariosDisponibles')}
        > 
          <Icon name="calendar" size={20} color="black" style={styles.icon} /> 
          <Text style={styles.buttonText}>Horarios Disponibles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HorasAgendadas')}
        >
          <Icon name="clock-o" size={20} color="black" style={styles.icon} />
          <Text style={styles.buttonText}>Horas Agendadas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={Logout}
        >
          <Icon name="sign-out" size={20} color="black" style={styles.icon} />
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
  },
  content: {
    flexGrow: 1,
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
    fontSize: 38,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: 'black',
    marginVertical: 25,
  },
  button: {
    flexDirection: 'row', 
    backgroundColor: '#81C3FF',
    paddingVertical: 20,
    paddingHorizontal: 25, 
    borderRadius: 30, 
    marginVertical: 12, 
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center', 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8, 
  },
  icon: {
    marginRight: 15, 
  },
  buttonText: {
    fontSize: 22, 
    fontFamily: 'Roboto',
    color: '#000',
  },
});

export default MenuInicio;
