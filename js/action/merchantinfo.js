/**
 * Created by fy on 2018/5/16.
 */
import { LYFetchRequest } from '../network/LYHttpHelper'
import { API_MERCHANT_INFO } from '../network/LY_API'

export const REQUEST_MERCHANT_INFO = "REQUEST_MERCHANT_INFO"
export const RECEIVE_MERCHANT_INFO = "RECEIVE_MERCHANT_INFO"
export const FAILED_MERCHANT_INFO = "FAILED_MERCHANT_INFO"


function requestMerchantInfo() {
    return {
        type: REQUEST_MERCHANT_INFO
    }
}

function receiveMerchantInfo(entity) {
    return {
        type: RECEIVE_MERCHANT_INFO,
        entity
    }
}

function failedMerchantInfo(errMessage) {
    return {
        type: FAILED_MERCHANT_INFO,
        errMessage
    }
}


export default function fetchMerchantInfo(merchantId) {

    return dispatch => {
        dispatch(requestMerchantInfo())
        let url = API_MERCHANT_INFO + merchantId
        return LYFetchRequest(url, null, "GET", null)
        .then(json =>dispatch(receiveMerchantInfo(json)))
        .catch(err =>dispatch(failedMerchantInfo(err.message)))
    }
}