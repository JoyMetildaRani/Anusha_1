import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Alert,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Card from '../components/swipableCard';
import db from '../config';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';

export default function Home({ navigation }) {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const currentUserId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const findMatches = async () => {
      try {
        const currentUserDoc = await db
          .firestore()
          .collection('users')
          .doc(currentUserId)
          .get();
        const currentUserData = currentUserDoc.data();

        if (!currentUserData) return;

        const currentUserMatches = currentUserData.matches || [];

        const usersSnapshot = await db.firestore().collection('users').get();
        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const matchedUsers = users.filter((user) => {
          if (user.id === currentUserId) return false;
          if (currentUserMatches.some((match) => match.id === user.id)) return false;

          const isInSameRegion = user.Region === currentUserData.Region;

          const userInterests = user.interests || [];
          const currentUserInterests = currentUserData.interests || [];
          const commonInterests = userInterests.filter((interest) =>
            currentUserInterests.includes(interest)
          );

          return isInSameRegion && commonInterests.length >= 1;
        });

        setMatches(matchedUsers);
      } catch (error) {
        console.error('Error finding matches: ', error);
      }
    };

    findMatches();
  }, [currentUserId]);

  const handleSwipedLeft = () => {
    setCurrentProfileIndex((prevIndex) => prevIndex + 1);
  };

  const handleSwipedRight = async (currentProfileIndex) => {
    const matchedProfile = matches[currentProfileIndex];
    const currentUserDoc = await db
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .get();
    const currentUserData = currentUserDoc.data();

    const matchData = {
      id: matchedProfile.id,
      email: matchedProfile.email,
      name: matchedProfile.name,
      imageUri: matchedProfile.imageUri,
    };

    await db
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .update({
        matches: firebase.firestore.FieldValue.arrayUnion(matchData),
      });

    await db
      .firestore()
      .collection('users')
      .doc(matchedProfile.id)
      .update({
        matches: firebase.firestore.FieldValue.arrayUnion({
          id: currentUserId,
          email: currentUserData.email,
          name: currentUserData.name,
          imageUri: currentUserData.imageUri,
        }),
      });

    navigation.navigate('Matches', {
      user: currentUserData,
      data: matchedProfile,
    });
    setCurrentProfileIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/kulPinkBackground.png')}
        style={styles.background}
      >
        <Text style={styles.header}>Kul</Text>
        {matches.length > 0 ? (
          <Swiper
            cards={matches}
            renderCard={(card) => <Card item={card} key={card.id} />}
            onSwipedRight={(index) => handleSwipedRight(index)}
            onSwipedLeft={handleSwipedLeft}
            onSwipedAll={() => Alert.alert('All cards swiped')}
            cardIndex={0}
            backgroundColor={'transparent'}
            stackSize={10}
            cardStyle={styles.cardStyle}
          />
        ) : (
          <Text style={styles.noMatchesText}>No matches available</Text>
        )}

        <View style={styles.swipeInfoContainer}>
          <View style={styles.swipeInfoTextContainer}>
            <Text style={styles.swipeInfoText}>Swipe Left</Text>
          </View>

          <View style={styles.swipeInfoTextContainer}>
            <Text style={styles.swipeInfoText}>Swipe Right</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: RFValue(34),
    textAlign: 'center',
    marginTop: RFValue(80),
    color: 'black',
  },
  cardStyle: {
    height: RFValue(500),
    width: RFValue(300),
  },
  noMatchesText: {
    marginTop: RFValue(250),
    textAlign: 'center',
    color: 'black',
    fontSize: RFValue(18),
  },
  swipeInfoContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: RFValue(50),
    justifyContent: 'space-between',
    width: '80%',
    marginLeft : RFValue(10),
  },
  swipeInfoTextContainer: {
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    margin: RFValue(4),
    borderColor: '#C56364',
    width: RFValue(130),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeInfoText: {
    textAlign: 'center',
    marginTop: RFValue(5),
    color: 'black',
    fontSize: RFValue(14),
  },
});
