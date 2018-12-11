/**
 * Created by fy on 2018/5/18.
 */
import { LOGIN_LOADING, LOGIN_FAILED, LOGIN_SUCCESS, LOGIN_LOGOUT, LOGIN_GOBACK_KEY } from '../action/login'

const initialState = {
    isLoading: false,
    errMessage: '',
    entity: '',
    goBackKey: '',
}

export default function loginInfo(state = initialState, action) {
    switch (action.type) {
        case LOGIN_LOADING:
            return {...state, isLoading: true}
        case LOGIN_FAILED:
            return {...state, isLoading: false, errMessage: action.errMessage}
        case LOGIN_SUCCESS:
            return {...state, isLoading: false, entity: action.entity}
        case LOGIN_LOGOUT:
            return {...state, entity:''}
        case LOGIN_GOBACK_KEY:
            return {...state, goBackKey: action.goBackKey}
        default :
            return state
    }
}
