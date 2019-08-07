import React from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import ThemeFactory, { ThemeFlags } from '../../res/style/ThemeFactory.js';

export const THEME_KEY = 'theme_key'
export default class ThemeDao {
    /**
     * 获取当前主题
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error)
                    return
                }
                if (!result) {
                    this.save(ThemeFlags.Default)
                    result = ThemeFlags.Default
                }
                resolve(ThemeFactory.createTheme(result))
            })
        })
    }

    /**
     * 保存主题
     * @param {*} objectData 
     */
    save(themeFlag) {
        AsyncStorage.setItem(THEME_KEY, themeFlag, () => { })
    }
}