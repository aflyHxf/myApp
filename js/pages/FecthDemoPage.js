/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

const URL = 'https://api.github.com/search/repositories?q=';

export default class FecthDemoPage extends Component {
  constructor(props) {
    super(props)
    this.searchKey = ''
    this.state = {
      renderText: ''
    }
  }
  _fecthData() {
    fetch(`${URL + this.searchKey}`)
      .then(response => {
        if (response.ok) {
          return response.text()
        }
        throw new Error('network response was not OK')
      })
      .then(responseText => this.setState({ renderText: responseText }))
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to FecthPage!</Text>
        <View style={{ alignItems: 'center' }}>
          <TextInput style={styles.input} onChangeText={text => this.searchKey = text} />
          <Button title={'搜索'} onPress={() => this._fecthData()} />
        </View>
        <Text>{this.state.renderText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  input: {
    width: 250,
    height: 40,
    lineHeight: 40,
    borderWidth: 1,
    borderColor: '#555',
    paddingLeft: 10,
  }
});
