/**
 * Created by fy on 2018/3/14.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';
import { Util } from '../../common/utils';
import { ProductDetailView } from './ProductDetailView';
import PropTypes from 'prop-types'

class LYMallView extends Component {

    static navigationOptions = ({navigation}) => {
        return{
            headerTitle: '商店',
            tabBarVisible: true,
            tabBarOnPress: (e)=>{
                if (e.scene.focused) {
                    navigation.state.params.tabItemReclicked()
                }
                e.jumpToIndex(e.scene.index)
            }
        }
    }

    constructor(props){
        super(props)
        this.state = {
            productList: [],
            refreshing: false,
        }
    }

    componentDidMount(){
        this.requestData()
        this.props.navigation.setParams({
            tabItemReclicked: this.requestData.bind(this)
        })
    }

    requestData = async () => {
        this.setState({
            refreshing: true
        })
        try {
            let response = await fetch('http://14.119.109.232:30666/center/shop/?cmd=query_product&merchantid=3')
            let json = await response.json()
            if(json.status === 1) {
                console.log(json.result)
                this.setState({
                    productList:json.result,
                    refreshing: false
                })
            }
        } catch (error) {
            console.log('请求失败')
            this.setState({
                refreshing: false
            })
        }
    }

    _renderCell(item){
        return(
            <ProductCell product={item} itemClickHandler={() => this.productItemClicked(item)}></ProductCell>
        )
    }

    productItemClicked(item){
        this.props.navigation.navigate('ProductDetail',{
            productModel: item
        })
    }

    _keyExtractor = (item: Object, index: number) => {
        return item.productid.toString()
    }

    render() {
        return(
            <View style={{flex:1, backgroundColor: '#fff'}}>
                <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this.requestData.bind(this)}
                    style={{flex:1}}
                    keyExtractor={this._keyExtractor}
                    data={this.state.productList}
                    renderItem={({item}) => this._renderCell(item)}
                >
                </FlatList>

            </View>
        )
    }
}

class ProductCell extends Component {

    constructor(props){
        super(props)
    }

    static propTypes = {
        product: PropTypes.object.isRequired,
        itemClickHandler: PropTypes.func.isRequired,
    }

    _itemClickHandler(){
        this.props.itemClickHandler()
    }
    render() {
        return(
            <View style={styles.view1}>
                <View style={styles.view2}>
                    <TouchableOpacity onPress={() => this._itemClickHandler()} >
                        <Image style={styles.img1} source={{uri:this.props.product.picurl}}/>
                        <View style={styles.view3}>
                            <Text style={styles.text1}>{this.props.product.name}</Text>
                            <Text style={styles.text2}>￥ {this.props.product.price}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view1: {
        height: 240,
    },
    view2: {
        marginTop: 20,
        flex:1,
        marginLeft: 18,
        width:Util.size.width-36,
        borderRadius:5,
        shadowOffset: {width:5, height:5},
        shadowColor: Util.detailBackgroundGray,
        shadowOpacity:1
    },
    img1: {
        height:150,
        width:Util.size.width-36,
        borderRadius:5
    },
    view3: {
        height: 70
    },
    text1: {
        marginLeft:8,
        marginTop: 8,
        fontSize:16,
        color:'#333'
    },
    text2: {
        marginLeft:8,
        marginTop: 12,
        fontSize:18,
        color:'#ff1c4c'
    }

})


class ProductModel {
    constructor(description, price, picurl, name, productid, detail_picurl){
        this.description = description;
        this.price = price;
        this.picurl = picurl;
        this.name = name;
        this.productid = productid;
        this.detail_picurl = detail_picurl;
    }
}


export default LYMallStack = StackNavigator(
    {
        Mall: {
            screen: LYMallView,
        },
        ProductDetail: {
            screen: ProductDetailView,
        }
    },
    {
        navigationOptions: {
            tabBarVisible: false,
            headerTintColor: '#fff',
            headerBackground: <Image style={{width: Util.size.width, height: Util.iPhoneSize.topHeight+Util.iPhoneSize.bangHigher}} resizeMode='stretch' source={{uri:'nav_header_background'}}/>
        }
    }
);