import React from 'react';
import { StyleSheet, View, Text, Image, Alert } from 'react-native';
import { Card as RNECard } from 'react-native-elements';
import 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';

const Card = ({ item }) => {
  const imageUri = item.imageUri;
  console.log('URI from database ', imageUri);

const formatUriForPlatform = (uri) => {
    if (uri) {
      if (Platform.OS === 'ios' && !uri.startsWith('file://')) {
        // Handle iOS file URIs properly
        return `file://${uri}`;
      }
      // Ensure Android or any other platforms handle it as-is
      return uri;
    }
    return null;
  };

  const formattedUri = formatUriForPlatform(imageUri);
  
  console.log(formattedUri)


  return (
    <RNECard containerStyle={styles.card}>
      <Text style={styles.headerText}>This is....</Text>
      {imageUri ? (
        <Image
          style={styles.image}
          source={{ uri: formattedUri }}
          resizeMode="cover"
          onError={(error) => {
            console.error('Image loading error:', error.nativeEvent.error);
            //Alert.alert('Image Loading Error', 'Failed to load image.');
          }}
          onLoad={() => console.log('Image loaded successfully')}
        />
      ) : (
        <Text style={styles.noImageText}>Image not available</Text>
      )}
      <RNECard.Title style={styles.nameText}>{item.name}</RNECard.Title>
      <View style={styles.interestsContainer}>
        <Text style={styles.interestsHeaderText}>Interests</Text>
        <Text style={styles.interestsText}>{item.interests.join(', ')}</Text>
      </View>
    </RNECard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    marginLeft: 40,
    padding: 10,
    marginTop : 120,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 2,
    marginLeft : RFValue(20),
    marginTop : RFValue(10),
  },
  image: {
    width: '90%',
    height: RFValue(200),
    alignSelf: 'center',
    marginTop: 5,
  },
  noImageText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  nameText: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 10,
  },
  interestsContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#C56364',
    padding: 10,
    marginLeft: RFValue(10),
    width: '90%',
    alignItems: 'center',
  },
  interestsHeaderText: {
    fontSize: 18,
    textAlign: 'center',
  },
  interestsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Card;
