/**
 * Created by fy on 2018/5/7.
 */
import React from 'react'
import { Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Util } from '../../common/utils'

export default class ModifyStoreCell extends React.Component {

    static propTypes = {
        isCreateStore: PropTypes.bool.isRequired,
        store: PropTypes.object,
        itemClickHandler: PropTypes.func
    }

    render() {
        var title = this.props.isCreateStore ? '新建门店' : this.props.store.storename
        var titleStyle = styles.title
        if (this.props.store && this.props.store.is_defaultgroup === 1) {
            titleStyle = styles.titleRed
        }
        return(
            <View style={styles.itemContainer}>
                <TouchableOpacity style={styles.touchOpacity} onPress={() => this.itemClicked()}>
                    <Text style={titleStyle}>{title}</Text>
                    {
                        this.props.isCreateStore
                            ? <Image style={styles.img} source={{uri:'添加'}}/>
                            : null
                    }
                </TouchableOpacity>
            </View>
        )
    }

    itemClicked() {
        this.props.itemClickHandler()
    }

}

const styles = StyleSheet.create({
    itemContainer:{
        backgroundColor:'#fff'
    },
    touchOpacity:{
        height:35,
        flexDirection:'row',
        alignItems:'center'
    },
    title:{
        fontSize:16,
        color:'#333',
        marginLeft:30
    },
    titleRed:{
        fontSize:16,
        color:'red',
        marginLeft:30
    },
    img:{
        position:'absolute',
        right:24,
        width:20,
        height:20
    },
})