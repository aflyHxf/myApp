/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { BackHandler } from 'react-native'
import { NavigationActions } from 'react-navigation'
import DynamicTabNavigator from '../AppNavigators/DynamicTabNavigator';
import { connect } from 'react-redux'
import BackPressComponent from './../common/BackPressComponent'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.backPress = new BackPressComponent({ backPress: this.onBackPress() })
  }
  componentDidMount() {
    this.backPress.componentDidMount()
  }
  componentWillUnmount() {
    this.backPress.componentWillUnMount()
  }
  // 处理android 的物理返回键
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    //if (nav.index === 0) {
    if (nav.routes[1].index === 0) {//如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };
  render() {
    return <DynamicTabNavigator />
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav
});
export default connect(mapStateToProps)(HomePage)