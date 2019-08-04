import Types from '../types';
import LanguageDao from '../../expand/Dao/LanguageDao';

/**
 * 加载标签 flagKey
 * @param {*} flagKey 
 */
export function onLoadLanguage(flagKey) {
    return async dispatch => {
        try {
            const languages = await new LanguageDao(flagKey).fetch()
            dispatch({
                type: Types.LANGUAGE_LOAD_SUCCESS,
                languages,
                flag: flagKey
            })
        } catch (error) {
            console.log(error)
        }
    }
}