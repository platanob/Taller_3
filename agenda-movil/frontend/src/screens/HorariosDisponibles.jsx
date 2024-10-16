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

  const obtenerHorarios = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/citas_disponibles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluye el token de acceso en la solicitud
        },
      });
  
      const result = await response.json();
      
      if (response.status === 200) {
        setHorarios(result.citas_disponibles);
        setLoading(false);
      } else {
        Alert.alert("Error", result.error || "No se pudieron obtener los horarios disponibles");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al obtener los horarios disponibles.");
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerHorarios();
  }, []);  

  const infoPress = (fecha, hora, lugar, servicio, profesional) => {
    navigation.navigate('HoraDetalle', { fecha, hora, lugar, servicio, profesional });
  };

  const agendarPress = async (cita_id) => {
    try {
      const confirmar = window.confirm("¿Estás seguro de que quieres agendar esta cita?");
      
      if (!confirmar) return;

      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/agendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Token para la solicitud
        },
        body: JSON.stringify({ cita_id }),  // Manda el ID de la cita
      });
  
      const result = await response.json();
  
      if (response.status === 200) {
        Alert.alert("Éxito", "Cita agendada correctamente");
        obtenerHorarios();
      } else {
        Alert.alert("Error", result.error || "No se pudo agendar la cita");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al agendar la cita.");
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
    <View style={styles.gradientContainer}>
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
                  onPress={() => infoPress(horario.fecha, horario.hora, horario.locacion, horario.servicio, horario.colaborador)}
                >
                  <Text style={styles.buttonText}>INFORMACIÓN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.agendarButton} 
                  onPress={() => agendarPress(horario._id)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    backgroundColor: '#55A9F9',
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
    fontFamily: 'Roboto', 
  },
  placeText: {
    position: 'absolute', 
    top: 15, 
    right: 15, 
    color: 'red',
    fontWeight: 'bold',
    fontFamily: 'Roboto', 
    fontSize: 18,
  },
  serviceText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Roboto', 
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoButton: {
    backgroundColor: '#fff',
    fontSize: 22,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  agendarButton: {
    backgroundColor: '#fff',
    fontSize: 22,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Roboto',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#260e86',
    marginTop: 10,
    fontFamily: 'Roboto', 
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
});

export default Horarios;
