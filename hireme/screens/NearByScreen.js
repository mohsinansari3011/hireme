import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, Button, TextInput, RefreshControl  ,
} from 'react-native';

import { Constants, Location, Permissions } from 'expo';
import { firebase, firedb } from '../config/firebase';





export default class NearByScreen extends React.Component {

  
  static navigationOptions = {
    title: 'NearBy Service Providers',
  };

  state = {
    user: '',
    snap:'',
    userarr : [],
    location: { cord: {} },
    refreshing: false,
    locate : null
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



    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }



  componentWillUpdate(){
    console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
  }

  componentDidMount(){
    console.log('componentDidMount');
  }

// shouldComponentUpdate(){
//   console.log('shouldComponentUpdate');
// }


  viewprofile() {

    alert('view Profile');
    //this.props.navigation.navigate('Login');
  }



  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
  return d;
}

deg2rad(deg) {
  return deg * (Math.PI / 180)
}


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      this.setState({
        errorMessage: 'Permission to access location was denied',
        refreshing: false
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: { cord: location.coords }, refreshing: false });
    console.log('location------', location.coords);
  };


  renderUsers(){

    const { user, snap, userarr } = this.state;
      snap.forEach((childSnapshot) => {
        if (childSnapshot.val().email !== user.email) {
          if (childSnapshot.val().isblock || childSnapshot.val().isdelete) {
          } else {
            if (!childSnapshot.val().role) {
              userarr.push(childSnapshot.val());
            }
            
          }
        }
        
        
        
      })

    //console.log(user);
    //console.log('user lat-- ', user.location.cord.latitude);
    //console.log('user long-- ', user.location.cord.longitude);



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
    this.setState({ refreshing: true });
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const locate = JSON.stringify(position);

        this.setState({ locate });
        console.log(locate);
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  render() {
    //console.log('home redner');
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

         
          <TouchableOpacity onPress={this.findCoordinates}>
            <Text>Find My Coords?</Text>
            <Text>Location: {this.state.location}</Text>
          </TouchableOpacity>


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
