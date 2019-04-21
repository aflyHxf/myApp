/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View ,Button} from 'react-native';


export default class MyPage extends Component {
  render() {
    const {navigation} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to FavoritePage!</Text>
        <Button title={'改变主题色（蓝）'}
          onPress={() => navigation.setParams({
            theme: { tintColor: 'blue', updateTime: new Date().getTime() }
          })} />
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
