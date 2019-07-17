/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList, ActivityIndicator, DeviceInfo } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import PopularItem from '../common/PopularItem'
import { connect } from 'react-redux'
import actions from '../action'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from '../AppNavigators/NavigationUtil';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STAR = '&sort=star'
const THEME_COLOR = '#678'

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
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar =
      <NavigationBar
        title={'最热'}
        statusBar={statusBar}
        style={{ backgroundColor: THEME_COLOR }}
      />
    const TopNavigations = createAppContainer(createMaterialTopTabNavigator(this._renderTabs(), {
      tabBarOptions: {
        tabStyle: styles.tabStyle,
        upperCaseLabel: false,
        scrollEnabled: true,
        style: {
          backgroundColor: THEME_COLOR,
          height: 30
        },
        indicatorStyle: styles.indicatorStyle,
        labelStyle: styles.labelStyle
      }
    }))
    return (
      <View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
        {navigationBar}
        <TopNavigations />
      </View>
    );
  }
}

const pageSize = 10
class PopularTab extends React.Component {
  constructor(props) {
    super(props)
    this.storeName = this.props.tabLabel
  }
  componentDidMount() {
    this.loadData()
  }
  loadData(loadMore) {
    const { onRefreshPopular, onLoadMorePopular } = this.props
    const store = this._store();
    // 生成url
    const url = this._genFecth(this.storeName)
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else {
      onRefreshPopular(this.storeName, url, pageSize)
    }
  }

  _genFecth(key) {
    return URL + key + QUERY_STAR
  }

  _renderItem(data) {
    const { item } = data
    return <View style={{ marginBottom: 2 }}>
      <PopularItem item={item} onSelect={() => {
        NavigationUtil.goPage('DetailPage', { projectModel: item })
      }} />
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
  popular: state.popular
})

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize) => dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callback))
})

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tabStyle: {
    padding: 0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 14,
    margin: 0
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});
