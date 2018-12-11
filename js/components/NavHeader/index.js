
/**
 * Created by fy on 2018/4/16.
 */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'

export default class NavHeader extends Component {

    static propTypes = {
        navTitle: PropTypes.string.isRequired,
        leftBtnHandle: PropTypes.func.isRequired,
    }

    _leftBtnHandle() {
        this.props.leftBtnHandle()
    }

    render() {
        return(
            <View style={styles.nav}>
                <TouchableOpacity style={styles.backBox} onPress={this._leftBtnHandle.bind(this)}>
                    <Image source={{uri:'左箭头'}} style={{width:9, height:16}}></Image>
                </TouchableOpacity>
                <Text style={styles.navTitle}>{this.props.navTitle}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    nav:{
        height: 25,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    backBox: {
        position:'absolute',
        width: 40,
        left:0,
        justifyContent: 'center',
        alignItems: 'center',
        height:25,
    },
    navTitle:{
        color:'#fff',
        fontSize: 18,
        fontWeight:'bold',
        backgroundColor:'rgba(0,0,0,0)'
    }
})