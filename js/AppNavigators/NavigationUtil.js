/**
 * 全局导航跳转工具类
 */
export default class NavigationUtil {
    static navigation = '';
    /**
     * 赋值navigation
     * @param {*} params 
     */
    static initNavigation(nav) {
        if (!nav) {
            console.log("nav is not undefind")
            return false
        }
        navigation = nav
    }
    /**
     * 重置回首页
     */
    static resetToHomePage() {
        navigation.navigate('Main')
    }
    
    /**
     * 跳转到指定页面
     * @param {*} params 跳转的参数
     * @param {*} page 指定的页面
     */
    static goPage(page, params) {
        navigation.navigate(page, { ...params })
    }

    /**
     * 返回上一页
     * @param {*} 
     */
    static goBack(navigationItem) {
        navigationItem.goBack()
    }
}