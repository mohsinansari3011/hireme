import React from 'react';
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };


  alert("Hello! I am an alert box!!");


  render() {
    return <ExpoConfigView />;
  }
}
