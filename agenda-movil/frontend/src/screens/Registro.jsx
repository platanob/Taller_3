import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

export default function Registro() {
  const navigation = useNavigation();
  const [pdfFile, setPdfFile] = useState(null);

  const handlePdfUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.type === "success") {
        setPdfFile(result);
        console.log("Archivo seleccionado:", result);
      } else {
        console.log('Selección cancelada');
      }
    } catch (err) {
      console.error('Error en la selección de archivo:', err);
      Alert.alert('Error', 'Hubo un error seleccionando el archivo. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/fondo.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image
          source={require('../assets/img/logo_muni.jpg')}
          style={styles.logo}
        />

        <Text style={styles.title}>Registro de Usuario</Text>

        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          placeholder="Nombre Completo"
          placeholderTextColor="#000"
          style={styles.input}
        />

        <Text style={styles.label}>RUT</Text>
        <TextInput
          placeholder="RUT"
          placeholderTextColor="#000"
          style={styles.input}
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          placeholder="Correo Electrónico"
          placeholderTextColor="#000"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#000"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#000"
          secureTextEntry
          style={styles.input}
        />

        {/* Botón para subir archivo PDF */}
        <TouchableOpacity style={styles.button} onPress={handlePdfUpload}>
          <Text style={styles.buttonText}>Subir archivo PDF</Text>
        </TouchableOpacity>

        {pdfFile && (
          <Text style={styles.pdfFileName}>Archivo seleccionado: {pdfFile.name}</Text>
        )}

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>REGISTRARME</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(240, 205, 117, 0.9)',
    width: '80%',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#00CFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pdfFileName: {
    marginTop: 10,
    color: '#000',
    fontSize: 16,
  },
});
