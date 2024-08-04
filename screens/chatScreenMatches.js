import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'firebase';
import db from '../config';
import { RFValue } from 'react-native-responsive-fontsize';

export default function ChatMatches({ navigation }) {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const currentUserId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      try {
        const currentUserDoc = await db
          .firestore()
          .collection('users')
          .doc(currentUserId)
          .get();
        
        const currentUserData = currentUserDoc.data();
        const matches = currentUserData.matches || [];

        const matchedUserIds = matches.map(match => match.id);
        
        const usersSnapshot = await db
          .firestore()
          .collection('users')
          .where(firebase.firestore.FieldPath.documentId(), 'in', matchedUserIds)
          .get();
        console.log("matches",usersSnapshot)
        const users = await usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setMatchedUsers(users);
  
      } catch (error) {
        console.error('Error fetching matched users: ', error);
      }
    };

    fetchMatchedUsers();
  }, [currentUserId]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.imageUri }} // User image
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat', { data: item, id: firebase.auth().currentUser.email })}>
          <Text style={styles.buttonText}>Open Chat</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require('../assets/kulPinkBackground.png')}>
        <KeyboardAwareScrollView>
          <View style={styles.innerContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'white' }]} onPress={() => navigation.navigate('Messages')}>
                <Text style={styles.buttonText}>Messages</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#F0B3B3' }]} onPress={() => navigation.navigate('ChatMatches')}>
                <Text style={styles.buttonText}>Matches</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.messagenumber}>Matches ({matchedUsers.length})</Text>
            <FlatList
              data={matchedUsers}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    flex: 1,
    padding: RFValue(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RFValue(60),
  },
  button: {
    width: RFValue(150),
    height: RFValue(35),
    justifyContent: 'center',
    borderRadius: RFValue(20),
    marginVertical: RFValue(10),
  },
  buttonText: {
    textAlign: 'center',
    fontSize: RFValue(14),
    alignSelf: 'center',
  },
  messagenumber: {
    marginLeft: RFValue(30),
    marginTop: RFValue(10),
    fontSize: RFValue(14),
  },
  card: {
    flexDirection: 'row',
    padding: RFValue(3),
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    marginHorizontal: RFValue(20),
    backgroundColor: 'white',
    alignItems: 'center',
  },
  avatar: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(25),
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: RFValue(10),
    alignItems: 'center',
  },
  userName: {
    color: 'black',
    fontSize: RFValue(14),
  },
  chatButton: {
    height: RFValue(30),
    width: RFValue(80),
    borderRadius: RFValue(20),
    backgroundColor: '#E0AED0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: RFValue(20),
  },
});

