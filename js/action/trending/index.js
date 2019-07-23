import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/Dao/DataStore';
import { handleData, commonFunc } from '../ActionUtil'

// 获取最热数据的异步action
export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
    return dispatch => {
        dispatch({ type: Types.TRENDING_REFRESH, storeName })
        const dataStore = new DataStore()
        dataStore.fetchData(url, FLAG_STORAGE.flag_trending).then(res => { // 异步action 流
            handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, res, pageSize, favoriteDao)
        }).catch(error => {
            dispatch({ type: Types.TRENDING_REFRESH_FAIL, storeName, error })
        })
    }
}


export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
    return dispatch => {
        setTimeout(() => { // 模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more')
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName,
                    pageIndex: pageIndex--
                })
            } else {
                commonFunc(dispatch, storeName, pageIndex, pageSize, dataArray, favoriteDao, Types.TRENDING_LOAD_MORE_SUCCESS)
            }
        }, 500)
    }
}


export function onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    return dispatch => {
        commonFunc(dispatch, storeName, pageIndex, pageSize, dataArray, favoriteDao, Types.TRENDING_FLUSH_FAVORITE)
    }
}