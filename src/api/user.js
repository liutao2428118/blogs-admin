import request from '@/utils/request'

export function login(data) {
    return request.post('/user/login', data)
}

export function getInfo(token) {
    return request({
        url: '/vue-admin-template/user/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'get'
    })
}

export function getUserList(params) {
    return request({
        url: '/user/userList',
        method: 'get',
        params
    })
}