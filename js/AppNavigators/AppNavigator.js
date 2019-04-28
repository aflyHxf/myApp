import { connect } from 'react-redux'
import { createReactNavigationReduxMiddleware, createReduxContainer } from 'react-navigation-redux-helpers'
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation'
import HomePage from '../pages/HomePage';
import WelcomePage from '../pages/WelcomePage';
import DetailPage from '../pages/DetailPage';
import FecthDemoPage from '../pages/FecthDemoPage';

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
            // header: null
        }
    },
    FecthPage: {
        screen: FecthDemoPage,
        navigationOptions: {
            // header: null
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