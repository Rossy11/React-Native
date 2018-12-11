/**
 * Created by fy on 2018/5/21.
 */
import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Util } from '../common/utils'
import LYIndicator from '../components/LYIndicatorView'
import { LYFetchRequest } from '../network/LYHttpHelper'
import { API_MERCHANT_INFO } from '../network/LY_API'

export default class ResetPasswordView extends React.Component {
    static navigationOptions = {
        headerTitle: '修改密码'
    }

    constructor(props) {
        super(props)
        this.state = {
            isShowIndicator: false,
            indicatorMsg: ''
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.container1}>
                    <View style={styles.container2}>
                        <Image source={{uri:'密码icon'}} style={{width:16, height:20}}/>
                        <TextInput onChangeText={this.passwordChanged.bind(this)} placeholder={'输入新密码，不少于6位'} style={styles.passwordText}/>
                    </View>
                    <View style = {styles.container2}>
                        <Image source={{uri:'密码icon'}} style={{width:16, height:20}}/>
                        <TextInput onChangeText={this.repeatPasswordChanged.bind(this)} placeholder={'确认新密码'} style={styles.passwordText}/>
                    </View>
                </View>
                <TouchableOpacity onPress={this.updatePassword.bind(this)} style = {styles.doneOpacity}>
                    <Text style={styles.doneText}>确定修改</Text>
                </TouchableOpacity>
                {
                    this.state.isShowIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null
                }
            </View>
        )
    }

    updatePassword() {
        if (!this.passwordLegal()) return
        let { merchantid } = this.props.navigation.state.params
        let url = `${API_MERCHANT_INFO}${merchantid}/`
        let headerObj = {}
        headerObj.password = this.password

        LYFetchRequest(url, null, "PATCH", headerObj).then(json => {
            if (json.password === this.password) {
                this.showIndicator('修改成功')
            }
        }).catch(err => {
            console.log(123,err.message)
        })

        /* test */
        // const { meKey, settingKey } = this.props.navigation.state.params
        // console.log(meKey, settingKey)
        // this.props.navigation.goBack(settingKey)

    }



    passwordLegal() {
        if (!this.password || !this.repeatPassword) {
            this.showIndicator('密码不能为空')
            return false
        }
        if (this.password !== this.repeatPassword) {
            this.showIndicator('两次密码输入一致，请重新输入')
            return false
        }

        if (this.password.length < 6) {
            this.showIndicator('密码不能少于6位')
            return false
        }
        return true
    }

    passwordChanged(value) {
        this.password = value.trim()
    }

    repeatPasswordChanged(value) {
        this.repeatPassword = value.trim()
    }

    showIndicator(message) {
        this.timer && clearTimeout(this.timer)
        this.setState({
            isShowIndicator: true,
            indicatorMsg: message
        })
        this.timer = setTimeout(()=>{
            this.setState({
                isShowIndicator: false
            })
            if (message === '修改成功') {
                this.props.navigation.popToTop()
            }
        }, 1000)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container1: {
        marginTop: 30,
        marginLeft: 40,
        height: 80,
        width: Util.size.width - 80
    },
    container2: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth:1,
        borderColor: Util.detailBackgroundGray
    },
    passwordText: {
        marginLeft: 10,
        width: 200
    },
    doneOpacity: {
        marginTop: 30,
        marginLeft: 40,
        width: Util.size.width - 80,
        height: 40,
        borderRadius: 20,
        backgroundColor: Util.lybBlue,
        alignItems:'center',
        justifyContent:'center'
    },
    doneText: {
        fontSize: 16,
        color: '#fff'
    }
})