import { createStackNavigator } from '@react-navigation/stack';
import PersonalisedExperienceScreen1 from '../screens/personalisedExpScreen1';
import PersonalisedExperienceScreen2 from '../screens/personalisedExpScreen2';
import PersonalisedExperienceScreen3 from '../screens/personalisedExpScreen3';
import PersonalisedExperienceScreen4 from '../screens/personalisedExpScreen4';
import PersonalisedExperienceScreen5 from '../screens/personalisedExpScreen5';
import PersonalisedExperienceScreen6 from '../screens/personalisedExpScreen6';
import PersonalisedExperienceScreen7 from '../screens/personalisedExpScreen7';
import PersonalisedExperienceScreen8 from '../screens/personalisedExpScreen8';
import PersonalisedExperienceScreen9 from '../screens/personalisedExpScreen9';
import PersonalisedExperienceScreen10 from '../screens/personalisedExpScreen10';
import Profile from '../screens/profile';
import EditProfile from '../screens/editProfile';
import React, { useState, useEffect } from 'react';

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  const [interests, setInterests] = useState([ 'Music',
                'Dance',
                'Reading',
                'Sports',
                'Cooking',
                'Art',
                'Business/Finance',
                'Travelling',
                'Gardening',
                'Nature + Walking',]);
  return (
    <Stack.Navigator
      initialRoute="Profileuser"
      options={{ headerShown: false }}>
      <Stack.Screen name="Profileuser" component={Profile}  options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfile}  options={{ headerShown: false }}/>

       {interests.includes('Music') && (
      <Stack.Screen
        name="PersonalisedScreen1"
        component={PersonalisedExperienceScreen1}
        options={{ headerShown: false }}
      />
       )}
        {interests.includes('Dance') && (
      <Stack.Screen
        name="PersonalisedScreen2"
        component={PersonalisedExperienceScreen2}
        options={{ headerShown: false }}
      />
        )}
         {interests.includes('Reading') && (
      <Stack.Screen
        name="PersonalisedScreen3"
        component={PersonalisedExperienceScreen3}
        options={{ headerShown: false }}
      />
         )}
          {interests.includes('Art') && (
      <Stack.Screen
        name="PersonalisedScreen4"
        component={PersonalisedExperienceScreen4}
        options={{ headerShown: false }}
      />
          )}
           {interests.includes('Music') && (
      <Stack.Screen
        name="PersonalisedScreen5"
        component={PersonalisedExperienceScreen5}
        options={{ headerShown: false }}
      />
           )}

           {interests.includes('Cooking') && (
      <Stack.Screen
        name="PersonalisedScreen6"
        component={PersonalisedExperienceScreen6}
        options={{ headerShown: false }}
      />
           )}

           {interests.includes('Travelling') && (
      <Stack.Screen
        name="PersonalisedScreen7"
        component={PersonalisedExperienceScreen7}
        options={{ headerShown: false }}
      />
           )}

            {interests.includes('Gardening') && (
      <Stack.Screen
        name="PersonalisedScreen8"
        component={PersonalisedExperienceScreen8}
        options={{ headerShown: false }}
      />
           )}

           {interests.includes('Movies') && (
      <Stack.Screen
        name="PersonalisedScreen9"
        component={PersonalisedExperienceScreen9}
        options={{ headerShown: false }}
      />
           )}

           {interests.includes('Politics') && (
      <Stack.Screen
        name="PersonalisedScreen10"
        component={PersonalisedExperienceScreen10}
        options={{ headerShown: false }}
      />
           )}
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
