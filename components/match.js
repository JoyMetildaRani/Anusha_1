import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import db from '../config'
import firebase from 'firebase'

const UserMatches = ({ currentUserId }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const findMatches = async () => {
      try {
        const currentUserDoc = await db.firestore().collection('users').doc(currentUserId).get();
        const currentUserData = currentUserDoc.data();

        if (!currentUserData) return;

        const usersSnapshot = await db.firestore().collection('users').get();
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const matchedUsers = users.filter(user => {
          if (user.id === currentUserId) return false; // Exclude the current user

          const isInSameRegion = user.Region === currentUserData.Region;

          // Ensure interests are defined and count common interests
          const userInterests = user.Interests || [];
          const currentUserInterests = currentUserData.Interests || [];
          const commonInterests = userInterests.filter(interest =>
            currentUserInterests.includes(interest)
          );

          return isInSameRegion && commonInterests.length >= 1; // At least 1 interest
        });

        setMatches(matchedUsers);
      } catch (error) {
        console.error('Error finding matches: ', error);
      }
    };

    findMatches();
  }, [currentUserId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches Found:</Text>
      <FlatList
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.matchItem}>
            <Image source={{ uri: item.imageUri }} style={styles.profilePicture} />
            <Text>User ID: {item.id}</Text>
            <Text>Interests: {item.Interests.join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default UserMatches;
