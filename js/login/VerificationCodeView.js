/**
 * Created by fy on 2018/5/21.
 */
import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Button, TextInput } from 'react-native'

import { Util } from '../common/utils'
import { API_CENTER_MANAGER } from '../network/LY_API'
import { LYFetchRequest } from '../network/LYHttpHelper'
import LYIndicator from '../components/LYIndicatorView'

export default class VerificationCodeView extends React.Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
            headerTitle: '忘记密码'
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            opacityText: '发送验证码',
            opacityAvailable: true,
            isShowIndicator: false,
            indicatorMsg: ''
        }
    }

    componentWillUnmount() {
        this.timeInterval && clearInterval(this.timeInterval)
        this.timer && clearTimeout(this.timer)
    }

    render() {

        return(
            <View style={styles.container}>
                <View style={styles.container1}>
                    <View style={styles.container2}>
                        <Image style={styles.img} source={{uri:'手机icon灰'}}/>
                        <TextInput placeholder='请输入手机号' onChangeText={this.numberChanged.bind(this)} maxLength={11} style={styles.input}/>
                    </View>
                    <View style={styles.container2}>
                        <Image style={styles.img} source={{uri:'验证码灰'}}/>
                        <TextInput placeholder='请输入验证码' onChangeText={this.verificationCodeChanged.bind(this)} maxLength={6} style={styles.input}/>
                        <TouchableOpacity
                            onPress={this.sendMessage.bind(this)}
                            style={[styles.btnAvailable, {backgroundColor:(this.state.opacityAvailable?Util.lybBlue:Util.detailBackgroundGray)}]}
                            activeOpacity={this.state.opacityAvailable? 0.5:1}>
                            <Text style={styles.btnText}>{this.state.opacityText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.nextStepOpacity} onPress={this.verifyMessage.bind(this)}>
                    <Text style={styles.nextStepText}>下一步</Text>
                </TouchableOpacity>
                {
                    this.state.isShowIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null
                }
            </View>
        )
    }
    sendMessage() {
        if (!this.state.opacityAvailable) return

        if (!this.phoneNumberLegal()) return

        let paramsObj = {}
        paramsObj.cmd = 'request_sms'
        paramsObj.mobile = this.number
        LYFetchRequest(API_CENTER_MANAGER, paramsObj, "GET", null).then(json => {
            console.log(json)
        }).catch(err => {
            console.log('err,', err.message)
        })

        this.setState({
            opacityAvailable: false,
            opacityText: 60
        })

        this.timeInterval && clearInterval(this.timeInterval)
        this.timeInterval = setInterval(()=>{
            console.log('嘀、嘀哒嘀')
            this.setState({
                opacityText: this.state.opacityText - 1
            })

            if (this.state.opacityText <= 0) {
                this.setState({
                    opacityAvailable: true,
                    opacityText:'发送验证码'
                })
                clearInterval(this.timeInterval)
            }

        },1000)
    }

    numberChanged(value) {
        this.number = value
    }

    verificationCodeChanged(value) {
        this.verificationCode = value
    }

    verifyMessage() {

        if (!this.phoneNumberLegal()) return

        let paramsObj = {}
        paramsObj.cmd = 'verif_sms'
        paramsObj.mobile = this.number
        paramsObj.sms = this.verificationCode
        LYFetchRequest(API_CENTER_MANAGER, paramsObj, "GET", null).then(json => {
            if (json.status === 1) {
                let merchantid = json.result.merchantid
                if (!merchantid) return
                this.props.navigation.navigate('ResetPassword', {
                    merchantid: merchantid
                })
            } else {
                this.showIndicator('验证失败，请检查手机号码和短信验证码')
            }
        }).catch(err=> {
            this.showIndicator(err.message)
        })
    }

    phoneNumberLegal() {
        if (this.number.length !== 11 || this.number.substring(0,1) !== '1') {
            this.showIndicator('手机号码格式有误，请检查')
            console.log(this.number)
            return false
        } else {
            return true
        }
    }

    showIndicator(message) {

        this.setState({
            isShowIndicator: true,
            indicatorMsg: message
        })

        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
            this.setState({
                isShowIndicator: false
            })
        },1000)

    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#fff'
    },
    container1: {
        marginTop: 30,
        height: 80,
        marginLeft: 40,
        width: Util.size.width-80,
    },
    container2: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth:1,
        borderColor: Util.detailBackgroundGray
    },
    img: {
        width:16,
        height:22
    },
    input: {
        width: 150,
        height: 30,
        marginLeft: 10,
    },
    btnAvailable: {
        position:'absolute',
        right:0,
        width: 90,
        height: 30,
        backgroundColor: Util.lybBlue,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:15,
    },
    btnDisabled: {},
    btnText: {
        fontSize: 14,
        color:'#fff'
    },
    nextStepOpacity: {
        marginTop: 30,
        marginLeft: 40,
        width: Util.size.width - 80,
        height: 40,
        borderRadius: 20,
        backgroundColor: Util.lybBlue,
        alignItems:'center',
        justifyContent:'center'
    },
    nextStepText: {
        color: '#fff',
        fontSize: 16,
    }
})