/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList, ActivityIndicator, TouchableOpacity, Platform, TextInput } from 'react-native';
import Toast from 'react-native-easy-toast'
import PopularItem from '../common/PopularItem'
import { connect } from 'react-redux'
import actions from '../action'
import NavigationUtil from '../AppNavigators/NavigationUtil';
import FavoriteDao from '../expand/Dao/FavoriteDao'
import { FLAG_STORAGE } from '../expand/Dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtils';
import LanguageDao, { FLAG_LANGUAGE } from '../expand/Dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import Utils from '../util/Utils';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

const pageSize = 10
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

class SearchPage extends React.Component {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
        // this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.isKeyChange = false
    }
    componentDidMount() {
        this.backPress.componentDidMount()
    }
    componentWillUnmount() {
        this.backPress.componentWillUnMount()
    }

    loadData(loadMore) {
        const { onSearch, onLoadMoreSearch, search, keys } = this.props
        if (loadMore) {
            onLoadMoreSearch(++search.pageIndex, pageSize, search.items, favoriteDao, () => {
                this.toast.show('没有更多了');
            })
        } else {
            onSearch(this.inputKey, pageSize, this.searchToekn = new Date().getTime(), favoriteDao, keys, message => {
                this.toast.show(message);
            })
        }
    }

    onBackPress() {
        const { onSearchCancel, onLoadLanguage, navigation } = this.props
        onSearchCancel()
        this.refs.input.blur()
        NavigationUtil.goBack(navigation)
        if (this.isKeyChange) {
            onLoadLanguage(FLAG_LANGUAGE.flag_key)
        }
        return true
    }

    _renderItem(data) {
        const { item } = data
        const { theme } = this.params
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

    _genIndicator(hideLoadingMore) {
        return hideLoadingMore ? null : <View style={styles.indicatorContainer}>
            <ActivityIndicator style={styles.indicator} />
            <Text>加载更多</Text>
        </View>
    }

    saveKey() {
        const { keys } = this.props
        let key = this.inputKey
        if (Utils.checkKeyIsExist(keys, key)) {
            this.toast.show(key + '已经存在')
        } else {
            key = {
                path: key,
                name: key,
                checked: true
            };
            keys.unshift(key) // 将key添加到数组开头
            this.languageDao.save(keys)
            this.toast.show('保存成功')
            this.isKeyChange = true
        }
    }
    onRightButtonClick() {
        const { onSearchCancel, search } = this.props
        if (search.showText === '搜索') {
            this.loadData()
        } else {
            onSearchCancel(this.searchToekn)
        }
    }

    renderNavBar() {
        const { theme } = this.params
        const { showText, inputKey } = this.props.search
        const placeholder = inputKey || '请输入'
        let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress())
        let inputView = <TextInput ref={'input'}
            placeholder={placeholder}
            onChangeText={text => this.inputKey = text}
            style={styles.textInput} />
        let rightButton = <TouchableOpacity onPress={() => {
            this.refs.input.blur()
            this.onRightButtonClick()
        }}>
            <View style={{ marginRight: 10 }}>
                <Text style={styles.title}>{showText}</Text>
            </View>
        </TouchableOpacity >
        return <View style={{
            backgroundColor: theme.themeColor,
            flexDirection: 'row',
            alignItems: 'center',
            height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android
        }}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }

    render() {
        const { isLoading, projectModels, showBottomButton, hideLoadingMore } = this.props.search
        const { theme } = this.params
        let statusBar = null
        if (Platform.OS === 'ios') {
            statusBar = <View style={{ backgroundColor: theme.themeColor }} />
        }

        let listView = !isLoading ?
            <FlatList data={projectModels}
                renderItem={data => this._renderItem(data)}
                keyExtractor={item => '' + item.item.id}
                contentInset={{ bottom: 45 }}
                refreshControl={
                    <RefreshControl
                        title={'loading'}
                        titleColor={theme.themeColor}
                        colors={[theme.themeColor]}
                        refreshing={isLoading}
                        onRefresh={() => this.loadData()}
                        tintColor={theme.themeColor}
                    />
                }
                ListFooterComponent={() => this._genIndicator(hideLoadingMore)}
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
            /> : null
        let bottomButton = showBottomButton ?
            <TouchableOpacity style={[styles.bottomButton, { backgroundColor: theme.themeColor }]}
                onPress={() => this.saveKey()}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={styles.title}>朕收下了</Text>
                </View>
            </TouchableOpacity> : null
        let indicatorView = isLoading ?
            <ActivityIndicator style={styles.centering} size={'large'} animating={isLoading} /> : null
        let resultView = <View style={{ flex: 1 }}>
            {indicatorView}
            {listView}
        </View>
        return (
            <SafeAreaViewPlus style={GlobalStyles.root_container} topColor={theme.themeColor}>
                {statusBar}
                {this.renderNavBar()}
                {resultView}
                {bottomButton}
                <Toast ref={toast => this.toast = toast} />
            </SafeAreaViewPlus>
        )
    }
}

const mapStateToProps = state => ({
    search: state.search,
    keys: state.language.keys
})

const mapDispatchToProps = dispatch => ({
    onSearch: (inputKey, pageSize, token, favoriteDao, popularKey, callback) => dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKey, callback)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callback)),
    onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
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
    },
    statusBar: {
        height: 20
    },
    bottomButton: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: .9,
        height: 40,
        left: 10,
        right: 10,
        top: GlobalStyles.window_height - 45,
        borderRadius: 3,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500'
    },
    centering: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 26 : 36,
        borderWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: '#fff',
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 10,
        paddingLeft: 5,
        borderRadius: 3,
        opacity: .7,
        color: '#fff'
    }
});
