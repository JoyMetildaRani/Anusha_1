import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const TellUsMoreAboutYou = () => {
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [interests, setInterests] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

 const handleInterestChange = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((item) => item !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleContinue = async () => {
    console.log('eneters');
    if (!age.trim()) {
      Alert.alert('Age is required!');
      return;
    }
    if (!region.trim()) {
      Alert.alert('Region is required!');
      return;
    }
    if (interests.length === 0) {
      Alert.alert('At least one interest is required!');
      return;
    }

    
    navigation.navigate('TellUsMoreAboutYou1');

   
    await db.firestore().collection('users').doc(userId).update({
      Age: age,
      Region: region,
      interests: interests,
      UpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ImageBackground
          source={require('../assets/kulPinkBackground.png')}
          style={styles.background}>

          <View style={styles.iconContainer}>
            <Icon
              name="arrow-left"
              type="feather"
              color="black"
              onPress={() => navigation.navigate('Signup')}
            />
          </View>
          <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.headerText}>Tell us more about you!</Text>

              <Text style={styles.label}>Age*</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Region/Area*</Text>
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

              <TouchableOpacity style={styles.doneButton} onPress={handleContinue}>
                <Text style={styles.doneButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: RFValue(20),
  },
  iconContainer: {
    position: 'absolute',
    top: RFValue(40),
    left: RFValue(20),
  },
  headerText: {
    fontSize: RFValue(28),
    textAlign: 'center',
    marginBottom: RFValue(30),
  },
  label: {
    fontSize: RFValue(18),
    alignSelf: 'flex-start',
    marginLeft: RFValue(10),
    marginTop: RFValue(10),
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
    backgroundColor: 'transparent',
  },
  pickerContainer: {
    height: RFValue(50),
    width: RFValue(200),
    borderColor: '#C56364',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    marginTop: RFValue(10),
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    width: '80%',
    height: RFValue(45),//45
  },
  pickerItem: {
    fontSize: RFValue(16),
    backgroundColor : 'transparent',
  },
  picker: {
    height: RFValue(170),
    width: '100%',
    backgroundColor:'transparent',
    
  },
  title: {
    fontSize: RFValue(18),
    marginTop: RFValue(20),
    alignSelf: 'flex-start',
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: RFValue(10),
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginVertical: RFValue(10),
  },
  checkbox: {
    marginRight: RFValue(8),
  },
  doneButton: {
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
  doneButtonText: {
    fontSize: RFValue(18),
    color: 'black',
  },
});

export default TellUsMoreAboutYou;
