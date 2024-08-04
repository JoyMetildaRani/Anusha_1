import {
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  View,KeyboardAvoidingView,Platform,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user.emailVerified) {
        navigation.navigate('BottomTabNavigator');
        setEmail('');
        setPassword('');
      } else {
        Alert.alert(
          'Email not verified',
          'Please verify your email before logging in.',
          [{ text: 'OK' }]
        );
        await firebase.auth().signOut();
      }
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex:1}}
      
    >
      <ImageBackground
        source={require('../assets/kulPinkBackground.png')}
        style={styles.background}
      >
         <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.text}>Login</Text>

          <Text style={styles.label}>Email*</Text>
          <TextInput
            style={styles.input}
            placeholder=" "
            onChangeText={setEmail}
            keyboardType="email-address"
            value={email}
          />

          <Text style={styles.label}>Password*</Text>
          <TextInput
            style={styles.input}
            placeholder=" "
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width :'100%',
    height : '100%'
  },
  scrollContainer : {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(25),
    paddingVertical: RFValue(30),
  },
  container: {
    flex: 1,
    marginTop : RFValue(100),
    alignItems: 'center',
    paddingHorizontal: RFValue(25),
    paddingVertical : RFValue(30),
  },
  text: {
    fontSize: RFValue(30),
    marginBottom: RFValue(20),
    textAlign: 'center',
  },
  label: {
    fontSize: RFValue(18),
    alignSelf: 'flex-start',
    marginLeft: RFValue(20),
    marginTop: RFValue(25),
  },
  input: {
    width: '90%',
    height: RFValue(50),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    fontSize: RFValue(16),
    color: 'black',
    marginTop: RFValue(10),
    paddingHorizontal: RFValue(10),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: RFValue(20),
    marginTop: RFValue(10),
  },
  forgotPasswordText: {
    fontSize: RFValue(12),
    color: '#C56364',
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
    marginTop: RFValue(20),
  },
  loginButtonText: {
    fontSize: RFValue(20),
    color: 'black',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: RFValue(20),
  },
  signupText: {
    fontSize: RFValue(14),
  },
  signupButtonText: {
    fontSize: RFValue(14),
    color: '#C56364',
    marginLeft: RFValue(5),
  },
});
