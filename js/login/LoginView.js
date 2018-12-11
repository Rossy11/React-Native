/**
 * Created by fy on 2018/3/15.
 */
import React, { Component } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native';
import BVLinearGradient, { NavigationActions, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import LinearGradient from 'react-native-linear-gradient'
import { login, loginFailed, loginSuccess, recordGoBackKey } from '../action/login'
import { Util } from '../common/utils';
import LYIndicator from '../components/LYIndicatorView'

const ScreenHeight = Util.size.height;
const BottomBoxHeight = 250/667*ScreenHeight,
    OperationBoxHeight = 110/667*ScreenHeight,
    LogoHeight = 110/667*ScreenHeight,
    LogoMarginTop = 70/667*ScreenHeight;

class LoginView extends Component {

    static navigationOptions = {
        header: null,
    };

    // cpr 18621608101
    constructor(props) {
        super(props)
        this.state = {
            phoneNumber:'',
            passWord:'',
            isShowIndicator: false,
            indicatorMsg: ''
        }
    }

    componentDidMount(){
        let _this = this
        console.ignoredYellowBox = [
            'Remote debugger',
            'Warning: componentWillMount',
            'Warning: componentWillReceiveProps',
            'Warning: componentWillUpdate',
            'Warning: isMounted'
        ];
        this.deviceEventListener = DeviceEventEmitter.addListener("Logout", ()=>{
            console.log('收到退出登录通知')
            let resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: 'Login'})
                ]
            });
        })

        const { key } = this.props.navigation.state
        this.props.recordGoBackKey(key)
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
        this.deviceEventListener.remove()
        console.log('登录成功 --- componentWillUnmount')
    }

    render(){
        console.log('render--')
        return(
            <KeyboardAvoidingView
                behavior={'padding'}
                style={{flex:1, backgroundColor:'#4ce7fd'}}>
                {/*<ScrollView style={{flex:1}}>*/}
                    <View style={styles.bottomBox}>
                        <Image style={styles.logoImage} source={{uri:'logo'}} resizeMode='stretch'/>
                    </View>
                    <View style={styles.operationBox}>
                        <View style={styles.textInputBox}>
                            <Image source={{uri:'手机icon白'}} style={{width:16, height:22}}></Image>
                            <TextInput
                                onChangeText={(e) => this.phoneNumberChange(e) }
                                placeholder={'请输入账号'}
                                style={styles.phoneNumber}/>
                        </View>
                        <View style={styles.whiteLine}/>
                        <View style={styles.textInputBox}>
                            <Image source={{uri:'密码icon白'}} style={{width:16, height:22}}></Image>
                            <TextInput
                                onChangeText={(e) => this.passWordChange(e)}
                                onFocus={() => {console.log('onFocus')}}
                                onBlur={() => {console.log('onBlur')}}
                                placeholder={'请输入密码'}
                                style={styles.phoneNumber}/>
                        </View>
                        <View style={styles.whiteLine}/>
                        <TouchableOpacity style={styles.forgetPasswordOpacity} onPress={this.forgetPassword.bind(this)}>
                            <Text style={styles.forgetPassword}>忘记密码</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.login.bind(this)} activeOpacity={0.55} style={{marginLeft: 40, width: Util.size.width-80, height: 40, alignItems:'center', justifyContent:'center', backgroundColor:'#fff', borderRadius:20}}>
                        <Text style={{fontSize: 18, color: Util.lybBlue}}>登 录</Text>
                    </TouchableOpacity>
                    <View style={{position:'absolute', bottom:0, height:50, width:Util.size.width, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color:'#fff', fontSize:16}}>Copyright ©2018 LY.</Text>
                        <Text style={{color:'#fff', fontSize:16}}>V1.1.1</Text>
                    </View>
                    {
                        this.state.isShowIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null
                    }
                    {/*<TextInput style={{marginTop:30, height:40, width:100, backgroundColor:'green'}}/>*/}
                {/*</ScrollView>*/}

            </KeyboardAvoidingView>
        )
    }

    login = () => {
        const phoneNumber = this.state.phoneNumber
        const passWord = this.state.passWord
        this.props.login(phoneNumber, passWord).then(res => {
            if (res === '登录成功') {
                let reetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'Tabs'})
                    ]
                })
                this.props.navigation.dispatch(reetAction)

            }
        }).catch(errMsg => {
            this.showIndicator('登录失败，'+ (errMsg || '请检查账号密码'))
        })
    }

    forgetPassword() {
        this.props.navigation.navigate('Verification')
    }

    phoneNumberChange(e) {
        console.log(e)
        this.setState({
            phoneNumber:e
        })
    }
    passWordChange(e) {
        console.log(e)
        this.setState({
            passWord: e
        })
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

function mapStateToProps(state) {
    const { loginInfo } = state
    return { loginInfo }
}

function mapDispatchToProps(dispatch) {
    return {
        login: bindActionCreators(login, dispatch),
        recordGoBackKey: bindActionCreators(recordGoBackKey, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginView)


// Later on in your styles..
var styles = StyleSheet.create({
    bottomBox: {
        height: BottomBoxHeight,
        alignItems: 'center',
    },
    logoImage: {
        marginTop:LogoMarginTop,
        height: LogoHeight*1.25,
        width: LogoHeight,
    },
    operationBox: {
        height: OperationBoxHeight,
    },
    textInputBox: {
        flexDirection:'row',
        alignItems:'center',
        height:38,
        marginLeft:40,
        width: Util.size.width-80,
    },
    phoneNumber: {
        height:30,
        width:200,
        alignSelf:'center',
        color:'#fff',
        marginLeft:10,
    },
    whiteLine: {
        height: 1,
        marginLeft: 40,
        width: Util.size.width-80,
        backgroundColor:'#fff'
    },
    forgetPasswordOpacity: {
        position:'absolute',
        right:40,
        marginTop:87,

    },
    forgetPassword: {
        fontSize: 14,
        textDecorationLine: 'underline',
        color:'#fff'
    }


});
