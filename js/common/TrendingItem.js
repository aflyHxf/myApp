import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'
import BaseItem from './BaseItem'
import HTMLView from 'react-native-htmlview';

export default class TrendingItem extends BaseItem {
    render() {
        const { projectModel } = this.props
        const { item } = projectModel
        const htmlContent = `<p>${item.description}</p>`
        return (
            <TouchableOpacity onPress={this.props.onSelect}>
                <View style={styles.container}>
                    <Text style={styles.title}>{item.fullName}</Text>
                    <Text style={styles.description}>{item.meta}</Text>
                    <HTMLView
                        value={htmlContent}
                        onLinkPress={url => { }}
                        stylesheet={{
                            p: styles.description,
                            a: styles.description
                        }}
                    />
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text style={{ marginRight: 5 }}>Built By:</Text>
                            {item.contributors.map((result, i, arr) => {
                                return <Image key={i} style={{ width: 22, height: 22, margin: 2 }}
                                    source={{ uri: arr[i] }} />
                            })}
                        </View>
                        <View style={styles.star}>
                            <Text>Star:</Text>
                            <Text>{item.starCount}</Text>
                        </View>
                        {this._favoriteIcon()}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#ddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray', // shadow只对IOS有效
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: .4,
        shadowRadius: 2,
        elevation: 2 // 设置Android的阴影
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    star: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    row: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
    }
})