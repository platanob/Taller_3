import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HorasAgendadas = () => {

  const navegacion = useNavigation();

  const handleInfoPress = (fecha, hora, lugar, servicio, profesional) => {
    navegacion.navigate('HoraDetalle', { fecha, hora, lugar, servicio, profesional });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* Logo de Temuco en la esquina superior derecha */}
        <Image 
          source={require('../assets/img/logo_muni.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Horas agendadas</Text>

      <View style={styles.card}>
        <Text style={styles.dateText}>11/03/24</Text>
        <Text style={styles.timeText}>AMANECER</Text>
        <Text style={styles.serviceText}>PELUQUERIA</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.infoButton} 
            onPress={() => handleInfoPress('11/03/24', '08:00', 'AMANECER', 'PELUQUERIA', 'Dr. Benjamin Carrasco')}
          >
            <Text style={styles.buttonText}>INFORMACION</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tarjeta 2 */}
      <View style={styles.card}>
        <Text style={styles.dateText}>13/03/24</Text>
        <Text style={styles.placeText}>AMANECER</Text>
        <Text style={styles.serviceText}>PODOLOGIA</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.infoButton} 
            onPress={() => handleInfoPress('13/03/24', '10:20', 'AMANECER', 'PODOLOGIA', 'Dr. Jose Ignacio Delpino')}
          >
            <Text style={styles.buttonText}>INFORMACION</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    height: 40,
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
  placeText: {
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
});

export default HorasAgendadas;
