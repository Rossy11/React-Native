/**
 * Created by fy on 2018/4/26.
 */
import React from 'react'
import { View, TextInput, Button, Picker } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import fetchMerchantInfo from '../../action/merchantinfo'
import * as ModifyType from '../../static/ModifyInfoType'

import { API_MACHINE_INFO, API_MERCHANT_INFO } from '../../network/LY_API'
import { LYFetchRequest } from '../../network/LYHttpHelper'

import { Util } from '../../common/utils'
import LYIndicator from '../../components/LYIndicatorView'
import {IncomeCalendar} from "../income/IncomeCalendar";


class ModifyInfoView extends React.Component {

    static navigationOptions({navigation, navigationOptions}) {
        const { state } = navigation
        let title = ''
        switch (state.params.type) {
            case ModifyType.MODIFY_MACHINE_NAME:
                title = '修改机器名称'
                break
            case ModifyType.MODIFY_MERCHANT_NAME:
                title = '修改姓名'
                break
            case ModifyType.MODIFY_MERCHANT_SEX:
                title = '修改性别'
                break
            case ModifyType.MODIFY_MERCHANT_IDCARD:
                title = '修改身份证号'
                break
            case ModifyType.MODIFY_MERCHANT_MOBILE:
                title = '修改手机号码'
                break
            case ModifyType.MODIFY_MERCHANT_BANKCARD:
                title = '修改银行卡号'
                break
            case ModifyType.MODIFY_MERCHANT_AREA:
                title = '修改地区'
                break
            default :
                break
        }

        return{
            title:title,
            headerRight: (
                state.params.isShowDoneBtn
                    ? <Button title="确定" onPress={state.params.doneButtonHandle} color={'#fff'} />
                    : null
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            showIndicator: false,
            indicatorMsg: '',
            info:''
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state
        this.info = params.originInfo
        this.setState({
            info: params.originInfo
        })
        this.props.navigation.setParams({
            doneButtonHandle: this.doneButtonHandle
        })
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
        console.log('Modify---WillUnmount')
    }

    render() {
        return(
            <View style={{flex:1}}>
                <View style={{height:40, marginTop:10, backgroundColor:'#fff', justifyContent:'center'}}>
                    <TextInput
                        style={{marginLeft:10, width: Util.size.width-20}}
                        clearButtonMode={'while-editing'}
                        maxLength={16}
                        onChangeText={(e) => this.changeTextHandle(e)} value={this.state.info}/>
                </View>
                {
                    this.state.showIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null
                }
            </View>
        )
    }

    changeTextHandle(e) {
        this.info = e
        this.props.navigation.setParams({isShowDoneBtn: e.trim() ? true : false})

    }

    doneButtonHandle = () => {


        let modifyType = this.props.navigation.state.params.type

        // 判断修改类型
        switch(modifyType){
            case ModifyType.MODIFY_MACHINE_NAME:
                this.modifyMachineName()
                break
            case ModifyType.MODIFY_MERCHANT_NAME:
            case ModifyType.MODIFY_MERCHANT_AREA:
            case ModifyType.MODIFY_MERCHANT_BANKCARD:
            case ModifyType.MODIFY_MERCHANT_MOBILE:
            case ModifyType.MODIFY_MERCHANT_IDCARD:
            case ModifyType.MODIFY_MERCHANT_SEX:
                this.modifyMerchantInfo()
                break
            default:
                return
        }
    }

    modifyMachineName() {
        let {params} = this.props.navigation.state
        let url = `${API_MACHINE_INFO}${params.MachineId}/`

        let inputString = this.info
        inputString = inputString.trim()

        let bodyObj = {}
        bodyObj.MACHINE_NAME = inputString


        LYFetchRequest(url, null, 'PATCH', bodyObj)
            .then(json => {
               this.modifySucceed('BOX')
            })
            .catch(err => console.log(123,err))
    }

    modifyMerchantInfo() {

        let merchantId = this.props.merchantInfo.merchantid
        let url = `${API_MERCHANT_INFO}${merchantId}/`
        let bodyObj = {}
        let inputString = this.info
        inputString = inputString.trim()

        let modifyType = this.props.navigation.state.params.type

        switch(modifyType) {
            case ModifyType.MODIFY_MERCHANT_NAME:
                bodyObj.merchantname = inputString
                break
            case ModifyType.MODIFY_MERCHANT_AREA:
                bodyObj.area = inputString
                break
            case ModifyType.MODIFY_MERCHANT_BANKCARD:
                bodyObj.bankcard = inputString
                break
            case ModifyType.MODIFY_MERCHANT_MOBILE:
                bodyObj.mobile = inputString
                break
            case ModifyType.MODIFY_MERCHANT_IDCARD:
                bodyObj.IDcard = inputString
                break
            case ModifyType.MODIFY_MERCHANT_SEX:
                bodyObj.sex = (inputString === '男' ? 1 : 0)
                break
            default:
                return
        }

        LYFetchRequest(url,null,'PATCH',bodyObj).then(json => {
            this.modifySucceed('MERCHANT')
        }).catch(err => {
            console.log(123,err.message)
        })
    }

    // 修改后 显示提示信息 发送回调 回到之前的页面
    modifySucceed(type) {
        this.setState({
            showIndicator: true,
            indicatorMsg: '修改成功'
        })
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.setState({
                showIndicator: false
            })

            if (type === 'MERCHANT') {
                this.props.fetchMerchantInfo(this.props.merchantInfo.merchantid)
            } else if (type === 'BOX') {
                this.props.navigation.state.params.modifyCallback()
            }

            this.props.navigation.pop()
        }, 1000)
    }


}

function mapStateToProps(state) {
    let merchantInfo = state.merchantInfo.entity
    return { merchantInfo }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMerchantInfo : bindActionCreators(fetchMerchantInfo, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModifyInfoView)