/**
 * Created by fy on 2018/3/23.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Button } from 'react-native';
import { connect } from 'react-redux'

import {Util} from '../../common/utils';
import ShopOpenTimeView from '../../components/management/OpenTimePicker'
import LYIndicator from '../../components/LYIndicatorView'

class CreateShopView extends Component {

    static navigationOptions = () => {
        return {
            title:'创建门店'
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            storeName: '',
            address: '',
            startTime:'09:00',
            endTime:'23:30',
            isShowIndicator: false,
            indicatorMsg: ''
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={{height:104, backgroundColor:'#fff'}}>
                    <View style={{height:51, flexDirection:'row', alignItems:'center'}}>
                        <Text style={{marginLeft:20, color:'#333', fontSize:16, width:66}}>门店名称</Text>
                        <TextInput onChangeText={(value) => this.changeStoreNameAddressHandle(value,0)} style={{marginLeft: 20,width:150, height:25, alignSelf:'center'}} placeholder={'请填写门店名称'}></TextInput>
                    </View>
                    <View style={{height:2, left:20, width:Util.size.width-40, backgroundColor:'#f1f1f1', position:'relative'}}></View>
                    <View style={{height:51, flexDirection:'row', alignItems:'center'}}>
                        <Text style={{marginLeft:20, color:'#333', fontSize:16, width:66}}>门店地址</Text>
                        <TextInput onChangeText={(value) => this.changeStoreNameAddressHandle(value,1)} style={{marginLeft: 20,width:150, height:25, alignSelf:'center'}} placeholder={'请填写门店地址'}></TextInput>
                    </View>
                </View>

                <View style={{marginTop:10}}>
                    <ShopOpenTimeView changeTimeHandle={this.changeTimeHandle.bind(this)} isEditable={true} startTime={this.state.startTime} endTime={this.state.endTime}/>
                </View>

                <View style={{height:40,marginTop:50}}>
                    <TouchableOpacity onPress={this.createShop.bind(this)} activeOpacity={0.55} style={{backgroundColor:Util.lybBlue, marginLeft: 40, width: Util.size.width-80, height: 40, borderRadius: 20, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize: 16, color: '#fff'}}>确认创建</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.isShowIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null

                }
            </View>
        )
    }

    // 发送 创建 门店 协议
    createShop(){
        let formData = new FormData();
        formData.append("cmd", "add_StoreToMachant");
        formData.append("merchantid", this.props.loginInfo.merchantid);
        formData.append("storename", "乐音Box1");
        formData.append("address", "锦绣路")

        console.log(formData);
        var opts = {
            method:"POST",
            body:formData,
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json',
            }
        }

        let storeName = this.state.storeName
        let address = this.state.address
        let merchantid = this.props.loginInfo.merchantid
        let startTime = this.state.startTime
        let endTime = this.state.endTime
        if (storeName && address && startTime && endTime) {

            let createStoreURL = `xxx/center/manager/?cmd=add_StoreToMachant&merchantid=${merchantid}&storename=${storeName}&address=${address}&start_time=${startTime}&end_time=${endTime}`
            console.log(createStoreURL)

            fetch(createStoreURL)
            .then((response)=>{
                return response.json();
            })
            .then((json)=>{
                if (json.status === 1) {
                    this.createShopSucceed()
                }
            })
            .catch((error)=>{
                console.log('创建失败', error.message)
            })
        }
    }

    createShopSucceed() {
        this.props.navigation.state.params.CreateShopCallback()
        this.setState({
            isShowIndicator: true,
            indicatorMsg: '创建门店成功'
        })
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
            this.setState({
                isShowIndicator: false
            })
            this.props.navigation.pop()
        }, 1000)

    }

    changeStoreNameAddressHandle(value, flag) {
        let finalString = value.trim()
        console.log(finalString)
        if(flag === 0) {
            // 改变 storeName
            this.setState({
                storeName: value
            })
        } else {
            // 改变 address
            this.setState({
                address: value
            })
        }
    }

    changeTimeHandle(flag) {
        console.log(flag)
    }

}

function mapStateToProps(state) {
    let loginInfo = state.loginInfo.entity
    return { loginInfo }
}

export default connect (
    mapStateToProps,
) (CreateShopView)