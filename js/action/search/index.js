import Types from '../types';
import { handleData, commonFunc, doCallback } from '../ActionUtil';
import ArrayUtil from '../../util/ArrayUtil'
import Utils from '../../util/Utils';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = []

/**
 * @param {*} inputKey 搜索的key
 * @param {*} pageSize 
 * @param {*} token 与该搜索关联的唯一token
 * @param {*} favoriteDao 
 * @param {*} popularKeys 
 * @param {*} callback 
 */
export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callback) {
    return dispatch => {
        dispatch({ type: Types.SEARCH_REFRESH })
        fetch(getFetchUrl(inputKey)).then(response => {
            // 如果任务取消，则不做任何处理
            return hasCancel(token) ? null : response.json()
        }).then(responseData => {
            // 如果任务取消，则不做任何处理
            if (hasCancel(token, true)) {
                console.log('user cancel')
                return null
            }
            if (!responseData || !responseData.items || !responseData.items.length) {
                dispatch({ type: Types.SEARCH_FAIL, message: `没找到关于${inputKey}的项目` })
                doCallback(callback, { message: `没找到关于${inputKey}的项目` })
                return
            }

            let items = responseData.items;
            handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', { data: items }, pageSize, favoriteDao, {
                showBottomButton: !Utils.checkKeyIsExist(popularKeys, inputKey),
                inputKey
            })
        }).catch(e => {
            console.log(e)
            dispatch({ type: Types.SEARCH_FAIL, error: e })
        })
    }
}

/**
 * 取消一个异步的任务
 * @param {*} token 
 */

export function onSearchCancel(token) {
    return dispatch => {
        CANCEL_TOKENS.push(token)
        dispatch({ type: Types.SEARCH_CANCEL })
    }
}

/**
 * 加载更多
 * @param {*} pageIndex 
 * @param {*} pageSize 
 * @param {*} dataArray 
 * @param {*} favoriteDao 
 * @param {*} callback 
 */
export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
    return dispatch => {
        setTimeout(() => { // 模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more')
                }
                dispatch({
                    type: Types.SEARCH_LOAD_MORE_FAIL,
                    error: 'no more',
                    pageIndex: pageIndex--
                })
            } else {
                commonFunc(dispatch, '', pageIndex, pageSize, dataArray, favoriteDao, Types.SEARCH_LOAD_MORE_SUCCESS)
            }
        }, 500)
    }
}

function getFetchUrl(key) {
    return API_URL + key + QUERY_STR
}


function hasCancel(token, isRemove) {
    if (CANCEL_TOKENS.includes(token)) {
        isRemove && ArrayUtil.remove(CANCEL_TOKENS, token)
        return true
    }
    return false
}