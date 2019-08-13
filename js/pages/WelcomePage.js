/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationUtil from '../AppNavigators/NavigationUtil';
import { connect } from 'react-redux';
import actions from '../action';

class WelcomePage extends Component {
  componentDidMount() {
    const { navigation } = this.props
    NavigationUtil.initNavigation(navigation)
    this.props.onThemeInit()
    this.timer = setTimeout(() => {
      NavigationUtil.resetToHomePage()
    }, 200)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>WelcomePage!</Text>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onThemeInit: () => dispatch(actions.onThemeInit()),
});

export default connect(null, mapDispatchToProps)(WelcomePage);
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
