import { useState, useEffect } from 'react';
import {
  Button,
  Image,
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import * as FileSystem from 'expo-file-system'; // Ensure this import
import db from '../config';

const ProfilePictureUploader = ({ navigation }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState('');
  const [hasGalleryPermissions, sethasGalleryPermissions] = useState(null);

  const userId = firebase.auth().currentUser.uid;

   
  const handleEditProfilePicture = async () => {
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
      setProfilePic(source);
      await db
        .firestore()
        .collection('users')
        .doc(userId)
        .update({ imageUri: source });
    }
  };



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDoc = await db
          .firestore()
          .collection('users')
          .doc(userId)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();

          setProfilePic(userData.imageUri);
          setUsername(userData.name);
        }
      } catch (error) {
        alert('Error fetching user data: ' + error.message);
      }
    };

    fetchUserProfile();
  }, [userId]);
  

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style = {styles.container}>
    <View style = {styles.picCard}>
      {profilePic ? (
        <Image source={{ uri: profilePic }} style={styles.image} />
    
     ) : (
        <View style={styles.placeholderPic} />
      )}
    </View>
     <TouchableOpacity
        onPress={handleEditProfilePicture}
        style={styles.button}>
        <Text style={styles.buttonText}> Edit Picture </Text>
    </TouchableOpacity>

     <View style = {styles.nameContainer}>
  <Text  style = {styles.buttonText}> {username} </Text>
  </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 160,
    borderRadius : 95,
    marginLeft : 25,
    marginTop : 20,
  },
 
  placeholderPic: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  picCard: {
    width: 250,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 95,
    marginLeft: RFValue(75),
    marginTop: 60,
  },
  nameContainer: {
    width: RFValue(150),
    height: RFValue(35),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: RFValue(30),
    backgroundColor: '#FFF',
    marginTop: 8,
    marginLeft: 120,
  },

  button: {
    width: RFValue(150),
    height: RFValue(35),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: RFValue(30),
    backgroundColor: 'transparent',
    marginLeft: 122,
    
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    alignSelf: 'center',
   
  },
});
export default ProfilePictureUploader;
