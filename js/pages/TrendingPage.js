/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    FlatList,
    ActivityIndicator,
    DeviceInfo,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import TrendingItem from '../common/TrendingItem'
import { connect } from 'react-redux'
import actions from '../action'
import NavigationBar from '../common/NavigationBar'
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FavoriteDao from '../expand/Dao/FavoriteDao'
import { FLAG_STORAGE } from '../expand/Dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtils';
import NavigationUtil from '../AppNavigators/NavigationUtil';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import { FLAG_LANGUAGE } from '../expand/Dao/LanguageDao';
import ArrayUtil from '../util/ArrayUtil';

const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'
const URL = 'https://github.com/trending';
const pageSize = 10
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)

class TrendingPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timeSpan: TimeSpans[0]
        }
        const { onLoadLanguage } = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_language);
        this.preKeys = [];
    }

    _genTabs() {
        const tabs = {};
        const { keys, theme } = this.props;
        this.preKeys = keys;
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} theme={theme} />,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        });
        return tabs;
    }

    renderTitleView() {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={() => this.dialog.show()}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#fff', fontWeight: '400' }}>
                    趋势 {this.state.timeSpan.showText}</Text>
                <MaterialIcons name={'arrow-drop-down'} size={22} color={'#fff'} />
            </View>
        </TouchableOpacity>
    }

    onSelectTimeSpan(tab) {
        this.dialog.dismiss()
        this.setState({
            timeSpan: tab
        })
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
    }

    randerTrendingDialog() {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect={tab => this.onSelectTimeSpan(tab)}
        />
    }

    _tabNav() {
        //注意：主题发生变化需要重新渲染top tab
        const { theme } = this.props
        if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) {//优化效率：根据需要选择是否重新创建建TabNavigator，通常tab改变后才重新创建
            this.theme = theme
            this.tabNav = createAppContainer(createMaterialTopTabNavigator(
                this._genTabs(), {
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
            }
            ));
        }
        return this.tabNav;
    }

    render() {
        const { keys, theme } = this.props
        const statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        }

        const navigationBar =
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={statusBar}
                style={theme.styles.navBar}
            />
        const TopNavigations = keys.length ? this._tabNav() : null
        return (
            <View style={styles.container}>
                {navigationBar}
                {TopNavigations && <TopNavigations />}
                {this.randerTrendingDialog()}
            </View>
        );
    }
}

const mapTrendingStateToProps = state => ({
    keys: state.language.languages,
    theme: state.theme.theme
});
const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);


class TrendingTab extends React.Component {
    constructor(props) {
        super(props)
        const { tabLabel, timeSpan } = this.props
        this.storeName = tabLabel
        this.timeSpan = timeSpan
        this.isFavoriteChanged = false
    }

    componentDidMount() {
        this.loadData()
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan
            this.loadData()
        })
        EventBus.getInstance().addListener(EventTypes.favorite_change_trending, this.favoriteChangeListener = data => {
            // handle the event
            this.isFavoriteChanged = true
        })
        EventBus.getInstance().addListener(EventTypes.botton_tab_select, this.bottomTabSelectListener = data => {
            if (data.to === 1 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })
    }

    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabSelectListener);
    }

    loadData(loadMore, refreshFavorite) {
        const { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } = this.props
        const store = this._store();
        // 生成url
        const url = this._genFecth(this.storeName)
        // const url = this._genFecth('java')
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, () => {
                this.refs.toast.show('没有更多了');
            })
        } else if (refreshFavorite) {
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
        }
    }

    _genFecth(key) {
        if (key === 'All Language') {
            key = '';
            return URL + key + this.timeSpan.searchText
        }
        return URL + '/' + key + this.timeSpan.searchText
    }

    _renderItem(data) {
        const { item } = data
        const { theme } = this.props
        return <View style={{ marginBottom: 2 }}>
            <TrendingItem
                theme={theme}
                projectModel={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage('DetailPage', {
                        theme,
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_trending,
                        callback
                    })
                }}
                onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
            />
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
        const { theme } = this.props
        return (
            <View style={styles.container}>
                <FlatList data={store.projectModels}
                    renderItem={data => this._renderItem(data)}
                    keyExtractor={item => '' + item.item.fullName}
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
    trending: state.trending,
    theme: state.theme.theme
})

const mapDispatchToProps = dispatch => ({
    onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
})

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

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
