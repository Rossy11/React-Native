/**
 * Created by fy on 2018/5/18.
 */
import React from 'react'
import { Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import LYIncomeView from './LYIncomeView'
import { MerchantDailyIncome } from './MerchantDailyIncome'
import { BoxDailyIncome } from './BoxDailyIncome'
import { ConsumerRecord } from './ConsumerRecord'
import { IncomeCalendar } from './IncomeCalendar'
import { Util } from '../../common/utils'

export default LYIncomeStack = StackNavigator(
    {
        Income: {
            screen: LYIncomeView,
            title: 'Income',
        },
        MerchantDailyIncome: {
            screen: MerchantDailyIncome,
            title: '入账明细',
        },
        BoxDailyIncome: {
            screen: BoxDailyIncome,
        },
        ConsumerRecord: {
            screen: ConsumerRecord,
        },
        IncomeCalendar: {
            screen: IncomeCalendar,
        }
    },
    {
        navigationOptions: {
            headerStyle: {
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            tabBarVisible: false,
            headerBackground: <Image style={{width: Util.size.width, height: Util.iPhoneSize.topHeight+Util.iPhoneSize.bangHigher}} contentMode="stretch" source={{uri:'nav_header_background'}}/>,
        }
    }
);
