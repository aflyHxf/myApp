/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import PopularItem from './../common/PopularItem'
import { connect } from 'react-redux'
import actions from '../action'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STAR = '&sort=star'
const THEME_COLOR = 'red'

export default class PopularPage extends Component {
  constructor(props) {
    super(props)
    this.tabName = ['Java', 'Android', 'iOS', 'React', 'React-native', 'PHP']
  }

  _renderTabs() {
    const tabs = {}
    this.tabName.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item} />,
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


class PopularTab extends React.Component {
  constructor(props) {
    super(props)
    const { tabLabel } = this.props
    this.storeName = tabLabel
  }
  componentDidMount() {
    this.loadData()
  }
  loadData() {
    const { onLoadPopularData } = this.props
    // 生成url
    const url = this._genFecth(this.storeName)
    onLoadPopularData(this.storeName, url)
  }

  _genFecth(key) {
    return URL + key + QUERY_STAR
  }

  _renderItem(data) {
    const { item } = data
    return <View style={{ marginBottom: 10 }}>
      <PopularItem item={item} />
    </View>
  }
  _store() {
    const { popular } = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
        hideLoadingMore: true,//默认隐藏加载更多
      }
    }
    return store;
  }
  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList data={store.items}
          renderItem={data => this._renderItem(data)}
          keyExtractor={item => '' + item.id}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  popular: state.popular
})

const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
})

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)



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
