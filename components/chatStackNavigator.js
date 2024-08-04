import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatMatches from '../screens/chatScreenMatches';
import Messages from '../screens/messages';
import Chat from '../screens/chat';
import ChatMessages from '../screens/chatMessages';


const Stack = createStackNavigator();

function ChatStackNavigator() {
  return (
    <Stack.Navigator options={{ headerShown: false }}>
         <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
       <Stack.Screen name="ChatMatches" component={ChatMatches} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false , tabBarVisible: false }}/>
      <Stack.Screen name="ChatMessages" component={ChatMessages} options={{ headerShown: false,tabBarVisible:false }} />
      
   
    </Stack.Navigator>
   
  );
}


export default ChatStackNavigator;

