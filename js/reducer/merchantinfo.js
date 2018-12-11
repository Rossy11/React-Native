/**
 * Created by fy on 2018/5/16.
 */
import {
    REQUEST_MERCHANT_INFO,
    FAILED_MERCHANT_INFO,
    RECEIVE_MERCHANT_INFO
} from '../action/merchantinfo'

const initialState = {
    isFetching: false,
    errMessage: '',
    entity: {}
}

export default function merchantInfo(state = initialState, action) {

    switch (action.type) {
        case REQUEST_MERCHANT_INFO:
            return Object.assign({}, state, {
                isFetching: true
            })
        case FAILED_MERCHANT_INFO:
            return Object.assign({}, state, {
                isFetching: false,
                errMessage: action.errMessage
            })
        case RECEIVE_MERCHANT_INFO:
            return Object.assign({}, state, {
                isFetching: false,
                entity: action.entity
            })
        default:
            return state
    }

}