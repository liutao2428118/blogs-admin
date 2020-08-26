import request from '@/utils/request'

export function addClassify(data) {
    return request({
        url: '/classify/add-classify',
        method: 'post',
        data
    })
}

export function getAllClassify() {
    return request({
        url: '/classify/get-classify-list',
        method: 'get'
    })
}

export function alterClassify(data) {
    return request({
        url: '/classify/alter-classify',
        method: 'put',
        data
    })
}