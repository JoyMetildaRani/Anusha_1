import {
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import db from '../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const navigation = useNavigation();

    const handleContinue = async () => {
    console.log("1")
    // Validate name field
    if (name.trim() === '') {
      Alert.alert('Name is required!');
      return;
    }

    // Validate email field
    if (email.trim() === '') {
      Alert.alert('Email is required!');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Email is invalid!');
      return;
    }

    // Validate password field
    if (password.trim() === '') {
      Alert.alert('Password is required!');
      return;
    } else if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters!');
      return;
    }

    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
console.log(user)
console.log(user.uid)

      if (user) {
      
        await user.updateProfile({ displayName: name });

        await user.sendEmailVerification();

    
        navigation.navigate('TellUsMoreAboutYou', { userId: user.uid });

        Alert.alert('Verification Email sent');
        console.log('Verification mail sent');

            // Add user data to Firestore
        //const db = firebase.firestore();
       // console.log(db)
       
        console.log(user.uid)
     
        await db.firestore().collection('users').doc(user.uid).set({
          name: name,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(()=>console.log("saved"))
        
      }
    } catch (error) {
      console.error(error.message);
      Alert.alert(error.message);
      console.log('Error:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
     
      <ImageBackground
        source={require('../assets/kulPinkBackground.png')}
        style={styles.background}
      >
      <KeyboardAwareScrollView>
       
          <View style={styles.iconContainer}>
            <Icon
              name="arrow-left"
              type="feather"
              color="black"
              onPress={() => navigation.navigate('Login')}
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.text}>Create an Account</Text>
            <Text style={styles.label}>Name*</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Gender*</Text>
            <TextInput
              style={styles.input}
              value={gender}
              placeholder="Male / Female"
              placeholderTextColor = 'black'
              onChangeText={setGender}
            />
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Text style={styles.label}>Password*</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleContinue}>
              <Text style={styles.startText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: RFValue(40),
    left: RFValue(20),
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop : RFValue(60),
    paddingHorizontal: RFValue(20),
  },
  text: {
    fontSize: RFValue(28),
    textAlign: 'center',
    marginVertical: RFValue(30),
  },
  label: {
    fontSize: RFValue(18),
    alignSelf: 'flex-start',
    marginLeft: RFValue(20),
    marginTop: RFValue(20),
  },
  input: {
    width: '90%',
    height: RFValue(45),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    fontSize: RFValue(16),
    color: 'black',
    marginTop: RFValue(10),
    paddingHorizontal: RFValue(10),
  },
  loginButton: {
    width: '90%',
    height: RFValue(45),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    backgroundColor: '#F0B3B3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(30),
  },
  startText: {
    color: 'black',
    fontSize: RFValue(18),
  },
});

export default Signup;
