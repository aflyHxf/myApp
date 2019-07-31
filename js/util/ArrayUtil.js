export default class ArrayUtil {

    /**
     * 更新数组，若item存在，便删除不存在就添加
     * @param {*} array 
     * @param {*} item 
     */
    static updateArray(array, item) {
        for (let i = 0, len = array.lenght; i < len; i++) {
            const temp = array[i]
            if (temp === item) {
                array.splice(i,1)
                return;
            }
        }
        array.push(item)
    }
    /**
     * 判断两个数组是否相等
     * @param {*} arr1 
     * @param {*} arr2 
     */
    static isEqual(arr1, arr2) {
        if (!(arr1 && arr2)) return false
        if (arr1.length !== arr2.length) return false
        for (let i = 0, len = arr1.lenght; i < len; i++) {
            if (arr1[i] !== arr2[i]) return false
        }
        return true
    }
}
