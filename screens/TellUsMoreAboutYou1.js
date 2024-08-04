import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import db from '../config';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';

export default function TellUsMoreAboutYou1({ navigation }) {
  const [whyJoin, setWhyJoin] = useState('');
  const [howLearn, setHowLearn] = useState('');
  const [meetFrequency, setMeetFrequency] = useState('');
  const [imageUri, setImageUri] = useState(null);

   const handlechoosephoto = async () => {
    // Check and request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Please grant permission to access media library.'
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      const source = result.assets[0].uri; // Update image state with URI
      console.log(source);
      setImageUri(source);
    }

    console.log(result.assets[0].uri);
    console.log(imageUri);
  };

  const handleContinue = async () => {
    if (!whyJoin.trim() || !howLearn.trim() || !meetFrequency.trim()) {
      Alert.alert('All fields are required!');
      return;
    }

    const userId = firebase.auth().currentUser.uid;
    console.log(userId);
    let imageUrl = null;

    const userProfileData = {
      imageUri,
      whyJoin,
      howLearn,
      meetFrequency,
    };

    try {
      //const db = firebase.firestore();
      await db
        .firestore()
        .collection('users')
        .doc(userId)
        .update(userProfileData);

      Alert.alert('Profile info saved successfully!');
      alert('Profile saved successfully');
      // Navigate to the next screen if needed
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error saving profile info:', error.message);
    }
  };


  return (
    <View style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/kulPinkBackground.png')}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.iconContainer}>
            <Icon
              name="arrow-left"
              type="feather"
              color="black"
              style={styles.icon}
              onPress={() => navigation.navigate('TellUsMoreAboutYou')}
            />
          </View>
          <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <TouchableOpacity onPress={handlechoosephoto} style={styles.uploadButton}>
                <Text style={styles.uploadText}>Upload a Profile Picture</Text>
              </TouchableOpacity>
              <View style={styles.imageContainer}>
                {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
              </View>

              <Text style={styles.label}>Why did you join the app?</Text>
              <TextInput
                style={styles.input}
                value={whyJoin}
                onChangeText={setWhyJoin}
              />

              <Text style={styles.label}>How did you learn about the app?</Text>
              <TextInput
                style={styles.input}
                value={howLearn}
                onChangeText={setHowLearn}
              />

              <Text style={styles.label}>How regularly would you like to meet someone?</Text>
              <TextInput
                style={styles.input}
                value={meetFrequency}
                onChangeText={setMeetFrequency}
              />

              <TouchableOpacity style={styles.doneButton} onPress={handleContinue}>
                <Text style={styles.doneButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
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
  icon: {
    marginRight: 330,
    marginTop: 10,
  },
  uploadButton: {
    alignItems: 'center',
    marginBottom: RFValue(20),
  },
  uploadText: {
    fontSize: RFValue(18),
    color: 'black',
  },
  imageContainer: {
    backgroundColor: '#fff',
    width: 210,
    height: 170,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: RFValue(20),
  },
  image: {
    width: 190,
    height: 150,
    borderRadius: 75,
  },
  label: {
    fontSize: RFValue(18),
    marginTop: RFValue(20),
    alignSelf: 'flex-start',
    marginLeft: RFValue(10),
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

