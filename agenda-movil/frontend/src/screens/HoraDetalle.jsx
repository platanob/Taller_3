import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const HoraDetalle = ({ route, navigation }) => {
  const { fecha, hora, lugar, servicio, profesional } = route.params;

  return (
    <View style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
              colors={['#260e86', '#003B88']} // Degradado para el header
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

        <Text style={styles.title}>Detalles de la Cita</Text>

        <View style={styles.card}>
          <Text style={styles.detailText}><Text style={styles.label}>Fecha: </Text>{fecha} </Text>
          <Text style={styles.detailText}><Text style={styles.label}>Hora: </Text>{hora} </Text>
          <Text style={styles.detailText}><Text style={styles.label}>Lugar de Atención: </Text>{lugar}</Text>
          <Text style={styles.detailText}><Text style={styles.label}>Servicio: </Text>{servicio}</Text>
          <Text style={styles.detailText}><Text style={styles.label}>Profesional a Cargo: </Text>{profesional}</Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    zIndex: 1,
  },
  logo: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 100,
    height: 80,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    fontFamily: 'Roboto', 
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
    fontFamily: 'Roboto',
    marginVertical: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
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

export default HoraDetalle;
