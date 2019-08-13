import Types from '../types';
import DataStore, { FLAG_STORAGE } from '../../expand/Dao/DataStore';
import { handleData, commonFunc, doCallback } from '../ActionUtil';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
/**
 * 
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
            if (hasCancel(token)) {
                console.log('user cancel')
                return null
            }
            if (!responseData || !responseData.items || !responseData.items.length) {
                dispatch({ type: Types.SEARCH_FAIL, message: `没找到关于${inputKey}的项目` })
                doCallback(callback, { message: `没找到关于${inputKey}的项目` })
                return
            }

            let items = responseData.items;
            handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', { data: item }, pageSize, favoriteDao, {
                showBottomButton: !checkKeyIsExist(popularKeys, inputKey),
                
            })
        })
    }
}


export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
    return dispatch => {
        setTimeout(() => { // 模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName,
                    pageIndex: pageIndex--
                })
            } else {
                commonFunc(dispatch, storeName, pageIndex, pageSize, dataArray, favoriteDao, Types.POPULAR_LOAD_MORE_SUCCESS)
            }
        }, 500)
    }
}

/**
 * 刷新收藏状态
 * @param {*} storeName 
 * @param {*} pageIndex 
 * @param {*} pageSize 
 * @param {*} dataArray 
 * @param {*} favoriteDao 
 */
export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    return dispatch => {
        commonFunc(dispatch, storeName, pageIndex, pageSize, dataArray, favoriteDao, Types.POPULAR_FLUSH_FAVORITE)
    }
}

function getFetchUrl(key) {
    return API_URL + key + QUERY_STR
}


function hasCancel(token) {
    return false
}