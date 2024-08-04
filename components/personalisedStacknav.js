import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
  return (
    <UserInterestsProvider>
      
        <Stack.Navigator initialRouteName="Profile">
          <Stack.Screen name="Profile" component={ProfileScreen} />
          {/* Add other screens here if needed */}
        </Stack.Navigator>
   
    </UserInterestsProvider>
  );
};

export default App;