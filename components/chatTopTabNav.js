import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Messages from '../screens/messages';
import ChatMatches from '../screens/chatScreenMatches';

const Stack = createMaterialTopTabNavigator();

const ChatTopTabNav = () => {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="Messages" component={Messages}  options={{ headerShown: false }}/>
      <Stack.Screen name="ChatMatches" component={ChatMatches} options={{ headerShown: false }} />
      </Stack.Navigator>

  );
};

export default ChatTopTabNav;
