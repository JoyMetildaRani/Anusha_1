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
import db from '../config'

const PersonalisedExperienceScreen10 = ({ navigation }) => {
  const [mostInterest, setMostInterest] = useState('');
  const [politicStance, setPoliticStance] = useState('');
  const [impIssue, setImpIssue] = useState('');


  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(userId).get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setMostInterest(userData.mostInterest || '');
          setPoliticStance(userData.politicStance || '');
          setImpIssue(userData.impIssue || '');
          
        }
      } catch (error) {
        alert('Error fetching user data: ' + error.message);
      }
    };

    fetchUserProfile();
  }, [userId]);

  
  const handleSubmit = async () => {
    try {
      await db.firestore().collection('users').doc(userId).update({
            mostInterest:mostInterest,
            politicStance:politicStance,
            impIssue:impIssue,
      });
      Alert.alert('Preferences saved successfully!');
      navigation.navigate('Profileuser');
    } catch (error) {
      Alert.alert('Error saving preferences: ', error.message);
    }
  };
  return (
      <ImageBackground
        source={require('../assets/kulPinkBackground.png')}
        style={styles.background}
      >

      <View style = {styles.iconContainer}>
        <Icon
          name="arrow-left"
          type="feather"
          color="black"
          style={styles.icon}
          onPress={() => navigation.navigate('Profileuser')}
        />
        </View>
      

        <KeyboardAwareScrollView>
        
          <Text style={styles.headerText}>
            Embrace a personalised experience 10
          </Text>

          <Text style={styles.smallText}>
            Tell us more about your interest in Politics + History}!
          </Text>

          <Text style={[styles.smallText, { marginTop: 30 }]}>
            Which country’s politics are you most interested by? 
          </Text>
      

          <View style = {styles.pickerContainer}>
          <Picker
            selectedValue={mostInterest}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue) => setMostInterest(itemValue)}
          >
            <Picker.Item label="Select an item" value=""/>
            <Picker.Item label="United States of America" value="united states of america" />
            <Picker.Item label="Russia" value="russia" />
            <Picker.Item label="United Kingdom" value="united kingdom" />
            <Picker.Item label="China" value="china" />
            <Picker.Item label="India" value="India" />
          </Picker>
          </View>

          <Text style={[styles.smallTextQues, { marginTop: 50, marginLeft : 60 }]}>
            What’s your political stance (on the scale)?  
          </Text>

          <TextInput
            style={styles.textinput}
            placeholderTextColor={'black'}
            value={politicStance}
            onChangeText={setPoliticStance}
          />

          <Text style={[styles.smallTextQues, { marginTop: 40 ,  marginLeft : 60 }]}>
            What are the more important issues faced by the world today? 
          </Text>

          <TextInput
            style={styles.textinput}
            placeholderTextColor={'black'}
            value={impIssue}
            onChangeText={setImpIssue}
          />

          <View style={styles.buttonContainer}>
          
            <TouchableOpacity
              style={styles.doneButton}
             onPress = {handleSubmit}
            >
              <Text style={styles.doneButtonText}> Done </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => navigation.navigate('Profileuser')}
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

export default PersonalisedExperienceScreen10;
