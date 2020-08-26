
import Cookies from 'js-cookie'
import * as qiniu from 'qiniu-js'
import request from '@/utils/request'

export default class Qiniu {
    constructor() { }

    async fetchUploadToken() {
        let data = Cookies.get('uploadToken')
        if (!data) {
            data = await this.updateUploadToken()
        }

        return data
    }

    async updateUploadToken() {
        const { data } = await request({
            url: '/qiniu/upload-token',
            method: 'post'
        })

        const { uploadToken } = data

        Cookies.set('uploadToken', uploadToken, { expires: new Date(new Date().getTime() + 2 * 60 * 60 * 1000) })

        return uploadToken
    }


    async qiniuUpload(file, key, putExtra = {}, config = {}) {

        const token = await this.fetchUploadToken();

        const observable = qiniu.upload(file, key, token, putExtra, config)

        return new Promise((resolve, reject) => {
            const subscription = observable.subscribe({
                next(res) { },
                error(err) {
                    reject(err)
                },
                complete(res) {
                    res.url = 'http://qiniu.xiaoying.love/' + res.key
                    resolve(res)
                }
            })
        })


    }

}