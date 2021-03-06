import { connect } from 'react-redux'
import { createReactNavigationReduxMiddleware, createReduxContainer } from 'react-navigation-redux-helpers'
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation'
import HomePage from '../pages/HomePage';
import WelcomePage from '../pages/WelcomePage';
import DetailPage from '../pages/DetailPage';
import WebViewPage from '../pages/WebViewPage';
import CustomKeyPage from '../pages/CustomKeyPage';
import SortKeyPage from '../pages/SortKeyPage'
import AboutPage from '../pages/About/AboutPage';
import AboutMePage from '../pages/About/AboutMePage'
import SearchPage from '../pages/SearchPage'

export const rootCom = 'Init';//设置根路由

const InitNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
        navigationOptions: {
            header: null
        }
    }
})

const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null
        }
    },
    DetailPage: {
        screen: DetailPage,
        navigationOptions: {
            header: null
        }
    },
    WebViewPage: {
        screen: WebViewPage,
        navigationOptions: {
            header: null
        }
    },
    AboutPage: {
        screen: AboutPage,
        navigationOptions: {
            header: null
        }
    },
    AboutMePage: {
        screen: AboutMePage,
        navigationOptions: {
            header: null
        }
    },
    CustomKeyPage: {
        screen: CustomKeyPage,
        navigationOptions: {
            header: null
        }
    },
    SortKeyPage: {
        screen: SortKeyPage,
        navigationOptions: {
            header: null
        }
    },
    SearchPage: {
        screen: SearchPage,
        navigationOptions: {
            header: null
        }
    }
})

export const RootNavigator = createAppContainer(createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator
}))

export const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    'root'
)

const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

const mapStateToProps = (state) => ({
    state: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);

// export default AppNavigators = createAppContainer(SwitchNavigator)