/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text } from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../AppNavigators/NavigationUtil';
import MORE_MENU from '../common/MoreMenu';
import Ionicons from 'react-native-vector-icons/Ionicons'
import GlobalStyles from '../res/style/GlobalStyles';
import { FLAG_LANGUAGE } from '../expand/Dao/LanguageDao';
import actions from '../action';
import { connect } from 'react-redux'

class MyPage extends Component {
  constructor(props) {
    super(props)
  }

  onClick(menu) {
    const { theme } = this.props
    let RouteName, params = {
      themeColor: theme.themeColor
    }
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage'
        params.title = '教程'
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage'
        break;
      case MORE_MENU.Custom_Theme:
        const { onShowCustomThemeView } = this.props
        onShowCustomThemeView(true);
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage'
        params.isRemoveKey = menu === MORE_MENU.Remove_Key
        params.flag = menu === MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_language : FLAG_LANGUAGE.flag_key
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage'
        break;
      case MORE_MENU.Sort_Key:
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyPage'
        params.flag = menu === MORE_MENU.Sort_Key ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(RouteName, params)
    }
  }

  getItem(menu) {
    const { theme } = this.props
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor)
  }
  render() {
    const { theme } = this.props
    const statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    const navigationBar =
      <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={theme.styles.navBar}
      />
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity onPress={() => { this.onClick(MORE_MENU.About) }} style={styles.item}>
            <View style={styles.aboutLeft}>
              <Ionicons name={MORE_MENU.About.icon} size={40} style={{ marginRight: 10, color: theme.themeColor }} />
              <Text>Github Popular</Text>
            </View>
            <Ionicons name={'ios-arrow-forward'} size={16} style={{ marginRight: 10, alignSelf: 'center', color: theme.themeColor }} />
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


const mapStateToProps = state => ({
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapStateToProps, mapDispatchToProps)(MyPage);

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
