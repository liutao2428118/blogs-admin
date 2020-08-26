import request from '@/utils/request'

export function getReplyList(params) {
    return request.get('/reply/reply-list', { params })
}

export function deleteReply(data) {
    return request({
        url: '/reply/delete-reply',
        method: 'post',
        data
    })
}

export function getNewReply() {
    return request.get('/reply/reply-message')
}

export function setReplyRead(data) {
    return request({
        url: '/reply/set-reply-read',
        method: 'post',
        data
    })
}