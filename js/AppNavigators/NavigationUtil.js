/**
 * 全局导航跳转工具类
 */
export default class NavigationUtil {

    /**
     * 跳转到指定页面
     * @param {*} params 跳转的参数
     * @param {*} page 指定的页面
     */
    static goPage(page, params) {
        const navigation = NavigationUtil.navigation
        if (!navigation) {
            console.log('navigation can not be null')
            return false
        }
        navigation.navigate(page, { ...params })
    }
    /**
     * 返回上一页
     * @param {*} 
     */
    static goBack(params) {
        const { navigation } = params
        navigation.goBack()
    }
    /**
     * 跳转回首页
     * @param {*} params 
     */
    static resetToHomePage(params) {
        const { navigation } = params
        navigation.navigate('Main')
    }
}