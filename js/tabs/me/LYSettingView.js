/**
 * Created by fy on 2018/4/3.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, StyleSheet, Button, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
// import * as CacheManager from 'react-native-http-cache'

import { LYSettingCell } from '../../components/LYSettingCell';
import { Util } from '../../common/utils';



class LYSettingView extends Component {

    constructor(props){
        super(props)
    }

    static navigationOptions = ({navigation, navigationOptions}) => {
        return{
            headerTitle:'设置',
        }
    }

    static propTypes = {

    }

    componentDidMount(){
        // console.log('内存大小\n', CacheManager.getCacheSize())
    }

    componentWillUnmount() {
        console.log('SettingView----WillUnmount')
    }

    dataSource2 = [
        {key:'1', value:{"title":"清理缓存", "info":"4.9M", "type":0}},
        // {key:'2', value:{"title":"关于乐野", "type":2}},
    ];

    render() {
        return(
            <ScrollView style={{flex:1}}>
                {this._renderTopList()}
                {/*{this._renderBottomList()}*/}
                {this._renderLogout()}
            </ScrollView>
        )
    }

    _renderTopList(){
        let recvaddress = this.props.merchantInfo.recvaddress || '未填写'
        let dataSource1 = [
            // {key:'3', value:{"title":"收货地址", "info": recvaddress, "type":0}},
            {key:'4', value:{"title":"修改登录密码", "type":2}},
        ];
        return(
            <FlatList
                style={styles.topList}
                data={dataSource1}
                renderItem={this._renderCell}
                ItemSeparatorComponent={this._renderSeparator}
            />
        )
    }

    _renderBottomList(){
        return(
            <FlatList
                style={styles.bottomList}
                data={this.dataSource2}
                renderItem={this._renderCell}
                ItemSeparatorComponent={this._renderSeparator}
            />
        )
    }

    _renderCell = ({item}) => {
        return(
            <LYSettingCell
                itemClickHandler={() => this._itemClicked(item)}
                leftTitle={item.value.title}
                rightInfo={item.value.info}
                type={item.value.type}/>
        )
    }

    _renderLogout(){
        return(
            <View style={styles.logOutBox}>
                <Button color={'red'} title="退出登录" onPress={()=>this.logOut()}/>
            </View>
        )
    }

    _renderSeparator(){
        return(
            <View style={styles.separator}></View>
        )
    }

    _itemClicked(item){

        let { merchantid } = this.props.merchantInfo
        if (item.value.title === '修改登录密码') {
            this.props.navigation.navigate('ResetPassword', {
                merchantid: merchantid,
            })
        }

        /* TEST */
        // let meKey = this.props.navigation.state.params.routeKey
        // let settingKey = this.props.navigation.state.key
        // console.log(settingKey, this.props.navigation)
        // if (item.value.title === '修改登录密码') {
        //     this.props.navigation.navigate('ResetPassword', {
        //         merchantid: merchantid,
        //         meKey: meKey,
        //         settingKey: settingKey
        //     })
        // }
    }

    logOut(){
        DeviceEventEmitter.emit('Logout')

        /* ====== TEST =====  */
        // let { routeKey } = this.props.navigation.state.params
        // console.log(routeKey)
        // let key = this.props.navigation.state.key
        // console.log(key)
        // this.props.navigation.goBack(key)
        // this.props.navigation.navigate('Login')
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'Login'})
            ]
        });
        this.props.navigation.dispatch(resetAction)

        // const { goBackKey } = this.props.loginInfo
        // console.log(123,goBackKey)
        // this.props.navigation.goBack(goBackKey)
        // this.props.navigation.popToRoute('Login')
        // this.props.navigation.replace('Me')
        console.log(this.props)
    }

}

function mapPropsToState(state) {
    let merchantInfo = state.merchantInfo.entity
    let loginInfo = state.loginInfo
    return { merchantInfo, loginInfo }
}

export default connect (
    mapPropsToState,
)(LYSettingView)

/* Styles ================================*/

const styles = StyleSheet.create({
    topList:{
        marginTop: 20,
        backgroundColor:'#fff'
    },
    bottomList:{
        marginTop: 10,
        backgroundColor:'#fff'
    },
    logOutBox: {
        marginTop:10,
        backgroundColor:'#fff',
        height: 46,
        alignItems:'center',
        justifyContent:'center'
    },
    separator:{
        marginLeft:20,
        width: Util.size.width-40,
        backgroundColor:Util.detailBackgroundGray,
        height: 2,
    }
})