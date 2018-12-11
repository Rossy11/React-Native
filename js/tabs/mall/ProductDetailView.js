/**
 * Created by fy on 2018/4/2.
 */
import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Button, StyleSheet } from 'react-native'
import Swiper from 'react-native-swiper'
import { Util } from '../../common/utils'

const swiperHeight = 296*Util.size.width/375

export class ProductDetailView extends Component {

    _swiperPicUris = []

    _productDetail = null

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
            headerTitle:navigation.state.params.productModel.name
        }
    }

    render() {

        const { params } = this.props.navigation.state;
        this._swiperPicUris = params.productModel.detail_picurl
        this._productDetail = params.productModel

        return(
            <View style={{flex:1, backgroundColor:'#ddd'}}>
                {this._renderProductScrollView()}
                {/*{this._renderBottomButton()}*/}
            </View>
        )
    }

    _renderProductScrollView(){
        return(
            <View style={{height:Util.size.height-64, width:Util.size.width}}>
                <ScrollView style={{height:Util.size.height-64, width:Util.size.width}}>
                    {this._renderSwiper()}
                    {this._renderMiddleView()}
                    {this._renderProductIntroduction()}
                </ScrollView>
            </View>
        )
    }

    _renderSwiper(){
        const detailImages = this._swiperPicUris.map((ele, index) => {
            return(
                <Image key={index} source={{uri:ele}} style={styles.introImg}/>
            )
        })
        return(
            <Swiper
                height={swiperHeight} showsButtons={false} autoplay={true}
                activeDot={<View style={{backgroundColor:Util.lybBlue, width:8, height:8, borderRadius:8, marginTop:10, marginLeft:10, marginRight:10, marginBottom:10}}></View>}
            >
                {detailImages}
            </Swiper>
        )
    }

    _renderMiddleView(){
        return(
            <View style={{height: 110, backgroundColor:'#f5f5f5'}}>
                <View style={{height: 61, backgroundColor:'#fff'}}>
                    <Text style={styles.price}>￥ {this._productDetail.price}</Text>
                    <View style = {styles.nameContainer}>
                        <Text style={styles.name}>{this._productDetail.name}</Text>
                        <Text style={styles.salesVolume}>月销100笔</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <View style = {styles.productTypeContainer}>
                        <Text style={styles.productTypeTitle}>请选择 套餐分类</Text>
                        <Image style={styles.productTypeArrow} source={{uri:'右箭头灰'}}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _renderProductIntroduction(){
        const intorImages = this._swiperPicUris.map((ele, index) => {
            return(
                <Image key={index} style={styles.introImg} source={{uri:ele}}/>
            )
        })
        return(
            <View style={{backgroundColor:'#fff'}}>
                <View style = {styles.introContainer}>
                    <Image/>
                    <Text style={styles.introTitle}>产品介绍</Text>
                    <Image/>
                </View>
                <View>
                    {intorImages}
                </View>
            </View>
        )
    }


    _renderBottomButton(){
        return(
            <View style={styles.bottomContainer}>
                <View style={styles.leftButtonBox}>
                    <Button color={'#fff'} title="加入购物车" onPress={() => this._addShopCar()}/>
                </View>
                <View style={styles.rightButtonBox}>
                    <Button color={'#fff'} title="直接购买" onPress={() => this._buyProduct()}/>
                </View>
            </View>
        )
    }

    _addShopCar(){

    }

    _buyProduct(){

    }

}

/* StyleSheet ================================================*/

const styles = StyleSheet.create({

    price:{
        marginLeft:8,
        marginTop:6,
        fontSize: 18,
        color:'#ff1c4c',
    },
    nameContainer:{
        marginTop:8,
        height:18,
        flexDirection:'row',
    },
    name:{
        marginLeft:8,
        fontSize:16,
        color:'#333',
    },
    salesVolume:{
        fontSize:12,
        color:'#999',
        right:8,
        bottom:2,
        position:'absolute',
    },
    productTypeContainer:{
        height:32,
        marginTop:8,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
    },
    productTypeTitle:{
        marginLeft:8,
        fontSize:12,
        color:'#333',
    },
    productTypeArrow:{
        right: 24,
        position:'absolute',
        width:9,
        height:15,
    },
    introImg:{
        height:swiperHeight,
        width:Util.size.height,
    },
    introContainer:{
        height: 32,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    introTitle:{
        fontSize:12,
        color:'#999',
    },
    bottomContainer: {
        flex:1,
        flexDirection:'row',
    },
    leftButtonBox:{
        flex:1,
        width:Util.size.width/2,
        backgroundColor:'orange',
        justifyContent:'center',
    },
    rightButtonBox: {
        flex:1,
        width:Util.size.width/2,
        backgroundColor:Util.lybBlue,
        justifyContent:'center',
    }

})