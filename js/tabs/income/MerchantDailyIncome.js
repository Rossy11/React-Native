/**
 * Created by fy on 2018/3/16.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types'
import { Util } from '../../common/utils';


const ScreenHeight = Util.size.height;
const INCOME_BOX_HEIGHT = 320/667*ScreenHeight,
    TITLE_BOX_MARGIN_TOP = 30/667*ScreenHeight,
    NEXT_DAY_BOX_MARGIN_TOP = 26/667*ScreenHeight,
    INCOME_TITLE_MARGIN_TOP = 33/667*ScreenHeight,
    INCOME_AMOUNT_BOX_MARGIN_TOP = 28/667*ScreenHeight;


export class MerchantDailyIncome extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        const { params } = navigation.state;
        return {
            header: null,
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            dayIndex: 0,
            daysIncome: [],
            todayIncome: {},
        }
    }

    componentDidMount(){
        const {params} =  this.props.navigation.state
        const daysIncome = params.daysIncome
        console.log('params',params)
        let dayIndex = params.dayIndex!=undefined ? params.dayIndex : daysIncome.length - 1

        this.setState({
            daysIncome: daysIncome,
            dayIndex: dayIndex,
            todayIncome: daysIncome[dayIndex]
        })
    }

    componentWillUnmount(){
    }


    _itemClicked = (item)=>{
        console.log(item);
        this.props.navigation.navigate('BoxDailyIncome', {
            machineIncome: item,
            date: this.state.todayIncome.date,
        })
    };

    goCalendar(){
        this.props.navigation.navigate('IncomeCalendar');
    }

    render(){

        return(
            <View style={{flex:1}}>
                {this._renderTopIncome()}
                {this._renderMachineIncomeList()}
            </View>
        )
    }

    _renderTopIncome(){
        return(
            <ImageBackground style={styles.topContainer} source={{uri:'背景'}}>
                {this._renderNav()}
                {this._renderNextDayBanner()}
                {this._renderIncomeAmount()}
            </ImageBackground>
        )
    }

    _renderNav(){
        return(
            <View style={styles.nav}>
                <TouchableOpacity style={styles.backBox} onPress={this._goback.bind(this)}>
                    <Image source={{uri:'左箭头'}} style={{width:9, height:15}}></Image>
                </TouchableOpacity>
                <Text style={styles.navTitle}>入账明细</Text>
            </View>
        )
    }

    _goback() {
        this.props.navigation.goBack();
    }

    _renderNextDayBanner(){

        const daysIncome = this.state.daysIncome
        let dayIndex = this.state.dayIndex


        let perDay = null
        let nextDay = null
        let today = null

        // 后一天
        if (dayIndex < daysIncome.length-1) {
            nextDay = daysIncome[dayIndex+1]
        }

        // 前一天
        if (dayIndex > 0) {
            perDay = daysIncome[dayIndex-1]
        }


        return(
            <View style={styles.banner}>
                {
                    perDay ?
                        <TouchableOpacity style={styles.lastDay} onPress={this.perDayPressed.bind(this)}>
                            <Image style={styles.lastDayArrow} source={{uri:'左箭头'}}></Image>
                            <View style={styles.lastDayTextBox}>
                                <Text style={{color:'#fff', fontSize:14, marginTop:10, backgroundColor:'rgba(0,0,0,0)'}}>前一天</Text>
                                <Text style={{color:'#fff', fontSize:12, marginTop:6, backgroundColor:'rgba(0,0,0,0)'}}>￥{perDay.all_income}</Text>
                            </View>
                        </TouchableOpacity>
                        : null
                }
                <TouchableOpacity style={styles.middleDay} onPress={this.goCalendar.bind(this)}>
                    <Image style={styles.middleDayImg} source={{uri:'日期icon'}}></Image>
                    <Text style={styles.middleDayTitle}>{this.state.todayIncome ? this.state.todayIncome.date : '--'}</Text>
                    <Image style={styles.middleDayArrow} source={{uri:'向下箭头蓝'}}></Image>
                </TouchableOpacity>
                {
                    nextDay ?
                        <TouchableOpacity style={styles.nextDay} onPress={this.nextDayPressed.bind(this)}>
                            <Image style={styles.nextDayArrow} source={{uri:'右箭头白'}}></Image>
                            <View style={styles.nextDayTextBox}>
                                <Text style={{color:'#fff', fontSize:14, marginTop:10, backgroundColor:'rgba(0,0,0,0)'}}>后一天</Text>
                                <Text style={{color:'#fff', fontSize:12, marginTop:6, backgroundColor:'rgba(0,0,0,0)'}}>￥{nextDay.all_income}</Text>
                            </View>
                        </TouchableOpacity>
                        : null
                }
            </View>
        )
    }

    _renderIncomeAmount(){
        return(
            <View style={styles.incomeAmountBox}>
                <Text style={styles.incomeTitle}>入账金额（元）</Text>
                <View style={styles.incomeDetailBox}>
                    <Text style={{fontSize:72, color:'#fff', backgroundColor:'rgba(0,0,0,0)'}}>{this.state.todayIncome?this.state.todayIncome.all_income:'--'}</Text>
                    {/*<Text style={{position:'absolute', bottom:15, right:-15, color:'#fff'}}>元</Text>*/}
                </View>
            </View>
        )
    }

    _renderMachineIncomeList(){
        return(
            <View style={{flex:3, backgroundColor:'#fff'}}>
                <FlatList
                    data= {this.state.todayIncome?this.state.todayIncome.machinesDayIncome:[]}
                    renderItem={({item}) => <BoxIncomeCell boxName={item.machine_name || '未命名'} dailyIncome={item.mid_income} itemClickHandler = {()=>this._itemClicked(item)}/>}
                    keyExtractor={(item, index) => {return index.toString()}}
                    ItemSeparatorComponent={()=><View style={{height:1, backgroundColor:Util.detailBackgroundGray, marginLeft:20, width:Util.size.width-40}}></View>}
                />
            </View>
        )
    }

    perDayPressed() {
        let newIndex = this.state.dayIndex-1
        let newIncome = this.state.daysIncome[newIndex]
        this.setState({
            dayIndex: newIndex,
            todayIncome: newIncome
        })
    }

    nextDayPressed() {
        let newIndex = this.state.dayIndex+1
        let newIncome = this.state.daysIncome[newIndex]
        this.setState({
            dayIndex: newIndex,
            todayIncome: newIncome
        })
    }

}

export class BoxIncomeCell extends Component {

    /// 初始化state
    constructor(props){
        super(props)
        this.state = {
        }
    }

    /// 初始化 props
    static propTypes = {
        itemClickHandler: PropTypes.func.isRequired,
    };

    _itemClickHandler(){
        this.props.itemClickHandler()
    }

    componentDidMount(){
    }

    render(){

        return(
            <View style = {{height:50}}>
                <TouchableOpacity style={{flexDirection:'row', height:50, alignItems:'center'}} onPress = {()=>this._itemClickHandler()}>
                    <Text style={{marginLeft:20, fontSize:16, color:'#333'}}>{this.props.boxName}</Text>
                    <Text style={{position:'absolute', right:40, fontSize:16, color:'#333'}}>{this.props.dailyIncome}</Text>
                    <Image style={{position:'absolute', right:20, width:9, height:15}} source={{uri:'右箭头灰'}}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topContainer: {
        height: INCOME_BOX_HEIGHT,
        backgroundColor:Util.lybBlue,
    },
    nav:{
        marginTop: 30,
        height: 25,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    backBox: {
        position:'absolute',
        width: 40,
        left:0,
        justifyContent: 'center',
        alignItems: 'center',
        height:25
    },
    navTitle:{
        color:'#fff',
        fontSize: 18,
        fontWeight:'bold',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    banner:{
        marginTop:25,
        alignItems:'center',
        flexDirection:'row',
        height: 47,
    },
    lastDay:{
        width: 90,
        height: 47,
        flexDirection:'row',
    },
    lastDayArrow:{
        marginLeft:20,
        marginTop:10,
        width:9,
        height:15
    },
    lastDayTextBox:{
        marginLeft:10,
    },
    middleDay:{
        position:'absolute',
        left:110,
        width: Util.size.width-220,
        height:30,
        backgroundColor:'#fff',
        borderRadius:5,
        justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'row',

    },
    middleDayImg:{
        width:18,
        height:17
    },
    middleDayTitle:{
        fontSize:14,
        color:'#333'
    },
    middleDayArrow:{
        width:11,
        height:5
    },
    nextDay:{
        position:'absolute',
        right: 0,
        height:47,
        width:90,
    },
    nextDayTextBox:{
        position:'absolute',
        right: 38,
    },
    nextDayArrow:{
        position:'absolute',
        right: 20,
        marginTop:10,
        width: 9,
        height:15
    },
    incomeAmountBox: {
        marginTop: 35/667*ScreenHeight,
        alignItems:'center'
    },
    incomeTitle: {
        color:'#fff',
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0)'
    },

    incomeDetailBox: {
        marginTop: 26/667*ScreenHeight,
        flexDirection:'row'
    },

    machineListContainer: {

    }
})