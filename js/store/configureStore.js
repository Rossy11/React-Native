/**
 * Created by fy on 2018/5/16.
 */
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducer'

const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(
            applyMiddleware(
                thunkMiddleware,
                loggerMiddleware
            )
        )

    )
}