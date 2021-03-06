import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './../reducer'
import { middleware } from './../AppNavigators/AppNavigator'

const logger = store => next => action => {
    if (typeof action === 'function') {
        console.log('dispatching a function')
    } else {
        console.log('dispatch ', action)
    }
    console.log('nextState ', store.getState())
    return next(action)
}

const middlewares = [middleware, thunk, logger]

/**
 * 创建store
 */

export default createStore(reducer, applyMiddleware(...middlewares))