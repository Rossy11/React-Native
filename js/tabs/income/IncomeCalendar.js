/**
 * Created by fy on 2018/3/16.
 */
import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native'

import CalendarList from './subpage/CalendarList'

export class IncomeCalendar extends Component {

    static navigationOptions = ()=>{
        return{
            title:'日期选择'
        }
    };

    componentDidMount() {
        // 监听日历点击事件
        this.subscription = DeviceEventEmitter.addListener('navMerchantDailyIncome', this.calendarDayClicked.bind(this))
    }

    componentWillUnmount() {
        this.subscription.remove()
    }

    // 日历📅 day 点击事件
    calendarDayClicked(params){
        this.props.navigation.navigate('MerchantDailyIncome', {
            daysIncome: params.daysIncome,
            dayIndex: params.dayIndex
        })
    }

    render(){
        return(
            <CalendarList/>
        )
    }
}