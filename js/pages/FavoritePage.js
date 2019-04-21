/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action'

class FavoritePage extends Component {
  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to FavoritePage!</Text>
        <Button title={'改变主题色（绿）'}
          onPress={() => this.props.onThemeChange('green')} />
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage)