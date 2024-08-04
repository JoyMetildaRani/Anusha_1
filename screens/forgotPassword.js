import {
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Icon } from 'react-native-elements';
import React, { useState } from 'react';
import db from '../config';

import firebase from 'firebase';

import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native'; 

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app()
}


const ForgotPassword = () => {

  const [email, setEmail] = useState('');  // Initialize with empty string
  const navigation = useNavigation();

  const handleContinue = async () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert('Password Reset Email Sent', 'Please check your email for the reset link.');
      })
      .catch((error) => {
        alert('Error', error.message);
      });
    console.log('link sent!')
    navigation.navigate('Login')
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/kulPinkBackground.png')}
        style={styles.background}>
   <View style = {styles.iconContainer}>
        <Icon
          name="arrow-left"
          type="feather"
          color="black"
          onPress={() => navigation.navigate('Login')}
          style={styles.icon}
        />
        </View>
       
        <View style={{ marginTop: 120 }}>
          <Text style={styles.text}>Please re-enter your email to set a new password</Text>
          <Text style={styles.stext}>Email*</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <TouchableOpacity
          style={styles.loginButton}
           onPress={() => {
            handleContinue(email);
          }}>
          <Text style={styles.startText}>Continue</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loginButton: {
    width: RFValue(280),
    height: RFValue(45),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    fontSize: RFValue(16),
    color: 'black',
    marginTop: 40,
    justifyContent: 'center',
    backgroundColor: '#F0B3B3',
    alignSelf: 'center',
  },
  startText: {
    fontSize: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    marginLeft: 40,
    textAlign: 'center',
    margin: 30,
  },
  stext: {
    fontSize: 18,
    marginLeft: 65,
    marginTop: 25,
  },
  input: {
    width: RFValue(250),
    height: RFValue(60),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(15),
    fontSize: RFValue(16),
    color: 'black',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: RFValue(50),
    marginTop: RFValue(10),
  },
  iconContainer: {
    position: 'absolute',
    marginTop: RFValue(35),
    marginLeft: RFValue(20),
  },
});

export default ForgotPassword;
