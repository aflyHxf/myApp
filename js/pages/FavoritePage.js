/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, RefreshControl, FlatList } from 'react-native';
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
import TrendingItem from '../common/TrendingItem';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';

class FavoritePage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { theme } = this.props
        const statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        }
        const navigationBar =
            <NavigationBar
                title={'收藏'}
                statusBar={statusBar}
                style={theme.styles.navBar}
            />
        const TopNavigations = createAppContainer(createMaterialTopTabNavigator({
            'Popular': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme} />,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
                navigationOptions: {
                    title: '最热'
                }
            },
            'Trending': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme} />,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
                navigationOptions: {
                    title: '趋势'
                }
            }
        }, {
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false,
                style: {
                    backgroundColor: theme.themeColor,//TabBar 的背景颜色
                    height: 30
                },
                indicatorStyle: styles.indicatorStyle,
                labelStyle: styles.labelStyle
            }
        }))
        return (
            <View style={styles.container}>
                {navigationBar}
                <TopNavigations />
            </View>
        );
    }
}

const mapFavoriteStateToProps = state => ({
    theme: state.theme.theme,
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapFavoriteStateToProps)(FavoritePage);

class FavoriteTab extends React.Component {
    constructor(props) {
        super(props)
        const { flag } = this.props
        this.storeName = flag
        this.favoriteDao = new FavoriteDao(this.storeName)
    }
    componentDidMount() {
        this.loadData(true)
        EventBus.getInstance().addListener(EventTypes.botton_tab_select, this.listener = data => {
            // handle the event
            if (data.to === 2) {
                this.loadData(false)
            }
        })
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
    }

    loadData(isShowLoading) {
        const { onLoadFavoriteData } = this.props
        onLoadFavoriteData(this.storeName, isShowLoading)
    }

    onFavorite(item, isFavorite) {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName)
        if (this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_change_popular)
        } else if (this.storeName === FLAG_STORAGE.flag_trending) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_change_trending)
        }
    }

    _renderItem(data) {
        const { item } = data
        const { theme } = this.props
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
        return <View style={{ marginBottom: 2 }}>
            <Item
                theme={theme}
                projectModel={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage('DetailPage', {
                        theme,
                        projectModel: item,
                        flag: this.storeName,
                        callback
                    })
                }}
                onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
            />
        </View>
    }

    _store() {
        const { favorite } = this.props;
        let store = favorite[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],//要显示的数据
            }
        }
        return store;
    }

    render() {
        let store = this._store();
        const { theme } = this.props;
        return (
            <View style={styles.container}>
                <FlatList data={store.projectModels}
                    renderItem={data => this._renderItem(data)}
                    keyExtractor={item => '' + (item.item.id || item.item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tintColor={theme.themeColor}
                        />
                    }
                />
                <Toast ref={'toast'} position={'center'} />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    favorite: state.favorite,
    theme: state.theme,
})

const mapDispatchToProps = dispatch => ({
    onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading))
})

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)

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
