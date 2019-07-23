import AsyncStorage from '@react-native-community/async-storage';
const FAVORITE_KEY_PREFIX = 'favorite_'

export default class FavoriteDao {
    constructor(flag) {
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag
    }

    /**
     * 收藏项目，保存收藏的项目
     * @param {*} key 项目id
     * @param {*} value 收藏的项目
     * @param {*} callback 
     */
    saveFavoriteItem(key, value, callback) {
        AsyncStorage.setItem(key, value, (err, result) => {
            if (!err) { // 更新favorite的key
                this.updateFavoriteKeys(key, true)
            }
        })
    }

    /**
     * 更新favorite key集合
     * @param {*} key 
     * @param {*} isAdd true 添加 ,false 删除
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (err, result) => {
            if (!err) {
                let favoriteKeys = []
                if (result) {
                    favoriteKeys = JSON.parse(result)
                }
                let index = favoriteKeys.indexOf(key)
                if (isAdd) {
                    if (index === -1) favoriteKeys.push(key)
                } else {
                    if (index !== -1) favoriteKeys.splice(index, 1)
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
            }
        })
    }

    /**
     * 获取收藏的 Repository 对应的key
     *  @return {Promise}
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (err, result) => {
                if (!err) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(e)
                    }
                } else {
                    reject(err)
                }
            })
        })
    }

    /**
     * 取消收藏，移除已经收藏的项目
     * @param {项目的Id} key 
     */
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, err => {
            if (!err) {
                this.updateFavoriteKeys(key, false)
            }
        })
    }

    /**
     * 获取所以收藏的项目
     */
    getAllItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys().then(keys => {
                let items = [];
                if (keys) {
                    AsyncStorage.multiGet(keys, (err, stores) => {
                        try {
                            stores.map((result, i, store) => {
                                let value = store[i][1]
                                if (value) items.push(JSON.parse(value))
                            })
                            resolve(items);
                        } catch (e) {
                            reject(e)
                        }
                    })
                } else {
                    reject(err)
                }
            }).catch(error => {
                reject(error)
            })
        })
    }
}