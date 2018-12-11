/**
 * Created by fy on 2018/5/18.
 */
import { API_CENTER_MLOGIN } from '../network/LY_API'
import { LYFetchRequest } from '../network/LYHttpHelper'

export const LOGIN_LOADING = 'LOGIN_LOADING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGIN_LOGOUT = 'LOGIN_LOGOUT'
export const LOGIN_GOBACK_KEY = 'LOGIN_GOBACK_KEY'

function loginLoading() {
    return {
        type: LOGIN_LOADING
    }
}

function loginSuccess(entity) {
    return {
        type: LOGIN_SUCCESS,
        entity
    }
}

function loginFailed(errMessage) {
    return {
        type: LOGIN_FAILED,
        errMessage
    }
}

export function logout() {
    return {
        type: LOGIN_LOGOUT
    }
}

export function login(phoneNumber, passWord) {
    return dispatch => {
        dispatch(loginLoading())
        let paramsObj = {
            cmd: 'login',
            mobile: phoneNumber,
            password: passWord
        }
        return LYFetchRequest(API_CENTER_MLOGIN, paramsObj, "GET", null).then(json => {
            let result = json.result
            console.log(12345,result)
            // 返回到 container 中，进行页面的跳转
            let promise = new Promise((resolve, reject) => {
                if (result && result.length >= 1) {
                    dispatch(loginSuccess(result[0]))
                    resolve('登录成功')
                } else {
                    dispatch(loginFailed(json.info))
                    reject("请检查账号密码")
                }

            })
            return promise

        }).catch(err => {

            let promise1 = new Promise((resolve, reject) => {
                reject(err.message)
            })
            dispatch(loginFailed(err.message))
            return promise1

        })
    }
}

export function recordGoBackKey(goBackKey) {
    return {
        type: LOGIN_GOBACK_KEY,
        goBackKey
    }
}
