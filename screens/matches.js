import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import db from '../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Matches = ({ navigation }) => {
  const route = useRoute();
  const { user, data } = route.params;
 

console.log(user.imageUri)
console.log(data.imageUri)

  return (
   
      <ImageBackground
        style={styles.background}
        source={require('../assets/kulPinkBackground.png')}>
        <KeyboardAwareScrollView>
        <Text style={styles.header}>Kul</Text>

        <View style={styles.imageContainer}>
        
            <Image
              source={{ uri: user.imageUri }} // Assuming the image URL is stored in user data
              style={styles.image}
            />
          
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: data.imageUri }} style={styles.image} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.smallText, { fontSize: RFValue(16), marginTop: 5 }]}>
            {' '}
            You and {data.name} matched with each other!{' '}
          </Text>
          <Text style={styles.smallText}>
            {' '}
            You have similar interests including:{' '}
          </Text>
          <Text style={styles.smallText}> {data.interests+ ", "} </Text>
        </View>

        <Text
          style={[
            styles.smallText,
            { fontSize: 14, marginLeft: 20, padding: 5 },
          ]}>
          Click here to start chatting with {data.name}
        </Text>

        <TouchableOpacity
          style={styles.chatNowButton}
          onPress={() =>  navigation.navigate('ChatMessages', {
             data:data, id: user.email
            })}>
          <Text style={styles.chatNowButtonText}> Chat Now </Text>
        </TouchableOpacity>
         </KeyboardAwareScrollView>
      </ImageBackground>
    
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 40,
    color: 'black',
    textAlign: 'center',
    marginTop: 50,
  },
  imageContainer: {
    width: 270,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: RFValue(75),
    marginTop: 20,
  },
  textContainer: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#C56364',
    padding: 10,
    marginLeft: RFValue(45),
    width: '80%',
    alignItems: 'center',
    marginTop : RFValue(30),
  },
  smallText: {
    fontSize: RFValue(15),
    textAlign: 'center',
    padding: 2,
  },
  image: {
    width: '80%',
    height: '80%',
    alignSelf: 'center',
    padding: 20,
    marginTop: 20,
  },
  chatNowButton: {
    width: RFValue(200),
    height: RFValue(40),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    fontSize: RFValue(16),
    color: 'black',
    fontFamily: 'Bubblegum-Sans',
    marginTop: 20,
    justifyContent: 'space-evenly',
    marginLeft: RFValue(80),
    backgroundColor: '#F0B3B3',
  },
  chatNowButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Matches;
