import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, Button, TextInput, RefreshControl,
} from 'react-native';

import { firebase, firedb } from '../config/firebase';





export default class HomeScreen extends React.Component {

  
  static navigationOptions = {
    title: 'User List',
  };

  state = {
    user: '',
    snap:'',
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
          }) 
      }
    })
  }




  viewprofile() {

    alert('view Profile');
    //this.props.navigation.navigate('Login');
  }


  renderUsers(){

    const { user, snap } = this.state;
    const userarr = [];
      snap.forEach((childSnapshot) => {
        if (childSnapshot.val().email !== user.email) {
          if (childSnapshot.val().isblock || childSnapshot.val().isdelete) {
            //userarr.push(childSnapshot.val());
          } else {
            userarr.push(childSnapshot.val());
          }
        }
        
        
      })

      
   



return(
    userarr ? userarr.map((item,i) =>{
      //console.log('item --- ',item.email);
      return(
        <TouchableOpacity onPress={this.viewprofile}>
        <View key={i} style={styles.headrow}>
          <View style={styles.sideimage}>
            <Image style={{borderRadius:10}} source={{ uri: item.picture.data.url }}
            style={{ width: 100, height: 100 }} />
        </View>

          <View style={styles.sideview}>
            <View>
              <Text style={styles.titleText}> {item.name} </Text>
            </View>
            <View>
              <Text style={styles.titleText}> {item.phone} </Text>
            </View>
            {/* <View>
              <TouchableOpacity><Button
                title="View Profile"
                onPress={this.viewprofile}
                color='#4881B2'
              /></TouchableOpacity>
            </View> */}
          </View>
        </View>
        </TouchableOpacity>
      )

    }) : <View><Text>Loading....</Text></View>
)
  }


  _onRefresh = () => {
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {

        firedb.ref('users')
          .once('value', snap => {

            this.setState({
              user,
              snap,
              refreshing: false
            })
          })
      }
    })

    console.log('refreshed');
  }

  render() {
    console.log('home redner');
    const { snap } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                require('../assets/images/hireme.png')
              }
              style={styles.welcomeImage}
            />
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
  }, 
  headrow : {
    // display:"flex",
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#093d53',
    borderRadius: 10,
   
    marginTop: 10
  },
  sideimage :{
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 30,
    padding: 10,
    justifyContent: 'flex-start',
    position: 'relative'
    
  },
  sideview: {
    flex:1,
    padding : 10,
    justifyContent: 'flex-end',
    position: 'absolute',
    left: 120
   
  }, titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
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
