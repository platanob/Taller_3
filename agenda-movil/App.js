import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HorasAgendadas from './frontend/src/screens/HorasAgendadas';
import HoraDetalle from './frontend/src/screens/HoraDetalle';
import Login from './frontend/src/screens/login';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HorasAgendadas">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
        name="HorasAgendadas" 
        component={HorasAgendadas} 
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
