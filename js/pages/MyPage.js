/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, DeviceInfo, Text } from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../AppNavigators/NavigationUtil';
import MORE_MENU from '../common/MoreMenu';
import Ionicons from 'react-native-vector-icons/Ionicons'
import GlobalStyles from '../res/style/GlobalStyles';

const THEME_COLOR = '#678'
export default class MyPage extends Component {
  constructor(props) {
    super(props)
  }
  onClick(menu) {
    let RouteName, params = {}
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage'
        params.title = '教程'
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage'
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage'
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(RouteName, params)
    }
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR)
  }
  render() {
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar =
      <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={{ backgroundColor: THEME_COLOR }}
      />
    return (
      <View style={GlobalStyles.appContainer}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity onPress={() => { this.onClick(MORE_MENU.About) }} style={styles.item}>
            <View style={styles.aboutLeft}>
              <Ionicons name={MORE_MENU.About.icon} size={40} style={{ marginRight: 10, color: THEME_COLOR }} />
              <Text>Github Popular</Text>
            </View>
            <Ionicons name={'ios-arrow-forward'} size={16} style={{ marginRight: 10, alignSelf: 'center', color: THEME_COLOR }} />
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          {/* 教程 */}
          {this.getItem(MORE_MENU.Tutorial)}
          {/* 趋势管理 */}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/* 自定义语言 */}
          {this.getItem(MORE_MENU.Custom_Language)}
          <View style={GlobalStyles.line} />
          {/* 语言排序 */}
          {this.getItem(MORE_MENU.Sort_Language)}
          {/* 最热管理 */}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/* 自定义标签 */}
          {this.getItem(MORE_MENU.Custom_Key)}
          <View style={GlobalStyles.line} />
          {/* 标签排序 */}
          {this.getItem(MORE_MENU.Sort_Key)}
          <View style={GlobalStyles.line} />
          {/* 标签移除 */}
          {this.getItem(MORE_MENU.Remove_Key)}
          {/* 设置 */}
          <Text style={styles.groupTitle}>设置</Text>
          {/* 自定义主题 */}
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyles.line} />
          {/* 关注作者 */}
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line} />
          {/* 反馈 */}
          {this.getItem(MORE_MENU.Feedback)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  aboutLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between"
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }
});
