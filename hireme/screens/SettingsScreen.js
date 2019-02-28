import React from 'react';
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    user: null,
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

  renderButton = () => {
    const { user } = this.state;
    //alert(this.state.user); 
    return (
      <View style={styles.container}>


        <Text style={styles.label}>Welcome to the Profile Update!!</Text>
        <Text style={styles.label}>{user ? user.email : ''}</Text>
        <TouchableOpacity>



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
