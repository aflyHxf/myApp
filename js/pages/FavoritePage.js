/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, RefreshControl, FlatList, DeviceInfo } from 'react-native';
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

const THEME_COLOR = '#678'
export default class FavoritePage extends Component {
    constructor(props) {
        super(props)
        this.tabName = ['最热', '趋势']
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
        const TopNavigations = createAppContainer(createMaterialTopTabNavigator({
            'Popular': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
                navigationOptions: {
                    title: '最热'
                }
            },
            'Trending': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
                navigationOptions: {
                    title: '趋势'
                }
            }
        }, {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
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
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
        return <View style={{ marginBottom: 2 }}>
            <Item
                projectModel={item}
                onSelect={(callback) => { NavigationUtil.goPage('DetailPage', { projectModel: item, flag: this.storeName, callback }) }}
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
        return (
            <View style={styles.container}>
                <FlatList data={store.projectModels}
                    renderItem={data => this._renderItem(data)}
                    keyExtractor={item => '' + (item.item.id || item.item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tintColor={THEME_COLOR}
                        />
                    }
                />
                <Toast ref={'toast'} position={'center'} />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    favorite: state.favorite
})

const mapDispatchToProps = dispatch => ({
    onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading))
})

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
