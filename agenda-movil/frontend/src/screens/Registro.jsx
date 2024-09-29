import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export default function Registro() {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [carnetFrontal, setCarnetFrontal] = useState(null);
  const [carnetTrasero, setCarnetTrasero] = useState(null);

  function base64ToBlob(base64Data, contentType = 'image/jpeg') {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
  

  const register = async () => {
    if (!nombre || !rut || !correo || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
  
    if (!pdfFile || pdfFile.canceled || !pdfFile.assets || pdfFile.assets.length === 0) {
      Alert.alert('Error', 'Por favor, selecciona un archivo PDF válido');
      return;
    }

    if (!carnetFrontal || !carnetTrasero) {
      Alert.alert('Error', 'Por favor, selecciona ambas imágenes del carnet (frontal y trasero)');
      return;
    }
  
    const selectedFile = pdfFile.assets[0]; 
    const file = selectedFile.file; 

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('rut', rut);
    formData.append('correo', correo);
    formData.append('contrasena', password);
    formData.append('archivo', file)
     // Convertir URI base64 a Blob
    const carnetFrontalBlob = base64ToBlob(carnetFrontal.assets[0].uri, 'image/png');
    const carnetTraseroBlob = base64ToBlob(carnetTrasero.assets[0].uri, 'image/png');
    // Imagen carnet frontal (en formato Blob)
    formData.append('carnet_frontal', carnetFrontalBlob, 'carnet_frontal.png');
    formData.append('carnet_trasero', carnetTraseroBlob, 'carnet_trasero.png');
      
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Error en la solicitud');
      }
      console.log('Registro exitoso', result);

      if (Platform.OS === 'web') {
        window.alert('¡Registro exitoso!');
      } else {
        Alert.alert('Éxito', '¡Registro exitoso!');
      }
    } catch (error) {
      console.error('Error detallado del servidor:', error.message);
    }
  };

  const selectPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
  
      if (result.type !== 'cancel') {
        setPdfFile(result);
        console.log('Archivo seleccionado:', result);
      } else {
        console.log('Selección cancelada');
      }
    } catch (err) {
      console.error('Error en la selección de archivo:', err);
      Alert.alert('Error', 'Hubo un error seleccionando el archivo. Por favor, inténtalo de nuevo.');
    }
  };

  const selectCarnetFrontal = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setCarnetFrontal(result);
        console.log('Carnet frontal seleccionado:', result);
      }
    } catch (err) {
      console.error('Error en la selección de imagen:', err);
      Alert.alert('Error', 'Hubo un error seleccionando la imagen. Por favor, inténtalo de nuevo.');
    }
  };

  const selectCarnetTrasero = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setCarnetTrasero(result);
        console.log('Carnet trasero seleccionado:', result);
      }
    } catch (err) {
      console.error('Error en la selección de imagen:', err);
      Alert.alert('Error', 'Hubo un error seleccionando la imagen. Por favor, inténtalo de nuevo.');
    }
  };


  return (
    <ImageBackground
      source={require('../assets/img/fondo.jpg')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.overlay}>
          <Image
            source={require('../assets/img/logo_muni.jpg')}
            style={styles.logo}
          />

          <Text style={styles.title}>Registro de Usuario</Text>

          {/* Campos de texto */}
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            placeholder="Nombre Completo"
            placeholderTextColor="#000"
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>RUT</Text>
          <TextInput
            placeholder="RUT"
            placeholderTextColor="#000"
            style={styles.input}
            value={rut}
            onChangeText={setRut}
          />

          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            placeholder="Correo Electrónico"
            placeholderTextColor="#000"
            keyboardType="email-address"
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#000"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            placeholder="Confirmar Contraseña"
            placeholderTextColor="#000"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Sección para subir archivo PDF */}
          <View style={styles.fileUploadContainer}>
            <TouchableOpacity style={styles.fileButton} onPress={selectPdf}>
              <Text style={styles.fileButtonText}>Seleccionar archivo PDF</Text>
            </TouchableOpacity>
            <Text style={styles.pdfFileName}>
              {pdfFile && pdfFile.assets ? pdfFile.assets[0].name : 'Ningún archivo seleccionado'}
            </Text>
          </View>

           {/* Sección para seleccionar imagen del carnet frontal */}
          <View style={styles.fileUploadContainer}>
            <TouchableOpacity style={styles.fileButton} onPress={selectCarnetFrontal}>
              <Text style={styles.fileButtonText}>Seleccionar Carnet Frontal</Text>
            </TouchableOpacity>
            <Text style={styles.pdfFileName}>
              {carnetFrontal && carnetFrontal.assets ? carnetFrontal.assets[0].fileName : 'Ninguna imagen seleccionada'}
            </Text>
          </View>

          {/* Sección para seleccionar imagen del carnet trasero */}
          <View style={styles.fileUploadContainer}>
            <TouchableOpacity style={styles.fileButton} onPress={selectCarnetTrasero}>
              <Text style={styles.fileButtonText}>Seleccionar Carnet Trasero</Text>
            </TouchableOpacity>
            <Text style={styles.pdfFileName}>
              {carnetTrasero && carnetFrontal.assets ? carnetTrasero.assets[0].fileName : 'Ninguna imagen seleccionada'}
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={register}>
            <Text style={styles.buttonText}>REGISTRARME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>INICIO DE SESION</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(240, 205, 117, 0.9)',
    width: '90%',
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
    fontFamily: 'Roboto',
  },
  label: {
    fontSize: 18,
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
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
    backgroundColor: '#81C3FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  fileButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: "bold",
  },
  fileUploadContainer: {
    flexDirection: 'column', // Cambiado a 'column'
    alignItems: 'center',     // Centra los elementos
    marginBottom: 20,
    width: '100%',
  },
  fileButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5, // Añade un espacio entre el botón y el nombre
  },
  pdfFileName: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center', // Alinea el texto en el centro
  },
});
