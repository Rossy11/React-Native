/**
 * Created by fy on 2018/5/18.
 */
import React from 'react'
import { Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import LYManagementView from './LYManagementView'
import LYQRCodeScanView from './LYQRCodeScanView';
import CreateShopView from './CreateShopView';
import ShopDetailView from './ShopDetailView';
import BoxDetailView from './BoxDetailView';
import { PriceSetupView } from './PriceSetupView';
import { ShopPriceSetupView } from './ShopPriceSetupView';
import ModifyInfoView from './ModifyInfoView'
import { CreateSpecialPriceView } from './CreateSpecialPriceView'
import { Util } from '../../common/utils'

export default LYManagementStack = StackNavigator(
    {
        Management: {
            screen: LYManagementView,
        },
        QRCode: {
            screen: LYQRCodeScanView,
        },
        CreateShop: {
            screen: CreateShopView,
        },
        ShopDetail: {
            screen: ShopDetailView,
        },
        BoxDetail: {
            screen: BoxDetailView,
        },
        PriceSetup: {
            screen: PriceSetupView,
        },
        ShopPriceSetup: {
            screen: ShopPriceSetupView,
        },
        ModifyInfo: {
            screen: ModifyInfoView,
        },
        CreateSpecialPrice: {
            screen: CreateSpecialPriceView,
        }
    },
    {
        navigationOptions: {
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight:'bold',
            },
            tabBarVisible: false,
            headerBackground: <Image style={{width:Util.size.width, height: Util.iPhoneSize.topHeight+Util.iPhoneSize.bangHigher}} resizeMode={'stretch'} source={{uri:'nav_header_background'}}/>,
        }
    }
)