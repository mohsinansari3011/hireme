import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, Button,
} from 'react-native';

import { firebase, firedb } from '../config/firebase';
const firebase_users = firedb.ref('users');

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  async _handleLogin() {
  try {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Expo.Facebook.logInWithReadPermissionsAsync('2751151995110691', {
      permissions: ['public_profile', 'email'],
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=email,id,name,picture.type(large),gender,friends`);
      const profile = await response.json();
      //const credential = firebase.auth.FacebookAuthProvider.credential(token);
      // firebase.auth().signInWithCredential(credential).then((result) =>{
      // }).catch((error) => {
      //   console.log(error);
      // })


      
      //console.log(response.json());
      alert(`Logged in! Hi ${profile.name} , ${profile.email}!`);

      this.SubmitDataToFirebase(profile);

    } else {
      // type === 'cancel'
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}


  SubmitDataToFirebase = (dataToSubmit) =>{

    dataToSubmit['password'] = 'password';
    firebase.auth().createUserWithEmailAndPassword(dataToSubmit.email, dataToSubmit.password)
    .then(() => {
      


      firebase_users.orderByChild("id")
        .limitToLast(1).once('value')
        .then((snapshot) => {

          let userId = null;
          snapshot.forEach(childsnapshot => {
            userId = childsnapshot.val().id;
          })

          //console.log(this.state.formdata.category.value);
          dataToSubmit['id'] = userId + 1;
          dataToSubmit['date'] = firebase.database.ServerValue.TIMESTAMP;
          dataToSubmit['isdelete'] = false;
          dataToSubmit['isblock'] = false;
          dataToSubmit['location'] = { cord: { lat: '0.004044', long: '0.0004' } };
          dataToSubmit['phone'] = '0303-6660032';


          firebase_users.push(dataToSubmit)
            .then(() => {
              // this.setState({
              //   loading: false,
              //   registorCompleted: 'User Inserted Successfully',

              // })

            }).catch(error => {
              // this.setState({
              //   loading: false,
              //   registorError: error.message
              // })
            })

        })




    }).catch(error => {
      // this.setState({
      //   loading: false,
      //   registorError: error.message
      // })
    })



}

  renderButton = () =>{
      return (
        <View style={styles.container}>
          <Text style={styles.label}>Welcome to the HireMe Application!!</Text>
          <TouchableOpacity onPress={() => this._handleLogin()}> 

            <Image 
              source={
                require('../assets/images/loginfacebook.png')
              }
              style={styles.FbImage}
            />
            {/* <Button
              onPress={() => this._handleLogin()}
              title="Login With Facebook"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            /> */}
          </TouchableOpacity>
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
