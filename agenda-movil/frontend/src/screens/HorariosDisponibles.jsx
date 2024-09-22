import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient'; 

const Horarios = () => {
  const navigation = useNavigation();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerHorarios = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          Alert.alert('Error', 'No se encontró el token de autenticación.');
          return;
        }

        const response = await fetch('http://localhost:5000/api/citas_disponibles', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setHorarios(data.citas_disponibles);
        } else {
          Alert.alert('Error', data.error || 'Error al obtener los horarios disponibles');
        }
      } catch (error) {
        Alert.alert('Error', 'Hubo un problema al conectar con la API.');
      } finally {
        setLoading(false);
      }
    };

    obtenerHorarios();
  }, []);

  const handleInfoPress = (fecha, hora, lugar, servicio) => {
    navigation.navigate('HoraDetalle', { fecha, hora, lugar, servicio });
  };

  const handleAgendarPress = (citaId) => {
    if (Platform.OS === 'web') {
      window.alert(`¿Estás seguro de que quieres agendar esta cita?`);
      agendarCita(citaId);
    } else {
      Alert.alert(
        'Confirmación de agendar',
        '¿Estás seguro de que quieres agendar esta cita?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Sí',
            onPress: () => agendarCita(citaId),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const agendarCita = async (citaId) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/agendar/${citaId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'La cita ha sido agendada exitosamente.');
        setHorarios(horarios.filter(horario => horario._id !== citaId));
      } else {
        Alert.alert('Error', data.error || 'No se pudo agendar la cita.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al conectar con la API.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../assets/img/fondo.jpg')} 
          style={styles.backgroundImage} 
          resizeMode="cover"
        />
        <ActivityIndicator size="large" color="#260e86" />
        <Text style={styles.loadingText}>CARGANDO HORARIOS DISPONIBLES...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#55A9F9', '#003B88']}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
            colors={['#260e86', '#003B88']} 
            style={styles.header}
          >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <Image 
            source={require('../assets/img/logo_muni.jpg')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </LinearGradient>

        <Text style={styles.title}>Horarios Disponibles</Text>

        {horarios.length > 0 ? (
          horarios.map((horario) => (
            <View key={horario._id} style={styles.card}>
              <Text style={styles.dateText}>{horario.fecha}</Text>
              <Text style={styles.serviceText}>{horario.servicio}</Text>
              <Text style={styles.placeText}>{horario.locacion}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.infoButton} 
                  onPress={() => handleInfoPress(horario.fecha, horario.hora, horario.locacion, horario.servicio)}
                >
                  <Text style={styles.buttonText}>INFORMACIÓN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.agendarButton} 
                  onPress={() => handleAgendarPress(horario._id)}
                >
                  <Text style={styles.buttonText}>AGENDAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noAppointmentsText}>No hay horarios disponibles.</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
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
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dateText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 14,
    color: 'black',
  },
  serviceText: {
    fontSize: 14,
    color: 'black',
    marginTop: 10,
  },
  placeText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  agendarButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 12,
    backgroundColor: '#55A9F9', 
    borderRadius: 50, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, 
  },
  backButtonIcon: {
    color: 'white', 
    fontSize: 25, 
  },
});

export default Horarios;
