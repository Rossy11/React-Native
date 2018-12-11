/**
 * Created by fy on 2018/4/18.
 */
import React from 'react'
import { View, Text, TouchableOpacity,DeviceEventEmitter } from 'react-native'
import PropTypes from 'prop-types'
import MonthIncomeCalendar from '../../../components/income/MonthIncomeCalendar'
import MonthItem from '../../../components/income/MonthItem'
import { MachineDayIncome } from '../../../model/income'
import { Util } from '../../../common/utils'
import { jsonToMerchantDaysIncome } from '../../../logic/income'



export default class CalendarItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            calendarDate:{},
            daysIncome: []
        }
    }

    static propTypes = {
        showCalendar: PropTypes.bool,
        month: PropTypes.string,
        year: PropTypes.string,
        monthIncome: PropTypes.number,
        folderHandle: PropTypes.func
    }


    componentDidMount() {
        this.getCalendarDate()
    }

    shouldComponentUpdate() {
        return true
    }

    render() {
        let {year, month} = this.props
        if (month.length === 1) {
            month = `0${month}`
        }
        const current = year + '-' + month
        return(
            <View>
                <MonthItem
                    year={this.props.year}
                    month={this.props.month}
                    income={this.props.monthIncome}
                    arrowClickHandle={this.props.folderHandle}
                    isOpen={this.props.showCalendar}/>
                {
                    this.props.showCalendar ? <MonthIncomeCalendar incomeArr={this.state.daysIncome} incomeDic={this.state.calendarDate} current={current}/> : null
                }
            </View>
        )
    }

    getCalendarDate = async () => {
        console.log(this.state.merchantid)
        let time0 = this.props.year + '-' + this.props.month + '-01'
        let time1 = this.props.year + '-' + this.props.month + '-31'
        console.log(time0, time1)
        let url = `xxxxxxxxx/storereport/?merchantid=${Util.mid}&datetime_0=${time0}&datatime_1=${time1}`
        let response = await fetch(url)
        let json = await response.json()
        let result = json.result
        console.log(url)
        console.log('result',json)
        let yearObj = result[this.props.year]
        let monthObj = yearObj[this.props.month]["days"]
        let daysIncome = jsonToMerchantDaysIncome(result)
        this.setState({
            calendarDate:monthObj,
            daysIncome: daysIncome
        })

    }


}

