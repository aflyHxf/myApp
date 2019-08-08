import React from 'react'
import { Modal, StyleSheet, View, Text, ScrollView, Platform } from 'react-native'
import ThemeDao from '../expand/Dao/ThemeDao';
import GlobalStyles from '../res/style/GlobalStyles'
import ThemeFactory, { ThemeFlags } from '../res/style/ThemeFactory';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import actions from '../action'

class CustomTheme extends React.Component {
    constructor(props) {
        super(props)
        this.themeDao = new ThemeDao()
    }

    onSeleseTheme(themeKey) {
        this.props.onClose();
        this.themeDao().save(ThemeFlags[themeKey])
        const { onThemeChange } = this.props;
        onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]))
    }

    /**
     * 创建主题
     * @param {*} themeKey
     */
    getThemeItem(themeKey) {
        return <TouchableHighlight
            style={{ flex: 1 }}
            underlayColor={'#fff'}
            onPress={() => this.onSeleseTheme(themeKey)}>
            <View style={[{ backgroundColor: ThemeFlags[themeKey] }, styles.themeItem]}>
                <Text style={styles.themeText}>{themeKey}</Text>
            </View>
        </TouchableHighlight>
    }
    renderThemeItem() {
        const views = [];
        for (let i = 0, keys = Object.keys(ThemeFlags), len = keys.length; i < len; i += 3) {
            const key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2]
            views.push(
                <View key={i} style={{ flexDirection: 'row' }}>
                    {this.getThemeItem(key1)}
                    {this.getThemeItem(key2)}
                    {this.getThemeItem(key3)}
                </View>
            )
        }
        return views
    }
    renderContentView() {
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={this.props.onClose()}>
                <View style={styles.modalContainer}>
                    <ScrollView>
                        {this.renderThemeItem()}
                    </ScrollView>
                </View>
            </Modal>
        )
    }
    render() {
        return this.props.visible ? <View style={GlobalStyles.appContainer}>
            {this.renderContentView()}
        </View> : null
    }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
    onThemeChange: (theme) => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomTheme)

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 20 : 10,
        backgroundColor: '#fff',
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: .5,
        shadowRadius: 2,
        padding: 3
    },
    themeItem: {
        flex: 1,
        height: 120,
        margin: 3,
        padding: 3,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    themeText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 16
    }
})