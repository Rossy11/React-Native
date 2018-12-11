/**
 * Created by fy on 2018/3/24.
 */
import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, Image, ScrollView, DeviceEventEmitter } from 'react-native';
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import * as ModifyType from '../../static/ModifyInfoType'
import ModifyStoreList from '../../components/management/ModifyStoreList'
import LYIndicator from '../../components/LYIndicatorView'

import { LYFetchRequest } from '../../network/LYHttpHelper'
import { API_CENTER_MANAGER } from '../../network/LY_API'

class BoxDetailView extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
            title:'机器信息'
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            MACHINE_NAME:'',
            storename: '',
            MachineId:0,
            ACTIVE_TIME:'',
            stores:[],
            isShowStores: false,
            isShowIndicator: false,
            indicatorMsg: ''
        }
        this.storeid = props.navigation.state.params.storeid
    }

    componentDidMount() {
        console.log('componentDidMount')
        console.log('--------- ',this.props.loginInfo.merchantid)
        const { params } = this.props.navigation.state

        // if (params.isReplaceQRCode) {
        //     // this.props.navigation.replace('Management')
        //     let resetNav = NavigationActions.reset({
        //         index:0,
        //         actions: [
        //             NavigationActions.navigate({routeName: 'Management'}),
        //             NavigationActions.navigate({routeName: 'BoxDetail'})
        //         ]
        //     })
        //     this.props.navigation.dispatch(resetNav)
        // }
        let stores = params.stores
        this.fitData(stores)
        this.subscription = DeviceEventEmitter.addListener('modifyStores', (eParams) => {
            console.log('收到通知')
            this.fitData(eParams.stores)
        })

    }

    componentWillUnmount() {
        console.log('BoxDetailView Will Unmount')
        this.subscription.remove()
        this.timer && clearTimeout(this.timer)
    }

    // 处理数据 根据收到 stores 处理适合页面显示的数据
    fitData(stores) {

        console.log('--处理数据---')
        const { params } = this.props.navigation.state

        let store = {}
        stores.forEach((ele, index) => {
            if (ele.storeid === this.storeid) {
                store = ele
                console.log('找到store', store)
            }
        })

        let machine = {}
        store.machine_detail.forEach((ele, index) => {
            if (ele.MachineId === params.MachineId) {
                machine = ele
                console.log('找到machine', machine)
            }
        })

        console.log(1245,machine.MACHINE_NAME, store.storename)

        this.setState({
            MACHINE_NAME: machine.MACHINE_NAME,
            storename: store.storename,
            MachineId: machine.MachineId,
            ACTIVE_TIME: machine.ACTIVE_TIME,
            stores: stores
        })
    }


    render(){
        let arrowImage = this.state.isShowStores ? {uri:'向下箭头'} : {uri:'右箭头灰'}
        return(
            <ScrollView>
                <View style={{height:58}}>
                    <View style={{marginTop:8, height:50, backgroundColor:'#fff', backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{marginLeft:20,fontSize:16, color:'#333'}}>机器名称</Text>
                        <TouchableOpacity onPress={this.modifyMachineName.bind(this)} style={{position:'absolute', right:10, flexDirection:'row'}}>
                            <Text style={{color:'#999', fontSize:14}}>{this.state.MACHINE_NAME || '未命名'}</Text>
                            <Image style={{marginLeft:8, width:9, height:15}} source={{uri:'右箭头灰'}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height:58}}>
                    <View style={{marginTop:8, height:50, backgroundColor:'#fff', backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{marginLeft:20,fontSize:16, color:'#333'}}>所属门店</Text>
                        <TouchableOpacity onPress={this.foldShops.bind(this)} style={{position:'absolute', right:10, flexDirection:'row'}}>
                            <Text style={{color:'#999', fontSize:14}}>{this.state.storename || '未命名'}</Text>
                            {
                                this.state.isShowIndicator ?
                                    <Image style={{marginLeft:8, alignSelf:'center', width:15, height:9}} source={arrowImage}/>:
                                    <Image style={{marginLeft:8, alignSelf:'center', width:9, height:15}} source={arrowImage}/>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.isShowStores
                    ? <ModifyStoreList dataSource={this.state.stores} itemClickHandler={this._shopItemHandler.bind(this)}/>
                        : null
                }
                <View style={{height:58}}>
                    <View style={{marginTop:8, height:50, backgroundColor:'#fff', backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{marginLeft:20,fontSize:16, color:'#333'}}>机器编号</Text>
                        <Text style={{color:'#333', fontSize:14, right:10, position:'absolute'}}>{this.state.MachineId || '--'}</Text>
                    </View>
                </View>
                <View style={{height:52}}>
                    <View style={{marginTop:2, height:50, backgroundColor:'#fff', backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{marginLeft:20,fontSize:16, color:'#333'}}>激活时间</Text>
                        <Text style={{color:'#333', fontSize:14, right:10, position:'absolute'}}>{this.state.ACTIVE_TIME || '--'}</Text>
                    </View>
                </View>
                {
                    this.state.isShowIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null
                }
            </ScrollView>
        )
    }

    _shopItemHandler(isCreateStore, store) {

        if (isCreateStore) {

            this.props.navigation.navigate('CreateShop')

        } else {
            let merchantid = this.props.loginInfo.merchantid

            var paramObj = {
                cmd:'bind_MachineToOther',
                mid: this.state.MachineId,
                merchantid: merchantid,
                storeid: store.storeid
            }

            LYFetchRequest(API_CENTER_MANAGER, paramObj, 'GET', null)
            .then(res => {
                if (res.status === 1) {
                    // 修改成功
                    this.storeid = store.storeid
                    this.modifyMachineSucceed()
                }
            })
            .catch(err => console.log('error',err))
            this.setState({
                isShowStores: !this.state.isShowStores
            })
        }

    }

    // 修改成功后 显示 indicator 发送回调
    modifyMachineSucceed() {
        this.machineCallback()
        this.setState({
            isShowIndicator: true,
            indicatorMsg: '修改机器信息成功'
        })
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
            this.setState({
                isShowIndicator: false
            })
        }, 1000)
    }

    modifyMachineName() {
        let _this = this
        let machineName = this.state.MACHINE_NAME
        let MachineId = this.state.MachineId
        this.props.navigation.navigate('ModifyInfo', {
            type: ModifyType.MODIFY_MACHINE_NAME,
            originInfo: machineName,
            MachineId: MachineId,
            modifyCallback: _this.machineCallback.bind(_this)
        })
    }

    foldShops() {
        this.setState({
            isShowStores: !this.state.isShowStores
        })
    }

    machineCallback() {
        const { params } = this.props.navigation.state
        let machineCallback = params.machineCallback
        machineCallback()

        console.log('执行Box回调，看看ManageView是否收到回调')
    }

}

function mapStateToProps(state) {
    let loginInfo = state.loginInfo.entity
    return { loginInfo }
}

export default connect(
    mapStateToProps,
)(BoxDetailView)