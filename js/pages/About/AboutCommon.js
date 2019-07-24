import React from 'react'
import { Platform } from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobalStyles from '../../res/style/GlobalStyles';

/**
 * 设置常量
 */
const THEME_COLOR = '#678'
const AVATAR_SIZE = 90
const PARALLAX_HEADER_HEIGHT = 270
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios' ? GlobalStyles.nav_bar_height_ios + 20 : nav_bar_height_android)
export default class AboutCommon {
    constructor(props, updateState) {
        super(props)
        this.props = props
        this.updateState = updateState
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
    }

    componentDidMount() {
        this.backPress.componentDidMount()
    }

    componentWillUnmount() {
        this.backPress.componentWillUnMount()
        fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json').then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error('network Error')
        }).then(data => {
            if (data) {
                this.updateState({ data })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    onBackPress() {
        NavigationUtil.goBack(this.props.navigation)
        return true
    }

    render(contentView, params) {
        return (
            <ParallaxScrollView
                backgroundColor={THEME_COLOR}
                contentBackgroundColor={GlobalStyles.backgroundColor}
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                backgroundScrollSpeed={10}
                renderForeground={() => (
                    <View style={{ height: 300, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Hello World!</Text>
                    </View>
                )}>
                <View style={{ height: 500 }}>
                    <Text>Scroll me</Text>
                </View>
            </ParallaxScrollView>
        )
    }
}