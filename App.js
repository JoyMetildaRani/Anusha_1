import Splash from './screens/Splash';
import Login from './screens/Login';
import Signup from './screens/Signup';
import TellUsMoreAboutYou from './screens/TellUsMoreAboutYou';
import ForgotPassword from './screens/forgotPassword'
import firebase from 'firebase';
import './config';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TellUsMoreAboutYou1 from './screens/TellUsMoreAboutYou1';

import BottomTabNavigator from './components/bottomTab';
import Loading from './screens/loading';


const Stack = createStackNavigator();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Loading" component={Loading}></Stack.Screen>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen
          name="TellUsMoreAboutYou"
          component={TellUsMoreAboutYou}
        />
        <Stack.Screen
          name="TellUsMoreAboutYou1"
          component={TellUsMoreAboutYou1}
        />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
