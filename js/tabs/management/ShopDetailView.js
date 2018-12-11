/**
 * Created by fy on 2018/3/23.
 */
import React, { Component } from 'react';
import { View, Text, Button, DeviceEventEmitter, TouchableOpacity, FlatList, Image, ImageBackground, DatePickerAndroid, DatePickerIOS } from 'react-native';
import PropTypes from 'prop-types'
import SwipeOut from 'react-native-swipeout'
import Lodash from 'lodash'
import { connect } from 'react-redux'

import { LYFetchRequest } from '../../network/LYHttpHelper'
import { Util } from '../../common/utils';
import LYEditableCell from '../../components/LYEditableCell'
import ShopOpenTimeView from '../../components/management/OpenTimePicker'
import LYIndicator from '../../components/LYIndicatorView'

class ShopDetailView extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {

        const { params } = navigation.state
        let rightTitle = params.rightTitle || '编辑'
        let leftTitle = rightTitle === '编辑'?'返回':'取消'
        let header1 = {
            title: '门店详情',
            headerRight: <Button title={rightTitle} onPress={params.changeEditState || (()=>{})} color='#fff'/>,
            headerLeft: <Button title={leftTitle} onPress={params.cancleEdit || (() => {})} color='#fff'/>
        }
        let header2 = {
            title: '门店详情',
            headerRight: <Button title={rightTitle} onPress={params.changeEditState || (()=>{})} color='#fff'/>,
        }
        let fHeader = params.rightTitle ? header1 : header2
        return fHeader
    }

    constructor(props) {
        super(props)
        this.mids = []
        this.storeName = ''
        this.storeAddress = ''
        this.state = {
            store:{},
            isEditing: false,
            isShowIndicator: false,
            indicatorMsg: '',
        }
    }

    /*
    * 渲染页面之前 获得 Manage 页面传递的 stores
    * 处理 stores 获得当前门店的 store 信息
    * 修改 store 信息后 回调 Manage 页面 重新请求数据 获得新的数据后 发送新数据的消息
    * 注册接收 Mange 页面新消息的监听 修改 store 后，更新页面
    * 设置右按钮
    * */
    componentDidMount() {
        const { params } = this.props.navigation.state;
        let stores = params.stores
        this.fitDate(stores)

        this.subscription = DeviceEventEmitter.addListener('modifyStores',(params) => {
            let stores = params.stores
            this.fitDate(stores)
        })

        this.props.navigation.setParams({
            changeEditState:this.headerRightHandle.bind(this),
            cancleEdit: this.cancleEdit.bind(this)
        })
    }

    // 移除 修改后更新页面数据的监听
    componentWillUnmount() {
        this.subscription.remove()
        this.timer && clearTimeout(this.timer)
        console.log('ShopDetailView--即将销毁')
    }

    /*
    * 根据路由传递的 storeid 处理
    * 路由传递的 stores 或者 监听收到的 stores
    * 得到 本页面需要的 store
    * */
    fitDate(stores) {
        const { params } = this.props.navigation.state;
        let store = {}
        stores.forEach((element, index) => {
            if (element.storeid === params.storeid) {
                store = Lodash.cloneDeep(element)
                this.storeName = store.storename
                this.storeAddress = store.address
            }
        })
        this.setState({
            store: store
        })
    }

    render() {

        let isDefaultShop = this.state.store.is_defaultgroup === 1

        return(
            <View style={{flex:1}}>
                <View style={{height:100, backgroundColor:'#fff'}}>
                    <LYEditableCell
                        detailChanged={(value) => this.textChangeHandle(0,value)}
                        isEditing={ isDefaultShop ? false : this.state.isEditing}
                        maxLength={16} title={'门店名称'}
                        detail={this.storeName}/>
                    <View style={{height:2, left:20, width:Util.size.width-40, backgroundColor:'#f1f1f1', position:'relative'}}></View>
                    <LYEditableCell
                        detailChanged={(value) => this.textChangeHandle(1, value)}
                        isEditing={this.state.isEditing}
                        maxLength={16} title={'门店地址'}
                        detail={this.storeAddress}/>
                </View>
                <View style={{height:8}}></View>
                <ShopOpenTimeView
                    type="Shop"
                    showSwitch={false}
                    title={'营业时间'}
                    changeTimeHandle={this.openTimeHandle.bind(this)}
                    startTime={this.state.store.start_time}
                    endTime={this.state.store.end_time}
                    isEditable={this.state.isEditing}>
                </ShopOpenTimeView>


                <FlatList
                    style={{backgroundColor:'#fff', marginTop:8}}
                    data={this.state.store.machine_detail}
                    keyExtractor={this._keyExtractor}
                    ListHeaderComponent={()=>this._listHeader()}
                    renderItem = {(ele) =>{
                        return <BoxNameCell
                            deleteItem={this.deleteItem.bind(this)}
                            itemIndex={ele.index}
                            machineName={ele.item.MACHINE_NAME?ele.item.MACHINE_NAME:'未命名'}
                            itemClickHandler={()=>this.boxItemClicked(ele.item)}/>
                    }}
                    ItemSeparatorComponent = {this._renderSeparator}
                />
                {
                    this.state.isShowIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null
                }
            </View>
        )
    }

    // 机器 FlatList 的分割线
    _renderSeparator(){
        return(
            <View style = {{height:1, backgroundColor:'#ddd', marginLeft:20, width:Util.size.width-40}}></View>
        )
    }

    /*
    * 点击机器列表 item 跳转到 BoxDetail
    * stores 所有的门店
    * storeid
    * MachineId
    * machineCallback
    * */
    boxItemClicked(item){
        let _this = this;
        this.props.navigation.navigate('BoxDetail',{
            stores:_this.props.navigation.state.params.stores,
            storeid:_this.state.store.storeid,
            MachineId:item.MachineId,
            machineCallback:_this.shopCallback.bind(_this)
        })
    }

    /**
     * SwipeOut 点击删除方法的回调
     * 操作数据源 store
     * 根据 数组下标 删除 machine
     * 重新渲染FlatList
     */
    deleteItem(index) {
        let store = this.state.store
        let machine = store.machine_detail[index]
        this.mids.push(machine.MachineId)
        store.machine_detail.splice(index,1)
        this.setState({
            store: store
        })
        console.log(this.mids)
    }

    // FlatListHeader
    _listHeader = () =>{
        return(
            <View style={{height:64, backgroundColor:'#ebebf1'}}>
                <View style={{height:56, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
                    <Text style={{fontSize:17, color:'#333', left:20}}>门店机器：{this.state.store.machine_detail?this.state.store.machine_detail.length:'0'}台</Text>
                </View>
            </View>
        )
    }

    _keyExtractor(item:Object, index: number){
        return index.toString();
    }

    // 门店名称地址变化的回调
    textChangeHandle(flag, value) {
        let store = this.state.store
        if(flag === 0){
            store.storename = value
        }else if (flag === 1) {
            store.address = value
        }
        this.setState({
            store: store
        })

        console.log(value)
    }

    /*
    * DatePicker 修改时间的回调
    * 将受到的时间 写入state
    * 再渲染页面
    * */
    openTimeHandle(startTime, endTime) {
        let store = this.state.store
        store.start_time = startTime
        store.end_time = endTime
        this.setState({
            store: store
        })

    }

    /*
    * 右按钮响应事件
    * 改变按钮名称
    * 改变编辑状态
    * 发送改变 store 的网络请求
    * */
    headerRightHandle() {
        let { state, setParams } = this.props.navigation
        if (state.params.rightTitle === '完成') {
            setParams({rightTitle: '编辑'})
            this.setState({
                isEditing: false
            })
            this.modifyShopDetail()
        } else {
            setParams({rightTitle:'完成'})
            this.setState({
                isEditing: true
            })
        }
    }

    cancleEdit(){
        this.props.navigation.goBack()
    }

    // 修改店铺信息
    modifyShopDetail() {
        let store = this.state.store
        let merchantid = this.props.loginInfo.merchantid
        let storeid = store.storeid
        let details = {}
        details.storename = this.state.store.storename
        details.address = this.state.store.address
        details.start_time = this.state.store.start_time
        details.end_time = this.state.store.end_time
        let detailsJson = JSON.stringify(details)
        //let modifyURL = `xxxx/center/manager/?cmd=update_StoreDetail&merchantid=${merchantid}&storeid=${storeid}&mids=${mids}&details=${encodeURIComponent(detailsJson)}`
        let paramsObj = {
            cmd:'update_StoreDetail',
            merchantid: merchantid,
            storeid: storeid,
            mids: this.mids,
            details: detailsJson
        }
        LYFetchRequest('center/manager/', paramsObj, 'GET', null).then(res => {
            this.modifyShopSucceed()
        }).catch(err => {
            console.log(err)
        })
    }

    // 修改成功后 显示 indicator 发送回调
    modifyShopSucceed() {
        this.shopCallback()
        this.setState({
            isShowIndicator: true,
            indicatorMsg: '修改门店信息成功'
        })
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
            this.setState({
                isShowIndicator: false
            })
            this.props.navigation.pop()
        },1000)
    }


    // 修改机器信息 -> 回调首页更新数据 -> 发送通知 子页面更新数据
    shopCallback() {
        let shopCallback = this.props.navigation.state.params.shopCallback
        shopCallback()
    }

}

function mapStateToProps(state) {
    let loginInfo = state.loginInfo.entity
    return { loginInfo }
}

export default connect(
    mapStateToProps,
)(ShopDetailView)

class BoxNameCell extends Component {

    /*
    * machineName 用于展示的机器名
    * itemClickHandler 点击回调
    * itemIndex 用于删除操作的 index
    * deleteItem 点击删除的回调
    * */
    static propTypes = {
        machineName: PropTypes.string.isRequired,
        itemClickHandler: PropTypes.func.isRequired,
        itemIndex: PropTypes.number.isRequired,
        deleteItem: PropTypes.func.isRequired,
    }

    // 机器点击后的回调 navigate 到 BoxDetail
    _itemClickHandler(){
        this.props.itemClickHandler()
    }

    render(){
        return(
            // SwipeOut 支持滑动删除
            <SwipeOut
                autoClose={true}
                right={[{text:'删除',onPress:()=>{this.props.deleteItem(this.props.itemIndex)}, type:'delete'}]}
                style = {{height:50, justifyContent:'center', backgroundColor:'#fff'}}>
                <TouchableOpacity onPress={()=>this._itemClickHandler()}>
                    <Text style={{fontSize:16, color:'#333', marginLeft:20}}>{this.props.machineName}</Text>
                </TouchableOpacity>
            </SwipeOut>
        )
    }
}