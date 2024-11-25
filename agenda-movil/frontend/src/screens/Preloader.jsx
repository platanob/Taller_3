import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Preloader = () => {
  return (
    <ImageBackground
      source={require('../assets/img/fondo.jpg')} // Ajusta la ruta según tu proyecto
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.2)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <ActivityIndicator size="large" color="white" style={styles.spinner} />
          <Text style={styles.title}>Un momento por favor... Estamos cargando la información...</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 40,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default Preloader;