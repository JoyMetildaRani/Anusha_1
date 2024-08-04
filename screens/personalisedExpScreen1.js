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

const PersonalisedExperienceScreen1 = ({ navigation }) => {
  const [musicGenre, setmusicGenre] = useState('');
  const [musicauthors, setmusicAuthors] = useState('');
  const [musicFrequency, setmusicFrequency] = useState('');

  const userId = firebase.auth().currentUser.uid;
  //const userId = 'LVjnAGjTl9Wy6jrq7hBvJvY6lRn2'
  const handleSubmit = async () => {
    try {
      await db.firestore().collection('users').doc(userId).update({
        musicGenre: musicGenre,
        musicauthors: musicauthors,
        musicFrequency: musicFrequency,
      });
      Alert.alert('Preferences saved successfully!');
      navigation.navigate('PersonalisedScreen2');
      console.log('musicAuthor',musicauthors);
    console.log('musicFrequency',musicFrequency);
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
          setmusicGenre(userData.musicGenre || '');
          setmusicAuthors(userData.musicauthors || '');
          setmusicFrequency(userData.musicFrequency || '');
          
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
       
       <View style = {styles.iconContainer}>
       <TouchableOpacity onPress={() =>{ navigation.navigate('Profileuser')}}>
        <Icon
          name="arrow-left"
          type="feather"
          color="black"
          style={styles.icon}
        />
        </TouchableOpacity>
        </View>

       <KeyboardAwareScrollView>  
          <Text style={styles.headerText}>
            Embrace a personalised experience 1
          </Text>

          <Text style={styles.smallText}>
            Tell us more about your interest in Music!
          </Text>

          <Text style={[styles.smallText, { marginTop: RFValue(20) }]}>
            Which type of music do you like?
          </Text>

           <View style={styles.pickerContainer}>
          <Picker
            selectedValue={musicGenre}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue) => setmusicGenre(itemValue)}
          >
            <Picker.Item label="Select an item" value="" />
            <Picker.Item label="Classical" value="classical" />
            <Picker.Item label="R&B" value="r&b" />
            <Picker.Item label="Pop" value="pop" />
            <Picker.Item label="Rock" value="rock" />
            <Picker.Item label="Country" value="country" />
            
          </Picker>
          </View>

          <Text style={[styles.smallTextQues, { marginTop: RFValue(50) }]}>
            Who are your favourite artists?
          </Text>

            <TextInput
              style={styles.textinput}
              placeholderTextColor={'#000'}
              value = {musicauthors}
              onChangeText={setmusicAuthors}
            />

          <Text style={[styles.smallTextQues, { marginTop: RFValue(40) }]}>
            How often do you listen to music?
          </Text>

           <TextInput
              style={styles.textinput}
              placeholderTextColor={'#000'}
              value={musicFrequency}
              onChangeText={setmusicFrequency}
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
              onPress={() => navigation.navigate('PersonalisedScreen2')}
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
    marginLeft: RFValue(40),
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
  
  iconContainer: {
    marginTop: RFValue(40),
    marginRight: RFValue(260),
  },
  pickerContainer: {
    height: RFValue(50),
    width: RFValue(200),
    marginLeft: RFValue(70),
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
    marginLeft: RFValue(55),
    marginTop: RFValue(30),
  },
});

export default PersonalisedExperienceScreen1;
