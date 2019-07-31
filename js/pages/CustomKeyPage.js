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
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import LanguageDao, { FLAG_LANGUAGE } from '../expand/Dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import ViewUtil from '../util/ViewUtil';
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'
const THEME_COLOR = '#678'

class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
        this.changeValues = [];
        this.isRemoveKey = !!this.params.isRemoveKey
        this.languageDao = new LanguageDao(this.params.flag)
        this.state = {
            keys: []
        }
    }

    componentDidMount() {
        // 如果props中的标签为空则从本地存储中读取
        if (!CustomKeyPage._keys(this.props).langth) {
            const { onLoadLanguage } = this.props
            onLoadLanguage(this.params.flag)
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props)
        })
        this.backPress.componentDidMount()
    }

    componentWillUnmount() {
        this.backPress.componentWillUnMount()
    }

    onBackPress() {
        NavigationUtil.goBack(this.props.navigation)
        return true
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState)
            }
        }
        return false
    }

    /**
     * 获取标签
     * @param {*} props 
     * @param {*} original 移除标签时使用 是否从props获取原始的标签
     * @param {*} state 移除标签时使用
     */
    static _keys(props, original, state) {
        const { flag, isRemoveKey } = props.navigation.state.params
        let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
        if (isRemoveKey && !original) {

        } else {
            return props.language[key]
        }
    }



    static getRightButtonText(text, callback) {
        return <TouchableOpacity
            style={{ alignItems: 'center' }} onPress={callback}>
            <Text style={{ fontSize: 20, color: '#fff', marginRight: 10 }}>{text}</Text>
        </TouchableOpacity>
    }
    onSave() { }

    onClick(data, index) {
      data.checked = !data.checked
    }
    _checkedImage(checked) {
        const { } = this.params
        return <Ionicons
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20} style={{ color: THEME_COLOR }} />
    }
    renderCheckBox(data, index) {
        return <CheckBox
            style={{ flex: 1, padding: 10 }}
            onClick={() => this.onClick(data, index)}
            isChecked={data.checked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
    }
    renderView() {
        let dataArray = this.state.keys
        if (!dataArray || dataArray.length === 0) return null
        let len = dataArray.length
        let views = []
        for (let i = 0, l = len; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}
                    </View>
                    <View style={styles.line} />
                </View>
            )
        }
        return views
    }
    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签'
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title
        const rightButtonText = this.isRemoveKey ? '移除' : '保存'
        const navigationBar =
            <NavigationBar
                title={title}
                style={{ backgroundColor: THEME_COLOR }}
                rightButton={CustomKeyPage.getRightButtonText(rightButtonText, () => this.onSave())}
                leftButton={ViewUtil.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
            />;
        return <View style={styles.container}>
            {navigationBar}
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>
    }
}

const mapPopularStateToProps = state => ({
    language: state.language
});
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    item: {
        flexDirection: 'row'
    },
    line: {
        height: 0.3,
        flex: 1,
        backgroundColor: 'darkgray'
    }
});
