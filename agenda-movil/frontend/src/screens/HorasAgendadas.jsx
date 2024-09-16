import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Icon from 'react-native-vector-icons/Ionicons';

const HorasAgendadas = () => {
  const navigation = useNavigation();
  const [citas, setCitas] = useState([]); // Estado para almacenar las citas
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  useEffect(() => {
    // Función para obtener las citas desde la API
    const obtenerCitas = async () => {
      try {
        // Obtener el token desde AsyncStorage
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          Alert.alert('Error', 'No se encontró el token de autenticación.');
          return;
        }

        // Solicitud GET a la API
        const response = await fetch('http://localhost:5000/api/mis_citas', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setCitas(data.citas); // Almacenar las citas en el estado
        } else {
          Alert.alert('Error', data.error || 'Error al obtener las citas');
        }
      } catch (error) {
        Alert.alert('Error', 'Hubo un problema al conectar con la API.');
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    };

    obtenerCitas();
  }, []);

  const handleInfoPress = (fecha, hora, lugar, servicio, profesional) => {
    navigation.navigate('HoraDetalle', { fecha, hora, lugar, servicio, profesional });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Image 
          source={require('../assets/img/logo_muni.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Horas agendadas</Text>

      {citas.length > 0 ? (
        citas.map((cita) => (
          <View key={cita._id} style={styles.card}>
            <Text style={styles.dateText}>{cita.fecha}</Text>
            <Text style={styles.timeText}>{cita.locacion}</Text>
            <Text style={styles.serviceText}>{cita.servicio}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.infoButton} 
                onPress={() => handleInfoPress(cita.fecha, cita.hora, cita.locacion, cita.servicio, cita.colaborador)}
              >
                <Text style={styles.buttonText}>INFORMACIÓN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.buttonText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text>No tienes citas agendadas.</Text>
      )}
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
  card: {
    backgroundColor: '#81C3FF',
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    position: 'relative', 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeText: {
    position: 'absolute', 
    top: 15, 
    right: 15, 
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },
  serviceText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    borderRadius: 10,
    top: 10,
    left: 10,
    backgroundColor: '#81C3FF',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HorasAgendadas;
