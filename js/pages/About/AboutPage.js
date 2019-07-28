/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtil from '../../AppNavigators/NavigationUtil';
import MORE_MENU from '../../common/MoreMenu';
import GlobalStyles from '../../res/style/GlobalStyles';
import AboutCommon, { FLAG_ABOUT } from './AboutCommon';
import config from '../../res/data/config'

const THEME_COLOR = '#678'
export default class AboutPage extends Component {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about
        }, data => this.setState({ ...data }))

        this.state = {
            data: config
        }
    }

    onClick(menu) {
        let RouteName, params = {}
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebViewPage'
                params.title = '教程'
                params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
                break;
            case MORE_MENU.About:
                RouteName = 'AboutPage'
                break;
            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage'
                break;
            case MORE_MENU.Feedback:
                const url = 'mailto://aflyhxf@gmail.com'
                Linking.canOpenURL(url).then(support => {
                    if (!support) {
                        console.log('cant open the url:' + url)
                    } else {
                        Linking.openURL(url)
                    }
                }).catch(error => {
                    console.error(error)
                })
                break;
        }
        if (RouteName) {
            NavigationUtil.goPage(RouteName, params)
        }
    }

    getItem(menu) {
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR)
    }
    render() {
        const content = <View>
            {this.getItem(MORE_MENU.Tutorial)}
            <View style={GlobalStyles.line} />
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line} />
            {this.getItem(MORE_MENU.Feedback)}
        </View>
        return this.aboutCommon.render(content, this.state.data.app)
    }
}
