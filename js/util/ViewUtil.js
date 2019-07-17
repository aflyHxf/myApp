import React from 'react'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {
    static getLeftBackButton(callback) {
        return <TouchableOpacity
            style={{ padding: 8, paddingLeft: 12 }}
            onPress={callback}>
            <Ionicons name={'ios-arrow-back'} size={26} style={{ color: '#fff' }} />
        </TouchableOpacity>
    }

    static getShareButton(callback) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callback}>
            <Ionicons name={'md-share'} size={20} style={{ color: '#fff', marginRight: 10, opacity: 0.9 }} />
        </TouchableOpacity>
    }
}