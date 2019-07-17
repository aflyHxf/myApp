import React from 'react'
import { BackHandler } from 'react-native'

/**
 * Android 物理返回键的处理
 */
export default class BackPressComponent {
    constructor(props) {
        this.props = props
        this._hardwareBackPress = this.onHardwareBackPress.bind(this)
    }

    componentDidMount() {
        if (this.props.backPress) BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress)
    }

    componentWillUnMount() {
        if (this.props.backPress) BackHandler.removeEventListener('hardwareBackPress', this._hardwareBackPress)
    }

    onHardwareBackPress(e) {
        return this.props.backPress(e)
    }
}