/**
 * Created by fy on 2018/4/23.
 */
import React from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet, DatePickerIOS, DatePickerAndroid, Switch } from 'react-native'
import PropTypes from 'prop-types'
import { Util } from '../../common/utils'


/**
 * 一、显示模式 单行显示开始时间结束时间
 * 二、编辑时间
 *   1、双行显示 标题 和 营业时间
 *   2、点击时间 弹出 DatePicker 确定或取消 DatePicker 消失
 */
const YOUTH_DAY = '2018-5-4'

export default class ShopOpenTime extends React.Component {


    props:{
        type: "Shop" | "Machine",
        title: string,
        showSwitch: boolean
    }

    /*
     * isEditable 是否为编辑模式
     * startTime  开始时间
     * endTime 结束时间
     * changeTimeHandle 点击确定修改时间后的回调 将修改后的时间传给 Controller 再修改视图
     * */
    static propTypes = {
        isEditable: PropTypes.bool,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
        changeTimeHandle: PropTypes.func,
        switchValue: PropTypes.bool,
        switchValueHandler: PropTypes.func,
    }

    constructor(props) {
        super(props)
        /*
        * isShowDatePicker 是否显示 DatePicker 编辑模式下 点击时间显示
        * pickerStartTime  为了 DatePicker 显示时间的方便 拼接的字符串日期时间格式
        * pickerEndTime    同上
        * */
        this.state = {
            isShowDatePicker: false,
            pickerStartTime: `${YOUTH_DAY}  ${props.startTime}`,
            pickerEndTime: `${YOUTH_DAY}  ${props.endTime}`
        }
    }

    render() {

        //
        if (this.props.type === "Machine") {
            return this.editingOpenTime()
        }else if (this.props.type === "Shop") {
            return(
                this.props.isEditable ? this.editingOpenTime() : this.normalOpenTime()
            )
        } else {
            return null
        }

    }

    // 非编辑状态下的视图
    normalOpenTime() {
        let openTime = `${this.props.startTime}-${this.props.endTime}`
        return (
            <View style={styles.normalContainer}>
                <Text style={styles.normalText}>{this.props.title}</Text>
                <Text style={styles.openTime}>{openTime}</Text>
            </View>
        )
    }

    /*
    * 编辑状态下的视图
    * 点击时间 显示 DatePicker
    */
    editingOpenTime() {

        return (
            <View style={styles.editContainer}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={styles.editTitle}>{this.props.title}</Text>
                    {
                        this.props.showSwitch ?
                            <Switch
                                disabled={!this.props.isEditable}
                                value={this.props.switchValue}
                                onValueChange={this._switchValueChanged.bind(this)}
                                style={{right:20, position:'absolute', transform:[{scaleY:0.8}, {scaleX:0.8}]}}>
                            </Switch>
                            : null
                    }
                </View>
                <View style={styles.editTimeBox}>
                    <Text style={styles.operateText}>开始时间：</Text>
                    <TouchableOpacity onPress={() =>this.isShowDatePicker()} style={styles.editOpacity}>
                        <Text style={styles.timeText}>{this.props.startTime}</Text>
                    </TouchableOpacity>
                    <Text style={styles.operateText}>结束时间：</Text>
                    <TouchableOpacity onPress={() =>this.isShowDatePicker()} style={styles.editOpacity}>
                        <Text style={styles.timeText}>{this.props.endTime}</Text>
                    </TouchableOpacity>
                </View>

                {
                    this.state.isShowDatePicker ?
                        this.renderDatePicker()
                        : null
                }

            </View>
        )
    }

    /*
    * DatePicker
    * 两列 分别操作开始时间和结束时间
    * 点击时间 显示/关闭
    * 点击确定 回调 向 Controller 传递 startTime endTime 修改 Controller state 改变本视图
    * */
    renderDatePicker() {
        return(
            <View style={styles.pickerContainer}>
                <View style={styles.topTitleContainer}>
                    <Text style={styles.topTitle}>开始时间</Text>
                    <Text style={styles.topTitle}>结束时间</Text>
                </View>
                <View style={{flexDirection:'row', borderWidth:1, borderColor:'#ddd'}}>
                    <DatePickerIOS
                        style={{flex:1}}
                        mode='time'
                        date={new Date(this.state.pickerStartTime)}
                        onDateChange={(time) => this.dateChanged(time, 0)}/>

                    <DatePickerIOS
                        style={{flex:1}}
                        mode='time'
                        date={new Date(this.state.pickerEndTime)}
                        onDateChange={(time)=> this.dateChanged(time, 1)}/>
                </View>
                <View style={styles.bottomBtnContainer}>
                    <Button title="取消" onPress={this.isShowDatePicker.bind(this)} color={Util.lybBlue}/>
                    <Button title="确定" onPress={this._changeTimeHandle.bind(this)} color={Util.lybBlue}/>
                </View>
            </View>
        )
    }


    // 点击时间 展示/隐藏 DatePicker
    isShowDatePicker() {
        if (this.props.isEditable) {
            this.setState({
                isShowDatePicker: !this.state.isShowDatePicker
            })
        }
    }

    // DatePicker 时间改变后的回调 用于更新 DatePicker 时间的显示
    dateChanged(time, flag) {
        let hour = time.getHours()
        let hourString = hour > 9 ? `${hour}` : `0${hour}`
        let minute = time.getMinutes()
        let minuteString = minute > 9 ? `${minute}` : `0${minute}`
        console.log(minute)
        let fTime = `${YOUTH_DAY} ${hourString}:${minuteString}:00`
        if (flag === 0) {
            this.setState({
                pickerStartTime: fTime
            })
        }else if (flag === 1) {
            this.setState({
                pickerEndTime: fTime
            })
        }

    }

    // 回调 改变container 开始时间结束时间 改变视图
    _changeTimeHandle() {
        let startTime = this.state.pickerStartTime.split(' ').pop()
        let endTime = this.state.pickerEndTime.split(' ').pop()
        this.props.changeTimeHandle(startTime, endTime)
        console.log('TimeChanged', startTime, endTime)
        this.setState({
            isShowDatePicker: false
        })
    }

    // 回调 改变 Switch Value
    _switchValueChanged() {
        this.props.switchValueHandler(!this.props.switchValue)
    }

}

const styles = StyleSheet.create({
    normalContainer: {
        height: 49,
        alignItems:'center',
        backgroundColor:'#fff',
        flexDirection:'row'
    },
    normalText: {
        marginLeft:20,
        color:'#333',
        fontSize: 16,
    },
    openTime: {
        marginLeft:20,
        color:'#999',
        fontSize: 14,
        position:'absolute',
        right:20,
    },
    editContainer: {
        // height: 280,
        backgroundColor:'#fff'
    },
    editTitle: {
        fontSize:16,
        color:'#333',
        marginLeft:20,
        marginTop: 11,
        fontWeight:'600'
    },
    editTimeBox: {
        height:40,
        alignItems:'center',
        flexDirection:'row'
    },
    operateText: {
        marginLeft:20,
        fontSize:14,
        color:'#333'
    },
    editOpacity: {
        height:20,
        width:80,
        borderBottomWidth:1,
        borderColor: Util.detailBackgroundGray,
        alignItems:'center',
        justifyContent:'center'

    },
    timeText: {
        color:'#999',
        fontSize:14,
    },
    pickerContainer:{
        // borderWidth:1,
        // borderColor:'#ddd'
    },
    topTitleContainer:{
        flexDirection:'row',
        height:30,
        justifyContent:'space-around',
        alignItems:'center'
    },
    topTitle:{
        color:'#333',
        fontSize:16
    },
    bottomBtnContainer:{
        height:40,
        flexDirection:'row',
        justifyContent:'space-around',
        borderBottomWidth: 1,
        borderColor: Util.detailBackgroundGray
    },

})