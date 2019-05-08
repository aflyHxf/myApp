import React, { Component } from 'react';
import { Provider } from 'react-redux'
import store from './store'
import AppNavigator from './AppNavigators/AppNavigator';

export default class App extends Component {
  render() {
    console.log(store)
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    )
  }
}
