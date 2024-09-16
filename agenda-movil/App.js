import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuInicio from './frontend/src/screens/MenuInicio';
import HorasAgendadas from './frontend/src/screens/HorasAgendadas';
import HoraDetalle from './frontend/src/screens/HoraDetalle';
import Login from './frontend/src/screens/login';
import Registro from './frontend/src/screens/Registro'; 
import Horarios from './frontend/src/screens/HorariosDisponibles';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
        name="Registro" 
        component={Registro} 
        options={{ headerShown: false }} 
        />   
        <Stack.Screen 
        name="MenuInicio" 
        component={MenuInicio} 
        options={{ headerShown: false }} />
        <Stack.Screen 
        name="HorasAgendadas" 
        component={HorasAgendadas} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="HorariosDisponibles" 
        component={Horarios}
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="HoraDetalle" 
        component={HoraDetalle}
        options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
