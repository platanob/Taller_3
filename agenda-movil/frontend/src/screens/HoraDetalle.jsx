import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HoraDetalle = ({ route, navigation }) => {
  const { fecha, hora, lugar, servicio, profesional } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Cita</Text>

      <View style={styles.card}>
        <Text style={styles.detailText}><Text style={styles.label}>Fecha: </Text>{fecha} </Text>
        <Text style={styles.detailText}><Text style={styles.label}>Hora: </Text>{hora} </Text>
        <Text style={styles.detailText}><Text style={styles.label}>Lugar de Atención: </Text>{lugar}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Servicio: </Text>{servicio}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Profesional a Cargo: </Text>{profesional}</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#55A9F9',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#81C3FF',
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  detailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default HoraDetalle;
