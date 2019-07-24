import React from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {
    /**
     * 获取设置页的Item
     * @param {*} callback 单击Item的回调
     * @param {*} text 显示的文本
     * @param {*} color 显示的颜色
     * @param {*} Icons 左侧react-native-vector-icons 图标
     * @param {*} icon 图标的名字name
     * @param {*} expandableIco 右侧的图标
     * @return {XML}
     */
    static getSettingItem(callback, text, color, Icons, icon, expandableIco) {
        return <TouchableOpacity onPress={callback} style={styles.setting_item_container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {Icons && icon ?
                    <Icons name={icon} size={16} style={{ color, marginRight: 10 }} />
                    : <View style={{ width: 16, height: 16, marginRight: 10, opacity: 1 }} />}
                <Text>{text}</Text>
            </View>
            <Ionicons name={expandableIco ? expandableIco : 'ios-arrow-forward'}
                size={16} style={{ marginRight: 10, alignSelf: 'center', color: color || '#000' }} />
        </TouchableOpacity>
    }

    /**
     * 获取设置页的Item
     * @param {*} callback 单击Item的回调
     * @param {*} menu @MORE_MENU
     * @param {*} color 图标着色
     * @param {*} expandableIco 右侧图标
     */
    static getMenuItem(callback, menu, color, expandableIco) {
        return ViewUtil.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIco)
    }

    /**
     * 获取左侧返回按钮
     * @param {*} callback
     * @return {XML}
     */
    static getLeftBackButton(callback) {
        return <TouchableOpacity
            style={{ padding: 8, paddingLeft: 12 }}
            onPress={callback}>
            <Ionicons name={'ios-arrow-back'} size={26} style={{ color: '#fff' }} />
        </TouchableOpacity>
    }

    /**
     * 详情页右侧分享按钮
     * @param {*} callback
     * @return {XML}
     */
    static getShareButton(callback) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callback}>
            <Ionicons name={'md-share'} size={20} style={{ color: '#fff', marginRight: 10, opacity: 0.9 }} />
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: '#fff',
        padding: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
})