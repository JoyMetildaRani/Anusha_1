import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Matches from '../screens/matches';
import Home from '../screens/home';
import Chat from '../screens/chat';


const Stack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator options={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Matches" component={Matches} options={{ headerShown: false }} /> 
    <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
    </Stack.Navigator>
   
  );
}


export default HomeStackNavigator;
