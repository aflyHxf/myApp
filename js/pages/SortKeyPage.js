/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux'
import actions from '../action'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from '../AppNavigators/NavigationUtil';
import LanguageDao, { FLAG_LANGUAGE } from '../expand/Dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import ViewUtil from '../util/ViewUtil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ArrayUtil from '../util/ArrayUtil';
import SortableListView from 'react-native-sortable-listview'

const THEME_COLOR = '#678'

class RowComponent extends React.Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                style={this.props.data.checked ? styles.item : styles.hidden}
                {...this.props.sortHandlers}>
                <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                    <MaterialCommunityIcons name={'sort'} size={16} style={{ marginRight: 10, color: THEME_COLOR }} />
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

class SortKeyPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) });
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            checkedArray: SortKeyPage._keys(this.props)
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedArray = SortKeyPage._keys(nextProps, prevState);
        if (prevState.checkedArray !== checkedArray) {
            return {
                checkedArray: checkedArray,
            };
        }
        return null;
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        //如果props中标签为空则从本地存储中获取标签
        if (SortKeyPage._keys(this.props).length === 0) {
            let { onLoadLanguage } = this.props;
            onLoadLanguage(this.params.flag);
        }
    }

    componentWillUnmount() {
        this.backPress.componentWillUnMount();
    }

    onBackPress() {
        NavigationUtil.goBack(this.props.navigation)
        return true
    }

    /**
     * 获取标签
     * @param {*} props 
     * @param {*} state 移除标签时使用
     */

    static _keys(props, state) {
        // 如果state 中有 checkedArray 则使用state中的 checkedArray
        if (state && state.checkedArray && state.checkedArray.length) {
            return state.checkedArray
        }
        // 从原始数据中获取checkedArray 
        const flag = SortKeyPage._flag(props)
        let dataArray = props.language[flag] || []
        let keys = []
        for (let i = 0, len = dataArray.length; i < len; i++) {
            const item = dataArray[i]
            if (item.checked) keys.push(item)
        }
        return keys
    }

    static _flag(props) {
        const { flag } = props.navigation.state.params
        return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
    }

    static getRightButtonText(text, callback) {
        return <TouchableOpacity
            style={{ alignItems: 'center' }} onPress={callback}>
            <Text style={{ fontSize: 20, color: '#fff', marginRight: 10 }}>{text}</Text>
        </TouchableOpacity>
    }

    //保存变更
    onSave(hasChecked) {
        if (!hasChecked) {
            // 如果没有排序则直接返回 -> 原始数据和state的数据进行比较，完全相等
            if (ArrayUtil.isEqual(SortKeyPage._keys(this.props, this.state.checkedArray))) {
                NavigationUtil.goBack(this.props.navigation)
                return false
            }
        }
        // TODO: 保存排序后的数据
        //更新本地数据
        this.languageDao.save(this.getSortResult());
        const { onLoadLanguage } = this.props;
        //更新store
        onLoadLanguage(this.params.flag);
        NavigationUtil.goBack(this.props.navigation);
    }

    /**
     * 获取排序后的标签结果
     */
    getSortResult() {
        const flag = SortKeyPage._flag(this.props);
        //从原始数据中复制一份数据出来，以便对这份数据进行进行排序
        let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
        //获取排序之前的排列顺序
        const originalCheckedArray = SortKeyPage._keys(this.props);
        //遍历排序之前的数据，用排序后的数据checkedArray进行替换
        for (let i = 0, j = originalCheckedArray.length; i < j; i++) {
            let item = originalCheckedArray[i];
            //找到要替换的元素所在位置
            let index = this.props.language[flag].indexOf(item);
            //进行替换
            sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
        return sortResultArray;
    }

    onBack() {
        if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props, this.state.checkedArray))) {
            Alert.alert('提示', '要保存修改吗？', [
                {
                    text: '否',
                    onPress: () => {
                        NavigationUtil.goBack(this.props.navigation)
                    }
                },
                {
                    text: '是',
                    onPress: () => this.onSave(true)
                }
            ])
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }

    render() {
        const title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序'
        const order = this.state.checkedArray
        const navigationBar =
            <NavigationBar
                title={title}
                style={{ backgroundColor: THEME_COLOR }}
                rightButton={SortKeyPage.getRightButtonText('保存', () => this.onSave())}
                leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            />;

        return <View style={styles.container}>
            {navigationBar}
            <SortableListView
                style={{ flex: 1 }}
                data={order}
                order={Object.keys(order)}
                  onRowMoved={e => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                    this.forceUpdate()
                }}
                renderRow={row => <RowComponent data={row} {...this.params} />}
            />
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
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    line: {
        height: 0.3,
        flex: 1,
        backgroundColor: 'darkgray'
    },
    item: {
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    },
    hidden: {
        height: 0
    }
});
