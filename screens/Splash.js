import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/kulSplashBackground.jpg')}
        style={styles.background}
      >

        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <View style={styles.textContainer}>
            <Image
              style={styles.image}
              source={require('../assets/KullogoNoBG.png')}
            />
            <Text style={styles.kulText}>Kul</Text>
          </View>

          <Text style={styles.communityText}>Find a Community</Text>

          <Text style={styles.text}>
            Let's find the correct community for you in Singapore
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: RFValue(40),
    height: RFValue(40),
    marginRight: RFValue(10),
  },
  button: {
    width: RFValue(150),
    height: RFValue(45),
    borderRadius: RFValue(30),
    backgroundColor: '#FFF',
    marginTop: RFValue(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: RFValue(16),
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: RFValue(26),
    textAlign: 'center',
  },
  kulText: {
    fontSize: RFValue(50),
    textAlign: 'center',
  },
  communityText: {
    fontSize: RFValue(28),
    marginTop: RFValue(130),
    textAlign: 'center',
  },
  text: {
    fontSize: RFValue(10),
    textAlign: 'center',
    marginVertical: RFValue(10),
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: RFValue(20),
  },
});

export default Splash;
