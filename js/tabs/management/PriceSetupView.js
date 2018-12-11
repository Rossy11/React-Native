/**
 * Created by fy on 2018/3/22.
 */
import React, { Component } from 'react';
import { Text, View , TouchableOpacity, Image, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { Util } from '../../common/utils';

export class PriceSetupView extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
            title:'收费管理'
        }
    }

    constructor(props){
        super(props)
        this.state = {
            stores: [],
        }
    }

    componentDidMount(){
        const {params} = this.props.navigation.state;
        let storeInfos = params.stores;
        let newStores =  storeInfos.map((element, index) => {
            return {
                storeInfo:element,
                isShowSetupView: false, // 增加是否关闭标签的 flag
            }
        })
        this.setState({
            stores: newStores,
        })
    }

    render() {

        return(
            <View style={{flex:1}}>
                <FlatList
                    data={this.state.stores}
                    renderItem={this.renderCell}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        )
    }

    _foldHandler(item, itemIndex){

        let foldStores = this.state.stores.map((element, index) => {
            if(element.isShowSetupView) {
                element.isShowSetupView = false;
            }else {
                element.isShowSetupView = (itemIndex === index) ? true : false;
            }
            return element
        })


        this.setState({
            stores: foldStores,
        })
    }

    _setWorkdayPrice(item){
        this.props.navigation.navigate('ShopPriceSetup',{
            store: item,
            isHoliday: false,
        })
    }

    _setHolidayPrice(item){
        this.props.navigation.navigate('ShopPriceSetup',{
            store: item,
            isHoliday: true,
        })
    }

    renderCell =  ({item, index}) =>{
        return(
            <ShopPriceSetupCell
                foldHandler={()=>this._foldHandler(item, index)}
                shop={item}
                setWorkdayPrice={()=>this._setWorkdayPrice(item.storeInfo)}
                setHolidayPrice={() => this._setHolidayPrice(item.storeInfo)}/>
        )
    }

    _keyExtractor(item,index){
        return index.toString();
    }

}

class ShopPriceSetupCell extends Component {

    constructor(props){
        super(props)
        this.state = {
        }
    }

    static propTypes = {
        foldHandler: PropTypes.func.isRequired,
        shop: PropTypes.object.isRequired,
        setWorkdayPrice: PropTypes.func.isRequired,
        setHolidayPrice: PropTypes.func.isRequired,
    }

    _shopTitle(){
        imageFile = this.props.shop.isShowSetupView?{uri:'向下箭头'}:{uri:'右箭头灰'}
        return(
            <View style={{height:60, flexDirection:'row', marginTop:8, backgroundColor:'white'}}>
                <View style={{marginLeft:20, justifyContent:'center', width:Util.size.width-120}}>
                    <Text style={{fontSize:16, color:'#333'}}>{ this.props.shop.storeInfo.storename }</Text>
                    <Text style={{fontSize:12, color:'#999', marginTop:4}}>{this.props.shop.storeInfo.priceType?this.props.shop.shopInfo.priceType:'系统默认收费'}</Text>
                </View>
                <TouchableOpacity style={{flexDirection:'row', alignItems:'center', flex:1}} onPress={()=>this._foldPriceSetupView()}>
                    {
                        this.props.shop.isShowSetupView?
                            <Image source={imageFile} style={{position:'absolute', right:10, width:15, height:9}}/>:
                            <Image source={imageFile} style={{position:'absolute', right:10, width:9, height:15}}/>
                    }
                </TouchableOpacity>
            </View>
        )
    }

    _itemSetPriceHandler(index){
        if(index == 0) {
            this.props.setWorkdayPrice()
        }else {
            this.props.setHolidayPrice()
        }

    }

    _priceSetupView(){
        return(
            <View style={{backgroundColor:'#fff'}}>
                <View style={{height:40, backgroundColor:Util.lybBlue, justifyContent:'center'}}>
                    <Text style={{marginLeft:20, color:'#fff', fontSize:16}}>收费设置</Text>
                </View>
                <View style={{height:50, flexDirection:'row', backgroundColor:'white'}}>
                    <View style={{marginLeft:20, justifyContent:'center', width:Util.size.width-120}}>
                        <Text style={{fontSize:16, color:'#333'}}>工作日</Text>
                        <Text style={{fontSize:12, color:'#999', marginTop:4}}>(周一至周五，法定节假日除外)</Text>
                    </View>
                    <TouchableOpacity style={{flexDirection:'row', alignItems:'center', flex:1}} onPress={()=>this._itemSetPriceHandler(0)}>
                        <Text style={{right:25, position:'absolute', fontSize:14, color:'#999'}}>去设置</Text>
                        <Image source={{uri:'右箭头灰'}} style={{right:10, position:'absolute', width:9, height:15}}/>
                    </TouchableOpacity>
                </View>
                <View style={{marginLeft:20, width:Util.size.width-30, height:2, backgroundColor:Util.detailBackgroundGray}}></View>
                <View style={{height:50, flexDirection:'row', backgroundColor:'white'}}>
                    <View style={{marginLeft:20, justifyContent:'center', width:Util.size.width-120}}>
                        <Text style={{fontSize:16, color:'#333'}}>节假日</Text>
                        <Text style={{fontSize:12, color:'#999', marginTop:4}}>(周六、周日及法定节假日)</Text>
                    </View>
                    <TouchableOpacity style={{flexDirection:'row', alignItems:'center', flex:1}} onPress={()=>this._itemSetPriceHandler(1)}>
                        <Text style={{right:25, position:'absolute', fontSize:14, color:'#999'}}>去设置</Text>
                        <Image source={{uri:'右箭头灰'}} style={{right:10, position:'absolute', width:9, height:15}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _foldPriceSetupView(){
        this.props.foldHandler()
    }


    render() {
        return(
            <View>
                {this._shopTitle()}
                {(this.props.shop.isShowSetupView ? this._priceSetupView() : null)}
            </View>
        )
    }

}