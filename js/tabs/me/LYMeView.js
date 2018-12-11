/**
 * Created by fy on 2018/3/14.
 */
import React, { Component } from 'react';
import { View, ActivityIndicator, Text, TextInput, Button, TouchableOpacity, ScrollView, Image, StatusBar, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Util } from '../../common/utils';
import fetchMerchantInfo from '../../action/merchantinfo'

let headBoxWidth = 130/375*Util.size.width
let headBoxMarginTop = 68/375*Util.size.width

class LYMeView extends Component {

    static navigationOptions = {
        header: ({navigation}) => {
            console.log(navigation)
            return null
        },
        tabBarVisible: true
    }

    constructor(props){
        super(props)
        this.loginInfo = props.loginInfo
    }

    componentDidMount(){
        const { merchantid } = this.loginInfo.entity
        this.props.fetchMerchantInfo(merchantid)
    }

    render() {
        let merchantInfo = this.props.merchantInfo.entity
        this.merchantInfo = merchantInfo
        return(
            <View style={{flex:1, backgroundColor:"#fff"}}>
                {this.renderHeader()}
                {/*{this.renderSections()}*/}
            </View>
        )
    }

    // 头部视图
    renderHeader(){
        return(
            <View>
                <ImageBackground style={{width: Util.size.width, height:200/667*Util.size.height}} resizeMode='stretch' source={{uri:'我的背景'}}>
                    <TouchableOpacity style={styles.setting} onPress={() => this.navigateSetting()}>
                        <Image source={{uri:'设置icon'}} style={{width:24, height:24}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userInfo} onPress={() => this.navigateUserInfo()}>
                        <Image source={{uri:'头像未登录'}} style={{width:79, height:79}}/>
                        <Text numberOfLines={1} style={styles.userName}>{this.merchantInfo.merchantname}</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )
    }

    renderSections(){
        return(
            <View style={styles.bottomContainer}>
                <View style={styles.sectionBox}>
                    <TouchableOpacity onPress={() => this.shoppingCarHandle()}>
                        <Image source={{uri:'购物车icon蓝'}} style={{width:27, height:24}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.sectionText}>购物车</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.sectionBox}>
                    <TouchableOpacity onPress={(e) => this.orderHandle(e)}>
                        <Image source={{uri:'订单icon'}} style={{width:21, height:29}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.sectionText}>订单</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.sectionBox}>
                    <TouchableOpacity onPress={() => this.messageHandle('123')}>
                        <Image source={{uri:'消息通知icon'}} style={{width:32, height:26}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.sectionText}>消息通知</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    navigateUserInfo(){
        this.props.navigation.navigate('UserInfo')
    }
    navigateSetting(){

        this.props.navigation.navigate('Setting')

        /* test */
        // let routeKey = this.props.navigation.state.key
        // this.props.navigation.navigate('Setting', {
        //     routeKey: routeKey
        // })
    }

    shoppingCarHandle() {
    }

    orderHandle(e) {
    }

    messageHandle(param) {
        console.log(this.props,11234,param)
    }

}

function mapStateToProps(state) {
    const { merchantInfo, loginInfo } = state
    return {
        merchantInfo,
        loginInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMerchantInfo: bindActionCreators(fetchMerchantInfo, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LYMeView)

const styles = StyleSheet.create({
    setting: {
        marginTop: 30,
        right:14,
        position:'absolute'
    },
    userInfo: {
        marginTop:headBoxMarginTop,
        height:headBoxWidth,
        width: headBoxWidth,
        alignSelf:'center',
        alignItems:'center'
    },
    userName:{
        backgroundColor:'rgba(0,0,0,0)',
        fontSize: 16,
        color:'#fff',
        marginTop:10,
    },
    bottomContainer: {
        height:88,
        flexDirection:'row'
    },
    sectionBox: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    sectionText: {
        marginTop:8,
        fontSize: 12,
        color:'#333'
    }
})