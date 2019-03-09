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
import { Constants, Location, Permissions, ImagePicker } from 'expo';
import RadioForm from 'react-native-simple-radio-button';



export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };


    state = {
      user: null,
      profile: null,
      phone: null,
      image: null,
      errorMessage:'',
      location : { cord : {} },
      role:0,
    };


  
  _pickImage = async () => {
    //await this.getCameraRollPermission()
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    //console.log(result);

    if (!result.cancelled) {
      this._handlePhotoChoice(result)
      this.setState({ image: result.uri });
    }
  };




  _updatedata = () => {

    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     console.log(user.uid);
    //   }
    // });

    const { userid, phone, image, location, role } = this.state;
    //console.log('user----- ', user);
    //console.log('user----- ', user.uid);

    
    try {
     
        firedb.ref('users/' + userid).update({
          phone,
          picture: { data: { url: image } },
          location,
          role
        });

        alert('Profile Updated Successfully');
      

      
    } catch (error) {
      
    }
   


  }


  _handlePhotoChoice = async pickerResult => {
    // File or Blob named mountains.jpg
    const { userid } = this.state;
    //console.log('pickerResult.uri ------- ',pickerResult.uri);
    //var file = this.convertImgToBase64URL(pickerResult.uri);

    const storageRef = firebase
      .storage()
      .ref('photos/profile_' + userid + '.jpg');

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', pickerResult.uri, true);
      xhr.send(null);
    });


    const metadata = {
      contentType: 'image/jpeg',
    };

    (downloadURL = await new Promise((resolve, reject) => {
      try {
        storageRef.put(blob, metadata).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            this.setState({
              image: downloadURL
            })  

            resolve(downloadURL);
          });
        });
      } catch (err) {
        reject(err);
      }
    }));

   
    //console.log('url---- ', url);
  }







  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: { cord: location.coords } });
    //console.log('location------', location.coords);
  };



  componentWillMount() {

    let phone = null;
    let image = null;
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {

        firedb.ref('users').orderByChild('email').equalTo(user.email)
          .once('value', snap => {
            let userid = Object.keys(snap.val())[0];
            //console.log(Object.keys(snap.val())[0])
            //console.log('childSnapshot.val()  ', snap.doc().id)
            snap.forEach((childSnapshot) => {
              //console.log('childSnapshot.val()  ', childSnapshot.val())
             
              this.setState({
                userid,
                profile: childSnapshot.val(),
                phone: childSnapshot.val().phone,
                image: childSnapshot.val().picture.data.url,
                location: childSnapshot.val().location,
                role: childSnapshot.val().role,
              })
              //alert(childSnapshot.val().email);
            });


            

          });

        this.setState({
          user,
          phone,
          image
        })
      }
    })

    //console.log(Platform.OS)
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }



  }


  
  // renderCheckBoxs(){

  //   return(
      
  //   )
  // }



  renderProfile(){
    const { profile, phone, image, role } = this.state;
    let radio_props = [
      { label: 'Worker', value: 0 },
      { label: 'User', value: 1 }
    ];
    
    //alert(number);
    return (
      profile ?
        <View><Text> Hello {profile.name} </Text>
          <Text>Email : {profile.email}</Text>
        <Text>Phone : </Text>
        <TextInput
            keyboardType='numeric'
            maxLength={11}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(text) => this.setState({ phone:text })}
            value={phone}
        />

          <RadioForm
            radio_props={radio_props}
            initial={role}
            onPress={(value) => { this.setState({ role: value }) }}
          />
          {/* {this.renderCheckBoxs()} */}
          <Image source={{ uri: image }}
            style={{ width: 400, height: 400 }} />

       </View> : <Text> Loading... </Text>
      
    )
  }


  async _LogoutHireMe() {

    try {
      await firebase.auth().signOut();
      alert('You have Logout Successfully');
      //this.props.navigation.navigate("HomeStack");
      // signed out
    } catch (e) {
      // an error
    } 


  }





  renderButton = () => {
    //const { user } = this.state;
    //alert(this.state.user); 
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Update Your Profile!!</Text>

        
<TouchableOpacity><Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
          color='#093d53'
          /></TouchableOpacity>
     
        
        <ScrollView>{this.renderProfile()}</ScrollView>



        <TouchableOpacity><Button
          title="Update Profile"
          color='#093d53'
          onPress={this._updatedata}
        /></TouchableOpacity>

        <TouchableOpacity><Button
          onPress={this._LogoutHireMe}
          title="Logout"
          color='#093d53'
          accessibilityLabel="Logout From Facebook"
        /></TouchableOpacity>


      </View>
    );
  }






  render() {
    const { user } = this.state;
    //console.log('render user ', user);
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
  }, 
  button :{
    width:250,
    height:50,
    backgroundColor: '#F5FCFF',
    borderRadius : 30,
    justifyContent : 'center',
    marginTop : 15
  },
  text :{
    color : 'white',
    fontSize : 18,
    textAlign: 'center',
    backgroundColor:"#841584"
  },
  label: {
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
