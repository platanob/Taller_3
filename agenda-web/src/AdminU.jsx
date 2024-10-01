import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const CitasDisponibles = () => {
  const citas = [
    { fecha: '2024-09-17', tipo: 'Terapia física', clinica: 'Clínica Norte' },
    { fecha: '2024-09-17', tipo: 'Podología', clinica: 'Clínica Norte' },
  ];

  const viewInfo = (index) => {
    alert(`Información sobre la cita:\n\nFecha: ${citas[index].fecha}\nTipo: ${citas[index].tipo}`);
  };

  const editCita = (index) => {
    alert(`Editar cita para ${citas[index].tipo} aún no implementado.`);
  };

  const deleteCita = (index) => {
    alert(`Cita para ${citas[index].tipo} eliminada.`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>ADMINISTRAR COLABORADORES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>ADMINISTRAR USUARIOS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>VISUALIZAR GRÁFICOS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>CREAR CITAS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>VER HORAS DISPONIBLES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.navButtonText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>HORAS DISPONIBLES</Text>

      <View style={styles.citasContainer}>
        {citas.map((cita, index) => (
          <View key={index} style={styles.citaCard}>
            <Text>{cita.fecha}</Text>
            <Text>{cita.tipo}</Text>
            <Text style={styles.clinica}>{cita.clinica}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => viewInfo(index)} style={styles.button}>
                <Text style={styles.buttonText}>Información</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editCita(index)} style={styles.button}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteCita(index)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CitasDisponibles;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ADD8E6', // Azul claro
      padding: 20,
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      backgroundColor: '#4B0082', // Color púrpura
      padding: 10,
      borderRadius: 10,
    },
    navButton: {
      padding: 10,
      backgroundColor: '#FFD700', // Dorado
      borderRadius: 10,
    },
    navButtonText: {
      color: '#000',
      fontWeight: 'bold',
    },
    logoutButton: {
      backgroundColor: '#00BFFF', // Azul cielo
      padding: 10,
      borderRadius: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    citasContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    citaCard: {
      backgroundColor: '#B0E0E6', // Azul pálido
      padding: 20,
      borderRadius: 10,
      width: '45%',
      marginBottom: 20,
    },
    clinica: {
      color: 'red',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: '#FFF',
      padding: 10,
      borderRadius: 5,
    },
    deleteButton: {
      backgroundColor: '#f44336', // Rojo para borrar
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#000',
      fontWeight: 'bold',
    },
  });
  