/**
 * Created by fy on 2018/4/18.
 */
import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Util } from '../../common/utils'

export default class MonthItem extends React.Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        year: PropTypes.string.isRequired,
        month: PropTypes.string.isRequired,
        income: PropTypes.number.isRequired,
        isOpen: PropTypes.bool.isRequired,
        arrowClickHandle: PropTypes.func.isRequired,
    }

    static defaultProps = {
        year:'--',
        month:'--',
        income:0,
        isOpen:false
    }

    render() {
        const upArrow = {uri:'向上箭头'}
        const downArrow = {uri:'向下箭头'}
        const date = this.props.year + '年' +this.props.month + '月'
        const income = '月营收：￥' + this.props.income
        return (
            <View style={styles.box}>
                <Text style={this.props.isOpen ? styles.monthSelected : styles.month}>{date}</Text>
                <TouchableOpacity style={styles.incomeContainer} onPress={this.arrowClicked.bind(this)}>
                    <Text style={styles.income}>{income}</Text>
                    <Image style={styles.arrowBtn} source={this.props.isOpen ? upArrow : downArrow}/>
                </TouchableOpacity>
            </View>
        )
    }

    arrowClicked() {
        this.props.arrowClickHandle()
    }
}

const styles = StyleSheet.create({
    box: {
        height: 38,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderTopWidth:1,
        borderColor:'#ddd'
    },
    month: {
        marginLeft: 20,
        color:'#333',
        fontSize:16
    },
    monthSelected: {
        marginLeft: 20,
        color: Util.lybBlue,
        fontSize:16
    },
    incomeContainer:{
        position:'absolute',
        right:0,
        width:140,
        flexDirection:'row',
        alignItems:'center'
    },
    income: {
        fontSize: 14,
        color:'#999'
    },
    arrowBtn: {
        position:'absolute',
        right: 10,
        width:16,
        height:8,
    }
})