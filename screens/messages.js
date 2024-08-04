import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, Image, View, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import db from '../config'; // Adjust your db import based on your config

export default function Messages({ navigation }) {
  const [chats, setChats] = useState([]);
  const currentUserEmail = firebase.auth().currentUser.email;
   const currentUserId = firebase.auth().currentUser.uid;
    const [available, setAvailable] = useState(false); // Initialize available state


  useEffect(() => {
    const fetchChats = async () => {
      try {
        const currentUserDoc = await db.firestore().collection('users').doc(currentUserId).get();
        const matchedProfiles = currentUserDoc.data().matches || [];

        const chatList = [];

        for (let i = 0; i < matchedProfiles.length; i++) {
          const matchedEmail = matchedProfiles[i].email;
          const chatId1 = `${currentUserEmail}${matchedEmail}`;
          const chatId2 = `${matchedEmail}${currentUserEmail}`;
          const chatDoc1 = await db.firestore().collection('chats').doc(chatId1).get();
          const chatDoc2 = await db.firestore().collection('chats').doc(chatId2).get();

      //    if (chatDoc1.exists || chatDoc2.exists) {
            const subscriber = db.firestore()
              .collection('chats')
              .doc(chatDoc1.exists ? chatId1 : chatId2)
              .collection('messages')
              .orderBy('createdAt', 'desc');

            subscriber.onSnapshot(async (querySnapshot) => {
              const allMessages = querySnapshot.docs.map(item => ({
                ...item.data(),
                createdAt: item.data().createdAt,
              }));

              if (allMessages.length > 0) {
                const otherUserDoc = await db.firestore().collection('users').doc(matchedProfiles[i].id).get();
                if (otherUserDoc.exists) {
                  const otherUserData = otherUserDoc.data();
                  const isUserAlreadyAdded = chatList.some(chat => chat.email === matchedEmail);
                  if (!isUserAlreadyAdded) {
                    chatList.push({
                      email: matchedEmail,
                      name: otherUserData.name,
                      avatar: otherUserData.imageUri,
                    });
                    console.log(chatList)
                    setChats([...chatList]); // Update chats state with new chatList
                  }
                }
              }
            });
        //  }
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  
const renderItem = ({ item }) => (
    <View style={styles.chatItem}>    
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style = {styles.userInfo}>
        <Text style={styles.chatText}>
          {item.name}
        </Text>
        </View>
        <TouchableOpacity
        style={styles.chatButton}
         onPress={() => navigation.navigate('ChatMessages', { data: item, id: firebase.auth().currentUser.email })}>
        <Text style = {styles.buttonText}> Open Chat </Text>
        </TouchableOpacity>
      </View>
  );
  

  const keyExtractor = (item, index) => item.id;

  return (
    <ImageBackground style={styles.background} source={require('../assets/kulPinkBackground.png')}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>

        <View style = {{ flexDirection: "row", marginTop : 60 }}>
       <TouchableOpacity style={[styles.button, { backgroundColor : '#F0B3B3' }]} onPress={() => navigation.navigate('Messages')}>
       <Text style= {styles.buttonText}> Messages  </Text>
       </TouchableOpacity>    

         <TouchableOpacity style={[styles.button, { backgroundColor : 'white' }]} onPress={() => navigation.navigate('ChatMatches')}> 
      <Text style = {styles.buttonText}> Matches </Text>
  </TouchableOpacity>
  </View>

          <Text style={styles.messagenumber}>Messages({chats.length})</Text>
          <FlatList
            data={chats}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
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
  messagenumber: {
    marginLeft: RFValue(30),
    marginTop: RFValue(10),
    fontSize: RFValue(14),
  },
  avatar: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(25),
  },
  chatButton: {
    height: RFValue(30),
    width: RFValue(80),
    borderRadius: RFValue(20),
    backgroundColor: '#E0AED0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: RFValue(20),
    marginTop :RFValue(5),
  },
  button: {
    width: RFValue(150),
    height: RFValue(35),
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: RFValue(30),
    backgroundColor: "#FFF",
    marginTop: RFValue(20),
    margin: RFValue(12),
  },
  buttonText: {
    textAlign: 'center',
    fontSize: RFValue(14),
    alignSelf: 'center'
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: RFValue(10),
    alignItems: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    padding: RFValue(3),
    borderRadius: RFValue(10),
    margin: RFValue(10),
    marginLeft: RFValue(30),
    backgroundColor: 'white',
    marginVertical: RFValue(10),
    marginHorizontal: RFValue(20),
  },
  chatText: {
    textAlign: 'center',
    fontSize: RFValue(14),
    alignSelf: 'center',
  },
});
