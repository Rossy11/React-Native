/**
 * Created by fy on 2018/5/9.
 */
import React from 'react'
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { PriceSetupTableView } from './ShopPriceSetupView'
import LYIndicator from '../../components/LYIndicatorView'

import { PriceSetupTableType } from '../../common/static'

import { LYFetchRequest } from '../../network/LYHttpHelper'
import { API_CENTER_MANAGER } from '../../network/LY_API'
import { Util } from '../../common/utils'

export class CreateSpecialPriceView extends React.Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return{
            title:'创建特价时间'
        }
    }

    constructor(props) {
        super(props)
        let priceObj = {
            status: 1,
                start_time: '09:00',
                end_time: '21:00',
                trade: [
                {status:1, price:15, tradeid:1, tradename:'包时15分钟'},
                {status:1, price:30, tradeid:2, tradename:'包时30分钟'},
                {status:1, price:60, tradeid:3, tradename:'包时60分钟'},
                    {status:1, price:90, tradeid:4, tradename:'包时90分钟'}
            ]
        }

        this.state = {
            priceObj: priceObj,
            isShowIndicator: false,
            indicatorMsg: ''
        }

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }


    render() {
        let priceObj = this.state.priceObj
        const {params} = this.props.navigation.state
        let isHoliday = params.isHoliday
        return(
            <View style={{flex:1}}>
                <PriceSetupTableView
                    switchValue={priceObj.status === 1}
                    isHoliday={isHoliday}
                    timeCallback={this.timeCallback.bind(this)}
                    priceCellCallback={this.priceItemCallback.bind(this)}
                    switchCallback={this.switchCallback.bind(this)}
                    priceSetupTitle="创建特价时间"
                    dataSource={priceObj.trade}
                    startTime={priceObj.start_time}
                    endTime={priceObj.end_time}
                    priceSetupTableType={PriceSetupTableType.specialCreate}/>
                <View>
                    {/*<Button title="确定创建" onPress={this.createSpecialTrade.bind(this)}/>*/}
                    <TouchableOpacity onPress={this.createSpecialTrade.bind(this)} activeOpacity={0.55} style={{marginLeft:40, marginTop:40, height:40, width:Util.size.width-80, justifyContent:'center', borderRadius:20, alignItems:'center',backgroundColor:Util.lybBlue}}>
                        <Text style={{fontSize:16, color:'#fff'}}>确定创建</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.isShowIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null
                }
            </View>
        )
    }


    // 向服务器发送创建特殊收费的请求，成功后向上个页面发送回调，展示增加新创建的特价时间后的数据
    createSpecialTrade() {
        let { params } = this.props.navigation.state
        let priceSetupObj = params.priceSetupObj, isHoliday = params.isHoliday, storeid = params.storeid, priceObj = this.state.priceObj

        if(priceSetupObj == null) {
            return;
        }

        if (isHoliday) {
            priceSetupObj.weekend.special.push(priceObj)
        } else {
            priceSetupObj.weekday.special.push(priceObj)
        }

        let editedPriceJson = JSON.stringify(priceSetupObj)
        let paramsObj = {
            cmd:'update_tradepackage',
            storeid: storeid,
            packages: editedPriceJson
        }

        LYFetchRequest(API_CENTER_MANAGER,paramsObj, "GET", null).then(json => {
            this.createSucceed()
        }).catch(err => {
            console.warn(err)
        })
    }

    createSucceed() {
        this.setState({
            isShowIndicator: true,
            indicatorMsg: '创建特价时间成功'
        })
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
            this.setState({
                isShowIndicator: false
            })
            this.props.navigation.state.params.createSpecialCallback()
            this.props.navigation.pop()
        },1000)
    }


    timeCallback(isHoliday, tableIndex, startTime, endTime) {
        let priceObj = this.state.priceObj
        priceObj.start_time = startTime
        priceObj.end_time = endTime
        this.setState({
            priceObj: priceObj
        })
    }

    switchCallback(isHoliday, tableIndex, switchValue) {
        let priceObj = this.state.priceObj
        priceObj.status = (switchValue ? 1 : 0)
        this.setState({
            priceObj: priceObj
        })
    }

    priceItemCallback(newPrice, isHoliday, normalOrSpecial, tableIndex, itemIndex) {
        let priceObj = this.state.priceObj
        priceObj.trade[itemIndex].price = newPrice
        this.setState({
            priceObj: priceObj
        })
    }

}