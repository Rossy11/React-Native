/**
 * Created by fy on 2018/3/20.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux'

import { LYFetchRequest } from '../../network/LYHttpHelper'
import { API_MACHINE_INFO } from '../../network/LY_API'

import LYIndicator from '../../components/LYIndicatorView'

class LYQRCodeScanView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            QRData:'',
            isShowIndicator: false,
            indicatorMsg: '',
        }
    }

    static navigationOptions = ({navigate, navigationOptions}) => {
        return {
            headerTitle:'激活机器'
        }
    }

    componentDidMount() {

        // 激活成功后 给首页发送回调 首页更新数据 发送通知 接收到通知后 跳转到 BoxDetail 页
        this.subScription1 = DeviceEventEmitter.addListener('modifyStores',(params) => {
            if (this.legalCode) {
                this.goBoxDetail(params.stores)
            }
        })
    }

    componentWillUnmount() {
        this.subScription1.remove()
        console.log('QRScreenView----WillUnmounted')
        this.timer && clearTimeout(this.timer)
    }

    render(){
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style = {styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    onBarCodeRead={this.readQRCode.bind(this)}
                />
                <View style={{flex: 0, justifyContent: 'center', alignItems:'center'}}>

                    <Text style={{color:'#fff', marginTop:20}}>扫码结果：{this.state.QRData}</Text>
                    {/*<TouchableOpacity*/}
                        {/*onPress={this.takePicture.bind(this)}*/}
                        {/*style = {styles.capture}*/}
                    {/*>*/}
                        {/*<Text style={{fontSize: 14}}> SNAP </Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity*/}
                        {/*onPress={this.activeMachine.bind(this)}*/}
                        {/*style = {styles.capture}*/}
                    {/*>*/}
                        {/*<Text style={{fontSize: 14}}> 激活 </Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                {
                    this.state.isShowIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null
                }
            </View>
        );
    }

    readQRCode(result, type) {

        this.setState({
            QRData: result.data
        })

        // 如果已经扫描到合法的激活二维码 不对扫码结果进行处理
        if (this.legalCode) return
        try {
            let QRbj = {}
            QRObj = JSON.parse(result.data)
            let machineId = QRObj.musicpro_mid
            if (machineId) {
                this.legalCode = true
                this.MachineId = machineId
                this.activeMachine()
            } else {
                throw ('这不是我要的二维码')
            }
        }catch (err) {
            this.setState({
                isShowIndicator: true,
                indicatorMsg: '这不是我要的二维码'
            })
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                this.setState({
                    isShowIndicator: false,
                    indicatorMsg: ''
                })
            }, 1000)
            return
        }
    }

    takePicture = async function() {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options)
            console.log(data.uri);
        }
    };

    goBoxDetail(stores) {
        let storeid = -1
        stores.forEach((store)=>{
            if (store.is_defaultgroup === 1) {
                storeid = store.storeid
            }
        })
        if (storeid === -1) {
            return
        }
        let MachineId = this.MachineId
        let _this = this
        let callback = this.props.navigation.state.params.QRCallback

        // 使用 replace 跳转 释放掉QRCodeView
        this.props.navigation.replace('BoxDetail',{
            stores: stores,
            storeid: storeid,
            MachineId: MachineId,
            // machineCallback: _this.QRCallback.bind(_this) 取消QR回调，换做BoxDetail中的回调
            machineCallback: callback,
        })

        // 跳转过去之后 释放本页面 将回调函数绑定到上一个页面
        // this.props.navigation.navigate('BoxDetail',{
        //     stores: stores,
        //     storeid: storeid,
        //     MachineId: MachineId,
        //     // machineCallback: _this.QRCallback.bind(_this) 取消QR回调，换做BoxDetail中的回调
        //     machineCallback: callback,
        //     isReplaceQRCode: true,
        // })

    }

    activeMachine() {
        let url = `${API_MACHINE_INFO}${this.MachineId}/`
        let bodyObj = {}
        bodyObj.STATUS = 1
        bodyObj.mid = this.MachineId
        bodyObj.merchantid = this.props.merchantInfo.merchantid
        LYFetchRequest(url, null, 'PATCH', bodyObj)
        .then(json => {
            if(json.info_code === 10002) {
                this.setState({
                    isShowIndicator: true,
                    indicatorMsg: '机器号有误，你是不是扫了别人的机器？'
                })
                this.timer && clearTimeout(this.timer)
                this.timer = setTimeout(()=>{
                    this.setState({
                        isShowIndicator: false,
                        indicatorMsg: ''
                    })
                }, 1000)
                return
            }
            console.log('激活机器\n', json)
            this.QRCallback()
        })
        .catch(err => console.log(err))
    }

    QRCallback() {
        let callback = this.props.navigation.state.params.QRCallback
        callback()
    }

}

function mapStateToProps(state) {
    let merchantInfo = state.loginInfo.entity
    return { merchantInfo }
}

export default connect(
    mapStateToProps
)(LYQRCodeScanView)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    }
});