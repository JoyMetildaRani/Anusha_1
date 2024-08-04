import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Image,KeyboardAvoidingView,Platform,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import firebase from 'firebase';
import { useRoute } from '@react-navigation/native';
import { Header, Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import db from '../config';
import 'firebase/firestore'; // Ensure you import Firestore

class CustomInputToolbar extends React.Component {
  render() {
    return (
      <InputToolbar
        {...this.props}
        containerStyle={styles.inputToolbar}
        primaryStyle={{ alignItems: 'center' }}
      />
    );
  }
}

class CustomBubble extends React.Component {
  render() {
    return (
      <Bubble
        {...this.props}
        wrapperStyle={{
          left: styles.leftBubble,
          right: styles.rightBubble,
        }}
        textStyle={{
          left: styles.leftText,
          right: styles.rightText,
        }}
      />
    );
  }
}

class CustomSend extends React.Component {
  render() {
    return (
      <Send {...this.props} containerStyle={styles.sendContainer}>
        <Icon
          name="send"
          type="feather"
          color="black"
          style={styles.sendButton}
        />
      </Send>
    );
  }
}

class CustomAvatar extends React.Component {
  render() {
    const { route } = this.props;
    return (
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: route.params.data.imageUri }}
          style={styles.avatarImage}
        />
      </View>
    );
  }
}

const Chat = ({ navigation }) => {
  const [messagesList, setMessagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();

  useEffect(() => {
    const chatId = route.params.id + route.params.data.email;
    const subscriber = db.firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const allMessages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: firebaseData.text,
            createdAt: firebaseData.createdAt ? new Date(firebaseData.createdAt.seconds * 1000) : new Date(),
            user: {
              _id: firebaseData.user._id,
              name: firebaseData.user.name,
              avatar: firebaseData.user.avatar
            }
          };

          return data;
        });
        setMessagesList(allMessages);
        setLoading(false);
      });

    return () => subscriber();
  }, [route.params.id, route.params.data.email]);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sendTo: route.params.data.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      user: {
        _id: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName || '',
        avatar: firebase.auth().currentUser.photoURL || ''
      }
    };
    
    setMessagesList((previousMessages) => GiftedChat.append(previousMessages, messages));
    
    const chatId = route.params.id + route.params.data.email;
    db.firestore().collection('chats').doc(chatId).collection('messages').add(myMsg);

    const reverseChatId = route.params.data.email + route.params.id;
    db.firestore().collection('chats').doc(reverseChatId).collection('messages').add(myMsg);
  }, []);

  return (
    <ImageBackground
      style={{ flex: 1, width: '100%', height: '100%' }}
      source={require('../assets/KulChatBackground.jpg')}>
      
        <Header
          centerComponent={{
            text: route.params.data.name,
            style: { fontSize: RFValue(22), color: 'white', marginTop: RFValue(10) },
          }}
          leftComponent={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="arrow-left"
                type="feather"
                color="white"
                size={RFValue(30)}
                onPress={() => navigation.navigate('Messages')}
              />
              <Image source={{ uri: route.params.data.imageUri }} style={styles.avatar} />
            </View>
          }
          backgroundColor={'black'}
        />
        
        <KeyboardAwareScrollView
        style={{ flex: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraHeight={RFValue(50)}
      >

        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <GiftedChat
              messages={messagesList}
              onSend={(messages) => onSend(messages)}
              user={{
                _id: firebase.auth().currentUser.uid,
                name: firebase.auth().currentUser.displayName || '',
                avatar: firebase.auth().currentUser.photoURL || '',
              }}
              renderBubble={(props) => <CustomBubble {...props} />}
              renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
              renderSend={(props) => <CustomSend {...props} />}
              renderAvatar={(props) => <CustomAvatar {...props} route={route} />}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e4e4e4',
    padding: RFValue(5),
    borderRadius: RFValue(30),
    margin: RFValue(3),
  },
  container : {
      flex:1,
  },
  leftBubble: {
    backgroundColor: '#F8E1D9',
    padding: RFValue(5),
    borderRadius: RFValue(15),
    maxWidth: '80%',
  },
  rightBubble: {
    backgroundColor: '#E0AED0',
    padding: RFValue(5),
    borderRadius: RFValue(15),
    maxWidth: '80%',
  },
  leftText: {
    color: 'black',
    flexWrap: 'wrap',
  },
  rightText: {
    color: 'black',
    flexWrap: 'wrap',
  },
  avatar: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    marginLeft: RFValue(10),
  },
  sendButton: {
    backgroundColor: 'transparent',
    marginRight: RFValue(15),
    marginBottom: RFValue(10),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(10),
    backgroundColor: 'white',
    borderRadius: RFValue(20),
  },
  avatarImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
  },
});

export default Chat;
