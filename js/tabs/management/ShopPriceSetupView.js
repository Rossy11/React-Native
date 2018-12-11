/**
 * Created by fy on 2018/3/26.
 */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Button, FlatList, Image, TextInput, ScrollView, Switch } from 'react-native';
import PropTypes from 'prop-types'

import ShopOpenTimePicker from '../../components/management/OpenTimePicker'
import LYIndicator from '../../components/LYIndicatorView'

import { Util } from '../../common/utils';
import { PriceSetupTableType } from '../../common/static';
import { API_CENTER_MANAGER } from '../../network/LY_API'
import { LYFetchRequest } from '../../network/LYHttpHelper'

export class ShopPriceSetupView extends Component {

    static navigationOptions({navigation, navigationOptions}){
        const { state, setParams } = navigation;
        let title = state.params.store.storename + ': ' + (state.params.isHoliday?"节假日":"工作日")
        return {
            title: title,
            /* 通过设置 navigation.state.params 设置右按钮 */
            headerRight:(
                <View style={{flexDirection:'row'}}>
                    <Button
                        title={state.params.editState ? state.params.editState : '编辑'}
                        onPress={state.params.editStateChange ? state.params.editStateChange : () => null}
                        color='#fff'
                    />
                </View>
            )
        }
    }

    constructor(props){
        super(props)
        /* 根据 storeid isHoliday 从 priceSetupObj 中寻找当前门店的收费设置数据 */
        this.storeid = this.props.navigation.state.params.store.storeid
        this.isHoliday = this.props.navigation.state.params.isHoliday
        this.state = {
            /* 收费设置的总体数据 */
            priceSetupObj: null,
            /* 编辑状态*/
            normalPriceSetupType: PriceSetupTableType.normalSee,
            specialPriceSetupType: PriceSetupTableType.specialSee,
            /* 当前scrollView的位置*/
            currentPage: 'normal',
            isShowIndicator: false,
            indicatorMsg: ''
        }
    }

    /*
    * 设置右按钮点击事件
    * 请求价格设置数据
    * */
    componentDidMount(){
        this.props.navigation.setParams({editStateChange: this._editStateChange})
        this.fetchPriceSetData()
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer)
    }

    // 获得 store 的 收费设置 更新 state.priceSetupObj 更新页面
    fetchPriceSetData() {
        let paramsObj = {
            cmd:'query_tradepackage',
            storeid:this.storeid
        }
        LYFetchRequest(API_CENTER_MANAGER,paramsObj,"GET", null).then(json=>{
            console.log('收费设置',json)
            if(this.isHoliday) {
                this.defaultDataSource = json.weekend.default
                this.specialDataSources = json.weekend.special
            }else {
                this.defaultDataSource = json.weekday.default
                this.specialDataSources = json.weekday.special
            }

            this.setState({
                priceSetupObj: json
            })

        }).catch(err => {
            console.warn(err.message)
        })
    }

    render(){

        if (!this.state.priceSetupObj) return <Text>加载中</Text>

        return(
            <View style={{flex:1}}>
                {this.renderSwitchTitle()}
                <View style={{height:10}}></View>
                <ScrollView
                    ref='scrollView'
                    scrollEventThrottle={200}
                    style={{flex:1}}
                    horizontal={true}
                    scrollEnabled={true}
                    pagingEnabled={true}
                    scrollEnabled={false}>
                    {/* 常规时间、特价时间 价格渲染 */}
                    {this._renderNormalPricePage()}
                    {this._renderSpecialPricePage()}
                </ScrollView>
                {
                    this.state.isShowIndicator ? <LYIndicator message={this.state.indicatorMsg}/> : null
                }
            </View>
        )
    }

    renderSwitchTitle(){

        var leftColor = this.state.currentPage === 'normal' ? Util.lybBlue : '#fff';
        var rightColor = this.state.currentPage === 'special' ? Util.lybBlue : '#fff';

        return(
            <View style={{height:59, backgroundColor:'#fff'}}>
                <View style={{height:56, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                    <Button title="常规时间" onPress={() => this._scrollPage('normal')} color='#333'/>
                    <Button title="特价时间" onPress={() => this._scrollPage('special')} color='#333'/>
                </View>
                <View style={{height:3, flexDirection:'row', justifyContent:'space-around'}}>
                    <View style = {{height:3, width:80, backgroundColor:leftColor}}></View>
                    <View style = {{height:3, width:80, backgroundColor:rightColor}}></View>
                </View>
            </View>
        )
    }

    _renderNormalPricePage(){
        return(
            <ScrollView style={{width:Util.size.width}}>
                <PriceSetupTableView
                    style={{flex:1}}
                    isHoliday={this.isHoliday}
                    dataSource={this.defaultDataSource.trade}
                    priceCellCallback={this._priceItemCallback.bind(this)}
                    priceSetupTableType={this.state.normalPriceSetupType}/>
            </ScrollView>
        )
    }

    _renderSpecialPricePage(){

        const specialLists = this.specialDataSources.map((priceSetting, index) => {
            let key1 = `+${index}`
            let key2 = `*${index}`
            return(
                <View key={key1}>
                    <PriceSetupTableView
                        key={index}
                        style={{flex:1}}
                        isHoliday={this.isHoliday}
                        tableIndex={index}
                        dataSource={priceSetting.trade}
                        switchValue={priceSetting.status===1}
                        priceSetupTableType={this.state.specialPriceSetupType}
                        switchCallback={this._switchCallback.bind(this)}
                        deleteCallback={this._deleteCallback.bind(this)}
                        priceCellCallback={this._priceItemCallback.bind(this)}
                        timeCallback={this._timeCallback.bind(this)}
                        priceSetupTitle={`特价时间${index+1}`} endTime={priceSetting.end_time} startTime={priceSetting.start_time}/>
                    <View key={key2} style={{height:8, backgroundColor: Util.detailBackgroundGray}}></View>
                </View>
            )
        })

        return(
            <ScrollView style={{flex:1, width:Util.size.width}}>
                {specialLists}
                {this._createSpecialPriceButton()}
            </ScrollView>
        )
    }

    _createSpecialPriceButton() {
        return(
            <View>
                <TouchableOpacity activeOpacity={0.55} onPress={this.navSpecialPriceCreateView.bind(this)} style={{height:40, marginLeft:40, marginTop:30, width:Util.size.width-80,backgroundColor:Util.lybBlue, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:16, color:'#fff'}}>创建特价时间</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /*
    * 右按钮事件
    * 改变按钮标题
    * 改变编辑状态
    * 提交改变后的数据
    * */
    _editStateChange = () => {
        const { state, setParams } = this.props.navigation;
        if(state.params.editState === '完成') {
            setParams({editState:'编辑'})
            this.setState({
                normalPriceSetupType:PriceSetupTableType.normalSee,
                specialPriceSetupType:PriceSetupTableType.specialSee,
            })

            this._submitEditedPriceSetupObj()

        }else {
            setParams({editState:'完成'})
            this.setState({
                normalPriceSetupType:PriceSetupTableType.normalEdit,
                specialPriceSetupType:PriceSetupTableType.specialEdit,
            })
        }
    }

    /* 提交修改后的价格对象到服务器 ==========*/
    _submitEditedPriceSetupObj(){
        if(this.state.priceSetupObj == null) {
            return;
        }
        let editedPriceJson = JSON.stringify(this.state.priceSetupObj)
        console.log(editedPriceJson)
        let paramsObj = {
            cmd:'update_tradepackage',
            storeid: this.storeid,
            packages: editedPriceJson
        }

        LYFetchRequest(API_CENTER_MANAGER,paramsObj, "GET", null).then(json => {
            this.editeSucceed()
        }).catch(err => {
            console.warn(err)
        })

    }

    /* 修改成功后显示 indicator */
    editeSucceed() {
        this.setState({
            isShowIndicator: true,
            indicatorMsg: '修改成功'
        })
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
            this.setState({
                isShowIndicator: false
            })
        },1000)
    }


    /* 点击 标签 滑动 scrollView */
    _scrollPage(currentPage){
        console.log(currentPage)
        if(this.state.currentPage !== currentPage) {
            this.setState({
                currentPage: currentPage
            })

            if(currentPage === 'normal') {
                this.refs.scrollView.scrollTo({x:0, y:0, animated:true})
            }else  {
                this.refs.scrollView.scrollToEnd(true)
            }

        }
    }




    /**
     * priceItem 修改价格事件 经过 TableView 两层回调 修改priceSetupObj
     * 更新页面 实现数据驱动页面改变，数据单项流动
     *
     */
    _priceItemCallback(newPrice, isHoliday, normalOrSpecial, tableIndex, itemIndex) {
        // 1 fails, normal,
        // 2 fails, special
        // 3 true,  normal,
        // 4 true,  special
        // 5 增加

        let priceSetupObj = this.state.priceSetupObj

        // 节假日
        if(isHoliday){
            // 常规时间
            if(normalOrSpecial === 1) {
                priceSetupObj.weekend.default.trade[itemIndex].price = newPrice;
                // 特价时间
            }else if(normalOrSpecial === 3) {
                priceSetupObj.weekend.special[tableIndex].trade[itemIndex].price = newPrice;
            }

            // 工作日
        }else {
            // 常规时间
            if(normalOrSpecial === 1) {
                priceSetupObj.weekday.default.trade[itemIndex].price = newPrice;

                // 特价时间
            }else if(normalOrSpecial === 3) {
                priceSetupObj.weekday.special[tableIndex].trade[itemIndex].price = newPrice;
            }
        }

        this.setState({
            priceSetupObj: priceSetupObj
        })

    }

    _switchCallback(isHoliday, tableIndex, switchValue) {

        let priceSetupObj = this.state.priceSetupObj
        let newStatue = switchValue ? 1 : 0
        console.log(priceSetupObj)
            // 节假日
        if(isHoliday){
            priceSetupObj.weekend.special[tableIndex].status = newStatue;

            // 工作日
        }else {
            priceSetupObj.weekday.special[tableIndex].status = newStatue;
        }

        this.setState({
            priceSetupObj: priceSetupObj
        })

    }

    _timeCallback(isHoliday, tableIndex, startTime, endTime) {
        let priceSetupObj = this.state.priceSetupObj
        console.log('TimeCallBack\n', isHoliday, tableIndex, startTime, endTime)
        if (isHoliday) {
            priceSetupObj.weekend.special[tableIndex].start_time = startTime
            priceSetupObj.weekend.special[tableIndex].end_time = endTime

        }else {
            priceSetupObj.weekday.special[tableIndex].start_time = startTime
            priceSetupObj.weekday.special[tableIndex].end_time = endTime
        }
        this.setState({
            priceSetupObj: priceSetupObj
        })
    }

    _deleteCallback(isHoliday, tableIndex) {
        let priceSetupObj = this.state.priceSetupObj
        if (isHoliday) {
            priceSetupObj.weekend.special.splice(tableIndex, 1)

        }else {
            priceSetupObj.weekday.special.splice(tableIndex, 1)
        }
        this.setState({
            priceSetupObj: priceSetupObj
        })
    }

    navSpecialPriceCreateView() {
        let _this = this
        this.props.navigation.navigate('CreateSpecialPrice',{
            priceSetupObj: _this.state.priceSetupObj,
            storeid: _this.storeid,
            isHoliday: _this.isHoliday,
            createSpecialCallback: _this._createSpecialPriceCallback.bind(_this)
        })
    }

    // 创建完成特价时间的回调，请求创建后的数据，展示页面
    _createSpecialPriceCallback() {
        this.fetchPriceSetData()
    }

}

/*
 * 价格设置类型：
 * 1、常规时间  （查看，编辑）
 * 2、特价时间 头部开关、底部删除 （查看编辑）
 * 3、创建特价时间
 *
 */

export class PriceSetupTableView extends Component {

    static propTypes = {
        priceSetupTableType: PropTypes.number.isRequired,// 五种 Table 类型
        isHoliday: PropTypes.bool.isRequired,   // 是否为节假日 作为回调更改 priceSetupObj 的标记
        priceSetupTitle: PropTypes.string,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
        dataSource: PropTypes.array,            // tableView 的数据源
        switchValue: PropTypes.bool,            // 套餐是否开启
        tableIndex: PropTypes.number,           // table 数据在 priceSetupObj 中的 index 作为回调的参数
        switchCallback: PropTypes.func,
        timeCallback: PropTypes.func,
        deleteCallback: PropTypes.func,
        priceCellCallback: PropTypes.func,
    }

    render(){
        console.log('=== render ==')
        return(
            <View>
                {this._renderTableView()}
            </View>
        )
    }
    _renderTableView(){
        return(
            <FlatList
                style={{backgroundColor:'#fff'}}
                ItemSeparatorComponent={() => {return(<View style={{backgroundColor:Util.detailBackgroundGray, height:1, marginLeft:20, marginRight:20}}></View>)}}
                data={this.props.dataSource}
                renderItem = {this._renderItem}
                ListHeaderComponent={() => this._renderHeader()}
                ListFooterComponent={() => this._renderFooter()}
                keyExtractor={(item,index) => { return index.toString()}}
            />
        )
    }

    _renderHeader = () => {
        if(this.props.priceSetupTableType === 0 || this.props.priceSetupTableType === 1) {
            return null
        }else {
            let switchDisabled = true
            if(this.props.priceSetupTableType === PriceSetupTableType.specialEdit || this.props.priceSetupTableType === PriceSetupTableType.specialCreate) {
                switchDisabled = false;
            }
            return(
                <View>
                    {/*<View style={{height:40, flexDirection:'row', alignItems:'center'}}>*/}
                        {/*<Text style={{marginLeft:20, color:'#333', fontSize:16, fontWeight:'bold'}}>{this.props.priceSetupTitle}</Text>*/}
                        {/*<Switch*/}
                            {/*disabled={switchDisabled}*/}
                            {/*value={this.props.switchValue}*/}
                            {/*onValueChange={this._switchValueChanged.bind(this)}*/}
                            {/*style={{right:20, position:'absolute', transform:[{scaleY:0.8}, {scaleX:0.8}]}}>*/}

                        {/*</Switch>*/}
                    {/*</View>*/}
                    {/*<View style={{height:40, flexDirection:'row', alignItems:'center'}}>*/}
                        {/*<Text style={{fontSize:14, color:'#333', marginLeft:20}}>开始时间：</Text>*/}
                        {/*<TouchableOpacity style={{}}>*/}
                            {/*<Text style={{fontSize:14, color:'#999'}}>{this.props.startTime}</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<Text style={{fontSize:14, color:'#333', marginLeft:30}}>结束时间：</Text>*/}
                        {/*<TouchableOpacity style={{}}>*/}
                            {/*<Text style={{fontSize:14, color:'#999'}}>{this.props.endTime}</Text>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    <ShopOpenTimePicker
                        title={this.props.priceSetupTitle}
                        changeTimeHandle={this._timeCallback.bind(this)}
                        switchValueHandler={this._switchValueChanged.bind(this)}
                        switchDisabled={switchDisabled}
                        showSwitch={true}
                        type={"Machine"}
                        switchValue={this.props.switchValue}
                        startTime={this.props.startTime}
                        endTime={this.props.endTime}
                        isEditable={!switchDisabled}
                    />
                </View>
            )
        }
    }

    _renderItem = ({item, index}) => {
        return(
            <PriceSetupItem
                price={item.price}
                isHoliday={this.props.isHoliday}
                priceItemCallback={this._priceItemCallback.bind(this)}
                duration={item.tradename}
                priceItemStyle={this.props.priceSetupTableType}
                itemIndex={index}
                tableIndex={this.props.tableIndex} />
        )
    }

    _renderFooter = () => {
        if(this.props.priceSetupTableType == 3) {
            return(
                <View style={{height:72, alignItems:'center', justifyContent:'center'}}>
                    {/*<Button title="删除" onPress={()=>this._deleteOneSpecialSetup()}/>*/}
                    <TouchableOpacity onPress={()=>this._deleteOneSpecialSetup()} activeOpacity={0.55} style={{width:Util.size.width-100, height: 30, borderRadius:15, backgroundColor:'red', justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:15, color:'#fff'}}>删  除</Text>
                    </TouchableOpacity>
                </View>
            )
        }else {
            return(
                <View/>
            )
        }
    }

    _timeCallback(startTime, endTime) {
        this.props.timeCallback(this.props.isHoliday, this.props.tableIndex, startTime, endTime)
    }

    _switchValueChanged(newValue){
        this.props.switchCallback(this.props.isHoliday, this.props.tableIndex, newValue)
    }

    _priceItemCallback(newPrice, isHoliday, normalOrSpecial, tableIndex, itemIndex) {
        this.props.priceCellCallback(newPrice, isHoliday, normalOrSpecial, tableIndex, itemIndex)
    }

    _deleteOneSpecialSetup(){
        this.props.deleteCallback(this.props.isHoliday, this.props.tableIndex)
    }

}


class PriceSetupItem extends Component {

    static propTypes = {
        isHoliday: PropTypes.bool.isRequired,           // 是否为假期 作为修改 priceSetupObj 的标记
        duration: PropTypes.string.isRequired,          // 套餐持续时间
        priceItemStyle: PropTypes.number.isRequired,    // Table 的五种类型
        price: PropTypes.number.isRequired,
        itemIndex: PropTypes.number.isRequired,         // 价格在数组中位置 作为修改 priceSetupObj 的标记
        tableIndex: PropTypes.number,                   // table 在数组中位置 作为修改 priceSetupObj 的标记
        priceItemCallback: PropTypes.func.isRequired    // 修改价格后的回调 回调两次 修改 priceSetupObj
    }

    render(){

        let showOperationButton = true  // 显示 + - 按钮的标识
        if(this.props.priceItemStyle == PriceSetupTableType.specialSee || this.props.priceItemStyle == PriceSetupTableType.normalSee) {
            showOperationButton = false;
        }
        return(
            <View style={{flexDirection:'row', height:54, alignItems:'center'}}>
                {/* 套餐标题 */}
                <Text style={{fontSize:16, color:'#333', marginLeft:20}}>{this.props.duration}</Text>
                <View style={{height:50, flexDirection:'row', alignItems:'center', right:10, position:'absolute', width:140}}>
                    {/* - 按钮 */}
                    {showOperationButton ?
                        <View style={{width:30, height:30, alignItems:'center', justifyContent:'center'}}>
                            <TouchableOpacity
                                onPress={()=>this._cutPrice()}>
                                <Image source={{uri:'减号'}} style={{width:30, height:30}}/>
                            </TouchableOpacity>
                        </View>:null
                    }
                    {/* ￥价格 */}
                    <View style={{height:40,position:'absolute', left:35, width:70, alignItems:'center', justifyContent:'center', borderWidth:showOperationButton?1:0, borderColor:'#ccc'}}>
                        <Text >¥ {this.props.price}</Text>
                    </View>
                    {/* + 按钮 */}
                    {showOperationButton ?
                        <View style={{width:30, marginLeft:80, height:30, justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={()=>this._risePrice()}>
                                <Image source={{uri:'加号'}} style={{width:30, height:30}}/>
                            </TouchableOpacity>
                        </View>:null
                    }
                </View>
            </View>
        )
    }

    // 修改item price；获得当前 IS_HOLIDAY, normal or special, tableIndex, itemIndex
    _cutPrice() {
        if (this.props.price > 1) {
            let newPrice = this.props.price - 1;
            this._modifyPriceObjByPriceItem(newPrice, this.props.isHoliday, this.props.priceItemStyle, this.props.tableIndex, this.props.itemIndex);
        }
    }
    _risePrice(){

        let newPrice = this.props.price+1;

        this._modifyPriceObjByPriceItem(newPrice, this.props.isHoliday, this.props.priceItemStyle, this.props.tableIndex, this.props.itemIndex);
    }

    /* 点击 cellItem 增加或者减少按钮 回调上级页面修改数据 */
    _modifyPriceObjByPriceItem(newPrice, isHoliday, normalOrSpecial, tableIndex, itemIndex) {
        this.props.priceItemCallback(newPrice, isHoliday, normalOrSpecial, tableIndex, itemIndex)
    }
}