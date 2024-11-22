import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert, ScrollView, Platform, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [carnetFrontal, setCarnetFrontal] = useState(null);
  const [carnetTrasero, setCarnetTrasero] = useState(null);
  const [fechaNacimiento, setFechaNacimiento] = useState(null); 
  const [localidad, setLocalidad] = useState(''); 
  const [isDiscapacitado, setIsDiscapacitado] = useState(false); 
  const [pdfDiscapacidad, setPdfDiscapacidad] = useState(null); 

  function base64ToBlob(base64Data, contentType = 'image/jpeg') {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  const getFileSizeInKB = (base64) => {
    const stringLength = base64.length - 'data:image/jpeg;base64,'.length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    const sizeInKB = sizeInBytes / 1024; // Convertir de bytes a KB
    return sizeInKB.toFixed(2); // Redondear a 2 decimales
  };
  
    
    const register = async () => {
      if (!nombre || !rut || !correo || !password || !confirmPassword || !localidad) {
        Alert.alert('Error', 'Por favor, completa todos los campos');
        alert('Error: Por favor, completa todos los campos');
        return;
      }

      const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
      if (!rutRegex.test(rut)) {
        Alert.alert('Error', 'El RUT debe seguir el formato X.XXX.XXX-X o XX.XXX.XXX-X');
        alert('Error: El RUT debe seguir el formato X.XXX.XXX-X o XX.XXX.XXX-X');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        Alert.alert('Error', 'Por favor, ingresa un correo válido');
        alert('Error: Por favor, ingresa un correo válido');
        return;
      }

      // Validar si la fecha es lógica
      const [day, month, year] = fechaNacimiento.split('-').map(Number); // Convertir a números
      const fechaIngresada = new Date(year, month - 1, day); // Crear objeto de fecha (mes empieza en 0)

      // Validar que la fecha sea válida
      if (
        fechaIngresada.getFullYear() !== year || 
        fechaIngresada.getMonth() !== month - 1 || 
        fechaIngresada.getDate() !== day
      ) {
        Alert.alert('Error', 'La fecha ingresada no es válida');
        alert('Error: La fecha ingresada no es válida');
        return;
      }

      // Validar que no sea una fecha futura
      const fechaActual = new Date();
      if (fechaIngresada > fechaActual) {
        Alert.alert('Error', 'La fecha de nacimiento no puede ser una fecha futura');
        alert('Error: La fecha de nacimiento no puede ser una fecha futura');
        return;
      }

      // Validar que la persona tenga al menos 60 años
      const edadMinima = 60;
      const fechaLim = new Date(
        fechaActual.getFullYear() - edadMinima,
        fechaActual.getMonth(),
        fechaActual.getDate()
      );

      if (fechaIngresada > fechaLim) {
        Alert.alert('Error', `La fecha de nacimiento indica que tienes menos de ${edadMinima} años. Solo adultos mayores pueden registrarse.`);
        alert(`Error: La fecha de nacimiento indica que tienes menos de ${edadMinima} años. Solo adultos mayores pueden registrarse.`);
        return;
      }

      // Validar que la persona no tenga más de 120 años 
      const edadMaxima = 120;
      const fechaLimite = new Date(fechaActual.getFullYear() - edadMaxima, fechaActual.getMonth(), fechaActual.getDate());
      if (fechaIngresada < fechaLimite) {
        Alert.alert('Error', `La fecha de nacimiento no puede ser anterior a ${edadMaxima} años`);
        alert(`Error: La fecha de nacimiento no puede ser anterior a ${edadMaxima} años`);
        return;
      }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      alert('Error: Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      alert('Error: La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if(!pdfFile){
      Alert.alert('Error', 'Por favor, selecciona un archivo PDF válido para el registro social de hogares');
      alert('Error: Por favor, selecciona un archivo PDF válido para el registro social de hogares');
      return;
    }
  
  
    if (!carnetFrontal || !carnetTrasero) {
      Alert.alert('Error', 'Por favor, selecciona ambas imágenes del carnet (frontal y trasero)');
      alert('Error: Por favor, selecciona ambas imágenes del carnet (frontal y trasero)')
      return;
    }

    // Validar que, si el usuario marca el switch de discapacidad, suba el archivo correspondiente
    if (isDiscapacitado && !pdfDiscapacidad) {
      Alert.alert('Error', 'Por favor, adjunta un archivo que certifique tu discapacidad');
      alert('Error: Por favor, adjunta un archivo que certifique tu discapacidad');
      return;
    }
  
    const selectedFile = pdfFile.assets[0];
    const file = selectedFile.file;
  
    // Solo intentar asignar fileDisc si el usuario tiene discapacidad y seleccionó un archivo
    const fileDisc = isDiscapacitado && pdfDiscapacidad ? pdfDiscapacidad.assets[0].file : null;
  
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('rut', rut);
    formData.append('correo', correo);
    formData.append('contrasena', password);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('localidad', localidad);
    formData.append('discapacidad', isDiscapacitado ? 'true' : 'false');
  
    // Adjuntar carnet de discapacidad solo si aplica
    if (isDiscapacitado && fileDisc) {
      formData.append('carnet_discapacidad', fileDisc);
    }
  
    formData.append('archivo', file);
  
    const carnetFrontalBlob = base64ToBlob(carnetFrontal.assets[0].uri, 'image/png');
    const carnetTraseroBlob = base64ToBlob(carnetTrasero.assets[0].uri, 'image/png');
  
    formData.append('carnet_frontal', carnetFrontalBlob, 'carnet_frontal.png');
    formData.append('carnet_trasero', carnetTraseroBlob, 'carnet_trasero.png');
  
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (!response.ok) {
        if (result.error) {
          Alert.alert('Error', result.error); 
          alert('Error', result.error);
        } else {
          Alert.alert('Error', 'Error desconocido al registrar usuario');
        }
        return;
      }
  
      console.log('Registro exitoso', result);
  
      if (Platform.OS === 'web') {
        window.alert('¡Registro exitoso!');
      } else {
        Alert.alert('Éxito', '¡Registro exitoso!');
      }
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Error al registrar usuario', error.message);
      alert('Error al registrar usuario', error.message);
      console.error('Error detallado del servidor:', error.message);
    }
  };
  

  const selectPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      resultado = result.assets[0];
      resultado2 = resultado.name.toLowerCase();
  
      if (result.type !== 'cancel') {
        if (!resultado2.endsWith('.pdf')) {
          Alert.alert('Error', 'Solo se permiten archivos PDF.');
          console.log('Error: Solo se permiten archivos PDF.'); 
          alert('Error: Solo se permiten archivos PDF.');
          return;
        }
        if (resultado.size > 10 * 1024 * 1024) { // 10 MB
          Alert.alert('Error', 'El archivo PDF seleccionado excede el tamaño máximo de 10 MB.');
          console.log('Error: El archivo PDF seleccionado excede el tamaño máximo de 10 MB.');
          alert('Error: El archivo PDF seleccionado excede el tamaño máximo de 10 MB.')
          return;
        }
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

  const selectPdfDiscapacidad = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      
      resultado = result.assets[0];
      resultado2 = resultado.name.toLowerCase();

      if (result.type !== 'cancel') {
        if (!resultado2.endsWith('.pdf')) {
          Alert.alert('Error', 'Solo se permiten archivos PDF.');
          console.log('Error: Solo se permiten archivos PDF.'); 
          alert('Error: Solo se permiten archivos PDF.');
          return;
        } 
        if (resultado.size > 10 * 1024 * 1024) { // 10 MB
            Alert.alert('Error', 'El archivo PDF seleccionado excede el tamaño máximo de 10 MB.');
            console.log('Error: El archivo PDF seleccionado excede el tamaño máximo de 10 MB.');
            alert('Error: El archivo PDF seleccionado excede el tamaño máximo de 10 MB.')
            return;
          }
        setPdfDiscapacidad(result);
        console.log('Archivo de discapacidad seleccionado:', result);
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

      resultado = result.assets[0];
      resultado2 = resultado.fileName.toLowerCase();

      if (!result.canceled) {
        if (!resultado2.endsWith('.jpg') && !resultado2.endsWith('.png') ) {
          Alert.alert('Error', 'Solo se permiten archivos JPG o PNG.');
          console.log('Error: Solo se permiten archivos JPG o PNG.'); 
          alert('Error: Solo se permiten archivos JPG o PNG.');
          return;
        }
        const fileUri = result.assets[0].uri;
    
        const fileSizeInKB = getFileSizeInKB(fileUri);
    
        console.log('Tamaño aproximado del archivo:', fileSizeInKB, 'KB');
  
        if (fileSizeInKB > 5000) { // 5 MB en KB
          Alert.alert(
            'Error',
            'La imagen seleccionada excede el tamaño máximo de 5 MB.'
          );
          console.log('Error: La imagen seleccionada excede el tamaño máximo de 5 MB'); 
          alert('Error: La imagen seleccionada excede el tamaño máximo de 5 MB');
          return;
        }
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

      resultado = result.assets[0];
      resultado2 = resultado.fileName.toLowerCase();

      if (!result.canceled) {
        if (!resultado2.endsWith('.jpg') && !resultado2.endsWith('.png') ) {
          Alert.alert('Error', 'Solo se permiten archivos JPG o PNG.');
          console.log('Error: Solo se permiten archivos JPG o PNG.'); 
          alert('Error: Solo se permiten archivos JPG o PNG.');
          return;
        }
        const fileUri = result.assets[0].uri;
    
        const fileSizeInKB = getFileSizeInKB(fileUri);
    
        console.log('Tamaño aproximado del archivo:', fileSizeInKB, 'KB');
  
        if (fileSizeInKB > 5000) { // 5 MB en KB
          Alert.alert(
            'Error',
            'La imagen seleccionada excede el tamaño máximo de 5 MB.'
          );
          console.log('Error: La imagen seleccionada excede el tamaño máximo de 5 MB'); 
          alert('Error: La imagen seleccionada excede el tamaño máximo de 5 MB');
          return;
        }
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
            placeholder="Ej: X.XXX.XXX-X"
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

          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <TextInput
            placeholder="dd-mm-yyyy"
            placeholderTextColor="#000"
            style={styles.input}
            value={fechaNacimiento}
            onChangeText={setFechaNacimiento}
          />
          <Text style={styles.label}>Localidad</Text>
          <TextInput
            placeholder="Ej: Padre las Casas"
            placeholderTextColor="#000"
            style={styles.input}
            value={localidad}
            onChangeText={setLocalidad}
          />

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#000"
              secureTextEntry={!passwordVisible}
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.iconContainer}>
              <Icon
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirmar Contraseña"
              placeholderTextColor="#000"
              secureTextEntry={!confirmPasswordVisible}
              style={[styles.input, styles.passwordInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              style={styles.iconContainer}>
              <Icon
                name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.fileUploadContainer}>
            <TouchableOpacity style={styles.fileButton} onPress={selectPdf}>
              <Text style={styles.fileButtonText}>Adjuntar Cartola Registro Social</Text>
            </TouchableOpacity>
            <Text style={styles.pdfFileName}>
              {pdfFile && pdfFile.assets ? pdfFile.assets[0].name : 'Ningún archivo seleccionado'}
            </Text>
          </View>

          <View style={styles.fileUploadContainer}>
            <TouchableOpacity style={styles.fileButton} onPress={selectCarnetFrontal}>
              <Text style={styles.fileButtonText}>Adjuntar Imagen Carnet Frontal</Text>
            </TouchableOpacity>
            <Text style={styles.pdfFileName}>
              {carnetFrontal && carnetFrontal.assets ? carnetFrontal.assets[0].fileName : 'Ninguna imagen seleccionada'}
            </Text>
          </View>

          <View style={styles.fileUploadContainer}>
            <TouchableOpacity style={styles.fileButton} onPress={selectCarnetTrasero}>
              <Text style={styles.fileButtonText}>Adjuntar Imagen Carnet Trasero</Text>
            </TouchableOpacity>
            <Text style={styles.pdfFileName}>
              {carnetTrasero && carnetFrontal.assets ? carnetTrasero.assets[0].fileName : 'Ninguna imagen seleccionada'}
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>¿Tienes alguna discapacidad?</Text>
            <Switch
              value={isDiscapacitado}
              onValueChange={setIsDiscapacitado}
            />
          </View>

          {isDiscapacitado && (
            <View style={styles.fileUploadContainer}>
              <TouchableOpacity style={styles.fileButton} onPress={selectPdfDiscapacidad}>
                <Text style={styles.fileButtonText}>Adjuntar Certificado de Discapacidad</Text>
              </TouchableOpacity>
              <Text style={styles.pdfFileName}>
                {pdfDiscapacidad && pdfDiscapacidad.assets ? pdfDiscapacidad.assets[0].name : 'Ningún archivo seleccionado'}
              </Text>
            </View>
          )}

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
    flexDirection: 'column', 
    alignItems: 'center',     
    marginBottom: 20,
    width: '100%',
  },
  fileButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5, 
  },
  pdfFileName: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  passwordContainer: {
    width: '100%',
    position: 'relative', 
    marginBottom: 5,
  },
  passwordInput: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingRight: 40,  
    borderRadius: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,  
    top: 8,     
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
});
