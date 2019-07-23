import Types from '../types';
import DataStore, { FLAG_STORAGE } from '../../expand/Dao/DataStore';
import { handleData, commonFunc } from '../ActionUtil';
// 获取最热数据的异步action
export function onRefreshPopular(storeName, url, pageSize, favoriteDao) {
    return dispatch => {
        dispatch({ type: Types.POPULAR_REFRESH, storeName })
        const dataStore = new DataStore()
        dataStore.fetchData(url, FLAG_STORAGE.flag_popular).then(res => { // 异步action 流
            handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, res, pageSize, favoriteDao)
        }).catch(error => {
            dispatch({ type: Types.POPULAR_REFRESH_FAIL, storeName, error })
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

