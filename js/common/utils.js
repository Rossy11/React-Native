// obtained from react native tutorials

import React from 'react';
import { PixelRatio } from 'react-native';
import Dimensions from 'Dimensions';

const BangHeight = Dimensions.get('window').height === 812 ? 24:0

export const Util = {
  mid:'',
  ratio: PixelRatio.get(),
  pixel: 1 / PixelRatio.get(),
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
    iPhoneSize: {
      statusBar:20,
        navigationBar:44,
        tabBar: 49,
        statuBarX:44,
        tabBarX: 49+34,
        topHeight: 64,
        bangHigher: BangHeight,
    },
    incomeBackgroundColor: '#262626',
    detailBackgroundGray:'#ebebf1',
    lybBlue:'#3eb3fe',
    unitWidth: Dimensions.get('window').width/375,
  post(url, data, callback) {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(url, fetchOptions)
    .then((response) => {
      return response.json() 
    })
    .then((responseData) => {
      callback(responseData);
    });
  },
};
