/**
 * Created by fy on 2018/4/18.
 */
import React from 'react'
import { View, Text, FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CalendarItem from './CalendarItem'
import { Util } from '../../../common/utils'


class CalendarList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            monthsIncome: []
        }
    }

    componentDidMount() {
        this.getMonthsIncomeDate()
    }

    render() {

        return(
            <FlatList
                style={{marginTop:8}}
                data={this.state.monthsIncome}
                renderItem={(ele) => <CalendarItem folderHandle={() => this.folderHandle(ele.index)} year={ele.item.year} month={ele.item.month} monthIncome={ele.item.mouth_income}  showCalendar={ele.item.showCalendar}/>}
                keyExtractor={(item, index) => index.toString() }
                ItemSeparatorComponent={() => <View style={{height:6, backgroundColor:Util.detailBackgroundGray}}></View>}
            />
        )
    }

    getMonthsIncomeDate = async() => {
        let { merchantid } = this.props.loginInfo.entity
        let url = `xxxxxxxx/storereport/?merchantid=${merchantid}&mouth`
        let response = await fetch(url)
        let json = await response.json()
        let result = json.result
        let monthsIncome = []
        for(let year in result) {
            let yearObj = result[year]
            for(let month in yearObj) {
                let monthObj = yearObj[month]
                monthObj.year = year
                monthObj.month = month
                monthObj.showCalender = false
                monthsIncome.push(monthObj)
            }
        }
        this.setState({
            monthsIncome: monthsIncome
        })
    }

    folderHandle(index){
        let newIncomes = this.state.monthsIncome.map((ele, eleIndex) => {
            if(ele.showCalendar) {
                ele.showCalendar = false;
            }else {
                ele.showCalendar = (eleIndex === index) ? true : false
            }
            return ele
        })
        this.setState({
            monthsIncome: newIncomes
        })
    }

}

function mapStateToProps(state) {
    let loginInfo = state.loginInfo;
    return { loginInfo };
}

export default connect(
    mapStateToProps
)(CalendarList)