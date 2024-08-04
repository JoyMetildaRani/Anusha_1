import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Picker } from '@react-native-picker/picker';
import Colors from '../constants/colors';
import React, { useState , useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';

const PersonalisedExperienceScreen4 = ({ navigation }) => {
  const [athletes, setAthletes] = useState('');
  const [sports, setSports] = useState('');
  
  const [selectedSport, setSelectedSport] = useState('');

  const userId = firebase.auth().currentUser.uid;
  const handleSubmit = async () => {
    try {
      await db.firestore().collection('users').doc(userId).update({
       selectedSport:selectedSport,
        athletes:athletes,
        sports:sports,
      });
      alert('Preferences saved successfully!');
      navigation.navigate('PersonalisedScreen5');
    } catch (error) {
      alert('Error saving preferences: ' + error.message);
    }
  };

  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(userId).get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setAthletes(userData.athletes || '');
          setSports(userData.sports || '');
          setSelectedSport(userData.selectedSport || '');
          
        }
      } catch (error) {
        alert('Error fetching user data: ' + error.message);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ImageBackground
        source={require('../assets/kulPinkBackground.png')}
        style={styles.background}>

        <View style = {styles.iconContainer}>
        <Icon
          name="arrow-left"
          type="feather"
          color="black"
          onPress={() => navigation.navigate('PersonalisedScreen3')}
        />
        </View>
       
        <KeyboardAwareScrollView>
        
          <View style={styles.container}>
            <Text style={styles.headerText}>
              Embrace a personalised experience 4
            </Text>

            <Text style={styles.smallText}>
              Tell us more about your interest in Sports!
            </Text>

            <Text style={[styles.smallText, { marginTop: 30 }]}>
              Which sports do you like?
            </Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSport}
                onValueChange={(itemValue) => setSelectedSport(itemValue)}
                style={styles.picker}
                style= {styles.pickerItem}
              >
                <Picker.Item label="Select an item" value="" />
                <Picker.Item label="Cricket" value="cricket" />
                <Picker.Item label="Basketball" value="basketball" />
                <Picker.Item label="Soccer" value="soccer" />
                <Picker.Item label="F1" value="f1" />
                <Picker.Item label="Tennis" value="tennis" />
              </Picker>
            </View>

            <Text style={[styles.smallTextQues, { marginTop: 50, marginLeft : 60 }]}>
              Who are your favourite athletes?
            </Text>

            <TextInput
              style={styles.textinput}
              placeholderTextColor={'black'}
              value={athletes}
              onChangeText={setAthletes}
            />

             <Text style={[styles.smallTextQues, { marginTop: 40 ,  marginLeft : 60 }]}>
              Do you play any sports?
            </Text>

            <TextInput
              style={styles.textinput}
              placeholderTextColor={'black'}
              value={sports}
              onChangeText={setSports}
            />

           <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.doneButton} onPress={handleSubmit}>
                <Text style={styles.doneButtonText}> Done </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => navigation.navigate('PersonalisedScreen5')}>
                <Text style={styles.doneButtonText}> Skip </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

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
    marginRight: RFValue(270),
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


export default PersonalisedExperienceScreen4;
