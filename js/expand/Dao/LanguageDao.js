import React from 'react'
import { } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import langs from '../../res/data/langs.json'
import keys from '../../res/data/keys.json'

export const FLAG_LANGUAGE = { flag_language: 'language_dao_language', flag_key: 'language_dao_key' }
export default class LanguageDao {
    constructor(flag) {
        this.flag = flag
    }
    /**
     * 获取语言或标签
     */
    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                if (!result) {
                    let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys
                    this.save(data)
                    resolve(data)
                } else {
                    try {
                        resolve(JSON.parse(result))
                    } catch (error) {
                        reject(error)
                    }
                }
            })
        })
    }

    /**
     * 保存语言或标签
     * @param {*} objectData 
     */
    save(objectData) {
        const stringData = JSON.stringify(objectData)
        AsyncStorage.setItem(this.flag, stringData, (err, result) => {

        })
    }
}