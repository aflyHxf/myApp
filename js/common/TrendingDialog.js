import React from 'react'
import { Modal, TouchableOpacity, StyleSheet, View, Text, DeviceInfo } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TimeSpan from '../model/TimeSpan'

export const TimeSpans = [new TimeSpan('今 天', '?since=daily'), new TimeSpan('本 周', '?since=weekly'), new TimeSpan('本 月', '?since=monthly')]

export default class TrendingDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    show() {
        this.setState({ visible: true })
    }

    dismiss() {
        this.setState({ visible: false })
    }
    render() {
        const { onClose, onSelect } = this.props;
        return <Modal
            transparent={true}
            visible={this.state.visible}
            onRequestClose={() => onClose}
        >
            <TouchableOpacity
                style={styles.container}
                onPress={() => this.dismiss()}>
                <MaterialIcons
                    name={'arrow-drop-up'}
                    size={36}
                    style={styles.arrow}
                />
                <View style={styles.content}>
                    {TimeSpans.map((time, i) => {
                        return <TouchableOpacity
                            key={i}
                            onPress={() => onSelect(time)}
                            underlayColor="transparent">
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>{time.showText}</Text>
                            </View>
                            {i !== TimeSpans.length - 1 ? <View style={styles.line} /> : null}
                        </TouchableOpacity>
                    })}
                </View>
            </TouchableOpacity>
        </Modal>
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,.6)',
        flex: 1,
        alignItems: 'center',
        paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
    },
    arrow: {
        marginTop: 40,
        color: '#fff',
        padding: 0,
        margin: -15
    },
    content: {
        borderRadius: 3,
        backgroundColor: '#fff',
        paddingVertical: 3,
        marginRight: 3
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: '#000',
        fontWeight: '400',
        paddingVertical: 8,
        paddingHorizontal: 26
    },
    line: {
        height: 1,
        marginHorizontal: 8,
        backgroundColor: 'darkgray'
    }
})