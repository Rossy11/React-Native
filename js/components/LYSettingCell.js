/**
 * Created by fy on 2018/4/3.
 */
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types'

if(typeof LYSettingCellType == 'undefined') {
    var LYSettingCellType = {};
    LYSettingCellType.info = 0;
    LYSettingCellType.button = 1;
    LYSettingCellType.info_button = 2;
    LYSettingCellType.edit = 3;
    LYSettingCellType.none = 4;
}

export class LYSettingCell extends Component {

    _rightInfoRightEdge = 20;

    constructor(props) {
        super(props);
        this.state = {
            rightInfo: props.rightInfo
        };
        if(props.type === 2) {
            this._rightInfoRightEdge = 38;
        }
    }

    static propTypes = {
        height: PropTypes.number,
        leftTitle: PropTypes.string,
        rightInfo: PropTypes.string,
        itemClickHandler: PropTypes.func.isRequired,
        type: PropTypes.number.isRequired,
    };

    render(){
        let cellHeight = 44;
        if(this.props.height !== undefined) {
            cellHeight = this.props.height
        }
        return(
            <View style={[styles.container, {height: cellHeight}]}>
                {this.renderLeftTitle()}
                {this.renderRightInfo()}
                {this.renderRightImage()}
            </View>
        )
    }

    renderLeftTitle(){
        return(
            <Text style={styles.leftTitle}>{this.props.leftTitle}</Text>
        )
    }

    renderRightInfo(){
        if(this.props.type === 0 || this.props.type === 2 || this.props.type === 3) {
            let rightInfoStyle = styles.rightInfo1;
            if(this.props.type === LYSettingCellType.info_button) {
                rightInfoStyle = styles.rightInfo2;
            }
            return(
                <TouchableOpacity style={rightInfoStyle} onPress={() => this._itemClickHandler()}>
                    <Text style={styles.rightText}>{this.props.rightInfo}</Text>
                </TouchableOpacity>
            )
        }else {
            return null
        }
    }

    renderRightImage() {
        console.log(this.props.type)
        if(this.props.type === 1 || this.props.type === 2) {
            return(
                <TouchableOpacity style={styles.rightImage} onPress={() => this._itemClickHandler()}>
                    <Image source={{uri:'右箭头灰'}} style={{width:9, height:15}}/>
                </TouchableOpacity>
            )
        }else {
            return null
        }
    }

    _itemClickHandler(){
        this.props.itemClickHandler()
    }

}

/* Styles =====================*/
const styles = StyleSheet.create({

    container: {
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    leftTitle: {
        fontSize:16,
        color: '#333',
        marginLeft: 21,
    },
    rightImage: {
        position: 'absolute',
        right: 20,
    },
    rightInfo1: {
        position:'absolute',
        right:20,
    },
    rightInfo2: {
        position:'absolute',
        right:38,
    },
    rightText: {
        color:'#999',
        fontSize:14,
    }

});