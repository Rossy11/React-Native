/**
 * Created by fy on 2018/3/16.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ImageBackground } from 'react-native';
import PropTypes from 'prop-types'
import { Util } from '../../common/utils';
import NavHeader from '../../components/NavHeader';

const UnitHeight = Util.size.width/375;

export class BoxDailyIncome extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {

        return {
            header: null
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            machineIncome: {},
            date: '',
            consumeArr: []
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state


        this.state = {
            machineIncome: params.machineIncome,
            date: params.date,
        }
        this.setState({
            machineIncome: params.machineIncome,
            date: params.date
        })
        this.getMachineSerialIncome()
    }

    cellClickHandler(item){
        this.props.navigation.navigate('ConsumerRecord',{
            consume: item
        })
    }

    getMachineSerialIncome = async() => {
        let url = `xxxxx/machinedetailconsume/?mid=${this.state.machineIncome.mid}&pay_time_0=${this.state.date}&pay_time_1=${this.state.date}`
        console.log(url)
        let response = await fetch(url)
        let resultJSON = await response.json()
        console.log(resultJSON)
        this.setState({
            consumeArr: resultJSON
        })

    }

    render() {

        return(
            <View style = {{flex:1}}>

                <ImageBackground style = {{height:260/667*Util.size.height}} source={{uri:'背景'}}>
                    <View style={{marginTop: 30}}>
                        <NavHeader navTitle={this.state.machineIncome.machine_name || this.state.machineIncome.mid + '号机-未命名'} leftBtnHandle={() => this.goBack()}/>
                    </View>
                    <Text style={{marginTop: 42*UnitHeight, alignSelf:'center', color:'#fff', fontSize: 16, backgroundColor:'rgba(0,0,0,0)'}}>{this.state.date} 单机账目（元）</Text>
                    <Text style={{marginTop:30*UnitHeight, alignSelf:'center', color:'#fff', fontSize: 54, fontWeight:'bold', backgroundColor:'rgba(0,0,0,0)'}}>{this.state.machineIncome.mid_income}</Text>
                </ImageBackground>
                <View style = {{flex:1}}>
                    <FlatList
                        style={{marginTop:20, marginLeft: 10, width:Util.size.width-20, marginBottom: 40}}
                        data = {this.state.consumeArr}
                        keyExtractor={(item,index) => {return index.toString()}}
                        renderItem={({item}) => <BoxTimelyIncomeCell boxIncomeModel={item} cellClicked={() => this.cellClickHandler(item)}/>}
                        ItemSeparatorComponent={()=><View style={{height:10, backgroundColor:Util.detailBackgroundGray}}></View>}

                    />
                </View>
            </View>
        )
    }

    goBack(){
        this.props.navigation.goBack();
    }
}

class BoxTimelyIncomeCell extends Component {

    static propTypes = {
        boxIncomeModel: PropTypes.object.isRequired,
        cellClicked: PropTypes.func.isRequired,
    };

    constructor(props){

        super(props)
        this.state = {
            boxIncomeModel: props.boxIncomeModel,
        }
    }

    _cellClicked(){
        this.props.cellClicked()
    }

    render(){
        let payDate = new Date(this.state.boxIncomeModel.pay_time)
        let payTime = `${payDate.getHours()}:${payDate.getMinutes()}`

        return(
            <TouchableOpacity style={{height:40, flexDirection:'row', backgroundColor:'#fff', height:50, alignItems:'center', borderRadius:5}} onPress={()=>this._cellClicked()}>
                <Text style={{marginLeft:10, width: 50, fontSize:16, color:'#333'}}>{payTime}</Text>
                <View style={{width:2, height:21, marginLeft:7, backgroundColor:'#ccc'}}></View>
                <Text style={{marginLeft:17, width: 100, fontSize:16, color:'#333'}}>{this.state.boxIncomeModel.description}</Text>
                <Text style={{position:'absolute', right:30, fontSize:16, color:'#333'}}>{this.state.boxIncomeModel.mount}</Text>
                <Image source={{uri:'右箭头灰'}} style={{position:'absolute', right:14, width:9, height:15}}></Image>
            </TouchableOpacity>
        )
    }

}