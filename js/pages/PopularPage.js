/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList, ActivityIndicator, DeviceInfo, TouchableOpacity } from 'react-native';
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
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import { FLAG_LANGUAGE } from '../expand/Dao/LanguageDao';
import Ionicons from 'react-native-vector-icons/Ionicons'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STAR = '&sort=star'

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
class PopularPage extends Component {
    constructor(props) {
        super(props)
        const { onLoadLanguage } = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_key)
    }

    _renderTabs() {
        const tabs = {};
        const { keys, theme } = this.props;
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme} />,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        });
        return tabs;
    }

    _tabNav() {
        const { theme } = this.props
        return createAppContainer(createMaterialTopTabNavigator(
            this._renderTabs(), {
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false,//是否使标签大写，默认为true
                scrollEnabled: true,//是否支持 选项卡滚动，默认false
                style: {
                    backgroundColor: theme.themeColor,//TabBar 的背景颜色
                    height: 30//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
                },
                indicatorStyle: styles.indicatorStyle,//标签指示器的样式
                labelStyle: styles.labelStyle,//文字的样式
            },
            lazy: true
        }))
    }
    renderRightButton() {
        const { theme } = this.props
        return <TouchableOpacity
            onPress={() => {
                NavigationUtil.goPage('SearchPage', { theme })
            }}>
            <View style={{ padding: 5, marginRight: 8 }}>
                <Ionicons name={'ios-search'} size={24} style={{ marginRight: 8, alignSelf: 'center', color: '#fff' }} />
            </View>
        </TouchableOpacity>
    }
    render() {
        const { keys, theme } = this.props
        const statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        }
        const navigationBar =
            <NavigationBar
                title={'最热'}
                statusBar={statusBar}
                style={theme.styles.navBar}
                rightButton={this.renderRightButton()}
            />
        const TopNavigations = keys.length ? this._tabNav() : null

        return (
            <View style={styles.container}>
                {navigationBar}
                {TopNavigations && <TopNavigations />}
            </View>
        );
    }
}

const mapPopularStateToProps = state => ({
    keys: state.language.keys,
    theme: state.theme.theme
});
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);

const pageSize = 10
class PopularTab extends React.Component {
    constructor(props) {
        super(props)
        this.storeName = this.props.tabLabel
        this.isFavoriteChanged = false
    }
    componentDidMount() {
        this.loadData()
        EventBus.getInstance().addListener(EventTypes.favorite_change_popular, this.favoriteChangeListener = data => {
            // handle the event
            this.isFavoriteChanged = true
        })
        EventBus.getInstance().addListener(EventTypes.botton_tab_select, this.bottomTabSelectListener = data => {
            if (data.to === 0 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabSelectListener);
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
    popular: state.popular
})

const mapDispatchToProps = dispatch => ({
    onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
})

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

const styles = StyleSheet.create({
    container: {
        flex: 1
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
