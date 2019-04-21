/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import NavigationUtil from '../AppNavigators/NavigationUtil';

class PopularTab extends React.Component {
  render() {
    const { tabLabel } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{tabLabel}</Text>
        <Button title={'go to page'} onPress={() => NavigationUtil.goPage('DetailPage')} />
      </View>
    )
  }
}


export default class PopularPage extends Component {
  constructor(props) {
    super(props)
    this.tabName = ['Java', 'Android', 'iOS', 'React', 'React-native', 'PHP']
  }

  _renderTabs() {
    const tabs = {}
    this.tabName.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTab {...props} tabLabel={item} />,
        navigationOptions: {
          title: item
        }
      }
    })
    return tabs
  }
  render() {
    const TopNavigations = createAppContainer(createMaterialTopTabNavigator(this._renderTabs(), {
      tabBarOptions: {
        tabStyle: styles.tabStyle,
        upperCaseLabel: false,
        scrollEnabled: true,
        style: {
          backgroundColor: '#678'
        },
        indicatorStyle: styles.indicatorStyle,
        labelStyle: styles.labelStyle
      }
    }))
    return (
      <View style={{ flex: 1, marginTop: 30 }}>
        <TopNavigations />
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
  },
  tabStyle: {
    minWidth: 50
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6
  }
});
