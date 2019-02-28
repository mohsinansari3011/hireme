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


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    user: null,
    profile : null,
  };


  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({
          user
        })
      }
    })



  }


  componentDidMount(){
    const { user } = this.state;

    if (user) {
      firedb.ref('users/-LZAoafk6dvdbcussV5F').once('value')
      .then((snapshot) =>{

        this.setState({
          profile: snapshot
        })
      })
    }
    
  }

  renderProfile(){
    const { profile } = this.state;

    {
      profile? profile.map((item, i) => {

        return (<Text style={styles.label} key={i}>{item}</Text>)
      }) : ''
    }
  }

  renderButton = () => {
    const { user } = this.state;
    //alert(this.state.user); 
    return (
      <View style={styles.container}>


        <Text style={styles.label}>Welcome to the Profile Update!!</Text>
        <Text style={styles.label}>{user ? user.email : ''}</Text>
        
        {this.renderProfile()}

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
