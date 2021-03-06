import AsyncStorage from '@react-native-community/async-storage';
import Trending from 'GitHubTrending'
const Validity = 4
export const FLAG_STORAGE = { flag_popular: 'popular', flag_trending: 'trending' }
export default class DataStore {
    /**
     * 获取缓存数据
     * 1 获取本地的数据，本地有并且在有效期内 -> 本地
     * 2 否则 进行网络请求
     * @param {获取数据的请求地址} url 
     */
    fetchData(url, flag) {
        // 清空本地的缓存数据 （仅仅测试用）
        // AsyncStorage.clear().then(() => console.log('本地数据已经清空'))
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then(wrapData => {
                if (wrapData && this._checkValidateTimes(wrapData.timestamp)) {
                    resolve(wrapData)
                } else {
                    this.fetchNetData(url, flag).then((data) => {
                        resolve(this._wrapData(data));
                    }).catch((error) => {
                        reject(error);
                    })
                }
            }).catch(() => {
                this.fetchNetData(url, flag).then(data => {
                    resolve(this._wrapData(data))
                }).catch(error => reject(error))
            })
        })
    }


    /**
     * 保存数据
     */
    saveData(url, data, callback) {
        if (!url || !data) return false
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
    }

    /**
     * fetchLocalData 获取本地的数据
     * @param {*} url 
     */
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(e)
                        console.log(e)
                    }
                } else {
                    reject(error)
                    console.log(error)
                }
            })
        })
    }

    /**
     * 
     * @param {获取网络请求数据} data 
     */

    fetchNetData(url, flag) {
        return new Promise((resolve) => {
            if (flag !== FLAG_STORAGE.flag_trending) {
                fetch(url).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('network response was not ok')
                }).then(responseData => {
                    // 网络请求数据回来之后，先存在本地
                    this.saveData(url, responseData)
                    resolve(responseData);
                }).catch(error => console.log(error))
            } else {
                new Trending().fetchTrending(url).then(items => {
                    if (!items) {
                        throw new Error('response is null')
                    }
                    this.saveData(url, items)
                    resolve(items)
                }).catch(err => {
                    reject(err)
                })
            }
        })
    }
    /**
     * 给保存的数据加一个时间戳
     *  */
    _wrapData(data) {
        return { data: data, timestamp: new Date().getTime() }
    }

    /**
     * 校验时间有效期
     * @param {数据请求的时间} timestamp 
     */
    _checkValidateTimes(timestamp) {
        // 获取当前时间
        const currentTime = new Date()
        // 讲指定时间格式化
        const targetTime = new Date()
        targetTime.setTime(timestamp)
        if (currentTime.getMonth() !== targetTime.getMonth()) return false // 保持月份相同
        if (currentTime.getDate() !== targetTime.getDate()) return false // 保持天数相同
        if (currentTime.getHours() - targetTime.getHours() > Validity) return false // 保持月份相同
        return true
    }
}