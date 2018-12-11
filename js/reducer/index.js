/**
 * Created by fy on 2018/5/16.
 */
import { combineReducers } from 'redux'
import loginInfo from './login'
import merchantInfo from './merchantinfo'

const rootReducer = combineReducers({
    loginInfo,
    merchantInfo,
})

export default rootReducer