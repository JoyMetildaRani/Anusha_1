import { Image, View, StyleSheet } from 'react-native';
import firebase from 'firebase';
import React, { useState, useEffect } from 'react';
import db from '../config';

const CustomAvatar = (props) => {
  const currentUserId = firebase.auth().currentUser.uid;
   const currentUserEmail = firebase.auth().currentUser.email;
   const [currentUser, setCurrentUser] = useState(null);
    const [chatList, setChatList] = useState(null);

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
            console.log('allMessages', allMessages);

              // Fetch other user's data
              const otherUserDoc = await db.firestore().collection('users').doc(matchedEmail.id).get();
              
              if (otherUserDoc) {
                console.log("true")
                const otherUserData = otherUserDoc.data();
                chatList.push({
                  id: matchedEmail.email,
                  name: otherUserData.name,
                  avatar: otherUserData.imageUri || 'https://example.com/default-avatar.png',
                });
              }
              setChatList([...chatList]);
              console.log(chatList) // Update chats state with new chatList
          });
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [currentUserEmail]); // Dependency array ensures useEffect runs when currentUserEmail changes



  return (
    <View style={styles.avatarContainer}>
       <Image source={{ uri: currentUserEmail.imageUri }} style={styles.avatarImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
    backgroundColor : 'white',
    borderRadius: 20,
    marginBottom : 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default CustomAvatar;
