import Types from "../../action/types";
import { FLAG_LANGUAGE } from "../../expand/Dao/LanguageDao";

const initState = {
    languages: [],
    keys: []
}
/**
 * favorite :{
 *      popular: {
 *          projectModels:[],
 *          isShowLoading: false
 *      },
 *      trending: {
 *          projectModels:[],
 *          isShowLoading: false
 *      }
 * }
 * @param {*} state 
 * @param {*} action 
 */
export default function onAction(state = initState, action) {
    switch (action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS: // 获取数据成功
            if (FLAG_LANGUAGE.flag_key === action.flag) {
                return {
                    ...state,
                    keys: action.languages
                }
            } else {
                return {
                    ...state,
                    languages: action.languages
                }
            }
        default:
            return state
    }
}