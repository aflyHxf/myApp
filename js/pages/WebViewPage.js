/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, WebView, View, TouchableOpacity, DeviceInfo } from 'react-native';
import NavigationBar from '../common/NavigationBar'
import BackPressComponent from '../common/BackPressComponent'
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from '../AppNavigators/NavigationUtil';

const THEME_COLOR = '#678'

export default class WebViewPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    const { title, url } = this.params
    this.state = {
      title: title,
      url: url,
      canGoBack: false
    }
    this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnMount()
  }

  onBackPress() {
    this.onBack()
    return true
  }

  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }


  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }

  render() {
    const navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      title={this.state.title}
      style={{ backgroundColor: THEME_COLOR }}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{ uri: this.state.url }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  }
});
