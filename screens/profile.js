import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import ProfilePictureUploader from '../components/ProfilepictureUploader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'firebase';
import db from '../config';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [picture, setPicture] = useState('');
  const [interests, setInterests] = useState('');
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const currentUserEmail = firebase.auth().currentUser.email;
  const currentUserId = firebase.auth().currentUser.uid;
  const [available, setAvailable] = useState(false);

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.replace('Splash');
        Alert.alert('Logged Out..');
      })
      .catch((error) => {
        Alert.alert('Error logging out!');
      });
  };

  const userId = firebase.auth().currentUser.uid;

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
          setName(userData.name || '');
          setPicture(userData.imageUri);
          setUsername(userData.username || '');
          setEmail(userData.email || '');
          setAge(userData.Age || '');
          setRegion(userData.Region || '');
          setInterests(userData.interests || '');
        }
      } catch (error) {
        alert('Error fetching user data: ' + error.message);
      }
    };

    fetchUserProfile();
    console.log('Picture :' , picture)
  }, [userId]);

  const handleFillForm = () => {
    interests.forEach(interest => {
      const screenName = interestScreens[interest];
      if (screenName) {
        console.log('Navigating to:', screenName);
        navigation.navigate(screenName);
      } else {
        console.log('No screen found for interest:', interest);
      }
    });
    console.log('Handle fill form')
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const currentUserDoc = await db.firestore().collection('users').doc(currentUserId).get();
        const matchedProfiles = currentUserDoc.data().matches || [];

        const chatList = [];

        for (let i = 0; i < matchedProfiles.length; i++) {
          const matchedEmail = matchedProfiles[i];
          const chatId1 = `${currentUserEmail}${matchedEmail.email}`;
          const chatId2 = `${matchedEmail.email}${currentUserEmail}`;
          const chatDoc1 = await db.firestore().collection('chats').doc(chatId1).get();
          const chatDoc2 = await db.firestore().collection('chats').doc(chatId2).get();

          const subscriber = db.firestore()
            .collection('chats')
            .doc(currentUserEmail + matchedEmail.email)
            .collection('messages')
            .orderBy('createdAt', 'desc');

          subscriber.onSnapshot(async (querySnapshot) => {
            const allMessages = querySnapshot.docs.map(item => ({
              ...item.data(),
              createdAt: item.data().createdAt
            }));
            

            if (allMessages.length === 0) {
              setAvailable(false); // No messages available
            } else {
              setAvailable(true); // Messages available

              // Fetch other user's data
              const otherUserDoc = await db.firestore().collection('users').doc(matchedEmail.id).get();
              console.log(otherUserDoc.data())
              if (otherUserDoc) {
                const otherUserData = otherUserDoc.data();
                chatList.push({
                  id: matchedEmail.email,
                  name: otherUserData.name,
                  avatar: otherUserData.imageUri || 'https://example.com/default-avatar.png',
                });
              }
              setChats([...chatList]); // Update chats state with new chatList
            }
          });
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [currentUserEmail]);

  const deleteUserAccount = async () => {
    try {
      const user = firebase.auth().currentUser;

      if (!user) {
        console.log('No user is currently signed in.');
        return;
      }

      const userId = user.uid;

      // Step 1: Delete user from Firebase Authentication
      await user.delete();
      console.log('User account deleted from Firebase Authentication');

      // Step 2: Remove user data from Firestore
      const userDoc = firebase.firestore().collection('users').doc(userId);
      await userDoc.delete();
      console.log('User data deleted from Firestore');

      // Step 3: Optionally, remove user files from Firebase Storage
      const storageRef = firebase.storage().ref().child(`user_files/${userId}`);
      const listResult = await storageRef.listAll();

      const deletePromises = listResult.items.map((item) => item.delete());
      await Promise.all(deletePromises);
      console.log('User files deleted from Firebase Storage');

      // Step 4: Delete messages sent by the current user in chats collection
      const chatsSnapshot = await firebase.firestore().collection('chats').get();
      const chatDeletionPromises = [];

      chatsSnapshot.forEach(chatDoc => {
        chatDeletionPromises.push(
          chatDoc.ref.collection('messages')
            .where('sendBy', '==', userId)
            .get()
            .then(messagesSnapshot => {
              const messageDeletionPromises = messagesSnapshot.docs.map(msgDoc => msgDoc.ref.delete());
              return Promise.all(messageDeletionPromises);
            })
        );
      });

      await Promise.all(chatDeletionPromises);
      console.log('Messages sent by user deleted from Firestore');

      // Step 5: Sign out the user
      await firebase.auth().signOut();
      console.log('User signed out');

    } catch (error) {
      console.error('Error deleting user account:', error);
      if (error.code === 'auth/requires-recent-login') {
        // The user needs to re-authenticate before deleting their account
        console.error('User needs to re-authenticate before account deletion');
        alert('Please re-authenticate and try again.');

        // Handle re-authentication here
        try {
          const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            prompt('Please enter your password to re-authenticate:')
          );
          await user.reauthenticateWithCredential(credential);
          console.log('User re-authenticated');
          await deleteUserAccount(); // Try deleting the account again
        } catch (reauthError) {
          console.error('Re-authentication failed:', reauthError);
        }
      }
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteUserAccount();
            navigation.navigate('SignInScreen'); // Navigate to sign-in screen after account deletion
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require('../assets/kulPinkBackground.png')}>
          <KeyboardAwareScrollView>
            <ProfilePictureUploader />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.fillButton}
              onPress={() => navigation.navigate('PersonalisedScreen1')}>
              <Text style={styles.buttonText}>
                Fill out a form to get more personalised matches!
              </Text>
            </TouchableOpacity>
            <View style={styles.detailContainer}>
              <Text style={styles.detailsText}>Email: {email}</Text>
              <Text style={styles.detailsText}>Location: {region}</Text>
              <Text style={styles.detailsText}>Age: {age}</Text>
              <Text style={styles.detailsText}>Gender: Female</Text>
              <Text style={styles.detailsText}>Interests: {interests + " "}</Text>
              <Text style={styles.detailsText}>Friends: {chats.length}</Text>
            </View>
            <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
              <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  detailContainer: {
    width: RFValue(300),
    borderRadius: RFValue(20),
    height: RFValue(200),
    backgroundColor: 'white',
    marginLeft: RFValue(20),
    padding: RFValue(5),
  },
  detailsText: {
    fontSize: RFValue(14),
    padding: RFValue(2),
    marginTop: RFValue(5),
  },
  fillButton: {
    width: RFValue(250),
    height: RFValue(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(30),
    backgroundColor: '#FFF',
    margin: RFValue(12),
    marginLeft: RFValue(60),
  },
  buttonText: {
    textAlign: 'center',
    fontSize: RFValue(14),
  },
  button: {
    width: RFValue(150),
    height: RFValue(35),
    borderRadius: RFValue(20),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(15),
  },
  deleteAccountButton : {
    alignItems : 'center',
    marginTop : RFValue(30),
    width: RFValue(150),
    height: RFValue(35),
    borderRadius: RFValue(20),
    backgroundColor: '#fff',
   justifyContent: 'center',
   marginLeft : RFValue(100),
  }
});

export default Profile;
