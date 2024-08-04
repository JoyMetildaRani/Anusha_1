import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import db from '../config';


const PersonalisedExperienceScreen6 = ({ navigation }) => {
  const [cookingStyle, setStyle] = useState('');
  const [favCuisine, setCuisine] = useState('');
  const [cookingFrequency, setCookingFrequency] = useState('');

   const userId = firebase.auth().currentUser.uid;
  //const userId = 'LVjnAGjTl9Wy6jrq7hBvJvY6lRn2'
  const handleSubmit = async () => {
    try {
      await db.firestore().collection('users').doc(userId).update({
        cookingStyle: cookingStyle,
        favCuisine: favCuisine,
        cookingFrequency: cookingFrequency,
      });
      Alert.alert('Preferences saved successfully!');
      navigation.navigate('PersonalisedScreen7');
      console.log('cookingStyle',cookingStyle);

    } catch (error) {
      Alert.alert('Error saving preferences: ', error.message);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(userId).get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setStyle(userData.cookingStyle || '');
          setCuisine(userData.favCuisine || '');
          setCookingFrequency(userData.cookingFrequency || '');
          
        }
      } catch (error) {
        alert('Error fetching user data: ' + error.message);
      }
    };

    fetchUserProfile();
  }, [userId]);


  return (
      <ImageBackground
        source={require('../assets/kulPinkBackground.png')}
        style={styles.background}
      >
        <KeyboardAwareScrollView>
        <View style = {styles.iconContainer}>
        <Icon
          name="arrow-left"
          type="feather"
          color="black"
          style={styles.icon}
          onPress={() => navigation.navigate('Profileuser')}
        />
        </View>
          <Text style={styles.headerText}>
            Embrace a personalised experience 6
          </Text>

          <Text style={styles.smallText}>
            Tell us more about your interest in Cooking!
          </Text>

          <Text style={[styles.smallText, { marginTop: 30 }]}>
            What is your favourite cooking style? 
          </Text>
      

          <View style = {styles.pickerContainer}>
          <Picker
            selectedValue={cookingStyle}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue) => setStyle(itemValue)}
          >
            <Picker.Item label="Select an item" value=""/>
            <Picker.Item label="Grilling" value="grilling" />
            <Picker.Item label="Baking" value="baking" />
            <Picker.Item label="Steaming" value="steaming" />
            <Picker.Item label="Roasting" value="roasting" />
            <Picker.Item label="Stir-Frying" value="stir-frying" />
          </Picker>
          </View>

          <Text style={[styles.smallTextQues, { marginTop: 50, marginLeft : 65 }]}>
            What is your favourite cuisine? 
          </Text>

          <TextInput
            style={styles.textinput}
            placeholderTextColor={'#000'}
            value={favCuisine}
            onChangeText={setCuisine}
          />

          <Text style={[styles.smallTextQues, { marginTop: 40 ,  marginLeft : 65 }]}>
            Do you like cooking and do it often? 
          </Text>

          <TextInput
            style={styles.textinput}
            placeholderTextColor={'black'}
            value={cookingFrequency}
            onChangeText={setCookingFrequency}
          />

          <View style={styles.buttonContainer}>
          
            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleSubmit}
            >
              <Text style={styles.doneButtonText}> Done </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneButton}
               onPress={() => navigation.navigate('PersonalisedScreen7')}
            >
            <Text style={styles.doneButtonText}> Skip </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: RFValue(20),
  },
  headerText: {
    fontSize: RFValue(24),
    textAlign: 'center',
    marginTop : RFValue(30),
    marginLeft:RFValue(20),
  },
  smallText: {
    fontSize: RFValue(16),
    marginLeft: RFValue(30),
    marginTop: RFValue(35),
  },
  textinput: {
    width: RFValue(250),
    height: RFValue(50),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    fontSize: RFValue(14),
    color: 'black',
    marginTop: RFValue(10),
    marginLeft: RFValue(50),
    paddingHorizontal: RFValue(10),
  },
  icon: {
    marginRight: RFValue(50),
    marginTop: RFValue(10),
  },
  iconContainer: {
    marginTop: RFValue(40),
    marginRight: RFValue(260),
  },
  pickerContainer: {
    height: RFValue(50),
    width: RFValue(200),
    marginLeft: RFValue(75),
    marginTop: RFValue(30),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    backgroundColor: '#F0B3B3',
     justifyContent: 'center',
  },
  picker: {
    height: RFValue(170),
    width: '100%',
    backgroundColor:'transparent',
    
  },
  pickerItem: {
    fontSize: RFValue(16),
    color: 'black',
    backgroundColor : 'transparent',
  },
  doneButton: {
    width: RFValue(140),
    height: RFValue(40),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    marginTop: RFValue(30),
    backgroundColor: '#F0B3B3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: RFValue(14),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: RFValue(20),
  },
  smallTextQues: {
    fontSize: RFValue(16),
    marginLeft: RFValue(65),
    marginTop: RFValue(30),
  },
});


export default PersonalisedExperienceScreen6;

