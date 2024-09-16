import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Picker } from 'react-native';
//import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Horarios = () => {
  const navegacion = useNavigation();
  
  // Estado para los filtros
  const [fechaDesde, setFechaDesde] = useState(new Date());
  const [fechaHasta, setFechaHasta] = useState(new Date());
  const [mostrarFechaDesde, setMostrarFechaDesde] = useState(false);
  const [mostrarFechaHasta, setMostrarFechaHasta] = useState(false);
  const [servicio, setServicio] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  // Datos de ejemplo
  const horarios = [
    { id: 1, fecha: '15-08-2024', hora: '09:00', servicio: 'Psicología', comuna: 'Temuco' },
    { id: 2, fecha: '20-08-2024', hora: '11:00', servicio: 'Peluquería', comuna: 'Padre Las Casas' },
    { id: 3, fecha: '25-08-2024', hora: '14:00', servicio: 'Kinesiología', comuna: 'La Branza' },
    { id: 4, fecha: '10-09-2024', hora: '10:30', servicio: 'Asesoría Jurídica', comuna: 'Temuco' },
    { id: 5, fecha: '18-09-2024', hora: '16:00', servicio: 'Atención Social', comuna: 'Padre Las Casas' },
  ];

  // Función para manejar la selección de fecha
  const onChangeFechaDesde = (event, selectedDate) => {
    const currentDate = selectedDate || fechaDesde;
    setMostrarFechaDesde(false);
    setFechaDesde(currentDate);
  };

  const onChangeFechaHasta = (event, selectedDate) => {
    const currentDate = selectedDate || fechaHasta;
    setMostrarFechaHasta(false);
    setFechaHasta(currentDate);
  };

  // Función para filtrar horarios
  const filtrarHorarios = () => {
    let horariosFiltrados = horarios;

    // Filtrar por rango de fechas
    horariosFiltrados = horariosFiltrados.filter(h => {
      const fechaHorario = new Date(h.fecha.split('-').reverse().join('-'));
      return fechaHorario >= fechaDesde && fechaHorario <= fechaHasta;
    });

    // Filtrar por servicio
    if (servicio) {
      horariosFiltrados = horariosFiltrados.filter(h => h.servicio === servicio);
    }

    // Filtrar por ubicación
    if (ubicacion) {
      horariosFiltrados = horariosFiltrados.filter(h => h.comuna === ubicacion);
    }

    console.log('Horarios Filtrados:', horariosFiltrados);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* Botón de Volver en la esquina superior izquierda */}
        <TouchableOpacity style={styles.backButton} onPress={() => navegacion.goBack()}>
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Image 
          source={require('../assets/img/logo_muni.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
      </View>

      <Text style={styles.title}>Horarios</Text>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        {/* Filtro por Fecha Desde */}
        <TouchableOpacity onPress={() => setMostrarFechaDesde(true)} style={styles.filtro}>
          <Text style={styles.filtroTexto}>Desde: {fechaDesde.toLocaleDateString('es-CL')}</Text>
        </TouchableOpacity>
        {mostrarFechaDesde && (
          <DateTimePicker
            value={fechaDesde}
            mode="date"
            display="default"
            onChange={onChangeFechaDesde}
          />
        )}

        {/* Filtro por Fecha Hasta */}
        <TouchableOpacity onPress={() => setMostrarFechaHasta(true)} style={styles.filtro}>
          <Text style={styles.filtroTexto}>Hasta: {fechaHasta.toLocaleDateString('es-CL')}</Text>
        </TouchableOpacity>
        {mostrarFechaHasta && (
          <DateTimePicker
            value={fechaHasta}
            mode="date"
            display="default"
            onChange={onChangeFechaHasta}
          />
        )}

        {/* Filtro por Servicio */}
        <View style={styles.pickerContainer}>
          <Text style={styles.filtroTexto}>Servicio:</Text>
          <Picker
            selectedValue={servicio}
            style={styles.picker}
            onValueChange={(itemValue) => setServicio(itemValue)}
          >
            <Picker.Item label="Todos" value="" />
            <Picker.Item label="Atención Social" value="Atención Social" />
            <Picker.Item label="Asesoría Jurídica" value="Asesoría Jurídica" />
            <Picker.Item label="Psicología" value="Psicología" />
            <Picker.Item label="Kinesiología" value="Kinesiología" />
            <Picker.Item label="Peluquería" value="Peluquería" />
          </Picker>
        </View>

        {/* Filtro por Ubicación */}
        <View style={styles.pickerContainer}>
          <Text style={styles.filtroTexto}>Comuna:</Text>
          <Picker
            selectedValue={ubicacion}
            style={styles.picker}
            onValueChange={(itemValue) => setUbicacion(itemValue)}
          >
            <Picker.Item label="Todas" value="" />
            <Picker.Item label="Temuco" value="Temuco" />
            <Picker.Item label="Padre Las Casas" value="Padre Las Casas" />
            <Picker.Item label="La Branza" value="La Branza" />
          </Picker>
        </View>

        {/* Botón Filtrar */}
        <TouchableOpacity style={styles.button} onPress={filtrarHorarios}>
          <Text style={styles.buttonText}>FILTRAR</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Horarios */}
      {horarios.map((horario) => (
        <View key={horario.id} style={styles.card}>
          <Text style={styles.dateText}>{horario.fecha}</Text>
          <Text style={styles.timeText}>{horario.hora}</Text>
          <Text style={styles.serviceText}>{horario.servicio}</Text>
          <Text style={styles.placeText}>{horario.comuna}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.infoButton} 
              onPress={() => navegacion.navigate('HoraDetalle', { 
                fecha: horario.fecha, 
                hora: horario.hora, 
                comuna: horario.comuna, 
                servicio: horario.servicio 
              })}
            >
              <Text style={styles.buttonText}>INFORMACIÓN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.agendarButton}>
              <Text style={styles.buttonText}>AGENDAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
  filtrosContainer: {
    width: '100%',
    marginBottom: 20,
  },
  filtro: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  filtroTexto: {
    fontSize: 16,
    color: 'black',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    padding: 5,
  },
  picker: {
    height: 50,
    width: '100%',
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
  card: {
    backgroundColor: '#81C3FF',
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dateText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 14,
    color: 'black',
  },
  serviceText: {
    fontSize: 14,
    color: 'black',
    marginTop: 10,
  },
  placeText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoButton: {
    backgroundColor: '#00CFFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  agendarButton: {
    backgroundColor: '#00CFFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  backButton: {
    position: 'absolute',
    borderRadius: 10,
    top: 10,
    left: 10,
    backgroundColor: '#81C3FF',
    padding: 10,
  },
});

export default Horarios;
