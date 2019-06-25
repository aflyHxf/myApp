import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/Dao/DataStore';
import { handleData } from '../ActionUtil'
// 获取最热数据的异步action
export function onRefreshPopular(storeName, url, pageSize) {
    return dispatch => {
        dispatch({ type: Types.POPULAR_REFRESH, storeName })
        const dataStore = new DataStore()
        dataStore.fetchData(url, FLAG_STORAGE.flag_popular).then(res => { // 异步action 流
            handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, res, pageSize)
        }).catch(error => {
            dispatch({ type: Types.POPULAR_REFRESH_FAIL, storeName, error })
        })
    }
}


export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callback) {
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
                    pageIndex: pageIndex--,
                    projectModels: dataArray
                })
            } else {
                const max = pageIndex * pageSize > dataArray.length ? dataArray.length : pageIndex * pageSize
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels: dataArray.slice(0, max)
                })
            }
        }, 500)
    }
}