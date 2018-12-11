/**
 * Created by fy on 2018/5/17.
 */
import React from 'react'
import { Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import LYUserInfoView from './LYUserInfoView';
import LYSettingView from './LYSettingView';
import LYMeView from './LYMeView'
import ModifyInfoView from '../management/ModifyInfoView'
import ResetPasswordView from '../../login/ResetPasswordView'
import { LoginStack,Login } from '../../login/LoginStack'
import { Util } from '../../common/utils'

export default LYMeStack = StackNavigator(
    {
        // Me:{
        //     screen: LYMeView,
        // },
        UserInfo: {
            screen: LYUserInfoView,
        },
        Setting: {
            screen: LYSettingView,
        },
        Modify: {
            screen: ModifyInfoView,
        },
        ResetPassword: {
            screen: ResetPasswordView,
        },
        LoginStack: {
            screen: LoginStack,
        },
        Login:{
            screen:Login
        }
    },
    {
        navigationOptions:{
            headerBackground: <Image style={{width:Util.size.width, height: Util.iPhoneSize.topHeight+Util.iPhoneSize.bangHigher}} resizeMode='stretch' source={{uri:'nav_header_background'}}/>,
            headerTintColor:'#fff',
            tabBarVisible: false,
        }
    }
)