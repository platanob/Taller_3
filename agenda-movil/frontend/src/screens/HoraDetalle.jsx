import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const HoraDetalle = ({ route, navigation }) => {
  const { fecha, hora, lugar, servicio, profesional } = route.params;

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
    fontSize: 24,
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
    height: 50,
    width: 100
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24
  },
});

export default HoraDetalle;
