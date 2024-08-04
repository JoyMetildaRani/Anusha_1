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
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase';
import db from '../config';

const PersonalisedExperienceScreen3 = () => {
  const [readgenre, setGenre] = useState('');
  const [readauthors, setAuthors] = useState('');
  const [readFrequency, setReadFrequency] = useState('');
  const navigation = useNavigation();

  const userId = firebase.auth().currentUser.uid;
  const handleSubmit = async () => {
    try {
      await db.firestore().collection('users').doc(userId).update({
        readgenre:readgenre,
        readauthors:readauthors,
        readFrequency:readFrequency,
      });
      alert('Preferences saved successfully!');
      navigation.navigate('PersonalisedScreen4');
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
          setAuthors(userData.readauthors || '');
          setGenre(userData.readgenre || '');
          setReadFrequency(userData.readFrequency || '');
          
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
          onPress={() => navigation.navigate('PersonalisedScreen2')}
        />
        </View>
       
        <KeyboardAwareScrollView>
         
          <View style={styles.container}>
            <Text style={styles.headerText}>
              Embrace a personalised experience 3
            </Text>

            <Text style={styles.smallText}>
              Tell us more about your interest in Reading!
            </Text>

            <Text style={[styles.smallText, { marginTop: 30 }]}>
              Which type of genre do you like?
            </Text>

            <View style = {styles.pickerContainer}>
              <Picker
                selectedValue={readgenre}
                onValueChange={(itemValue) => setGenre(itemValue)}
                style = {styles.pickerItem}
                style={styles.picker}>
                <Picker.Item label="Select an item" value="" />
                <Picker.Item label="Sci-fi" value="sci-fi" />
                <Picker.Item label="Horror" value="horror" />
                <Picker.Item label="Comedy" value="comedy" />
                <Picker.Item label="Non-fiction" value="non-fiction" />
                <Picker.Item label="Self-improvement" value="self-improvement" />
              </Picker>
            </View>

             <Text style={[styles.smallTextQues, { marginTop: 50, marginLeft : 60 }]}>
              Who are your favourite authors?
            </Text>

            <TextInput
              style={styles.textinput}
              placeholderTextColor={'black'}
              value={readauthors}
              onChangeText={setAuthors}
            />

            <Text style={[styles.smallTextQues, { marginTop: 40 ,  marginLeft : 60 }]}>
              How often do you read?
            </Text>

            <TextInput
              style={styles.textinput}
              placeholderTextColor={'black'}
              value={readFrequency}
              onChangeText={setReadFrequency}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.doneButton} onPress={handleSubmit}>
                <Text style={styles.doneButtonText}> Done </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => navigation.navigate('PersonalisedScreen4')}>
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
    marginLeft: RFValue(55),
    marginTop: RFValue(30),
  },
});

export default PersonalisedExperienceScreen3;
