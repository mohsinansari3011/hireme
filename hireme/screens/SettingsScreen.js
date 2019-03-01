import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, Button, TextInput,
} from 'react-native';


import { firebase, firedb } from '../config/firebase';
//import ImagePicker from 'react-native-image-picker'
import ImagePicker from 'react-native-image-crop-picker';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };



    state = {
      user: null,
      profile: null,
      number: null,
      image: null

    };

    //this._showNumber = this._showNumber.bind(this)
  
  


  componentWillMount() {

    let number = null;
    let image = null;
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {

        firedb.ref('users').orderByChild('email').equalTo(user.email)
          .once('value', snap => {
            //console.log(snap.val())
           
            snap.forEach((childSnapshot) => {
              this.setState({
                profile: childSnapshot.val(),
                number: childSnapshot.val().phone,
                image: childSnapshot.val().picture.data.url
              })
              //alert(childSnapshot.val().email);
            });


            

          });

        this.setState({
          user,
          number,
          image
        })
      }
    })



  }


  
  handleChoosePhoto = () => {
    try {

      // const options = {
      //   title: 'Select Avatar',
      //   customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      //   storageOptions: {
      //     skipBackup: true,
      //     path: 'images',
      //   },
      // };


      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      }).then(image => {
        alert(image);
        console.log(image);
      });

    } catch (error) {
      alert(error)
    }
  }



  renderProfile(){
    const { profile, number, image } = this.state;
   
    
    //alert(number);
    return (
      profile ?
        <View><Text> WellCome {profile.name} </Text>
          <Text>Email : {profile.email}</Text>
        <Text>Phone : </Text>
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(text) => this.setState({ number:text })}
            value={number}
        />
          <Image source={{ uri: image }}
            style={{ width: 400, height: 400 }} />

       </View> : <Text> Loading... </Text>
      
    )
  }


  async _LogoutHireMe() {

    try {
      await firebase.auth().signOut();
      alert('You have Logout Successfully');
     
      // signed out
    } catch (e) {
      // an error
    } 


  }





  renderButton = () => {
    const { user } = this.state;
    //alert(this.state.user); 
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Update Your Profile!!</Text>

        <Button title="Choose Photo" onPress={this.handleChoosePhoto} color="#841584"/>
        <TouchableOpacity>{this.renderProfile()}</TouchableOpacity>

        <Button
          onPress={this._showNumber}
          title="ShowData"
          color="#841584"
          accessibilityLabel="Logout From Facebook"
        />

        <Button
          onPress={this._LogoutHireMe}
          title="Logout"
          color="#841584"
          accessibilityLabel="Logout From Facebook"
        />


      </View>
    );
  }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                require('../assets/images/hireme.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          {this.renderButton()}

        </ScrollView>


      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',


    backgroundColor: '#F5FCFF',
  }, label: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 48,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  }, label: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 48,
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  }, FbImage: {
    flex: 1,
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
