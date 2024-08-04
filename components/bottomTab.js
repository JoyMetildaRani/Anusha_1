import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileStackNavigator from './ProfileStackNavigator';
import ChatStackNavigator from './chatStackNavigator';
import HomeStackNavigator from './homeStackNavigator';


const Tab = createMaterialBottomTabNavigator();

export default class BottomTabNavigator extends Component {
  render(){
    return (
      <Tab.Navigator 
        barStyle={styles.bottomTabStyle}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } 
            else if (route.name === "Chat") {
              iconName = focused ?  "chatbox-ellipses" : "chatbox-ellipses-outline";
            }else if (route.name === "Profile") {
              iconName = focused ?  "person" : "person-outline";
            }
            return (
              <Ionicons
                name={iconName}
                size={25}
                color={color}
                style={styles.icons}
              />
            );
          }
        })}
        activeColor={"orange"}
        inactiveColor={"black"}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
        />
        <Tab.Screen
          name="Chat"
          component={ChatStackNavigator}
        />
         <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator}
        />
        
        
      </Tab.Navigator>
    );
  }}

const styles = StyleSheet.create({
  bottomTabStyle: {
    backgroundColor: "#F0B3B3",
    height: "6%",
    overflow: "hidden",
    display : 'flex'
  },
  icons: {
    width: RFValue(30),
    height: RFValue(30),
  }
});