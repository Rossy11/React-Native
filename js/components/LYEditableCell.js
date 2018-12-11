/**
 * Created by fy on 2018/5/3.
 */
import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import PropTypes from 'prop-types'

import { Util } from '../common/utils'

export default class LYEditableCell extends React.Component {


    constructor(props) {
        super(props)
    }

    static propTypes = {
        title: PropTypes.string,
        detail: PropTypes.string,
        isEditing: PropTypes.bool.isRequired,
        detailChanged: PropTypes.func,
        maxLength: PropTypes.number
    }


    changeTextHandle(value){
        this.setState({
            detail:value
        })
        this.props.detailChanged(value)
    }



    render() {

        let length = this.props.maxLength || 20

        return(
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.title}</Text>
                {
                    this.props.isEditing ?
                        <View style={styles.inputContainer}>
                            <TextInput onChangeText={(value) => {this.changeTextHandle(value)}} value={this.props.detail} style={styles.detailTextInput} maxLength={length} clearButtonMode={'while-editing'}></TextInput>
                        </View>
                        :<Text style={styles.detailText}>{this.props.detail}</Text>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fff',
        height: 49,
        flexDirection:'row',
        alignItems:'center'
    },
    title:{
        marginLeft:20,
        color:'#333',
        fontSize:16,
    },
    detailText:{
        fontSize:14,
        color:'#999',
        position:'absolute',
        right:20,
    },
    inputContainer:{
        position:'absolute',
        right:20,
        width:100,
        borderWidth:1,
        borderColor:Util.detailBackgroundGray,
        height: 28,
        justifyContent:'center'
    },
    detailTextInput:{
        fontSize:14,
        color:'#999',
        marginLeft:5
    }
})