/**
 * Created by fy on 2018/3/16.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import ConsumerRecordItem from '../../components/ConsumerRecordItem';
import { Util } from '../../common/utils';


export class ConsumerRecord extends Component {

    static navigationOptions = ()=>{
        return{
            title:'账单详情'
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            consume: {}
        }
    }

    componentDidMount() {
        const { consume } = this.props.navigation.state.params
        this.setState({
            consume: consume
        })
    }

    render(){

        return(
            <View style={{flex:1, backgroundColor:'#fff'}}>
                {this._renderIncomeCount()}
                {this._renderIncomeDetail()}
            </View>
        )
    }

    _renderIncomeCount() {
        return(
            <View style={styles.incomeCountBox}>
                <Text style={styles.count}>+{this.state.consume.mount}</Text>
                <Text style={styles.statue}>{this.state.consume.status === 1 ? "交易成功":"未知状态"}</Text>
            </View>
        )
    }

    _renderIncomeDetail() {
        return(
            <View style={styles.incomeDetailBox}>
                {this._renderSepLine()}
                <ConsumerRecordItem title={"套餐信息："} detail={this.state.consume.description}/>
                {this._renderSepLine()}
                <ConsumerRecordItem title={"消费用户："} img={this.state.consume.picurl}/>
                <ConsumerRecordItem title={"付款信息："} detail={this.state.consume.order_type === 1 ? "微信支付":"未知方式"}/>
                <ConsumerRecordItem title={"创建时间："} detail={this.state.consume.pay_time}/>
            </View>
        )
    }

    _renderSepLine() {
        return(
            <View style={styles.sepLine}></View>
        )
    }


}



const styles = StyleSheet.create({
    incomeCountBox: {
        height:230*Util.unitWidth,
        alignItems:'center',
        justifyContent:'center'
    },
    count: {
        fontSize: 48,
        color:'#333'
    },
    statue: {
        fontSize:18,
        color:'#28b32c',
        marginTop: 20,
    },
    incomeDetailBox: {
        flex:1,
    },
    sepLine: {
        width: Util.size.width-40,
        marginLeft: 20,
        height:1,
        backgroundColor:Util.detailBackgroundGray,
    }
})