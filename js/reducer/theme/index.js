import Types from '../../action/types';
import ThemeFactory, { ThemeFlags } from "../../res/style/ThemeFactory";

const defaultState = {
    theme: ThemeFactory.createTheme(ThemeFlags.Default),
    cutsomThemeViewVisiable: false,
};
export default function onAction(state = defaultState, action) {
    console.log(action)
    switch (action.type) {
        case Types.THEME_CHANGE:
            return {
                ...state,
                theme: action.theme,
            };
        case Types.THEME_SHOW_VIEW:
            return {
                ...state,
                cutsomThemeViewVisiable: action.cutsomThemeViewVisiable,
            };
        default:
            return state;
    }

}