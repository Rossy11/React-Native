/**
 * Created by fy on 2018/5/2.
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import { Util } from '../common/utils'

export default class LYIndicatorView extends React.Component {

    static propTypes = {
        message: PropTypes.string.isRequired
    }

    componentDidMount() {

    }

    render() {
        return(
            <View style={styles.indicatorContainer}>
                <Text style={styles.message}>{this.props.message}</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    indicatorContainer: {
        position:'absolute',
        marginTop:200,
        marginLeft:50,
        width: Util.size.width-100,
        height:80,
        backgroundColor:'#999',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        opacity:0.8
    },
    hideContainer: {
        height:0,
    },
    message: {
        width: Util.size.width-160,
        textAlign:'center',
        color:'#fff',
        fontSize:16
    }
})

function LYIndicatorHandler() {
    return(
        <LYIndicatorView/>
    )
}