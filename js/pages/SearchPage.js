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
import FavoriteDao from '../expand/Dao/FavoriteDao'
import { FLAG_STORAGE } from '../expand/Dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtils';
import LanguageDao, { FLAG_LANGUAGE } from '../expand/Dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STAR = '&sort=star'

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

class SearchPage extends React.Component {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.isKeyChange = false
    }
    componentDidMount() {
        this.backPress.componentDidMount()
    }
    componentWillUnmount() {
        this.backPress.componentWillUnMount()
    }

    loadData(loadMore, refreshFavorite) {
        const { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props
        const store = this._store();
        // 生成url
        const url = this._genFecth(this.storeName)
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, () => {
                this.refs.toast.show('没有更多了');
            })
        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
        }
    }

    _genFecth(key) {
        return URL + key + QUERY_STAR
    }

    _renderItem(data) {
        const { item } = data
        const { theme } = this.props
        return <View style={{ marginBottom: 2 }}>
            <PopularItem
                theme={theme}
                projectModel={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage('DetailPage', {
                        theme,
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_popular,
                        callback
                    })
                }}
                onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
            />
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
        const { theme } = this.props
        return (
            <View style={styles.container}>
                <FlatList data={store.projectModels}
                    renderItem={data => this._renderItem(data)}
                    keyExtractor={item => '' + item.item.id}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={theme.themeColor}
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
    search: state.search,
    keys: state.language.keys
})

const mapDispatchToProps = dispatch => ({
    onSearch: (inputKey, pageSize, token, favoriteDao, popularKey, callback) => dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKey, callback)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onLoadMoreSearch(storeName, pageIndex, pageSize, dataArray, favoriteDao, callback)),
    onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)

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
