/**
 * Created by fy on 2018/5/2.
 */
import { LY_BASE_URL } from './LY_API'

function LYFetchRequest(url, paramsObj, method = 'GET', bodyObj) {

    let headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }

    let params = obj2params(paramsObj)
    let finalURL = LY_BASE_URL + url + (params ? `?${params}` : '')

    // GET HEAD 请求 不能有 body
    let fetchComponent = null
    if ( method === 'GET' || method === 'HEAD' || method === 'get' || method === 'head') {
        fetchComponent = {
            method: method,
            headers: headers,
            credentials: 'include',
        }
    }else {
        fetchComponent = {
            method: method,
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(bodyObj)
        }
    }

    console.log('网络请求\n',finalURL,JSON.stringify(bodyObj))

    let result = new Promise((resolve, reject) => {
        fetch(finalURL, fetchComponent)
        .then(response => response.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {reject(err)})
    })

    return result
}


function obj2params(obj) {
    var result = ''
    var item
    for (item in obj) {
        result += `&${item}=${encodeURIComponent(obj[item])}`
    }
    if (result) {
        result = result.slice(1)
    }
    return result
}

module.exports = { LYFetchRequest }