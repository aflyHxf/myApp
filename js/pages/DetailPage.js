/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, WebView, View, TouchableOpacity, DeviceInfo } from 'react-native';
import NavigationBar from '../common/NavigationBar'
import BackPressComponent from '../common/BackPressComponent'
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from '../AppNavigators/NavigationUtil';
import FavoriteDao from '../expand/Dao/FavoriteDao';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import share from '../res/data/share.json'
import ShareUtil from '../util/ShareUtil'

const TRENDING_URL = 'https"//github.com/'
export default class DetailPage extends Component {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params
        const { projectModel, flag } = this.params
        this.favoriteDao = new FavoriteDao(flag)
        this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName
        const title = projectModel.item.full_name || projectModel.item.fullName
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false,
            isFavorite: projectModel.isFavorite
        }
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
    }

    componentDidMount() {
        this.backPress.componentDidMount()
    }

    componentWillUnmount() {
        this.backPress.componentWillUnMount()
    }

    onBackPress() {
        this.onBack()
        return true
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }

    onFavoriteButtonClick() {
        const { projectModel, callback } = this.params
        const isFavorite = projectModel.isFavorite = !projectModel.isFavorite
        callback(isFavorite)
        this.setState({ isFavorite })
        let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString()
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
        } else {
            this.favoriteDao.removeFavoriteItem(key)
        }
    }

    renderRightButton() {
        return <View>
            <TouchableOpacity onPress={() => {
                this.onFavoriteButtonClick()
            }} style={{ flexDirection: 'row' }}>
                <FontAwesome name={this.state.isFavorite ? 'star' : 'star-o'} size={20}
                    style={{ color: '#fff', marginRight: 10 }} />
                {ViewUtil.getShareButton(() => {
                    let shareApp = share.share_app
                    ShareUtil.shareboard(shareApp.content, shareApp.imgUrl, this.url, shareApp.title, [0, 1, 2, 3, 4, 5, 6], (code, message) => {
                        console.log("result:" + code + message);
                    });
                })}
            </TouchableOpacity>
        </View>
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })
    }

    render() {
        const { theme } = this.params
        const titleLayoutStyle = this.state.title.length > 20 ? { paddingRight: 30 } : null
        const navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => {
                this.onBack()
            })}
            rightButton={this.renderRightButton()}
            title={this.state.title}
            titleLayoutStyle={titleLayoutStyle}
            style={theme.styles.navBar}
        />
        return (
            <SafeAreaViewPlus topColor={theme.themeColor}>
                {navigationBar}
                <WebView ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{ uri: this.state.url }} />
            </SafeAreaViewPlus>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
    }
});
