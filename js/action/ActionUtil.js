import Utils from '../util/Utils'
import ProjectModel from '../model/ProjectModel'
/**
 * 处理下拉刷新数据
 * @param {*} actionType 
 * @param {*} dispatch 
 * @param {*} storeName 
 * @param {*} data 
 * @param {*} pageSize 
 * @param {*} favoriteDao 
 */
export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao) {
    let fixItems = []
    if (data && data.data) {
        if (Array.isArray(data.data)) {
            fixItems = data.data
        } else if (Array.isArray(data.data.items)) {
            fixItems = data.data.items
        }
    }
    let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize)
    _projectModels(showItems, favoriteDao, projectModels => {
        dispatch({
            type: actionType,
            items: fixItems,
            projectModels,
            storeName,
            pageIndex: 1
        })
    })
}

/**
 * 通过本地的收藏状态包装Item
 * @param {*} showItems 
 * @param {*} favoriteDao 
 * @param {*} callback 
 */
export async function _projectModels(showItems, favoriteDao, callback) {
    // 取出收藏的keys
    let keys = [];
    try {
        keys = await favoriteDao.getFavoriteKeys();
    } catch (e) {
        console.log(e)
    }
    let projectModels = [];
    for (let i = 0, len = showItems.length; i < len; i++) {
        projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)))
    }

    if (typeof callback === 'function') {
        callback(projectModels)
    }
}