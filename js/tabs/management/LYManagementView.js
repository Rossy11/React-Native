/**
 * Created by fy on 2018/3/14.
 */
import React, { Component } from 'react';
import { View, Text, StatusBar, DeviceEventEmitter, TouchableOpacity, FlatList, SectionList, Image, Button, ImageBackground } from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';
import PropTypes from 'prop-types'

import { Util } from '../../common/utils';
import { LYFetchRequest } from '../../network/LYHttpHelper'
import { API_MERCHANT_MANAGE } from '../../network/LY_API'

import { connect } from 'react-redux'

class LYManagementView extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '管理',
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
        super(props)
        this.state = {
            stores:[],
            refreshing: false,
        }
        this.loginInfo = props.loginInfo.entity
    }

    componentDidMount(){
        this.requestStores(false)
        this.props.navigation.setParams({
            tabItemReclicked: this.requestStores.bind(this)
        })
    }

    // 获得代理商 门店信息
    requestStores(postMessage){
        let merchantid = this.loginInfo.merchantid
        let paramObj = {
            cmd:'query_machine_info',
            merchantid:merchantid
        }

        this.setState({
            refreshing: true
        })

        // 封装好的网络请求 获得代理商店铺信息
        LYFetchRequest(API_MERCHANT_MANAGE,paramObj, 'GET', null).then(json => {
            let result = json.result
            let storeArray = result.group;
            let noneGroup = result.nongroup;
            storeArray.unshift(noneGroup)
            this.setState({
                stores: storeArray,
                refreshing: false
            })
            if (postMessage) {
                this.emitStores(storeArray)
            }

        }).catch(err => {
            console.log('error',err)
            this.setState({
                refreshing: false,
            })
        })
    }

    // 后面的页面修改信息后 接收回调 请求数据 发送新数据通知
    emitStores(stores) {
        DeviceEventEmitter.emit('modifyStores', {stores: stores})
    }


    goQRCodeView(){
        let _this = this
        this.props.navigation.navigate('QRCode',{
            QRCallback: _this.modifyShopInfoCallback.bind(_this)
        })
    }

    goCreateShop(){
        let _this = this
        this.props.navigation.navigate('CreateShop',{
            CreateShopCallback: _this.createShopCallback.bind(_this)
        })
    }

    goPriceSetupView(){
        this.props.navigation.navigate('PriceSetup',{
            stores: this.state.stores,
        })
    }

    _cellClicked(item){
        let _this = this
        this.props.navigation.navigate('ShopDetail',{
            shopCallback: _this.modifyShopInfoCallback.bind(_this),
            stores: _this.state.stores,
            storeid: item.storeid,
        })
    }

    modifyShopInfoCallback() {
        this.requestStores(true)
    }

    createShopCallback() {
        this.requestStores(false)
    }


    _listHeader(){
        return(
            <View style={{height:64, backgroundColor:Util.detailBackgroundGray}}>
                <View style={{height:56, backgroundColor:'#3aa4ff', flexDirection:'row', alignItems:'center'}}>
                    <Text style={{fontSize:17, color:'#fff', left:20}}>门店数：{this.state.stores.length}家</Text>
                    <TouchableOpacity onPress={this.goCreateShop.bind(this)} style={{position:'absolute', justifyContent:'center', width:90, height:30, right:10, borderRadius:15, backgroundColor:'#fff'}}>
                        <Text style={{color:Util.lybBlue, alignSelf:'center', fontSize:14}}>创建门店</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _keyExtractor = (item: Object, index: number) => {
        return index.toString();
    }

    render() {

        return(
            <SafeAreaView style = {{flex: 1}}>
                <View style={{height:100, flexDirection:'row',justifyContent:'space-around', alignItems:'center', backgroundColor:'#fff'}}>
                    <View style={{flex:1, alignSelf:'stretch', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity onPress={this.goQRCodeView.bind(this)}>
                            <Image source={{uri:'激活机器icon'}} style={{alignSelf:'center', width:33, height:33}}/>
                            <Text style={{fontSize:16, marginTop:8, color:'#333'}}>激活机器</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1, alignSelf:'stretch', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>this.goPriceSetupView()}>
                            <Image source={{uri:'收费设置icon'}} style={{alignSelf:'center', width:33, height:33}}/>
                            <Text style={{fontSize:16, marginTop:8, color:'#333'}}>收费设置</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height:8, backgroundColor:Util.detailBackgroundGray}}/>
                <View style={{flex:1}}>
                    <FlatList
                        ref='flatList'
                        refreshing={this.state.refreshing}
                        onRefresh={this.requestStores.bind(this, false)}
                        data={this.state.stores}
                        ListHeaderComponent={this._listHeader.bind(this)}
                        keyExtractor={this._keyExtractor}
                        ItemSeparatorComponent={this._renderSeparator}
                        renderItem={({item}) => <BoxShopCell boxShop={item} cellClickHandler={()=>this._cellClicked(item)}/>}
                    />
                </View>
            </SafeAreaView>
        )
    }

    _renderSeparator(){
        return(
            <View style={{height:1, backgroundColor:'#fff'}}>
                <View style={{height:1, backgroundColor:Util.detailBackgroundGray, marginLeft:20, width: Util.size.width-40}}></View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    let loginInfo = state.loginInfo
    return { loginInfo }
}

export default connect(
    mapStateToProps,
) (LYManagementView)

class BoxShopCell extends Component {

    constructor(props){
        super(props)
    }

    static propTypes = {
        boxShop: PropTypes.object.isRequired,
        cellClickHandler: PropTypes.func.isRequired
    }

    _cellClickHandler(){
        this.props.cellClickHandler()
    }

    render(){
        const titleColor = this.props.boxShop.is_defaultgroup === 1 ? 'red':'#333'
        return(
            <View style={{backgroundColor:'#fff'}}>
                <TouchableOpacity style={{height:56, flexDirection:'row', alignItems:'center'}} onPress={()=>this._cellClickHandler()}>
                    <Text style={{marginLeft:20, fontSize:16, color:titleColor}}>{this.props.boxShop.storename}</Text>
                    <Text style={{right:36, fontSize:14, color:'#999', position:'absolute'}}>{this.props.boxShop.machine_detail.length}台</Text>
                    <Image style={{right:20, position:'absolute', width:9, height:15}} source={{uri:'右箭头灰'}}/>
                </TouchableOpacity>
            </View>
        )
    }
}


