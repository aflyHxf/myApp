/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, WebView } from 'react-native';
import NavigationBar from '../common/NavigationBar'
import BackPressComponent from '../common/BackPressComponent'
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../AppNavigators/NavigationUtil';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

export default class WebViewPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.themeColor = this.params.themeColor
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
    const { themeColor } = this.params
    const navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      title={this.state.title}
      style={{ backgroundColor: themeColor }}
    />
    return (
      <SafeAreaViewPlus style={styles.container} topColor={themeColor}>
        {navigationBar}
        <WebView ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{ uri: this.state.url }}
        />
      </SafeAreaViewPlus>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
