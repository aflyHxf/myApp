/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import TrendingItem from '../common/PopularItem'
import { connect } from 'react-redux'
import actions from '../action'
import NavigationBar from '../common/NavigationBar'

const URL = 'https://github.com/trending/';
const QUERY_STAR = '?since=daily'
const THEME_COLOR = '#678'

export default class TrendingPage extends Component {
  constructor(props) {
    super(props)
    this.tabName = ['All', 'C', 'C#', 'PHP', 'JavaScript']
  }

  _renderTabs() {
    const tabs = {}
    this.tabName.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} tabLabel={item} />,
        navigationOptions: {
          title: item
        }
      }
    })
    return tabs
  }
  render() {
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar =
      <NavigationBar
        title={'趋势'}
        statusBar={statusBar}
        style={{ backgroundColor: THEME_COLOR }}
      />
    const TopNavigations = createAppContainer(createMaterialTopTabNavigator(this._renderTabs(), {
      tabBarOptions: {
        tabStyle: styles.tabStyle,
        upperCaseLabel: false,
        scrollEnabled: true,
        style: {
          backgroundColor: THEME_COLOR
        },
        indicatorStyle: styles.indicatorStyle,
        labelStyle: styles.labelStyle
      }
    }))
    return (
      <View style={{ flex: 1, marginTop: 30 }}>
        {navigationBar}
        <TopNavigations />
      </View>
    );
  }
}

const pageSize = 10
class TrendingTab extends React.Component {
  constructor(props) {
    super(props)
    this.storeName = this.props.tabLabel
  }
  componentDidMount() {
    this.loadData()
  }
  loadData(loadMore) {
    const { onRefreshTrending, onLoadMoreTrending } = this.props
    const store = this._store();
    // 生成url
    const url = this._genFecth(this.storeName)
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else {
      onRefreshTrending(this.storeName, url, pageSize)
    }
  }

  _genFecth(key) {
    return URL + key + QUERY_STAR
  }

  _renderItem(data) {
    const { item } = data
    return <View style={{ marginBottom: 2 }}>
      <TrendingItem item={item} />
    </View>
  }
  _store() {
    const { trending } = this.props;
    let store = trending[this.storeName];
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
  _genIndicator() {
    return this._store().hideLoadingMore ? null : <View style={styles.indicatorContainer}>
      <ActivityIndicator style={styles.indicator} />
      <Text>加载更多</Text>
    </View>
  }
  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList data={store.projectModels}
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
          ListFooterComponent={() => this._genIndicator()}
          onEndReached={() => {
            console.log('---onEndReached----');
            setTimeout(() => {
              if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
            console.log('---onMomentumScrollBegin-----')
          }}
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  trending: state.trending
})

const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callback))
})

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});
