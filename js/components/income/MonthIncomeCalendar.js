/**
 * Created by fy on 2018/4/18.
 */
import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter} from 'react-native'
import PropTypes from 'prop-types'
import {CalendarList, Calendar, Agenda, LocaleConfig} from 'react-native-calendars';


LocaleConfig.locales['fr'] = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六']
};

LocaleConfig.defaultLocale = 'fr';

export default class MonthIncomeCalendar extends React.Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        current: PropTypes.string,
        incomeDic: PropTypes.object,
        incomeArr: PropTypes.array
    }

    render() {
        return (
            <View style={{overflow: 'hidden'}}>
                <Calendar
                    style={{marginTop:-40}}
                    hideArrows={false}
                    firstDay={7}
                    dayComponent={this._renderDayComponent}
                    hideextradays={false}
                    current={this.props.current}/>
            </View>
        )
    }

    _renderDayComponent = ({date, state}) => {
        let all_income = ''
        let eleIndex = 0
        //console.log(state)
        if (state != 'disabled') {
            this.props.incomeArr.forEach((ele, index) => {
                let incomeDate = ele.date
                let incomeDay = incomeDate.split('-').pop()
                let incomeMonth = incomeDate.split('-')[1]
                let incomeYear = incomeDate.split('-')[0]
                let day = date.day
                let month = date.month
                let year = date.year
                //console.log(month)
                if (day == incomeDay && month == incomeMonth && year == incomeYear) {
                    eleIndex = index
                    all_income = ele.all_income
                }
            })
        }
        return (
            <TouchableOpacity onPress={all_income !== '' ? () => this.dayPressed(eleIndex) : null} style={{flex: 1}}>
                <Text style={{
                    textAlign: 'center',
                    color: state === 'disabled' ? '#ddd' : '#333',
                    fontSize: 16
                }}>{date.day}</Text>
                <Text style={{textAlign: 'center', color: '#999', fontSize: 11}}>{all_income}</Text>
            </TouchableOpacity>);
    }

    dayPressed(index) {
        console.log(this.props)
        console.log(index)
        DeviceEventEmitter.emit('navMerchantDailyIncome', {"daysIncome": this.props.incomeArr, "dayIndex": index})

    }


}