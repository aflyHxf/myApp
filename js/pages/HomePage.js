/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { BackHandler } from 'react-native'
import DynamicTabNavigator from '../AppNavigators/DynamicTabNavigator';

export default class HomePage extends Component {
  render() {
    return <DynamicTabNavigator />
  }
}