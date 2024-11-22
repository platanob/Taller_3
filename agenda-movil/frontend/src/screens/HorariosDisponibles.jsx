import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient'; 

const Horarios = () => {
  const navigation = useNavigation();
  const [horarios, setHorarios] = useState([]);
  const [horariosOriginales, setHorariosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
const [filterType, setFilterType] = useState('');
const [filterOptions, setFilterOptions] = useState([]);

  const [filtroActivo, setFiltroActivo] = useState({
    fecha: null,
    hora: null,
    servicio: null,
    locacion: null
  });

  const obtenerHorarios = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/citas_disponibles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      
      if (response.status === 200) {
        setHorarios(result.citas_disponibles);
        setHorariosOriginales(result.citas_disponibles);
        setLoading(false);
      } else {
        Alert.alert("Error", result.error || "No se pudieron obtener los horarios disponibles");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al obtener los horarios disponibles.");
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerHorarios();
  }, []); 

  const obtenerOpcionesFiltro = (tipo) => {
    let opciones = new Set();
    
    horariosOriginales.forEach(horario => {
      switch (tipo) {
        case 'fecha':
          opciones.add(horario.fecha);
          break;
        case 'hora':
          opciones.add(horario.hora);
          break;
        case 'servicio':
          opciones.add(horario.servicio);
          break;
        case 'locacion':
          opciones.add(horario.locacion);
          break;
      }
    });
    
    return Array.from(opciones).sort();
  };

  const abrirModal = (tipo) => {
    setFilterType(tipo);
    setFilterOptions(obtenerOpcionesFiltro(tipo));
    setModalVisible(true);
  };

  const aplicarFiltro = (valor) => {
    setFiltroActivo(prev => ({
      ...prev,
      [filterType]: valor
    }));
    
    let resultadosFiltrados = [...horariosOriginales];
    
    // Aplicar todos los filtros activos
    Object.entries({ ...filtroActivo, [filterType]: valor }).forEach(([tipo, valor]) => {
      if (valor) {
        resultadosFiltrados = resultadosFiltrados.filter(horario => horario[tipo] === valor);
      }
    });
    
    setHorarios(resultadosFiltrados);
    setModalVisible(false);
  };

  const restablecerFiltros = () => {
    setHorarios(horariosOriginales);
    setFiltroActivo({
      fecha: null,
      hora: null,
      servicio: null,
      locacion: null
    });
    Alert.alert("Filtros restablecidos", "Se han eliminado todos los filtros aplicados");
  };

  const infoPress = (fecha, hora, lugar, servicio, profesional) => {
    navigation.navigate('HoraDetalle', { fecha, hora, lugar, servicio, profesional });
  };

  const agendarPress = async (cita_id) => {
    try {
      const confirmar = window.confirm("¿Estás seguro de que quieres agendar esta cita?");
      
      if (confirmar) {
        const token = await AsyncStorage.getItem('access_token');
        
        if (!token) {
          window.alert("Error: Usuario no autenticado.");
          return;
        }
        
        const response = await fetch('http://localhost:5000/api/agendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ cita_id }),
        });
    
        const result = await response.json();
    
        if (response.status === 200) {
          window.alert("Éxito: Cita agendada correctamente");
          obtenerHorarios();
        } else {
          window.alert(`Error: ${result.error || "No se pudo agendar la cita"}`);
        }
      }
    } catch (error) {
      console.error(error);
      window.alert("Error: Hubo un problema al agendar la cita.");
    }
  };  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../assets/img/fondo.jpg')} 
          style={styles.backgroundImage} 
          resizeMode="cover"
        />
        <ActivityIndicator size="large" color="#260e86" />
        <Text style={styles.loadingText}>CARGANDO HORARIOS DISPONIBLES...</Text>
      </View>
    );
  }

  return (
    <View style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={['#260e86', '#003B88']} 
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

        <Text style={styles.title}>Horarios Disponibles</Text>

        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, filtroActivo.fecha && styles.activeFilter]} 
            onPress={() => abrirModal('fecha')}
          >
            <Icon name="calendar-outline" size={24} color="white" />
            <Text style={styles.filterButtonText}>
              {filtroActivo.fecha || 'Fecha'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filtroActivo.hora && styles.activeFilter]} 
            onPress={() => abrirModal('hora')}
          >
            <Icon name="time-outline" size={24} color="white" />
            <Text style={styles.filterButtonText}>
              {filtroActivo.hora || 'Hora'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filtroActivo.servicio && styles.activeFilter]} 
            onPress={() => abrirModal('servicio')}
          >
            <Icon name="medical-outline" size={24} color="white" />
            <Text style={styles.filterButtonText}>
              {filtroActivo.servicio || 'Servicio'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filtroActivo.locacion && styles.activeFilter]} 
            onPress={() => abrirModal('locacion')}
          >
            <Icon name="location-outline" size={24} color="white" />
            <Text style={styles.filterButtonText}>
              {filtroActivo.locacion || 'Locación'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, styles.resetButton]} 
            onPress={restablecerFiltros}
          >
            <Icon name="refresh-outline" size={24} color="white" />
            <Text style={styles.filterButtonText}>Restablecer</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Seleccionar {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
              
              <FlatList
                data={filterOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => aplicarFiltro(item)}
                  >
                    <Text style={styles.modalOptionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {horarios.length > 0 ? (
          horarios.map((horario) => (
            <View key={horario._id} style={styles.card}>
              <Text style={styles.dateText}>{horario.fecha}</Text>
              <Text style={styles.hourText}>{horario.hora}</Text>
              <Text style={styles.serviceText}>{horario.servicio}</Text>
              <Text style={styles.placeText}>{horario.locacion}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.infoButton} 
                  onPress={() => infoPress(horario.fecha, horario.hora, horario.locacion, horario.servicio, horario.colaborador)}
                >
                  <Text style={styles.buttonText}>INFORMACIÓN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.agendarButton} 
                  onPress={() => agendarPress(horario._id)}
                >
                  <Text style={styles.buttonText}>AGENDAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noAppointmentsText}>No hay horarios disponibles.</Text>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
    modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#260e86',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#003B88',
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#FF5252',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeFilter: {
    backgroundColor: '#1565C0',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  gradientContainer: {
    flex: 1,
    backgroundColor: '#55A9F9',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 25,
    padding: 10,
  },
  filterButton: {
    backgroundColor: '#003B88',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    marginBottom: 12,
    minWidth: 120, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowRadius: 3.84,
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'center',
    gap: 8,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  activeFilter: {
    backgroundColor: '#1565C0',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  resetButton: {
    backgroundColor: '#D32F2F', 
    minWidth: 150, 
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
    zIndex: 1,
  },
  logo: {
    width: 100,
    height: 80,
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
    fontFamily: 'Roboto', 
  },
  placeText: {
    position: 'absolute', 
    top: 15, 
    right: 15, 
    color: 'red',
    fontWeight: 'bold',
    fontFamily: 'Roboto', 
    fontSize: 18,
  },
  serviceText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Roboto', 
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoButton: {
    backgroundColor: '#fff',
    fontSize: 22,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  agendarButton: {
    backgroundColor: '#fff',
    fontSize: 22,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Roboto',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#260e86',
    marginTop: 10,
    fontFamily: 'Roboto', 
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
});

export default Horarios;
