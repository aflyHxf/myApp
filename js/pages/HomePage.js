/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import DynamicTabNavigator from '../AppNavigators/DynamicTabNavigator';
import { connect } from 'react-redux'
import BackPressComponent from './../common/BackPressComponent'
import CustomTheme from './CustomTheme'
import actions from '../action';
import SafeAreaViewPlus from './../common/SafeAreaViewPlus'

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

  renderCustomThemeView() {
    const { cutsomThemeViewVisiable, onShowCustomThemeView } = this.props;
    return (<CustomTheme
      visible={cutsomThemeViewVisiable}
      {...this.props}
      onClose={() => onShowCustomThemeView(false)}
    />)
  }

  render() {
    const { theme } = this.props
    return <SafeAreaViewPlus topColor={theme.themeColor}>
      <DynamicTabNavigator />
      {this.renderCustomThemeView()}
    </SafeAreaViewPlus>;
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  theme: state.theme.theme,
  cutsomThemeViewVisiable: state.theme.cutsomThemeViewVisiable
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);