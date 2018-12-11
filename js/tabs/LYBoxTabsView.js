/**
 * Created by fy on 2018/3/14.
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator, Tabbar } from 'react-navigation';
import LYIncomeStack from './income/LYIncomeStack';
import LYMallStack from './mall/LYMallView';
import LYManagementStack from './management/LYManagementStack';
import LYMeStack from './me/LYMeStatic';

export const Tab =  TabNavigator(
    {
        Income: {
            screen: LYIncomeStack,
            navigationOptions:(params) => ({
                tabBarLabel: '营收',
                tabBarIcon: ({focused, tintColor}) => (
                    focused ? <Image source={{uri:'营收icon高亮'}} style={styles.tabItemImg}/> :
                        <Image source={{uri:'营收icon灰'}} style={styles.tabItemImg}/>
                ),
                // tabBarOnPress: ({e}) => (
                //     console.log(789, params, e)
                // )
            })
        },
        Management: {
            screen: LYManagementStack,
            navigationOptions:({navigation}) => ({
                tabBarLabel:'管理',
                tabBarIcon: ({focused, tintColor}) => (
                    focused ? <Image source={{uri:'管理icon高亮'}} style={styles.tabItemImg}/> :
                        <Image source={{uri:'管理icon灰'}} style={styles.tabItemImg}/>
                ),
            })
        },
        Mall: {
            screen: LYMallStack,
            navigationOptions: ({navigation}) => ({
                tabBarLabel:'商店',
                tabBarIcon: ({focused, tintColor}) => (
                    focused ? <Image source={{uri:'商店icon高亮'}} style={styles.tabItemImg}/> :
                        <Image source={{uri:'商店icon灰'}} style={styles.tabItemImg}/>
                )
            })
        },
        Me: {
            screen: LYMeStack,
            navigationOptions: ({navigation}) => ({
                tabBarLabel:'我的',
                tabBarIcon: ({focused, tintColor}) => (
                    focused ? <Image source={{uri:'我的icon高亮'}} style={styles.tabItemImg}/> :
                        <Image source={{uri:'我的icon灰'}} style={styles.tabItemImg}/>
                )
            })
        }
    },
    {
        navigationOptions: ({ navigation }) => ({
            headerBackground: <Image source={{uri:'nav_header_background'}}/>,
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: '#3aa4ff',
            inactiveTintColor: 'gray',
        },
        animationEnabled: false,
        swipeEnable: false,
    }
);

const styles = StyleSheet.create({
    tabItemImg: {
        width:24,
        height:24,
    }
})

export class TabView extends React.Component {
    // static navigationOptions = {
    //     header: null
    // }
    render(){
        return (
            <Tab/>
        )
    }
}
