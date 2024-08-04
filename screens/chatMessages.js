import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import firebase from 'firebase';
import { useRoute } from '@react-navigation/native';
import { Header, Icon } from 'react-native-elements';
import db from '../config';
import { RFValue } from "react-native-responsive-fontsize"; // Import RFValue
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

const CustomAvatar = ({ navigation }) => {
  const route = useRoute(); 
  const [img, setImg] = useState(true)
  return (
    <View style={styles.avatarContainer}>
      <Image
        {...this.props}
        source={{ uri: route.params.data.avatar }}
        style={styles.avatarImage}
      />
    </View>
  );
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

const ChatMessages = ({ navigation }) => {
  const [messagesList, setMessagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(true);
  const route = useRoute();

  console.log('img : ', img);

  useEffect(() => {
    console.log('Email-chatmessa', route.params.data.email);
    console.log('Id=chatmess', route.params.id);
    console.log("itemi", route.params.data);
    const subscriber = db.firestore()
      .collection('chats')
      .doc(route.params.id + route.params.data.email)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const allMessages = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Ensure createdAt is a Firestore Timestamp
          if (data.createdAt && data.createdAt.toDate) {
            data.createdAt = data.createdAt.toDate();
          } else {
            data.createdAt = new Date();
          }
          console.log('Data from chats', data);
          return data;
        });
        setImg(route.params.data)
        setMessagesList(allMessages);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sendTo: route.params.data.email,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date(msg.createdAt)), // Convert to Firestore Timestamp
    };
    setMessagesList((previousMessages) =>
      GiftedChat.append(previousMessages, myMsg)
    );
    await db.firestore().collection('chats')
      .doc('' + route.params.id + route.params.data.email)
      .collection('messages')
      .add(myMsg);
    await db.firestore().collection('chats')
      .doc('' + route.params.data.email + route.params.id)
      .collection('messages')
      .add(myMsg);
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
            <View style={styles.leftComponent}>
              <Icon
                name="arrow-left"
                type="feather"
                color="white"
                size={RFValue(30)}
                onPress={() => navigation.navigate('Messages')}
              />
              <Image source={{ uri: route.params.data.avatar }} style={styles.avatar} />
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
              onSend={messages => onSend(messages)}
              user={{
                _id: firebase.auth().currentUser.uid || 0,
                name: firebase.auth().currentUser.displayName || '',
                avatar: route.params.data.avatar || '',
              }}
              renderBubble={(props) => <CustomBubble {...props} />}
              renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
              renderSend={(props) => <CustomSend {...props} />}
              renderAvatar={(props) => <CustomAvatar {...props} />}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e4e4e4',
    padding: RFValue(5),
    borderRadius: RFValue(30),
    margin:RFValue(3),
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
    color: '#000',
    flexWrap: 'wrap',
  },
  avatar: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    marginLeft: RFValue(10),
  },
  rightText: {
    color: '#000',
    flexWrap: 'wrap',
  },
  sendButton: {
    backgroundColor: 'transparent',
    marginRight: RFValue(15),
    marginBottom: Platform.OS === 'ios' ? RFValue(10) : RFValue(5),
  },
  leftComponent: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default ChatMessages;
