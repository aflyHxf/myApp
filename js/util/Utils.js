/**
 * 检查该item是否被收藏
 */

export default class Utils {
    static checkFavorite(item, keys = []) {
        if (!keys) return false
        for (let i = 0, len = keys.length; i < len; i++) {
            let id = item.id ? item.id : item.fullName
            if (id.toString() === keys[i]) {
                return true
            }
        }
        return false
    }

    static checkKeyIsExist(keys, key) {
        for (let i = 0, len = keys.length; i < len; i++) {
            if (key.toLowerCase().trim() === keys[i].name.toLowerCase().trim()) return true
        }
        return false
    }
}