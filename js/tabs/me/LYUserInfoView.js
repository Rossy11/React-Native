/**
 * Created by fy on 2018/4/3.
 */
"use strict";

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { LYSettingCell } from '../../components/LYSettingCell';
import { Util } from '../../common/utils';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ModifyType from '../../static/ModifyInfoType'
import fetchMerchantInfo from '../../action/merchantinfo'

const HEADER_HEIGHT = 200/667*Util.size.height,
    USER_IMG_SIZE = 66/375*Util.size.width,
    USER_IMG_MARGIN_TOP = 44/375*Util.size.width;

class LYUserInfoView extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
            // headerTitle:'个人资料',
            header: null,
            tabBarVisible: true
        }
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.getData()
    }

    componentWillUnmount() {
        console.log('UserInfoView----WillUnmount')
    }

    getData() {
        let {merchantid} = this.props.loginInfo
        this.props.fetchMerchantInfo(merchantid)
    }

    configDataSource() {
        const  merchantInfo = this.props.merchantInfo.entity
        const {merchantname, sex, IDcard, mobile, bankcard, area } = merchantInfo
        let gender = (sex === 1 ? '男' : '女')
        let bCard = bankcard || '未绑定'
        return [
            {key:'1', value:{"title":"姓名", "info": merchantname, "type":2}},
            {key:'2', value:{"title":"性别", "info": gender, "type":2}},
            {key:'3', value:{"title":"身份证", "info": IDcard, "type":2}},
            {key:'4', value:{"title":"手机", "info": mobile, "type":2}},
            {key:'5', value:{"title":"银行卡", "info": bCard, "type":2}},
            {key:'6', value:{"title":"地区", "info": area, "type":2}},
        ];

    }

    render() {
        return(
            <View style={{flex:1}}>
                {this.renderInfoList()}
            </View>
        )
    }

    renderInfoList() {
        const dataSource = this.configDataSource()
        return(
            <FlatList
                ListHeaderComponent={this.renderHeader.bind(this)}
                refreshing={this.props.merchantInfo.isFetching}
                onRefresh={this.getData.bind(this)}
                style={styles.list}
                data={dataSource}
                renderItem={this._renderItem}
                ItemSeparatorComponent = {this._renderItemSeparator}
            />
        )
    }

    renderHeader() {
        return(
            <ImageBackground source={{uri:'我的背景'}} style={styles.header}>
                <TouchableOpacity onPress={this.navigateSetting.bind(this)} style={{marginTop: 30, right:14, position:'absolute'}}>
                    <Image source={{uri:'设置icon'}} style={{width:24, height:24}}/>
                </TouchableOpacity>
                <Image style={styles.headerImage} source={{uri:'头像未登录'}}/>
                <Text style={styles.headerName}>投资人</Text>
            </ImageBackground>
        )
    }

    _renderItem = ({item}) => {
        return(
            <LYSettingCell
                rightInfo={item.value.info}
                itemClickHandler={()=>this.cellClickHandler(item)}
                leftTitle={item.value.title}
                type={item.value.type}/>
        )
    }

    _renderItemSeparator(){
        return(
            <View style={styles.separator}></View>
        )
    }

    navigateSetting() {
        this.props.navigation.navigate('Setting')
    }

    cellClickHandler(item){
        console.log(item)
        let type = ''
        console.log(item.value.title)
        switch (item.value.title) {
            case '姓名':
                type = ModifyType.MODIFY_MERCHANT_NAME
                break
            case '性别':
                type = ModifyType.MODIFY_MERCHANT_SEX
                break
            case '身份证':
                type = ModifyType.MODIFY_MERCHANT_IDCARD
                break
            case '手机':
                type = ModifyType.MODIFY_MERCHANT_MOBILE
                break
            case '银行卡':
                type = ModifyType.MODIFY_MERCHANT_BANKCARD
                break
            case '地区':
                type = ModifyType.MODIFY_MERCHANT_AREA
                break
            default:
                return
        }
        this.props.navigation.navigate('Modify', {
            type: type,
            originInfo: item.value.info
        })

    }

}

function mapStateToProps(state) {
    let merchantInfo = state.merchantInfo
    let loginInfo = state.loginInfo.entity
    return { merchantInfo, loginInfo }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMerchantInfo: bindActionCreators(fetchMerchantInfo, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (LYUserInfoView)

/* Styles =========================*/

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        alignItems:'center',
    },
    headerImage: {
        marginTop: USER_IMG_MARGIN_TOP,
        width: USER_IMG_SIZE,
        height: USER_IMG_SIZE,
        borderRadius: USER_IMG_SIZE/2,
        borderWidth: 3,
        borderColor: '#c1f6fe',
    },
    headerName: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
        backgroundColor:'rgba(0,0,0,0)'
    },
    list: {
        // backgroundColor:'#fff'
    },
    separator: {
        width: Util.size.width - 40,
        marginLeft: 20,
        height:1,
        backgroundColor: Util.detailBackgroundGray,
    }

})