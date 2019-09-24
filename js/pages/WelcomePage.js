/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import NavigationUtil from '../AppNavigators/NavigationUtil';
import { connect } from 'react-redux';
import actions from '../action';
import SplashScreen from 'react-native-splash-screen'

class WelcomePage extends Component {
  componentDidMount() {
    const { navigation } = this.props
    NavigationUtil.initNavigation(navigation)
    this.props.onThemeInit()
    this.timer = setTimeout(() => {
      SplashScreen.hide();
      NavigationUtil.resetToHomePage()
    }, 200)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  render() {
    return null
  }
}

const mapDispatchToProps = dispatch => ({
  onThemeInit: () => dispatch(actions.onThemeInit()),
});

export default connect(null, mapDispatchToProps)(WelcomePage);