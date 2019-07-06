/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil';

export default class DetailPage extends Component {
  constructor(props) {
    super(props)
  }
  onBack() {

  }

  render() {
    const navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => { this.onBack() })}
      title={'最热'}
      statusBar={statusBar}
      style={{ backgroundColor: THEME_COLOR }}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});
