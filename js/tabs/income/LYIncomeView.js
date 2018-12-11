/**
 * Created by fy on 2018/3/14.
 */
import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, StatusBar, StyleSheet, Image, ImageBackground, ScrollView, RefreshControl,DeviceEventEmitter } from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Echarts from 'native-echarts';

import { Util } from '../../common/utils';
import { MerchantDailyIncome } from './MerchantDailyIncome';
import { BoxDailyIncome, BoxIncomeCell } from './BoxDailyIncome';
import { MachineDayIncome, StoreDayIncome, MerchantDayIncome } from '../../model/income'
import { jsonToMerchantDaysIncome } from '../../logic/income'
import { LYFetchRequest } from '../../network/LYHttpHelper'
import { API_STORE_REPORT } from '../../network/LY_API'
import { recordGoBackKey } from '../../action/login'

const ScreenHeight = Util.size.height;
const INCOME_BOX_HEIGHT = 320/667*ScreenHeight,
    TITLE_MARGIN_TOP = 33/667*ScreenHeight,
    TODAY_INCOME_MARGIN_TOP = 32/667*ScreenHeight,
    INCOME_AMOUNT_MARGIN_TOP = 37/667*ScreenHeight,
    INCOME_DETAIL_BTN_MARGIN_TOP = 23/667*ScreenHeight;

class LYIncomeView extends Component {

    static navigationOptions =({navigation, navigationOptions}) => {
        return {
            header: null,
            tabBarVisible: true,
            tabBarOnPress: (e) => {
                if (e.scene.focused) {
                    navigation.state.params.tabItemReclicked()
                }
                e.jumpToIndex(e.scene.index)
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            merchantDaysIncome:[],
            todayIncome:null,
            isRefreshing: false
        }
        this.merchantInfo = props.loginInfo.entity
    }

    componentDidMount() {
        Util.mid=this.merchantInfo.merchantid;
        this.fetchIncome();
        this._navListener = this.props.navigation.addListener('didFocus', ()=>{
            StatusBar.setBarStyle('light-content')
        })
        this.props.navigation.setParams({
            tabItemReclicked: this.fetchIncome.bind(this)
        })
    }

    // componentWillUnmount() {
    //     console.log('LYIncomeView---WillUnmount')
    // }

    fetchIncome = () => {

        let endDate = new Date()
        let endNumber = Number(endDate)
        let startNumber = endNumber - 30*24*60*60*1000
        let startDate = new Date(startNumber)
        let endDateStr = `${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`
        let startDateStr = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`
        let paramsObj = {
            merchantid: this.merchantInfo.merchantid,
            datetime_0: startDateStr,
            datatime_1: endDateStr,
        }
        console.log(paramsObj)
        this.setState({
            isRefreshing: true
        })

        LYFetchRequest(API_STORE_REPORT, paramsObj, "GET", null).then(json => {
            console.log("数据1：",json)
            let result = json.result;
            let incomeArr = jsonToMerchantDaysIncome(result)
            console.log("incomeArr:",incomeArr)
            this.setState({
                merchantDaysIncome: incomeArr,
                todayIncome: incomeArr[incomeArr.length-1],
                isRefreshing: false
            })
        }).catch(err => {
            console.log(err.message)
            this.setState({
                isRefreshing: false
            })
        })

    }

    componentWillUnmount(){
        this._navListener.remove()
    }

    _goMerchantDailyIncome(){
        this.props.navigation.navigate('MerchantDailyIncome', {
            daysIncome: this.state.merchantDaysIncome
        })
    }

    render() {
        return(
        <View style={{flex:1}}>
            <ScrollView
                refreshControl={this._refreshControl.bind(this)()}
                bounces={true}
                automaticallyAdjustContentInsets={false}>
                {/*<ScrollView automaticallyAdjustContentInsets={false}>*/}
                {this._renderToadyIncome()}
                {this._renderEcharts()}
                {/*</ScrollView>*/}
            </ScrollView>
        </View>

        )
    }

    _refreshControl() {
        return(
            <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.fetchIncome.bind(this)}
                tintColor={Util.lybBlue}
                title="Loading..."
                titleColor={Util.lybBlue}
            />
        )
    }

    _renderToadyIncome(){
        return(
            <ImageBackground source={{uri:'背景'}} style = {styles.todayIncomeContainer}>
                <Text style={styles.topTitle}>营收一览</Text>
                <Text style={styles.todayIncomeTitle}>{this.state.todayIncome?this.state.todayIncome.date:''} 收益（元）</Text>
                <Text style={styles.todayIncomeAmount}>{this.state.todayIncome?this.state.todayIncome.all_income :'0'}</Text>
                <TouchableOpacity onPress={this._goMerchantDailyIncome.bind(this)} style={styles.incomeDetailBtn}>
                    <Text style={styles.incomeDetailText}>入账明细</Text>
                    <Image source={{uri:'右箭头白'}} style={{width:9, height:15}}/>
                </TouchableOpacity>
            </ImageBackground>
        )
    }

    _renderEcharts(){

        const merchantDaysIncome = this.state.merchantDaysIncome

        let days = merchantDaysIncome.map((ele) => {
            let fullYearString = ele.date
            let dateArr = fullYearString.split('-')
            let day = dateArr.pop()
            return day
        })
        //console.log(days)

        let incomes = merchantDaysIncome.map((ele) => {
            return ele.all_income
        })

        const option = {
            title: {
                text: '近期收益'
            },
            tooltip: {},
            legend: {
                data:['收入（元）']
            },
            xAxis: {
                data: days
            },
            yAxis: {},
            series: [{
                name: '收入（元）',
                type: 'line',
                data: incomes,
                itemStyle : {
                    normal : {
                        color:Util.lybBlue,  //圈圈的颜色
                        lineStyle:{
                            color:Util.lybBlue  //线的颜色
                        }
                    }
                },
            }],
        };
        return (
            <Echarts option={option} height={300} />
        );
    }
}

function mapStateToProps(state) {
    let loginInfo = state.loginInfo
    return { loginInfo }
}

function mapDispatchToProps(dispatch) {
    return {
        recordGoBackKey: bindActionCreators(recordGoBackKey, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LYIncomeView)

const styles = StyleSheet.create({
    todayIncomeContainer: {
        height: INCOME_BOX_HEIGHT,
        alignItems:'center',
        // resizeMode:'stretch'
    },
    topTitle: {
        marginTop: TITLE_MARGIN_TOP,
        color:'#fff',
        fontSize:18,
        fontWeight:'bold',
        backgroundColor:'rgba(0,0,0,0)'
    },
    todayIncomeTitle: {
        marginTop: TODAY_INCOME_MARGIN_TOP,
        color:'#fff',
        fontSize:16,
        backgroundColor: 'rgba(0,0,0,0)'

    },
    todayIncomeAmount: {
        marginTop: INCOME_AMOUNT_MARGIN_TOP,
        color:'#fff',
        fontSize:72,
        fontWeight:'bold',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    incomeDetailBtn: {
        marginTop: 40,
        width: 120,
        height: 30,
        borderRadius: 15,
        borderWidth:1,
        borderColor: '#fff',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around'
    },
    incomeDetailText: {
        fontSize: 14,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    incomeGraphContainer: {

    }
})