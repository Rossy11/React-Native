/**
 * Created by fy on 2018/3/14.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux'
import codePush from 'react-native-code-push'
import configureStore from './js/store/configureStore'
import { AppNavigator } from './js/tabs/LYNavigation';
import { LoginStack, Login } from './js/login/LoginStack'

const store = configureStore()

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <LoginStack/>
            </Provider>
        )
    }
}

export default App = codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.ON_NEXT_RESUME})(App)