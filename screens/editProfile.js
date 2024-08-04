import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import Checkbox from 'expo-checkbox';
import Colors from '../constants/colors';
import CheckboxComponent from '../components/checkBoxComponent'

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [interests, setInterests] = useState([]);

  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(userId).get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setName(userData.name || '');
          setUsername(userData.username || '');
          setPhoneNumber(userData.phoneNumber || '');
          setAge(userData.Age || '');
          setRegion(userData.Region || '');
          setInterests(userData.interests || []); // Load interests from Firestore
        }
      } catch (error) {
        alert('Error fetching user data: ' + error.message);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleInterestChange = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((item) => item !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSubmit = async () => {
    try {
      await db.firestore().collection('users').doc(userId).update({
        name: name,
        username: username,
        Age: age,
        Region: region,
        interests: interests, // Save interests to Firestore
      });
      alert('Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ImageBackground
        source={require('../assets/kulPinkBackground.png')}
        style={styles.background}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon
              name="arrow-left"
              type="feather"
              color="black"
              onPress={() => navigation.navigate('Profileuser')}
              style={styles.icon}
            />
          </View>
          <Text style={[styles.inputFont, { marginTop: RFValue(90) }]}>Full Name</Text>
          <TextInput
            style={styles.textinput}
            placeholderTextColor={'black'}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputFont}>Username</Text>
          <TextInput
            style={styles.textinput}
            placeholderTextColor={'black'}
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.inputFont}>Age</Text>
          <TextInput
            style={styles.textinput}
            placeholderTextColor={'black'}
            value={age}
            onChangeText={setAge}
          />

          <Text style={styles.title}>Your Interests</Text>
          <View style={styles.checkboxContainer}>
            {[
              'Music',
              'Dance',
              'Reading',
              'Sports',
              'Cooking',
              'Art',
              'Business/Finance',
              'Travelling',
              'Gardening',
              'Nature + Walking',
            ].map((interest) => (
              <View key={interest} style={styles.checkboxWrapper}>
                <Checkbox
                  value={interests.includes(interest)}
                  onValueChange={() => handleInterestChange(interest)}
                  style={styles.checkbox}
                />
                <Text>{interest}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.inputFont}>Region/Area*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={region}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue) => setRegion(itemValue)}>
              <Picker.Item label="Select an Item" value="" />
              <Picker.Item label="North" value="North" />
              <Picker.Item label="South" value="South" />
              <Picker.Item label="East" value="East" />
              <Picker.Item label="West" value="West" />
              <Picker.Item label="Central" value="Central" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text> Save Profile </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    position: 'absolute',
    marginTop: RFValue(5),
    marginLeft: RFValue(20),
  },
  textinput: {
    width: RFValue(250),
    height: RFValue(40),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(15),
    fontSize: RFValue(14),
    color: 'black',
    marginTop: RFValue(5),
    marginLeft: RFValue(50),
    paddingHorizontal: RFValue(10),
  },
  inputFont: {
    marginLeft: RFValue(50),
    marginTop: RFValue(10),
    color: 'black',
    fontSize: RFValue(14),
  },
  button: {
    width: RFValue(150),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(20),
    backgroundColor: '#F0B3B3',
    alignSelf: 'center',
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    marginTop: RFValue(30),
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(30),
    marginTop: RFValue(10),
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginVertical: RFValue(10),
  },
  title: {
    fontSize: RFValue(16),
    marginTop: RFValue(10),
    textAlign: 'center',
  },
  icon: {
    marginRight: RFValue(50),
    marginTop: RFValue(50),
  },
  checkbox: {
    marginRight: RFValue(8),
  },
  pickerContainer: {
    height: RFValue(50),
    width: RFValue(250),
    marginLeft: RFValue(50),
    marginTop: RFValue(10),
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
});

export default EditProfile;
