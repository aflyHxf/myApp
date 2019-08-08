import Types from '../types'
import ThemeDao from '../../expand/Dao/ThemeDao'
export function onThemeChange(theme) {
    return { type: Types.THEME_CHANGE, theme }
}

/**
 * 初始化主题
 */
export function onThemeInit() {
    return dispatch => {
        new ThemeDao().getTheme().then(data => {
            dispatch(onThemeChange(data))
        })
    }
}

export function onShowCustomThemeView(show) {
    return { type: Types.THEME_SHOW_VIEW, cutsomThemeViewVisiable: show }
}