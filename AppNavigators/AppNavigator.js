import React from 'react'
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import HomePage from '../pages/HomePage';
import Page1 from '../pages/Page1';
import Page2 from '../pages/Page2';
import Page3 from '../pages/Page3';
import Page4 from '../pages/Page4';
import Page5 from '../pages/Page5';

const TabNavigator = createBottomTabNavigator({
    page1: {
        screen: Page1
    },
    page2: {
        screen: Page2
    },
    page3: {
        screen: Page3
    }
})

export default AppNavigators = createAppContainer(createStackNavigator({
    Tab: {
        screen: TabNavigator
    },
    Home: {
        screen: HomePage
    }
}))


