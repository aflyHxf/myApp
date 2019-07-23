/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation'
import PopularPage from '../pages/PopularPage';
import TrendingPage from '../pages/TrendingPage';
import FavoritePage from '../pages/FavoritePage';
import MyPage from '../pages/MyPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { connect } from 'react-redux'
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'

class DynamicTabNavigator extends Component {
    constructor(props) {
        super(props)
        console.disableYellowBox = true
    }

    _renderTabOptions(routeName, title) {
        let iconName
        let titleName
        if (routeName === 'PopularPage') {
            iconName = 'whatshot'
            titleName = '最热'
        } else if (routeName === 'TrendingPage') {
            iconName = 'trending-up'
            titleName = '趋势'
        } else if (routeName === 'FavoritePage') {
            iconName = 'favorite'
            titleName = '收藏'
        } else if (routeName === 'MyPage') {
            iconName = 'person'
            titleName = '我的'
        }
        if (title) {
            return titleName
        }
        return iconName
    }
    _renderTabNavigator() {
        if (this.tabs) {
            return this.tabs
        }
        tabs = { PopularPage, TrendingPage, FavoritePage, MyPage }
        return this.tabs = createAppContainer(createBottomTabNavigator(tabs, {
            defaultNavigationOptions: ({ navigation }) => {
                const { routeName } = navigation.state
                return {
                    tabBarIcon: ({ tintColor }) => {
                        return <MaterialIcons name={this._renderTabOptions(routeName)} size={26} style={{ color: tintColor }} />
                    },
                    tabBarLabel: this._renderTabOptions(routeName, 'title')
                }
            },
            tabBarComponent: props => <TabBarComponent {...props} theme={this.props.theme} />
        }))
    }
    render() {
        const Tab = this._renderTabNavigator()
        return <Tab
            onNavigationStateChange={(prevState, newState, action) => {
                EventBus.getInstance().fireEvent(EventTypes.botton_tab_select, {
                    // 发送底部tab切换事件
                    from: prevState.index,
                    to: newState.index
                })
            }} />
    }
}


class TabBarComponent extends React.Component {
    render() {
        return (<BottomTabBar {...this.props}
            activeTintColor={this.props.theme} />)
    }
}

const mapStateToProps = (state) => ({
    theme: state.theme.theme
});

export default connect(mapStateToProps)(DynamicTabNavigator);