import React, { useState } from 'react';
import { CheckBox, Icon } from '@rneui/themed';
import { StyleSheet, Text, View,ImageBackground,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform } from "react-native";


type CheckboxComponentProps = {};

const CheckboxComponent: React.FunctionComponent<CheckboxComponentProps> = () => {
const [music, setMusic] = useState(false);
const [art, setArt] = useState(false);
const [reading, setReading] = useState(false);
const [gardening, setGardening] = useState(false);
const [dance, setDance] = useState(false);
const [cooking, setCooking] = useState(false);
const [walking, setWalking] = useState(false);
const [business, setBusiness] = useState(false);
const [sports, setSports] = useState(false);
const [travelling, setTravelling] = useState(false);

return (
  <>

    <View style = {{flexDirection : 'row'}}>

      <View>

      <View style={styles.checkboxContainer}>
     
        <CheckBox
         center
      title="Music"
      checked={music}
      onPress={() => setMusic(!music)}
      containerStyle = {{ width :150,backgroundColor : 'transparent'}}
        />
      </View>


      <View style={styles.checkboxContainer}>

        <CheckBox
          center
      title = "Dance"
      checked={dance}
      onPress={() => setDance(!dance)}
      containerStyle = {{ width :150,backgroundColor : 'transparent'}}
        />

      </View>

      <View style={styles.checkboxContainer}>
        <CheckBox
          center
      title="Reading"
      checked={reading}
      onPress={() => setReading(!reading)}
      containerStyle = {{ width :150,backgroundColor : 'transparent',marginLeft:15}}
      
        />
      </View>

      <View style={styles.checkboxContainer}>
        <CheckBox
          center
      title="Sports"
      checked={sports}
      onPress={() => setSports(!sports)}
      containerStyle = {{ width :150,backgroundColor : 'transparent'}}
        />
      </View>

       <View style={styles.checkboxContainer}>
        <CheckBox
       center
      title="Cooking"
      checked={cooking}
      onPress={() => setCooking(!cooking)}
      containerStyle = {{ width :150,backgroundColor : 'transparent',marginLeft:15}}
    
        />
     
      </View>

      </View>


      <View style ={{marginLeft: 80}}>

      <View style={styles.checkboxContainer}>
      
        <CheckBox
       center
      title="Art"
      checked={art}
      onPress={() => setArt(!art)}
      containerStyle = {{ width :110,backgroundColor : 'transparent'}}
     
        />
      
      </View>

       <View style={styles.checkboxContainer}>
        <CheckBox
         center
      title="Business/Finance"
      checked={business}
      onPress={() => setBusiness(!business)}
      containerStyle = {{ width :150,backgroundColor : 'transparent'}}
      
        />
        
      </View>

       <View style={styles.checkboxContainer}>
        <CheckBox
          center
      title="Travelling"
      checked={travelling}
      onPress={() => setTravelling(!travelling)}
      containerStyle = {{ width :150,backgroundColor : 'transparent'}}
        />
      </View>

       <View style={styles.checkboxContainer}>
        <CheckBox
   center
      title="Gardening"
      checked={gardening}
      onPress={() => setGardening(!gardening)}
      containerStyle = {{ width :150,backgroundColor : 'transparent'}}
        />
        
      </View>

       <View style={styles.checkboxContainer}>
        <CheckBox
         center
      title="Nature+Walking"
      checked={walking}
      onPress={() => setWalking(!walking)}
      containerStyle = {{ width :150,backgroundColor : 'transparent',marginLeft :30}}
        />
       
      </View>

      </View>
      </View>
    
  </>
);
};

const styles = StyleSheet.create({

  checkboxContainer: {
   flexDirection : 'row',
   width : 120,
   marginTop : 5,
  },
});

export default CheckboxComponent;