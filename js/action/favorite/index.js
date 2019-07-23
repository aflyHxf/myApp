import Types from '../types';
import FavoriteDao from '../../expand/Dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';

/**
 * 加载收藏的项目
 * @param {*} storeName  标识
 * @param {*} isShowLoading  是否显示loading
 * @returns {function(*))}
 */
export function onLoadFavoriteData(storeName, isShowLoading) {
    return dispatch => {
        if (isShowLoading) {
            dispatch({ type: Types.FAVORITE_LOAD_DATA, storeName })
        }
        new FavoriteDao(storeName).getAllItems().then(items => {
            let resultData = []
            for (let i = 0, len = items.length; i < len; i++) {
                resultData.push(new ProjectModel(items[i], true))
            }
            dispatch({ type: Types.FAVORITE_LOAD_SUCCESS, projectModels: resultData, storeName })
        }).catch(error => {
            console.log(error)
            dispatch({ type: Types.FAVORITE_LOAD_FAIL, error, storeName })
        })
    }
}