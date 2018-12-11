/**
 * Created by fy on 2018/5/21.
 */
import React, { Component } from 'react'
import { Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import LoginView from './LoginView'
import { Tab, TabView } from '../tabs/LYBoxTabsView'
import Tabs from '../tabs/LYTabs'
import VerificationCodeView from './VerificationCodeView'
import ResetPasswordView from './ResetPasswordView'
import { Util } from '../common/utils'
import LYMeStack from '../tabs/me/LYMeStatic'

export const LoginStack = StackNavigator(
    {
        Login:{
            screen: LoginView,
            path: 'login'
        },
        // The component for route must be a react component
        // Tab: {
        //     screen: Tab,
        // },
        // LYMeStack:{
        //     screen: LYMeStack
        // },
        Tabs: {
            screen: Tabs
        },
        // TabView: {
        //     screen: TabView
        // },
        Verification: {
            screen: VerificationCodeView
        },
        ResetPassword: {
            screen: ResetPasswordView
        }
    },
    {
        navigationOptions: {
            headerStyle: {},
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            tabBarVisible: false,
            headerBackground: <Image style={{width: Util.size.width, height: Util.iPhoneSize.topHeight+Util.iPhoneSize.bangHigher}} resizeMode="stretch" source={{uri:'nav_header_background'}}></Image>
        }
    }
)

export class Login extends React.Component {
    static navigationOptions = {
        header: null
    }
    render() {
        return (
            <LoginStack/>
        )
    }
}