/**
 * Created by fy on 2018/5/7.
 */
import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import ModifyStoreCell from './ModifyStoreCell'
import { Util } from '../../common/utils'

export default class ModifyStoreList extends React.Component {
    static propTypes = {
        dataSource: PropTypes.array.isRequired,
        itemClickHandler: PropTypes.func.isRequired
    }

    render() {
        return(
            <View>
                {this._renderSeparator()}
                <ModifyStoreCell isCreateStore={true} itemClickHandler={this._itemClicked.bind(this, true, null)}/>
                <FlatList
                    data={this.props.dataSource}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={this._renderSeparator.bind(this)}
                    renderItem={this._renderItem.bind(this)}
                />
            </View>
        )
    }

    _renderSeparator() {
        return(
            <View style={{height:1, backgroundColor:'#fff'}}>
                {this._separator()}
            </View>
        )
    }


    _separator() {
        return(
             <View style={{height:1, marginLeft:20, width: Util.size.width-40,backgroundColor: Util.detailBackgroundGray}}></View>
        )
    }

    _renderItem({item, index}) {
        return(
            <ModifyStoreCell isCreateStore={false} itemClickHandler={this._itemClicked.bind(this, false, item)} store={item}/>
        )
    }


    _keyExtractor = (item: Object, index: number) => {
        return index
    }

    _itemClicked(isCreateStore, store){
        this.props.itemClickHandler(isCreateStore, store)
    }

}

const styles = StyleSheet.create({

})