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

import { Constants, Location, Permissions, ImagePicker, RNFetchBlob } from 'expo';

//import RNFetchBlob from 'react-native-fetch-blob'

//var RNFetchBlob = require('react-native-fetch-blob')

//import ImagePicker  from 'react-native-image-picker'
//import ImagePicker from 'react-native-image-crop-picker';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };


    state = {
      user: null,
      profile: null,
      phone: null,
      image: null,
      errorMessage:''

    };

    //this._showNumber = this._showNumber.bind(this)
  
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

    const { userid, phone, image } = this.state;
    //console.log('user----- ', user);
    //console.log('user----- ', user.uid);

    try {
      
      firedb.ref('users/' + userid).update({
        phone,
        picture: { data: { url: image } }
      });

      console.log('image--- ',image);
      this.uploadImage(image, userid)
        .then(()=> { alert('uploaded'); })
        .catch(error => console.log(error))


      
    } catch (error) {
      
    }
   


  }

dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

  _handlePhotoChoice = async pickerResult => {
    // File or Blob named mountains.jpg
    var file = dataURLtoBlob(pickerResult.uri);

    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/mountains.jpg').put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function (error) {

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

    //...

    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, function() {
  // Upload completed successfully, now we can get the download URL
  uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
    console.log('File available at', downloadURL);
  });
});
  }


  uploadImage(uri, uid ,  mime = 'image/jpeg') {

    let fileUri = decodeURI(uri);
    console.log('uidx-----', fileUri);

    firebase
      .storage()
      .ref('photos/profile_' + uid + '.jpg')
      .putFile(fileUri)
      .then(uploadedFile => {
        console.log("Firebase profile photo uploaded successfully")
      })
      .catch(error => {
        console.log("Firebase profile upload failed: " + error)
      })


    // const Blob = RNFetchBlob.polyfill.Blob
    // const fs = RNFetchBlob.fs
    // console.log('uidx-----', uid);
    // window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    // window.Blob = Blob

    
    // return new Promise((resolve, reject) => {
    //   const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    //   let uploadBlob = null
    //   console.log('uploadUri-----', uploadUri);
    //   const imageRef = firebase.storage().ref('userimages').child(uid)

    //   fs.readFile(uploadUri, 'base64')
    //     .then((data) => {
    //       return Blob.build(data, { type: `${mime};BASE64` })
    //     })
    //     .then((blob) => {
    //       uploadBlob = blob
    //       return imageRef.put(blob, { contentType: mime })
    //     })
    //     .then(() => {
    //       uploadBlob.close()
    //       return imageRef.getDownloadURL()
    //     })
    //     .then((url) => {
    //       resolve(url)
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  }





  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    //console.log('location------',location);
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
                image: childSnapshot.val().picture.data.url
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


  



  renderProfile(){
    const { profile, phone, image } = this.state;
   
    
    //alert(number);
    return (
      profile ?
        <View><Text> WellCome {profile.name} </Text>
          <Text>Email : {profile.email}</Text>
        <Text>Phone : </Text>
        <TextInput
            keyboardType='numeric'
            maxLength={11}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(text) => this.setState({ phone:text })}
            value={phone}
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
      this.props.navigation.navigate("LoginScreen");
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

        

        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
          color='#093d53'
        />
     
        
        <ScrollView>{this.renderProfile()}</ScrollView>



        <Button
          title="Update Profile"
          color='#093d53'
          onPress={this._updatedata}
        />

        <Button
          onPress={this._LogoutHireMe}
          title="Logout"
          color='#093d53'
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
