/**
 * Created by fy on 2018/3/15.
 */

import { StackNavigator } from 'react-navigation';
import { Tab } from './LYBoxTabsView';
import LoginView from '../login/LoginView';
import { LoginStack } from '../login/LoginStack'
import { Image } from 'react-native';
import React, { Component } from 'react';

export const AppNavigator = StackNavigator(

    {
        Login: { screen: LoginStack },
        Tab: { screen: Tab }
    },{
        //initialRouteName: 'Login',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false,
        }
    }
);