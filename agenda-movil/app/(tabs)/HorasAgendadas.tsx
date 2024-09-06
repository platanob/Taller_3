import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const citas = [
  { id: 1, date: '11/03/24', time: 'AMANECER', service: 'PELUQUERIA' },
  { id: 2, date: '13/03/24', time: 'AMANECER', service: 'PODOLOGIA' },
];

const HorasAgendadas = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header con el logo */}
      <View style={styles.header}>
        <Image
          /*source={require('../assets/logo_temco.png')} // Asegúrate de tener el logo en assets
          style={styles.logo}*/
        />
      </View>

      {/* Título */}
      <Text style={styles.title}>Horas agendadas</Text>

      {/* Tarjetas de citas */}
      {citas.map((appointment) => (
        <View key={appointment.id} style={styles.card}>
          <Text style={styles.date}>{appointment.date}</Text>
          <Text style={styles.time}>{appointment.time}</Text>
          <Text style={styles.service}>{appointment.service}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={styles.buttonText}>INFORMACION</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.buttonText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', 
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#B0E0E6', 
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    color: 'red',
    marginVertical: 5,
  },
  service: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoButton: {
    backgroundColor: '#87CEEB',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#4682B4',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HorasAgendadas;
