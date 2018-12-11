/**
 * Created by fy on 2018/4/16.
 */
import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default class ConsumerRecordItem extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        detail: PropTypes.string,
        img: PropTypes.string
    }

    render() {
        console.log(this.props.img)
        return(
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.title}</Text>
                {
                    this.props.img ? <Image style={styles.img} source={{uri:this.props.img}}></Image>
                        : <Text style={styles.detail}>{this.props.detail}</Text>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        height: 50,
        alignItems:'center',
        flexDirection:'row'
    },
    title: {
        fontSize: 16,
        color:'#999',
        width:82,
        marginLeft: 20,
    },
    detail: {
        marginLeft:10,
        fontSize: 16,
        color:'#333'
    },
    img: {
        marginLeft:10,
        width: 30,
        height: 30,
        borderRadius: 15,
    }
})