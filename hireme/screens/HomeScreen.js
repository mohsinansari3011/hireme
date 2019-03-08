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



export default class HomeScreen extends React.Component {

  
  static navigationOptions = {
    title: 'User List',
  };

  state = {
    user: null,
    userarr : []
  };


  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
      
        firedb.ref('users')
          .once('value', snap => {

            this.setState({
              user,
              snap
            })


            // snap.forEach((childSnapshot) => {
            //   //console.log('pictue -- ', childSnapshot.val());
              
            //   // <View>
            //   //   <Text>Testing..</Text>
            //   // <View>
            //   //   <Image source={{ uri: childSnapshot.val().picture.data.url }}
            //   //     style={{ width: 200, height: 200 }} />
            //   // </View>

            //   // <View>
            //   //   <Text> {childSnapshot.val().name} </Text>
            //   // </View>
            //   // <View>
            //   //   <Text> {childSnapshot.val().phone} </Text>
            //   // </View>
            //   // </View>
            // })


            

            // let userid = Object.keys(snap.val())[0];
            // console.log(Object.keys(snap.val())[0])
            //console.log('childSnapshot.val()  ', snap.doc().id)
            // snap.forEach((childSnapshot) => {
            //   console.log('childSnapshot.val()  ', childSnapshot.val())

            //   // this.setState({
            //   //   userid,
            //   //   profile: childSnapshot.val(),
            //   //   phone: childSnapshot.val().phone,
            //   //   image: childSnapshot.val().picture.data.url,
            //   //   location: childSnapshot.val().location
            //   // })
            //   //alert(childSnapshot.val().email);
            // });




          })

       
        
      }
    })
  }



  renderUsers(){

    const { snap, userarr } = this.state;
    
    
      
      // userarr.map((item) =>{
      //   console.log(item);
      // })
     
      snap.forEach((childSnapshot) => {
        //console.log('pictue -- ', childSnapshot.val());
        userarr.push(childSnapshot.val());
        // <View>
        //   <Text>Testing..</Text>
        // <View>
        //   <Image source={{ uri: childSnapshot.val().picture.data.url }}
        //     style={{ width: 200, height: 200 }} />
        // </View>

        // <View>
        //   <Text> {childSnapshot.val().name} </Text>
        // </View>
        // <View>
        //   <Text> {childSnapshot.val().phone} </Text>
        // </View>
        // </View>
      })

      
    

    userarr ? userarr.map((item) =>{
      console.log('item --- ',item);
    })

  }

  render() {
    const { snap } = this.state;
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

          <View>
            <Text>Testing..</Text>
            <View>
              <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/hireme-3011.appspot.com/o/photos%2Fprofile_-L_IXxtSwkOb19uGPZAw.jpg?alt=media&token=77ee5c14-2f82-48b5-8fdd-821c4409aa4c" }}
                style={{ width: 100, height: 100 }} />
            </View>

            <View>
              <Text> MohsinAA </Text>
            </View>
            <View>
              <Text> 12312312312 </Text>
            </View>
          </View>
       

       
          {snap ? this.renderUsers() : <View><Text>Loading....</Text></View>}
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
